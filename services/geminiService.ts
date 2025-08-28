
import { GoogleGenAI, Type } from "@google/genai";
import type { AnalysisResult, DeviceSpecs } from '../types';

// The GoogleGenAI class is initialized using the API key from environment variables.
// As per security best practices, the key is not hardcoded or exposed in the frontend.
// The execution environment is expected to have `process.env.API_KEY` configured.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const analysisSchema = {
  type: Type.OBJECT,
  properties: {
    summary: { 
      type: Type.STRING, 
      description: 'A one or two-sentence overall verdict on the performance for the specified game. Be encouraging but realistic.' 
    },
    keyFactor: { 
      type: Type.STRING, 
      description: 'The single most important factor for this hardware and game combo, e.g., "The integrated GPU is the main bottleneck for this demanding title", or "CPU performance is critical for this strategy game".' 
    },
     bottleneckComponent: { 
      type: Type.STRING, 
      description: 'The single component that is the primary performance bottleneck. Can be "CPU", "GPU", "RAM", or "Balanced" if no single component is a clear bottleneck.' 
    },
    bottleneckExplanation: {
        type: Type.STRING,
        description: 'A brief 1-2 sentence explanation of why the component is a bottleneck. If "Balanced", explain what that means (e.g., "The CPU and GPU are well-matched for this game, and neither is significantly holding the other back.").'
    },
    upgradeSuggestion: { 
      type: Type.STRING, 
      description: 'A clear, concise recommendation for which component to upgrade for the biggest performance gain in this specific game. For example: "Upgrading the GPU to a model like the RTX 4060 would yield the most significant FPS increase."'
    },
    estimatedPowerDraw: {
        type: Type.STRING,
        description: 'An estimated range for the total system power draw in watts under a typical gaming load, e.g., "350-450W".'
    },
    performanceScore: {
        type: Type.INTEGER,
        description: 'A single integer score from 1 to 100 representing the overall gaming performance for this specific game and hardware combination. Higher is better. This should holistically reflect FPS, stability, and graphical settings potential.'
    },
    componentBreakdown: {
      type: Type.ARRAY,
      description: 'Analysis for each individual hardware component provided by the user.',
      items: {
        type: Type.OBJECT,
        properties: {
          component: { 
            type: Type.STRING, 
            enum: ['CPU', 'GPU', 'RAM', 'Virtual RAM'],
            description: 'The type of component: "CPU", "GPU", "RAM", or "Virtual RAM".' 
          },
          model: { 
            type: Type.STRING, 
            description: 'The user-provided model name for the component.' 
          },
          analysis: { 
            type: Type.STRING, 
            description: 'A brief 1-2 sentence analysis of this component\'s role and performance impact for the specified game.' 
          },
        },
        required: ['component', 'model', 'analysis']
      }
    },
    scenarios: {
      type: Type.ARRAY,
      description: 'A list of at least two different performance scenarios relevant to the game, e.g., "1080p Low Settings" and "1080p High Settings".',
      items: {
        type: Type.OBJECT,
        properties: {
          name: { 
            type: Type.STRING, 
            description: 'Scenario name, e.g., "1080p Low Settings" or "Competitive Settings"' 
          },
          resolution: { 
            type: Type.STRING, 
            description: 'e.g., "1920x1080"' 
          },
          settings: { 
            type: Type.STRING, 
            description: 'e.g., "Low" or "High / Ultra"' 
          },
          avgFps: { 
            type: Type.STRING, 
            description: 'The estimated average FPS range, e.g., "70-110 FPS"' 
          },
          analysis: { 
            type: Type.STRING, 
            description: 'A brief explanation of what this gameplay scenario would feel like.' 
          },
        },
        required: ['name', 'resolution', 'settings', 'avgFps', 'analysis']
      }
    }
  },
  required: ['summary', 'keyFactor', 'bottleneckComponent', 'bottleneckExplanation', 'upgradeSuggestion', 'estimatedPowerDraw', 'performanceScore', 'componentBreakdown', 'scenarios']
};

