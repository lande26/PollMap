import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { UserAuth } from '../context/AuthContext';
import PageShell, { GlassSection } from '../components/ui/PageShell.jsx';
import SpotlightCard from '../components/ui/SpotlightCard.jsx';
import {
  Activity,
  ArrowUpRight,
  BarChart3,
  Bookmark,
  Check,
  Clock3,
  Copy,
  Eye,
  Lock,
  PlusCircle,
  Shield,
  Trophy,
  Users,
} from 'lucide-react';
import { toast } from 'sonner';

const surfaceClass =
  'rounded-[28px] border border-white/8 bg-[linear-gradient(180deg,rgba(14,19,29,0.72),rgba(10,14,22,0.9))] backdrop-blur-2xl';

function Dashboard() {
  const navigate = useNavigate();
  const { session, user } = UserAuth();
  const [polls, setPolls] = useState([]);
  const [selectedPollId, setSelectedPollId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copiedLink, setCopiedLink] = useState(null);

  const firstName = useMemo(() => {
    const userEmail = session?.user?.email;
    return userEmail
      ? userEmail.split('@')[0].replace(/[^a-zA-Z]/g, '') || 'User'
      : 'User';
  }, [session?.user?.email]);

  useEffect(() => {
    const fetchPolls = async () => {
      try {
        const { data, error } = await supabase
          .from('polls')
          .select(`
            *,
            options (
              id,
              option_text,
              votes_count
            )
          `)
          .eq('created_by', user?.id)
          .order('created_at', { ascending: false });

        if (error) throw error;

        const mapped = (data || []).map((poll) => {
          const totalVotes = (poll.options || []).reduce(
            (sum, option) => sum + option.votes_count,
            0,
          );

          return {
            ...poll,
            totalVotes,
          };
        });

        setPolls(mapped);
      } catch (error) {
        console.error('Error fetching polls:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) {
      fetchPolls();
    } else {
      setLoading(false);
    }
  }, [user?.id]);

  const totalVotes = useMemo(
    () => polls.reduce((sum, poll) => sum + poll.totalVotes, 0),
    [polls],
  );

  const protectedCount = useMemo(
    () => polls.filter((poll) => poll.is_password_protected).length,
    [polls],
  );

  const activeCount = useMemo(
    () =>
      polls.filter((poll) => {
        if (!poll.expires_at) return true;
        return new Date(poll.expires_at) > new Date();
      }).length,
    [polls],
  );

  const selectedPoll = useMemo(
    () => polls.find((poll) => poll.id === selectedPollId) || null,
    [polls, selectedPollId],
  );

  const handleCreatePoll = () => {
    navigate('/create-poll', { state: { from: '/dashboard' } });
  };

  const generateJoinLink = async (pollId) => {
    try {
      const link = `${window.location.origin}/polls/${pollId}`;
      await navigator.clipboard.writeText(link);
      setCopiedLink(pollId);
      setTimeout(() => setCopiedLink(null), 1800);
      toast.success('Poll link copied to clipboard');
    } catch (error) {
      console.error('Error Copying link:', error);
      toast.error('Failed to copy link');
    }
  };

  return (
    <PageShell
      width="max-w-7xl"
      badge={<><BarChart3 size={16} /><span>Creator Workspace</span></>}
      title={<>Workspace for <span className="text-[#f5dfc0]">{firstName}</span></>}
      description="Run polls, review engagement, and manage live participation from one quieter workspace surface."
      actions={
        <>
          <button
            onClick={handleCreatePoll}
            className="group rounded-2xl bg-[#f59d0d] px-6 py-3 font-semibold text-[#120d06] transition hover:-translate-y-0.5 hover:bg-[#f7b339]"
          >
            <span className="flex items-center gap-3">
              <PlusCircle size={20} className="group-hover:rotate-90 transition-transform duration-300" />
              Create Poll
            </span>
          </button>
          <button
            onClick={() => navigate('/polls')}
            className="group rounded-2xl border border-white/10 bg-white/[0.045] px-6 py-3 font-semibold text-white backdrop-blur-md transition hover:-translate-y-0.5 hover:border-white/16 hover:bg-white/[0.08]"
          >
            <span className="flex items-center gap-3">
              <ArrowUpRight size={20} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300" />
              Explore Polls
            </span>
          </button>
        </>
      }
    >
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          icon={<BarChart3 className="h-5 w-5 text-orange-300" />}
          label="Total polls"
          value={polls.length}
          note="All campaigns"
          color="rgba(246,163,19,0.14)"
        />
        <StatCard
          icon={<Users className="h-5 w-5 text-[#b9e7ee]" />}
          label="Votes collected"
          value={totalVotes}
          note="Across your audience"
          color="rgba(86,185,200,0.12)"
        />
        <StatCard
          icon={<Clock3 className="h-5 w-5 text-emerald-300" />}
          label="Active now"
          value={activeCount}
          note="Open for responses"
          color="rgba(52,211,153,0.11)"
        />
        <StatCard
          icon={<Lock className="h-5 w-5 text-[#d8c0f7]" />}
          label="Protected"
          value={protectedCount}
          note="Password gated"
          color="rgba(192,141,242,0.12)"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[360px_minmax(0,1fr)]">
        <GlassSection className="p-5">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="font-display text-[1.7rem] font-semibold text-white">Recent Polls</h2>
              <p className="mt-1 text-sm text-slate-400">Select one poll to inspect, share, or open.</p>
            </div>
            <button
              onClick={handleCreatePoll}
              className="rounded-xl border border-white/10 bg-white/[0.045] px-3 py-2 text-sm font-medium text-white transition hover:bg-white/[0.08]"
            >
              New
            </button>
          </div>

          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="h-24 animate-pulse rounded-2xl bg-white/[0.045]" />
              ))}
            </div>
          ) : polls.length === 0 ? (
            <div className={`${surfaceClass} p-6 text-center`}>
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#f59d0d]/12">
                <PlusCircle className="h-6 w-6 text-orange-300" />
              </div>
              <h3 className="font-display text-xl font-semibold text-white">No polls yet</h3>
              <p className="mt-2 text-sm leading-6 text-slate-400">
                Start with one structured question and let the workspace grow from there.
              </p>
              <button
                onClick={handleCreatePoll}
                className="mt-5 rounded-xl bg-[#f59d0d] px-5 py-3 text-sm font-semibold text-[#120d06]"
              >
                Create your first poll
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {polls.map((poll) => (
                <button
                  key={poll.id}
                  type="button"
                  onClick={() => setSelectedPollId(poll.id)}
                  className={`w-full rounded-[22px] border p-4 text-left transition ${
                    selectedPollId === poll.id
                      ? 'border-[#f59d0d]/28 bg-[#f59d0d]/8'
                      : 'border-white/8 bg-white/[0.03] hover:border-white/14 hover:bg-white/[0.05]'
                  }`}
                >
                  <div className="mb-3 flex items-start justify-between gap-3">
                    <div>
                      <h3 className="line-clamp-2 font-display text-lg font-semibold text-white">
                        {poll.question}
                      </h3>
                      <p className="mt-2 text-xs uppercase tracking-[0.22em] text-slate-500">
                        {new Date(poll.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    {poll.is_password_protected ? (
                      <span className="rounded-full border border-amber-200/14 bg-[#f59d0d]/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#f5d8b2]">
                        Locked
                      </span>
                    ) : null}
                  </div>

                  <div className="mb-4 grid grid-cols-2 gap-2 text-sm text-slate-300">
                    <div className="rounded-xl bg-white/[0.045] px-3 py-2">
                      <span className="block text-[11px] uppercase tracking-[0.18em] text-slate-500">Votes</span>
                      <span className="mt-1 block font-semibold text-white">{poll.totalVotes}</span>
                    </div>
                    <div className="rounded-xl bg-white/[0.045] px-3 py-2">
                      <span className="block text-[11px] uppercase tracking-[0.18em] text-slate-500">Options</span>
                      <span className="mt-1 block font-semibold text-white">{poll.options?.length || 0}</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <span className="inline-flex flex-1 items-center justify-center rounded-xl bg-white/[0.045] px-3 py-2 text-sm font-medium text-slate-200">
                      Select
                    </span>
                    <span
                      onClick={(event) => {
                        event.stopPropagation();
                        generateJoinLink(poll.id);
                      }}
                      className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/[0.045] px-3 py-2 text-sm font-medium text-slate-200"
                    >
                      {copiedLink === poll.id ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </GlassSection>

        <GlassSection className="p-5">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="font-display text-[1.7rem] font-semibold text-white">Selected Poll</h2>
              <p className="mt-1 text-sm text-slate-400">Review the essentials here, then open the full poll or analytics.</p>
            </div>
            {selectedPollId ? (
              <div className="flex gap-2">
                <button
                  onClick={() => navigate(`/polls/${selectedPollId}`)}
                  className="rounded-xl border border-white/10 bg-white/[0.045] px-4 py-2 text-sm font-medium text-white transition hover:bg-white/[0.08]"
                >
                  Open Poll
                </button>
                <button
                  onClick={() => navigate(`/polls/${selectedPollId}/analytics`)}
                  className="rounded-xl bg-[#f59d0d] px-4 py-2 text-sm font-medium text-[#120d06] transition hover:bg-[#f7b339]"
                >
                  Analytics
                </button>
              </div>
            ) : null}
          </div>

          <SpotlightCard
            className="min-h-[580px] rounded-[24px] border border-white/10 bg-[linear-gradient(180deg,rgba(14,19,29,0.72),rgba(10,14,22,0.9))] p-5"
            spotlightColor="rgba(246,163,19,0.1)"
          >
            {selectedPoll ? (
              <SelectedPollPanel
                poll={selectedPoll}
                onOpen={() => navigate(`/polls/${selectedPoll.id}`)}
                onAnalytics={() => navigate(`/polls/${selectedPoll.id}/analytics`)}
                onCopy={() => generateJoinLink(selectedPoll.id)}
                copied={copiedLink === selectedPoll.id}
              />
            ) : (
              <div className="flex h-full flex-col items-center justify-center text-center">
                <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-[28px] bg-[#f59d0d]/10">
                  <Bookmark className="h-9 w-9 text-orange-300" />
                </div>
                <h3 className="font-display text-3xl font-semibold text-white">Choose a poll to continue</h3>
                <p className="mt-3 max-w-md text-base leading-7 text-slate-400">
                  This pane becomes the active detail surface for whichever poll you select from the left column.
                </p>
              </div>
            )}
          </SpotlightCard>
        </GlassSection>
      </div>
    </PageShell>
  );
}

function SelectedPollPanel({ poll, onOpen, onAnalytics, onCopy, copied }) {
  const isExpired = poll.expires_at ? new Date(poll.expires_at) < new Date() : false;
  const topOption = (poll.options || []).reduce((winner, option) => {
    if (!winner || option.votes_count > winner.votes_count) return option;
    return winner;
  }, null);

  return (
    <div className="flex h-full flex-col">
      <div className="rounded-[24px] border border-white/10 bg-white/[0.03] p-6">
        <div className="flex flex-wrap items-center gap-2">
          <span className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] ${
            isExpired
              ? 'bg-red-500/12 text-red-300'
              : 'bg-[#f59d0d]/12 text-[#f5d8b2]'
          }`}>
            {isExpired ? 'Closed' : 'Active'}
          </span>
          {poll.is_password_protected ? (
            <span className="rounded-full bg-[#f59d0d]/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[#f5d8b2]">
              Locked
            </span>
          ) : null}
        </div>

        <h3 className="mt-5 max-w-3xl font-display text-4xl font-semibold tracking-[-0.05em] text-white">
          {poll.question}
        </h3>

        <p className="mt-4 max-w-2xl text-base leading-7 text-slate-400">
          Created on {new Date(poll.created_at).toLocaleDateString()}.
          {' '}
          {isExpired ? 'This poll is no longer accepting votes.' : 'This poll is still open for responses.'}
        </p>
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-3">
        <SnapshotCard
          icon={<Users className="h-5 w-5 text-orange-200" />}
          label="Votes"
          value={poll.totalVotes}
          note="Total responses"
        />
        <SnapshotCard
          icon={<Activity className="h-5 w-5 text-sky-200" />}
          label="Options"
          value={poll.options?.length || 0}
          note="Choices available"
        />
        <SnapshotCard
          icon={<Shield className="h-5 w-5 text-emerald-200" />}
          label="Access"
          value={poll.is_password_protected ? 'Private' : 'Open'}
          note={poll.is_password_protected ? 'Password protected' : 'Public access'}
        />
      </div>

      <div className="mt-5 rounded-[24px] border border-white/10 bg-white/[0.03] p-6">
        <div className="flex items-center gap-2 text-white">
          <Trophy className="h-5 w-5 text-orange-200" />
          <h4 className="font-display text-2xl font-semibold">Top Option</h4>
        </div>

        {topOption ? (
          <div className="mt-5">
            <div className="flex items-end justify-between gap-4">
              <p className="text-xl font-semibold text-white">{topOption.option_text}</p>
              <p className="text-sm text-orange-200">
                {poll.totalVotes > 0 ? Math.round((topOption.votes_count / poll.totalVotes) * 100) : 0}% share
              </p>
            </div>
            <div className="mt-4 h-3 overflow-hidden rounded-full bg-white/8">
              <div
                className="h-full rounded-full bg-[#f59d0d]"
                style={{
                  width: `${poll.totalVotes > 0 ? Math.round((topOption.votes_count / poll.totalVotes) * 100) : 0}%`,
                }}
              />
            </div>
            <div className="mt-3 flex justify-between text-sm text-slate-400">
              <span>{topOption.votes_count} votes</span>
              <span>{poll.totalVotes} total</span>
            </div>
          </div>
        ) : (
          <p className="mt-4 text-sm text-slate-400">No options available yet.</p>
        )}
      </div>

      <div className="mt-5 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={onOpen}
          className="inline-flex items-center gap-2 rounded-2xl bg-[#f59d0d] px-5 py-3 text-sm font-semibold text-[#120d06] transition hover:bg-[#f7b339]"
        >
          <Eye className="h-4 w-4" />
          Open Full Poll
        </button>
        <button
          type="button"
          onClick={onAnalytics}
          className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.045] px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/[0.08]"
        >
          <BarChart3 className="h-4 w-4" />
          View Analytics
        </button>
        <button
          type="button"
          onClick={onCopy}
          className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.045] px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/[0.08]"
        >
          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          {copied ? 'Copied Link' : 'Copy Link'}
        </button>
      </div>
    </div>
  );
}

function SnapshotCard({ icon, label, value, note }) {
  return (
    <div className="rounded-[22px] border border-white/10 bg-white/[0.03] p-5">
      <div className="flex items-center justify-between">
        <div className="rounded-2xl bg-white/[0.045] p-3">{icon}</div>
        <span className="text-[11px] uppercase tracking-[0.22em] text-slate-500">{label}</span>
      </div>
      <div className="mt-4 font-display text-3xl font-semibold text-white">{value}</div>
      <p className="mt-2 text-sm text-slate-400">{note}</p>
    </div>
  );
}

function StatCard({ icon, label, value, note, color }) {
  return (
    <SpotlightCard
      className={`${surfaceClass} p-6`}
      spotlightColor={color}
    >
      <div className="mb-4 flex items-center justify-between">
        <div className="rounded-2xl bg-white/[0.045] p-3 ring-1 ring-white/8">
          {icon}
        </div>
        <span className="text-[11px] uppercase tracking-[0.22em] text-slate-500">{label}</span>
      </div>
      <div className="font-display text-4xl font-semibold text-white">{value}</div>
      <p className="mt-2 text-sm text-slate-400">{note}</p>
    </SpotlightCard>
  );
}

export default Dashboard;
