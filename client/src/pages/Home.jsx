import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  AudioLines,
  BadgeCheck,
  ChartNoAxesColumn,
  MessageSquareText,
  Sparkles,
  Users,
} from 'lucide-react';
import { UserAuth } from '../context/AuthContext';
import { useAuthModal } from '../context/AuthModalContext.jsx';
import { GlassSection } from '../components/ui/PageShell.jsx';
import AnimatedShaderHero from '../components/ui/animated-shader-hero.jsx';

const featureCards = [
  {
    icon: MessageSquareText,
    eyebrow: 'Live creation',
    title: 'Polls, Q&A, and room sessions in one flow',
    description:
      'Build public polls, private room sessions, and moderated audience questions without bouncing users across mismatched screens.',
    iconClass: 'text-orange-200 bg-orange-500/16 border-orange-400/25',
  },
  {
    icon: Users,
    eyebrow: 'Audience control',
    title: 'Move from broadcast polls to community-led sessions',
    description:
      'Open a public poll, run a room for a smaller group, or bring Q&A moderation into the same session shell.',
    iconClass: 'text-sky-200 bg-sky-500/16 border-sky-400/25',
  },
  {
    icon: BadgeCheck,
    eyebrow: 'Structured analytics',
    title: 'Track results, participation, and answer quality',
    description:
      'Keep results readable, exportable, and consistent across creator dashboards, voting flows, and live discussion rooms.',
    iconClass: 'text-[#b9e7ee] bg-[#56b9c8]/14 border-[#56b9c8]/24',
  },
];

const workflowSteps = [
  {
    label: 'Creator workspace',
    value: 'Polls, rooms, and analytics in one place',
  },
  {
    label: 'Live sessions',
    value: 'Moderated Q&A with audience participation',
  },
  {
    label: 'Cleaner flow',
    value: 'Fewer redirects and less route hopping',
  },
];

const productNotes = [
  'Shared background and shell across landing, dashboard, rooms, and poll detail.',
  'Modal auth instead of breaking the flow with a separate login route.',
  'One icon family and one palette instead of mixed blue, purple, and neon cards.',
];

const Home = () => {
  const navigate = useNavigate();
  const { user } = UserAuth();
  const { openAuthModal } = useAuthModal();

  const handlePrimaryAction = () => {
    if (user) {
      navigate('/dashboard');
      return;
    }

    openAuthModal({ mode: 'signup', intent: 'create' });
  };

  const handleExplore = () => {
    if (user) {
      navigate('/polls');
      return;
    }

    openAuthModal({
      mode: 'login',
      intent: 'signin',
      onSuccess: () => navigate('/polls'),
      pendingAuthAction: { type: 'navigate', path: '/polls' },
    });
  };

  return (
    <div className="relative min-h-screen overflow-hidden px-4 pb-10 pt-24 sm:px-6 lg:px-8">
      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col gap-8">
        <AnimatedShaderHero
          badge={<><AudioLines className="h-4 w-4" /><span>Live polling, rooms, and Q&amp;A in one workspace</span></>}
          title="One surface for"
          accentTitle="polls, rooms, and moderated Q&A"
          subtitle="Create polls, run live rooms, and manage audience questions from one consistent product flow. The goal here is clarity, not separate disconnected screens."
          primaryAction={
            <button
              type="button"
              onClick={handlePrimaryAction}
              className="inline-flex items-center justify-center gap-3 rounded-2xl bg-[#f59d0d] px-7 py-4 text-base font-semibold text-[#120d06] transition hover:bg-[#f7b339]"
            >
              Start building
              <ArrowRight className="h-5 w-5" />
            </button>
          }
          secondaryAction={
            <button
              type="button"
              onClick={handleExplore}
              className="inline-flex items-center justify-center gap-3 rounded-2xl border border-white/10 bg-white/[0.045] px-7 py-4 text-base font-semibold text-white transition hover:border-white/16 hover:bg-white/[0.08]"
            >
              Explore polls
            </button>
          }
          sideContent={(
            <GlassSection className="self-start bg-[linear-gradient(180deg,rgba(15,20,31,0.62),rgba(11,15,24,0.78))] p-6">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.05] text-[#f5d8b2]">
                  <Sparkles className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">Why this feels cleaner</p>
                  <p className="mt-1 text-sm leading-6 text-slate-400">
                    Cleaner typography and simpler action hierarchy make the product feel intentional instead of assembled.
                  </p>
                </div>
              </div>

              <div className="mt-6 grid gap-3">
                {workflowSteps.map((step, index) => (
                  <motion.div
                    key={step.label}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, delay: index * 0.08 }}
                    className="rounded-2xl border border-white/8 bg-white/[0.03] p-4"
                  >
                    <div className="mb-3 flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#f59d0d] text-xs font-bold text-[#120d06]">
                        0{index + 1}
                      </div>
                      <div className="text-[11px] uppercase tracking-[0.22em] text-slate-500">Sequence</div>
                    </div>
                    <p className="text-sm font-medium text-white">{step.label}</p>
                    <p className="mt-1 text-sm leading-6 text-slate-400">{step.value}</p>
                  </motion.div>
                ))}
              </div>
            </GlassSection>
          )}
        />

        <section className="grid gap-5 lg:grid-cols-3">
          {featureCards.map((card, index) => {
            const Icon = card.icon;

            return (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 22 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.38, delay: 0.08 * index }}
              >
                <GlassSection className="h-full p-5">
                  <div className="relative">
                    <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-2xl border ${card.iconClass}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <p className="text-xs uppercase tracking-[0.24em] text-slate-500">{card.eyebrow}</p>
                    <h2 className="mt-3 font-display text-[1.65rem] font-semibold tracking-tight text-white">
                      {card.title}
                    </h2>
                    <p className="mt-3 text-sm leading-7 text-slate-300">{card.description}</p>
                  </div>
                </GlassSection>
              </motion.div>
            );
          })}
        </section>

        <section className="grid gap-5 lg:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)]">
          <GlassSection className="p-6 sm:p-8">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Product flow</p>
                <h2 className="mt-3 font-display text-[2rem] font-semibold text-white sm:text-[2.4rem]">
                  Keep the next action <span className="font-accent text-[#f5dfc0]">obvious</span>.
                </h2>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.045] text-[#f5d8b2]">
                <ChartNoAxesColumn className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              {[
                ['Create', 'Start with a poll, a room, or a moderated Q&A session.'],
                ['Engage', 'Let people vote, ask questions, and join the right space.'],
                ['Review', 'Jump into analytics without duplicating the voting experience.'],
              ].map(([label, copy]) => (
                <div key={label} className="rounded-[24px] border border-white/8 bg-white/[0.03] p-5">
                  <p className="text-xs uppercase tracking-[0.22em] text-slate-500">{label}</p>
                  <p className="mt-3 text-sm leading-7 text-slate-300">{copy}</p>
                </div>
              ))}
            </div>
          </GlassSection>

          <GlassSection className="p-6 sm:p-8">
            <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Why it feels cleaner</p>
            <div className="mt-4 space-y-4">
              {productNotes.map((item) => (
                <div key={item} className="flex gap-3 rounded-[22px] border border-white/8 bg-white/[0.03] p-4">
                  <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.045] text-[#f5d8b2]">
                    <BadgeCheck className="h-4 w-4" />
                  </div>
                  <p className="text-sm leading-7 text-slate-300">{item}</p>
                </div>
              ))}
            </div>
          </GlassSection>
        </section>
      </div>
    </div>
  );
};

export default Home;
