import React from 'react';

export const CpuIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M12 6V3m0 18v-3M5.636 5.636l1.414 1.414m10.606 10.606l-1.414-1.414m-1.414 1.414L5.636 18.364m12.728-12.728L18.364 5.636M9 12h6" />
  </svg>
);

export const GpuIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 12V7a2 2 0 012-2h10a2 2 0 012 2v5m-14 0h14m-2 4h-2m-2-4h-2m0 0V9m6 8v-4m-2 4h-2m-2-4h-2" />
  </svg>
);

export const RamIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
  </svg>
);

export const VramIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h12A2.25 2.25 0 0 1 20.25 6v1.5H3.75V6ZM3.75 9v1.5h16.5V9M3.75 12v1.5h16.5v-1.5M3.75 15v1.5h16.5v-1.5M3.75 18A2.25 2.25 0 0 0 6 20.25h12a2.25 2.25 0 0 0 2.25-2.25V18H3.75Z" />
  </svg>
);

export const GameIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" >
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 0 1 0 3.75H5.625a1.875 1.875 0 0 1 0-3.75Z" />
  </svg>
);

export const DeviceSearchIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="m9.75 3.101.001 17.858m-2.25-15.607h4.5m-4.5 3.374h4.5m-4.5 3.375h4.5m-4.5 3.375h4.5m-4.5 3.375h4.5m-4.5 3.375h4.5M15 3.101a1.875 1.875 0 0 0-1.875-1.874H9.75a1.875 1.875 0 0 0-1.875 1.874m2.25 17.858a1.875 1.875 0 0 0 1.875 1.874h1.5a1.875 1.875 0 0 0 1.875-1.874m-4.5 0a1.875 1.875 0 0 1 1.875-1.874h1.5a1.875 1.875 0 0 1 1.875 1.874m0-17.858a1.875 1.875 0 0 0-1.875-1.874H9.75a1.875 1.875 0 0 0-1.875 1.874m2.25 17.858a1.875 1.875 0 0 0 1.875 1.874h1.5a1.875 1.875 0 0 0 1.875-1.874m-4.5 0a1.875 1.875 0 0 1 1.875-1.874h1.5a1.875 1.875 0 0 1 1.875 1.874m0-17.858L15 3.101" />
  </svg>
);


export const BottleneckIcon: React.FC<{ className?: string }> = ({ className }) => (
 <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
  <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244" />
</svg>
);

export const UpgradeIcon: React.FC<{ className?: string }> = ({ className }) => (
 <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
  <path strokeLinecap="round" strokeLinejoin="round" d="M9 9l6-6m0 0l6 6m-6-6v12a6 6 0 0 1-12 0v-3" />
</svg>
);

export const PowerIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="m3.75 13.5 10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z" />
  </svg>
);

export const LoadingSpinner: React.FC<{ className?: string }> = ({ className = "h-16 w-16" }) => (
  <div className="flex justify-center items-center p-8">
    <div className={`animate-spin rounded-full border-b-4 border-emerald-400 ${className}`}></div>
  </div>
);