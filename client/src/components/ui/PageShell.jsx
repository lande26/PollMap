import React from 'react';

export function PageShell({
  badge,
  title,
  description,
  actions,
  children,
  width = 'max-w-7xl',
}) {
  return (
    <div className="relative min-h-screen px-4 pb-16 pt-24 sm:px-6 lg:px-8">
      <div className={`relative z-10 mx-auto w-full ${width}`}>
        {(badge || title || description || actions) && (
          <section className="relative mb-10 overflow-hidden rounded-[32px] border border-[color:var(--color-panel-border)] bg-[linear-gradient(180deg,rgba(14,19,29,0.76),rgba(11,15,24,0.92))] shadow-[0_24px_70px_rgba(0,0,0,0.26)] backdrop-blur-2xl">
            <div className="absolute -left-20 top-[-5rem] h-52 w-72 rounded-full bg-[rgba(247,165,64,0.1)] blur-[110px]" />
            <div className="absolute right-[-8rem] bottom-[-6rem] h-56 w-64 rounded-full bg-[rgba(86,185,200,0.08)] blur-[120px]" />
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-100/20 to-transparent" />

            <div className="relative flex flex-col gap-6 px-6 py-7 sm:px-8 lg:flex-row lg:items-end lg:justify-between lg:px-10">
              <div className="max-w-3xl">
                {badge ? (
                  <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.045] px-4 py-2 text-sm font-medium text-[#f7d4a6]">
                    {badge}
                  </div>
                ) : null}

                {title ? (
                  <h1 className="font-display text-4xl font-semibold tracking-[-0.04em] text-white md:text-5xl">
                    {title}
                  </h1>
                ) : null}

                {description ? (
                  <p className="mt-4 max-w-2xl text-base leading-7 text-slate-300 md:text-lg">
                    {description}
                  </p>
                ) : null}
              </div>

              {actions ? (
                <div className="flex flex-wrap items-center gap-3">
                  {actions}
                </div>
              ) : null}
            </div>
          </section>
        )}

        <div className="space-y-8">
          {children}
        </div>
      </div>
    </div>
  );
}

export function GlassSection({ children, className = '' }) {
  return (
    <section
      className={`relative overflow-hidden rounded-[28px] border border-[color:var(--color-panel-border)] bg-[linear-gradient(180deg,rgba(14,19,29,0.72),rgba(11,15,24,0.9))] shadow-[0_20px_52px_rgba(0,0,0,0.2)] backdrop-blur-2xl ${className}`}
    >
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.018),transparent_32%)]" />
      {children}
    </section>
  );
}

export default PageShell;
