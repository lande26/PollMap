import React from 'react';

function AppBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-[#090d14]">
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(circle at 14% 18%, rgba(247, 165, 64, 0.16), transparent 22%),
            radial-gradient(circle at 76% 16%, rgba(255, 214, 160, 0.09), transparent 24%),
            radial-gradient(circle at 82% 68%, rgba(61, 124, 143, 0.12), transparent 20%),
            linear-gradient(180deg, #090d14 0%, #0a1018 52%, #090d14 100%)
          `,
        }}
      />

      <div className="absolute left-[-18%] top-[8%] h-[34rem] w-[62rem] rounded-full bg-[rgba(176,120,82,0.34)] blur-[140px]" />
      <div className="absolute right-[-16%] top-[14%] h-[40rem] w-[44rem] rounded-full bg-[rgba(86,62,41,0.3)] blur-[150px]" />
      <div className="absolute right-[8%] top-[30%] h-[28rem] w-[28rem] rounded-full bg-[rgba(218,186,160,0.12)] blur-[110px]" />
      <div className="absolute bottom-[-10%] left-[28%] h-[22rem] w-[34rem] rounded-full bg-[rgba(65,113,128,0.12)] blur-[120px]" />

      <div
        className="absolute inset-y-[-8%] right-[20%] w-[36rem] opacity-60 blur-[34px]"
        style={{
          background:
            'linear-gradient(130deg, rgba(255,255,255,0.0) 0%, rgba(255,236,216,0.16) 48%, rgba(255,255,255,0.0) 100%)',
          transform: 'rotate(14deg)',
        }}
      />

      <div
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)
          `,
          backgroundSize: '88px 88px',
          maskImage: 'linear-gradient(to bottom, rgba(0,0,0,0.42), rgba(0,0,0,0.08))',
          WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,0.42), rgba(0,0,0,0.08))',
        }}
      />

      <div
        className="absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage:
            'radial-gradient(rgba(255,255,255,0.9) 0.7px, transparent 0.7px)',
          backgroundSize: '24px 24px',
          maskImage: 'linear-gradient(to bottom, rgba(0,0,0,0.22), transparent 80%)',
          WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,0.22), transparent 80%)',
        }}
      />

      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-100/18 to-transparent" />
    </div>
  );
}

export default AppBackground;