export const getFpsAnalysis = async (cpu: string, gpu: string, ram: string, ramMhz: string, virtualRam: string, gameName: string, language: string): Promise<AnalysisResult> => {
  try {
    const prompt = `
      Analyze the following PC configuration for its performance in the game "${gameName}".
      The user wants the response in this language: "${language}". All text in your response must be in this language.

      User Hardware:
      - CPU: ${cpu}
      - GPU: ${gpu}
      - RAM: ${ram} (${ramMhz ? `${ramMhz} MHz` : 'Speed not specified'})
      - Virtual RAM (Page File): ${virtualRam}

      Analysis Steps:
      1.  **Game Research**: Briefly assess the typical system requirements and performance characteristics of "${gameName}". Is it CPU-bound, GPU-bound, or RAM-heavy?
      2.  **Hardware Analysis**: Evaluate the user's hardware against the game's needs. Consider the RAM speed (${ramMhz}), as it can be important for CPU-intensive games or certain CPU architectures (like AMD Ryzen). Pay special attention to the relationship between physical RAM and Virtual RAM. A large Virtual RAM is not a substitute for sufficient physical RAM and can cause stuttering if accessed frequently, but it can prevent crashes from memory exhaustion.
      3.  **Bottleneck Identification**: Clearly identify the primary performance bottleneck from the provided components (CPU, GPU, or RAM). State "Balanced" if no single one is a clear limiter. The bottleneck should focus on the primary physical components.
      4.  **Bottleneck Explanation**: Provide a brief, simple explanation for the identified bottleneck. If the system is "Balanced", explain that this is a good thing, meaning the components work well together for this game.
      5.  **Upgrade Path**: Based on a bottleneck, provide a concise, actionable upgrade suggestion.
      6.  **Power Estimation**: Estimate the total system power draw in watts under a typical gaming load. Consider the TDP/TGP of the CPU and GPU primarily, plus a general overhead for other components (RAM, storage, motherboard). Provide a reasonable range (e.g., "350-450W").
      7.  **Performance Score**: Based on all factors, provide a single integer score from 1 to 100. A score of 50 means it's playable at medium settings, while 90+ is excellent for high-refresh-rate gaming.
      8.  **Performance Scenarios**: Create at least two distinct performance scenarios (e.g., '1080p Low Settings', '1080p High Settings') with estimated FPS ranges.

      Structure your entire response according to the provided JSON schema. Ensure the componentBreakdown includes an entry for Virtual RAM.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: analysisSchema,
      },
    });
    
    const jsonText = response.text.trim();
    if (!jsonText.startsWith('{') && !jsonText.startsWith('[')) {
       throw new Error("Received a non-JSON response from the model. Please try again.");
    }
    const parsedJson = JSON.parse(jsonText);
    return parsedJson as AnalysisResult;

  } catch (error) {
    console.error("Error calling Gemini AI:", error);
    if (error instanceof Error && error.message.includes("API key not valid")) {
      throw new Error("The Gemini API key is invalid or not configured correctly.");
    }
    throw new Error("Failed to get analysis from the AI. The model may be busy or the request could not be processed.");
  }
};

const deviceSpecsSchema = {
  type: Type.OBJECT,
  properties: {
    cpu: { type: Type.STRING, description: 'The full model name of the CPU or SoC (e.g., "Apple M2" or "Qualcomm Snapdragon 8 Gen 2").' },
    gpu: { type: Type.STRING, description: 'The full model name of the GPU (e.g., "Apple 10-core GPU" or "Adreno 740").' },
    ram: { type: Type.STRING, description: 'The most common RAM amount for the base model (e.g., "8GB").' },
    ramMhz: { type: Type.STRING, description: 'The RAM speed in MHz for the base model (e.g., "3200"). If not applicable or available, return "N/A".' },
  },
  required: ['cpu', 'gpu', 'ram', 'ramMhz'],
};

export const getDeviceSpecs = async (deviceName: string, language: string): Promise<DeviceSpecs> => {
  try {
    const prompt = `
      You are a device specification expert. The user has provided a device name: "${deviceName}".
      Your task is to find the official technical specifications for this device.
      - If it is a mobile phone or tablet, identify its SoC and list the specific CPU and GPU models within that SoC.
      - For RAM, provide the most common or base model configuration amount and its speed in MHz (e.g., "3200"). If speed is not applicable (like LPDDR5X where it's complex), return "N/A".
      - If you cannot find the device, or the name is too generic, you must throw an error.
      - All text in your response must be in the requested language: "${language}".
      
      Return the data strictly in the provided JSON schema.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: deviceSpecsSchema,
      },
    });

    const jsonText = response.text.trim();
    if (!jsonText.startsWith('{')) {
      throw new Error(`Could not find specifications for "${deviceName}". Please try a more specific name.`);
    }
    const parsedJson = JSON.parse(jsonText);
    return parsedJson as DeviceSpecs;

  } catch (error) {
     console.error("Error fetching device specs:", error);
     throw new Error(`Failed to find specs for "${deviceName}". The device may be obscure or the name too generic.`);
  }
};

const createTranslationSchema = (obj: Record<string, any>): Record<string, any> => {
    const schema: { type: Type, properties: Record<string, any>, required: string[] } = {
        type: Type.OBJECT,
        properties: {},
        required: []
    };
    for (const key in obj) {
        if (typeof obj[key] === 'string') {
            schema.properties[key] = { type: Type.STRING, description: `Translation for '${key}'` };
            schema.required.push(key);
        }
    }
    return schema;
}

export const translateUI = async (baseTranslation: Record<string, string>, targetLanguage: string): Promise<Record<string, string>> => {
    try {
        const prompt = `
            You are a translation expert. Translate the JSON object's values into the language "${targetLanguage}".
            - Maintain the exact same JSON structure and keys.
            - Only translate the string values.
            - Do not add, remove, or change any keys.

            Base English JSON to translate:
            ${JSON.stringify(baseTranslation, null, 2)}
        `;
        
        const schema = createTranslationSchema(baseTranslation);

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: schema,
            },
        });

        const jsonText = response.text.trim();
        const parsedJson = JSON.parse(jsonText);
        return parsedJson as Record<string, string>;

    } catch (error) {
        console.error(`Error translating UI to ${targetLanguage}:`, error);
        throw new Error(`Failed to translate UI to ${targetLanguage}. The model may be busy or the request could not be processed.`);
    }
};