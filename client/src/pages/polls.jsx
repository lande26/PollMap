import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSocketContext } from '../context/SocketContext';
import { UserAuth } from '../context/AuthContext';
import { supabase } from '../supabaseClient';
import { motion } from 'framer-motion';
import { useAuthModal } from '../context/AuthModalContext.jsx';
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import {
  Tooltip as UITooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Calendar, Users, TrendingUp, BarChart3, Plus, Vote, Zap, Shield,
  Clock, Trophy, Sparkles, MessageCircle, Eye, Share2, MoreHorizontal,
  Copy, CheckCheck, BarChart4, PieChart as PieChartIcon, LineChart as LineChartIcon,
  Lock, X, QrCode, Download, FileText, Twitter, Linkedin, Facebook,
  ExternalLink, AlertCircle, Activity, Maximize2, ArrowLeft, Check
} from 'lucide-react';
import { toast } from 'sonner';
import TwitterXIcon from '../components/ui/icons/TwitterXIcon';
import WhatsappIcon from '../components/ui/icons/WhatsappIcon';
import FacebookIcon from '../components/ui/icons/FacebookIcon';
import LinkedinIcon from '../components/ui/icons/LinkedinIcon';
import PageShell, { GlassSection } from '../components/ui/PageShell.jsx';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const panelClass =
  'border border-white/10 bg-[linear-gradient(180deg,rgba(15,24,39,0.84),rgba(9,15,29,0.78))] backdrop-blur-xl';

const trackEvent = (category, action, label, value) => {
  if (window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
};

const trackPageView = (path) => {
  if (window.gtag) {
    window.gtag('config', import.meta.env.VITE_GA_MEASUREMENT_ID, {
      page_path: path,
    });
  }
};

const Polls = ({ pollId, isDashboardView = false }) => {
  const [polls, setPolls] = useState([]);
  const [poll, setPoll] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userVote, setUserVote] = useState(null);
  const [isExpired, setIsExpired] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [copiedPollId, setCopiedPollId] = useState(null);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [selectedSharePoll, setSelectedSharePoll] = useState(null);
  const [filter, setFilter] = useState('all'); // all, active, expired
  const [resumeVoteOptionId, setResumeVoteOptionId] = useState(null);

  const POLLS_PER_PAGE = 12;

  const socketContext = useSocketContext();
  const socket = socketContext?.socket;
  const { user } = UserAuth();
  const { openAuthModal, authResumeEvent } = useAuthModal();
  const navigate = useNavigate();

  useEffect(() => {
    const path = pollId ? `/polls/${pollId}` : '/polls';
    trackPageView(path);
  }, [pollId]);

  // Fetch all polls
  const fetchAllPolls = useCallback(async (pageNum = 1, append = false, activeFilter = filter) => {
    try {
      setLoading(true);

      const from = (pageNum - 1) * POLLS_PER_PAGE;
      const to = from + POLLS_PER_PAGE - 1;

      let query = supabase
        .from('polls')
        .select(`
          *,
          options!inner(id, option_text, votes_count, poll_id),
          profiles(username, avatar_url)
        `, { count: 'exact' });

      const now = new Date().toISOString();
      if (pageNum === 1 && activeFilter === 'active') { // Only apply filter logic if needed, simplify for now
        // Supabase OR syntax for "null OR > now" is a bit tricky with other filters. 
        // simplistic approach: 
      }

      // Better approach for filtering:
      if (activeFilter === 'active') {
        // Filter for polls that are either not expired (null) OR expire in the future
        query = query.or(`expires_at.is.null,expires_at.gt.${now}`);
      } else if (activeFilter === 'expired') {
        query = query.lt('expires_at', now);
      }

      const { data: pollsData, error: pollsError } = await query
        .order('created_at', { ascending: false })
        .range(from, to);

      if (pollsError) throw pollsError;

      const pollIds = pollsData.map(p => p.id);

      // Fetch vote data only if we have polls
      let votesData = [];
      if (pollIds.length > 0) {
        const { data } = await supabase
          .from('votes')
          .select('poll_id, user_id')
          .in('poll_id', pollIds);
        votesData = data || [];
      }

      const participantsByPoll = votesData.reduce((acc, vote) => {
        if (!acc[vote.poll_id]) acc[vote.poll_id] = new Set();
        acc[vote.poll_id].add(vote.user_id);
        return acc;
      }, {});

      const processedPolls = pollsData.map(poll => {
        const totalVotes = poll.options.reduce((sum, opt) => sum + opt.votes_count, 0);
        const participantCount = participantsByPoll[poll.id]?.size || 0;

        return {
          ...poll,
          totalVotes,
          participantCount,
          engagementRate: participantCount > 0 ? Math.round((totalVotes / participantCount) * 100) : 0
        };
      });

      setPolls(prev => append ? [...prev, ...processedPolls] : processedPolls);
      setHasMore(pollsData.length === POLLS_PER_PAGE);
      setLoading(false);
      trackEvent('Polls', 'view_all', `page_${pageNum}`);
    } catch (err) {
      console.error("Error fetching polls:", err);
      setError(err.message);
      setLoading(false);
      toast.error('Failed to load polls');
    }
  }, [filter]);

  // Fetch single poll
  const fetchPoll = useCallback(async () => {
    try {
      setLoading(true);

      const { data: pollData, error: pollError } = await supabase
        .from('polls')
        .select(`
          *,
          options(*),
          profiles(username, avatar_url),
          votes(*)
        `)
        .eq('id', pollId)
        .single();

      if (pollError) throw pollError;

      const isExpiredNow = pollData.expires_at && new Date(pollData.expires_at) < new Date();

      let userHasVoted = false;
      let existingVote = null;

      if (user) {
        const userVote = pollData.votes?.find(vote => vote.user_id === user.id);
        if (userVote) {
          userHasVoted = true;
          existingVote = userVote;
          setSelectedOption(userVote.option_id);
        }
      }

      const totalVotes = pollData.options.reduce((sum, opt) => sum + opt.votes_count, 0);
      const processedPoll = { ...pollData, totalVotes };

      setPoll(processedPoll);
      setHasVoted(userHasVoted);
      setUserVote(existingVote);
      setIsExpired(isExpiredNow);
      setLoading(false);
      trackEvent('Poll', 'view', pollId);
    } catch (err) {
      console.error("Error fetching poll:", err);
      setError(err.message);
      setLoading(false);
      toast.error('Failed to load poll');
    }
  }, [pollId, user]);

  // Initial fetch
  useEffect(() => {
    if (!pollId) {
      setPage(1);
      setPolls([]); // Clear polls on filter change
      fetchAllPolls(1, false, filter);
    } else if (pollId !== "undefined") {
      fetchPoll();
    } else {
      setError("Invalid poll ID");
      setLoading(false);
    }
  }, [pollId, user, fetchPoll, fetchAllPolls, filter]);

  // Socket connection
  useEffect(() => {
    if (!socket || !pollId || pollId === "undefined") return;

    socket.emit("joinPoll", pollId);

    const handlePollUpdate = (data) => {
      if (data.data.id === pollId) {
        setPoll(data.data);
        trackEvent('Poll', 'real_time_update', pollId);
      }
    };

    socket.on("pollDataUpdated", handlePollUpdate);

    return () => {
      socket.off("pollDataUpdated", handlePollUpdate);
      socket.emit("leavePoll", pollId);
    };
  }, [socket, pollId]);

  const submitVote = useCallback(async (optionId) => {
    if (!optionId) {
      toast.error('Please select an option to vote');
      return;
    }

    // Optimistic UI Update
    const previousHasVoted = hasVoted;
    const previousUserVote = userVote;
    const previousPoll = { ...poll };

    // Update local state immediately
    setHasVoted(true);
    // Create a temporary vote object for immediate feedback
    setUserVote({ option_id: optionId, user_id: user.id });

    // Update poll options count optimistically
    const updatedOptions = poll.options.map(opt => {
      if (opt.id === optionId) {
        return { ...opt, votes_count: opt.votes_count + 1 };
      }
      return opt;
    });
    setPoll({ ...poll, options: updatedOptions, totalVotes: poll.totalVotes + 1 });

    try {
      if (socket && socket.connected) {
        // Emit vote over socket to ensure real-time server broadcasting
        socket.emit("vote", { pollId, optionId, userId: user.id });
      } else {
        // Fallback if socket is unavailable
        const { error } = await supabase
          .from('votes')
          .insert({
            poll_id: pollId,
            option_id: optionId,
            user_id: user.id
          });

        if (error) throw error;

        // Update vote count on server
        await supabase.rpc('increment_vote', { option_id: optionId });

        // Refresh poll data to ensure sync locally
        fetchPoll();
      }

      toast.success('Your vote has been submitted!');
      trackEvent('Poll', 'vote_submitted', pollId, optionId);

    } catch (err) {
      console.error("Error voting:", err);
      toast.error('Failed to submit vote');

      // Revert optimistic updates
      setHasVoted(previousHasVoted);
      setUserVote(previousUserVote);
      setPoll(previousPoll);
    }
  }, [poll, pollId, user, fetchPoll, hasVoted, socket, userVote]);

  const handleVote = useCallback(async () => {
    if (!user) {
      openAuthModal({
        mode: 'login',
        intent: 'vote',
        pendingAuthAction: selectedOption ? { type: 'vote', pollId, optionId: selectedOption } : null,
        onSuccess: () => {
          if (selectedOption) {
            submitVote(selectedOption);
          }
        },
      });
      return;
    }

    await submitVote(selectedOption);
  }, [user, openAuthModal, selectedOption, pollId, submitVote]);

  useEffect(() => {
    const handleResumeVote = (event) => {
      const detail = event.detail;
      if (detail?.type !== 'vote' || detail?.pollId !== pollId || !detail?.optionId) {
        return;
      }
      setSelectedOption(detail.optionId);
      setResumeVoteOptionId(detail.optionId);
    };

    window.addEventListener(authResumeEvent, handleResumeVote);
    return () => window.removeEventListener(authResumeEvent, handleResumeVote);
  }, [authResumeEvent, pollId]);

  useEffect(() => {
    if (!resumeVoteOptionId || !user || !poll || hasVoted) return;
    submitVote(resumeVoteOptionId);
    setResumeVoteOptionId(null);
  }, [resumeVoteOptionId, user, poll, hasVoted, submitVote]);

  const copyPollLink = useCallback(async (pollId) => {
    const link = `${window.location.origin}/polls/${pollId}`;
    try {
      await navigator.clipboard.writeText(link);
      setCopiedPollId(pollId);
      toast.success('Poll link copied to clipboard!');
      setTimeout(() => setCopiedPollId(null), 2000);
      trackEvent('Poll', 'share_link', pollId);
    } catch (err) {
      toast.error('Failed to copy link');
    }
  }, []);

  const openShareModal = useCallback((poll) => {
    setSelectedSharePoll(poll);
    setShareModalOpen(true);
    trackEvent('Poll', 'open_share_modal', poll.id);
  }, []);

  const getInitials = useCallback((username, email) => {
    if (username) return username.substring(0, 2).toUpperCase();
    if (email) return email.substring(0, 2).toUpperCase();
    return 'US';
  }, []);

  const loadMore = useCallback(() => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchAllPolls(nextPage, true);
    trackEvent('Polls', 'load_more', `page_${nextPage}`);
  }, [page, fetchAllPolls]);

  const getPollStatus = useCallback((poll) => {
    if (poll.expires_at && new Date(poll.expires_at) < new Date()) {
      return 'expired';
    }
    return 'active';
  }, []);

  const getTopChoice = useCallback((options) => {
    if (!options || options.length === 0) return null;
    return options.reduce((prev, current) =>
      (prev.votes_count > current.votes_count) ? prev : current
    );
  }, []);

  // Memoized stats
  const stats = useMemo(() => {
    if (!polls.length) return null;

    return {
      totalPolls: polls.length,
      totalVotes: polls.reduce((sum, poll) => sum + poll.totalVotes, 0),
      activePolls: polls.filter(poll => getPollStatus(poll) === 'active').length,
      avgEngagement: Math.round(polls.reduce((sum, poll) => sum + poll.engagementRate, 0) / polls.length)
    };
  }, [polls, getPollStatus]);

  // Share Modal
  const ShareModal = () => {
    if (!selectedSharePoll) return null;

    const pollUrl = `${window.location.origin}/polls/${selectedSharePoll.id}`;
    const shareText = `Check out this poll: ${selectedSharePoll.question}`;

    return (
      <Dialog open={shareModalOpen} onOpenChange={setShareModalOpen}>
        <DialogContent className="z-[9999] border border-orange-400/15 bg-[#10172A]/90 text-white backdrop-blur sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl flex items-center gap-2">
              <Share2 className="h-5 w-5 text-orange-200" />
              Share Poll
            </DialogTitle>
            <DialogDescription className="text-gray-300">
              {selectedSharePoll.question}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            <div className="flex items-center space-x-2 rounded-lg border border-white/10 bg-[#0D1425] p-2">
              <Input
                value={pollUrl}
                readOnly
                className="bg-transparent border-none text-white focus-visible:ring-0 shadow-none"
              />
              <Button
                onClick={() => copyPollLink(selectedSharePoll.id)}
                size="icon"
                className="h-9 w-9 shrink-0 bg-gradient-to-r from-orange-500 to-amber-400 text-slate-950 hover:from-orange-400 hover:to-amber-300"
              >
                {copiedPollId === selectedSharePoll.id ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>

            <div className="flex justify-center items-center gap-6">
              {/* Twitter */}
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(pollUrl)}`);
                  trackEvent('Share', 'twitter', selectedSharePoll.id);
                }}
                className="cursor-pointer group flex flex-col items-center gap-1"
              >
                <div className="w-12 h-12 flex items-center justify-center bg-black/20 rounded-full group-hover:bg-black/40 transition-colors">
                  <TwitterXIcon className="w-6 h-6 text-white" />
                </div>
                <span className="text-xs text-gray-400">X</span>
              </motion.div>

              {/* LinkedIn */}
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(pollUrl)}`);
                  trackEvent('Share', 'linkedin', selectedSharePoll.id);
                }}
                className="cursor-pointer group flex flex-col items-center gap-1"
              >
                <div className="w-12 h-12 flex items-center justify-center bg-[#0077b5]/10 rounded-full group-hover:bg-[#0077b5]/20 transition-colors">
                  <LinkedinIcon className="w-6 h-6 text-[#0077b5]" />
                </div>
                <span className="text-xs text-gray-400">LinkedIn</span>
              </motion.div>

              {/* Facebook */}
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(pollUrl)}`);
                  trackEvent('Share', 'facebook', selectedSharePoll.id);
                }}
                className="cursor-pointer group flex flex-col items-center gap-1"
              >
                <div className="w-12 h-12 flex items-center justify-center bg-[#1877f2]/10 rounded-full group-hover:bg-[#1877f2]/20 transition-colors">
                  <FacebookIcon className="w-6 h-6 text-[#1877b5]" />
                </div>
                <span className="text-xs text-gray-400">Facebook</span>
              </motion.div>

              {/* WhatsApp */}
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(shareText + ' ' + pollUrl)}`);
                  trackEvent('Share', 'whatsapp', selectedSharePoll.id);
                }}
                className="cursor-pointer group flex flex-col items-center gap-1"
              >
                <div className="w-12 h-12 flex items-center justify-center bg-[#25d366]/10 rounded-full group-hover:bg-[#25d366]/20 transition-colors">
                  <WhatsappIcon className="w-6 h-6 text-[#25d366]" />
                </div>
                <span className="text-xs text-gray-400">WhatsApp</span>
              </motion.div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  };

  // Loading skeleton
  if (loading && polls.length === 0) {
    return (
      <div className="min-h-screen pt-16">
        <div className="max-w-7xl mx-auto p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
            {[1, 2, 3, 4].map(i => (
              <Card key={i} className="border-white/10 bg-[#10172A]/80 backdrop-blur">
                <CardContent className="p-6">
                  <Skeleton className="h-4 w-20 mb-2 bg-gray-700" />
                  <Skeleton className="h-8 w-16 bg-gray-700" />
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <Card key={i} className="border-white/10 bg-[#10172A]/80 backdrop-blur">
                <CardHeader>
                  <Skeleton className="h-6 w-3/4 mb-2 bg-gray-700" />
                  <Skeleton className="h-4 w-1/2 bg-gray-700" />
                </CardHeader>
                <CardContent className="space-y-3">
                  <Skeleton className="h-4 w-full bg-gray-700" />
                  <Skeleton className="h-4 w-5/6 bg-gray-700" />
                </CardContent>
                <CardFooter>
                  <Skeleton className="h-10 w-full bg-gray-700" />
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center p-8">
        <Card className="max-w-md border-white/10 bg-[#10172A]/80 text-center backdrop-blur">
          <CardContent className="pt-6">
            <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="h-8 w-8 text-red-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Unable to Load Polls</h3>
            <p className="text-gray-300 mb-4">{error}</p>
            <Button
              onClick={() => pollId ? fetchPoll() : fetchAllPolls()}
              className="bg-gradient-to-r from-orange-500 to-amber-400 text-slate-950 hover:from-orange-400 hover:to-amber-300"
            >
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Single poll view
  if (pollId && poll) {
    if (isExpired) {
      return (
        <PageShell
          width="max-w-6xl"
          badge={<><Clock className="h-4 w-4" /><span>Poll Closed</span></>}
          title="Final results"
          description="This poll is no longer accepting votes, but the results remain available."
        >
            <Card className={panelClass}>
              <CardHeader className="text-center">
                <CardTitle className="font-display text-4xl font-semibold text-white">
                  {poll.question}
                </CardTitle>
                <div className="mt-4 mx-auto max-w-md rounded-2xl border border-orange-400/20 bg-orange-500/10 p-4 text-orange-100">
                  <div className="flex items-center justify-center gap-2">
                    <Clock className="h-5 w-5" />
                    This poll has expired and is no longer accepting votes.
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <h3 className="text-2xl font-semibold text-white text-center mb-8">Final Results</h3>

                {/* Detailed Results */}
                <div className="mt-8 space-y-4">
                  <h4 className="text-xl font-semibold text-white text-center">Detailed Breakdown</h4>
                  {poll.options.map((option, index) => {
                    const percentage = poll.totalVotes > 0
                      ? Math.round((option.votes_count / poll.totalVotes) * 100)
                      : 0;
                    return (
                        <div key={option.id} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-white font-medium text-lg">{option.option_text}</span>
                          <div className="flex items-center gap-3">
                            <span className="text-orange-300 font-bold text-lg">{percentage}%</span>
                            <span className="text-slate-400 text-sm">({option.votes_count} votes)</span>
                          </div>
                        </div>
                        <Progress value={percentage} className="h-3 bg-gray-700" />
                      </div>
                    );
                  })}
                </div>

                {/* Action Buttons */}
                <div className="mt-8 flex justify-center gap-3">
                  <Button
                    onClick={() => navigate(`/polls/${pollId}/analytics`)}
                    className="bg-gradient-to-r from-orange-500 to-amber-500 text-white hover:from-orange-400 hover:to-amber-400"
                  >
                    <Activity className="mr-2 h-4 w-4" />
                    Full Analytics
                  </Button>
                  <Button
                    onClick={() => openShareModal(poll)}
                    variant="outline"
                    className="border-white/10 bg-white/5 text-white hover:bg-white/10"
                  >
                    <Share2 className="mr-2 h-4 w-4" />
                    Share Results
                  </Button>
                </div>
              </CardContent>
            </Card>
        </PageShell>
      );
    }

    // Active poll view
    return (
      <PageShell
        width="max-w-4xl"
        badge={<><Vote className="h-4 w-4" /><span>Live Poll</span></>}
        title={poll.question}
        description={poll.description || 'Vote in real time and watch the response shift as participation grows.'}
      >
          <Card className={panelClass}>
            <CardHeader className="text-center">
              {poll.profiles && (
                <div className="mt-2 flex items-center justify-center gap-2 text-slate-400">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={poll.profiles.avatar_url} />
                    <AvatarFallback className="text-xs">
                      {getInitials(poll.profiles.username)}
                    </AvatarFallback>
                  </Avatar>
                  <span>Created by {poll.profiles.username}</span>
                </div>
              )}
            </CardHeader>
            <CardContent className="pt-6">
              {!hasVoted && !isDashboardView ? (
                <div className="space-y-4">
                  <h3 className="mb-6 text-center font-display text-2xl font-semibold text-white">Cast your vote</h3>
                  {poll.options.map((option) => (
                    <div
                      key={option.id}
                      className={`flex items-center space-x-4 p-4 border-2 rounded-xl transition-all duration-200 cursor-pointer ${selectedOption === option.id
                        ? 'border-orange-400 bg-orange-500/10'
                        : 'border-white/10 bg-white/[0.03] hover:border-orange-300/40 hover:bg-orange-500/5'
                        }`}
                      onClick={() => setSelectedOption(option.id)}
                    >
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${selectedOption === option.id
                        ? 'border-orange-400 bg-orange-400'
                        : 'border-slate-500 bg-transparent'
                        }`}>
                        {selectedOption === option.id && (
                          <div className="w-2 h-2 rounded-full bg-white"></div>
                        )}
                      </div>
                      <label className="text-white text-lg font-medium flex-1 cursor-pointer">
                        {option.option_text}
                      </label>
                    </div>
                  ))}
                  <Button
                    onClick={handleVote}
                    disabled={!selectedOption}
                    className="mt-6 w-full rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 py-6 text-lg font-semibold text-white hover:from-orange-400 hover:to-amber-400 disabled:opacity-50"
                    size="lg"
                  >
                    <Vote className="mr-3 h-5 w-5" />
                    Submit Vote
                  </Button>
                  {!user && (
                    <div className="text-center mt-4">
                      <p className="text-gray-400 text-sm">
                        Need to sign in to vote?{' '}
                        <button
                          onClick={() => openAuthModal({ mode: 'login', intent: 'vote' })}
                          className="text-orange-300 hover:text-orange-200 underline"
                        >
                          Sign in here
                        </button>
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-6">
                  {!isDashboardView && (
                    <div className="text-center">
                      <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Check className="h-8 w-8 text-green-400" />
                      </div>
                      <h3 className="mb-2 font-display text-3xl font-semibold text-white">Vote recorded</h3>
                      {userVote && (
                        <p className="text-gray-300 text-lg">
                          You voted for: <span className="text-orange-300 font-semibold">
                            {poll.options.find(opt => opt.id === userVote.option_id)?.option_text}
                          </span>
                        </p>
                      )}
                    </div>
                  )}

                  <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
                    <h4 className="mb-6 text-center font-display text-2xl font-semibold text-white">Live results</h4>

                    {/* Detailed Results */}
                    <div className="space-y-3">
                      {poll.options.map((option) => {
                        const percentage = poll.totalVotes > 0
                          ? Math.round((option.votes_count / poll.totalVotes) * 100)
                          : 0;
                        const isUserVote = userVote && userVote.option_id === option.id;

                        return (
                          <div key={option.id} className="space-y-2">
                            <div className="flex justify-between items-center">
                              <div className="flex items-center gap-3 flex-1">
                                <span className="text-white font-medium">
                                  {option.option_text}
                                </span>
                                {isUserVote && (
                                  <Badge className="border-orange-400/20 bg-orange-500/10 text-orange-200 text-xs">
                                    Your Vote
                                  </Badge>
                                )}
                              </div>
                              <span className="min-w-16 rounded-full bg-orange-500/10 px-3 py-1 text-center text-lg font-bold text-orange-300">
                                {percentage}%
                              </span>
                            </div>
                            <Progress
                              value={percentage}
                              className={`h-3 bg-gray-700 ${isUserVote ? '!bg-orange-500/40' : ''
                                }`}
                            />
                            <div className="flex justify-between text-sm text-gray-400">
                              <span>{option.votes_count} votes</span>
                              <span>{percentage}% of total</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {poll.totalVotes > 0 && (
                      <div className="mt-6 rounded-xl border border-white/10 bg-white/[0.02] p-4">
                        <div className="flex items-center justify-between">
                          <span className="text-gray-300">Total Votes Cast:</span>
                          <span className="text-white font-bold text-lg">{poll.totalVotes}</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Button
                      onClick={() => navigate(`/polls/${pollId}/analytics`)}
                      className="bg-gradient-to-r from-orange-500 to-amber-500 text-white hover:from-orange-400 hover:to-amber-400"
                    >
                      <Activity className="mr-2 h-4 w-4" />
                      {isDashboardView ? 'View Full Analytics' : 'Advanced Analytics'}
                    </Button>
                    <Button
                      onClick={() => openShareModal(poll)}
                      variant="outline"
                      className="border-white/10 bg-white/5 text-white hover:bg-white/10"
                    >
                      <Share2 className="mr-2 h-4 w-4" />
                      Share Results
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
      </PageShell>
    );
  }

  // All polls list view
  if (!pollId) {
    if (polls.length === 0) {
      return (
        <div className="min-h-screen pt-16 flex items-center justify-center p-8">
          <div className="text-center max-w-2xl">
            <div className="mx-auto mb-8 flex h-32 w-32 items-center justify-center rounded-full bg-orange-500/12">
              <Vote className="h-16 w-16 text-orange-200" />
            </div>
            <h1 className="text-5xl font-bold text-white mb-6">
              Start the Conversation
            </h1>
            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
              Create your first interactive poll and engage your audience with real-time voting, analytics, and beautiful visualizations.
            </p>
            <Button
              onClick={() => {
                if (!user) {
                  openAuthModal({
                    mode: 'login',
                    intent: 'create',
                    pendingAuthAction: { type: 'navigate', path: '/create-poll' },
                    onSuccess: () => navigate('/create-poll', { state: { from: '/polls' } }),
                  });
                  return;
                }
                navigate('/create-poll', { state: { from: '/polls' } });
                trackEvent('Navigation', 'create_first_poll');
              }}
              className="rounded-xl bg-gradient-to-r from-orange-500 to-amber-400 px-8 py-6 text-lg text-slate-950 hover:from-orange-400 hover:to-amber-300"
              size="lg"
            >
              <Plus className="mr-3 h-5 w-5" />
              Create First Poll
            </Button>
          </div>
        </div>
      );
    }

    return (
      <TooltipProvider>
        <PageShell
          width="max-w-7xl"
          badge={<><Activity className="h-4 w-4" /><span>Live Polls</span></>}
          title="Community polls"
          description="Browse live conversations, protected voting flows, and shared analytics from one consistent discovery surface."
        >
            {/* Enhanced Stats Section */}
            {stats && (
              <div className="mb-10 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card className={panelClass}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-400">Total Polls</p>
                        <p className="mt-1 font-display text-3xl font-semibold text-white">{stats.totalPolls}</p>
                      </div>
                      <div className="w-12 h-12 bg-orange-500/10 rounded-xl flex items-center justify-center">
                        <BarChart3 className="h-6 w-6 text-orange-300" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className={panelClass}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-400">Total Votes</p>
                        <p className="mt-1 font-display text-3xl font-semibold text-white">{stats.totalVotes.toLocaleString()}</p>
                      </div>
                      <div className="w-12 h-12 bg-sky-500/10 rounded-xl flex items-center justify-center">
                        <Users className="h-6 w-6 text-sky-300" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className={panelClass}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-400">Active Polls</p>
                        <p className="mt-1 font-display text-3xl font-semibold text-white">{stats.activePolls}</p>
                      </div>
                      <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center">
                        <MessageCircle className="h-6 w-6 text-emerald-300" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className={panelClass}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-400">Avg. Engagement</p>
                        <p className="mt-1 font-display text-3xl font-semibold text-white">{stats.avgEngagement}%</p>
                      </div>
                      <div className="w-12 h-12 bg-violet-500/10 rounded-xl flex items-center justify-center">
                        <TrendingUp className="h-6 w-6 text-violet-300" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Action Bar */}
            <GlassSection className="mb-8 p-5">
            <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
              <div>
                <h2 className="mb-2 font-display text-[1.75rem] font-semibold text-white">Community Polls</h2>
                <p className="text-gray-400">Discover and participate in real-time discussions</p>
              </div>
              <div className="flex gap-3">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                    className="border-white/10 bg-white/5 text-white hover:bg-white/10"
                  >
                    <Eye className="mr-2 h-4 w-4" />
                      Filter: {filter.charAt(0).toUpperCase() + filter.slice(1)}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="border-white/10 bg-[#10172A] text-white">
                    <DropdownMenuItem onClick={() => setFilter('all')} className="hover:bg-orange-500/15 cursor-pointer">
                      All Polls
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setFilter('active')} className="hover:bg-orange-500/15 cursor-pointer">
                      Active Only
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setFilter('expired')} className="hover:bg-orange-500/15 cursor-pointer">
                      Expired Only
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <Button
                  onClick={() => {
                    if (!user) {
                      openAuthModal({
                        mode: 'login',
                        intent: 'create',
                        pendingAuthAction: { type: 'navigate', path: '/create-poll' },
                        onSuccess: () => navigate('/create-poll', { state: { from: '/polls' } }),
                      });
                      return;
                    }
                    navigate('/create-poll', { state: { from: '/polls' } });
                  }}
                  className="bg-gradient-to-r from-orange-500 to-amber-500 text-white hover:from-orange-400 hover:to-amber-400"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  New Poll
                </Button>
              </div>
            </div>
            </GlassSection>

            {/* Enhanced Polls Grid */}
            <div className="grid grid-cols-1 gap-5 lg:grid-cols-2 xl:grid-cols-3">
              {polls.map(poll => {
                const isTrending = poll.totalVotes >= 10;
                const isHighEngagement = poll.engagementRate >= 60;
                const isExpiredPoll = Boolean(poll.expires_at && new Date(poll.expires_at) < new Date());

                return (
                  <Card key={poll.id} className={`${panelClass} group transition-all duration-300 hover:border-orange-400/30`}>
                    <CardHeader className="pb-4">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8 border border-gray-600">
                            <AvatarImage src={poll.profiles?.avatar_url} />
                            <AvatarFallback className="bg-orange-500/10 text-orange-200 text-xs">
                              {getInitials(poll.profiles?.username, poll.created_by)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex gap-1">
                            {poll.is_password_protected && (
                              <UITooltip>
                                <TooltipTrigger>
                                  <Badge variant="outline" className="border-amber-400/20 bg-amber-500/10 text-amber-200 hover:bg-amber-500/20">
                                    <Shield className="h-3 w-3" />
                                  </Badge>
                                </TooltipTrigger>
                                <TooltipContent className="border-white/10 bg-[#1E293B] text-white">
                                  <p className="text-xs">Password Protected</p>
                                </TooltipContent>
                              </UITooltip>
                            )}

                            {isTrending && (
                              <UITooltip>
                                <TooltipTrigger>
                                  <Badge variant="outline" className="border-orange-400/20 bg-orange-500/10 text-orange-200 hover:bg-orange-500/20">
                                    <Zap className="h-3 w-3 mr-1" />
                                    <span className="text-[10px] font-bold">TRENDING</span>
                                  </Badge>
                                </TooltipTrigger>
                                <TooltipContent className="border-white/10 bg-[#1E293B] text-white">
                                  <p className="text-xs">High activity: {poll.totalVotes}+ votes</p>
                                </TooltipContent>
                              </UITooltip>
                            )}

                            {isHighEngagement && (
                              <UITooltip>
                                <TooltipTrigger>
                                  <Badge variant="outline" className="border-sky-400/20 bg-sky-500/10 text-sky-200 hover:bg-sky-500/20">
                                    <TrendingUp className="h-3 w-3 mr-1" />
                                    <span className="text-[10px] font-bold">HOT</span>
                                  </Badge>
                                </TooltipTrigger>
                                <TooltipContent className="border-white/10 bg-[#1E293B] text-white">
                                  <p className="text-xs">High Engagement: {poll.engagementRate}% participation</p>
                                </TooltipContent>
                              </UITooltip>
                            )}

                            {isExpiredPoll && (
                              <UITooltip>
                                <TooltipTrigger>
                                  <Badge variant="outline" className="bg-gray-700/50 text-gray-400 border-gray-600">
                                    <Clock className="h-3 w-3" />
                                  </Badge>
                                </TooltipTrigger>
                                <TooltipContent className="border-white/10 bg-[#1E293B] text-white">
                                  <p className="text-xs">Poll Expired</p>
                                </TooltipContent>
                              </UITooltip>
                            )}
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 text-gray-400 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => openShareModal(poll)}
                        >
                          <Share2 className="h-4 w-4" />
                        </Button>
                      </div>

                      <CardTitle className="font-display text-[1.35rem] leading-8 text-white line-clamp-2 group-hover:text-orange-200 transition-colors cursor-pointer"
                        onClick={() => {
                          navigate(`/polls/${poll.id}`);
                          trackEvent('Poll', 'open_detail', poll.id);
                        }}
                      >
                        {poll.question}
                      </CardTitle>

                      <CardDescription className="mt-3 flex items-center justify-between text-sm">
                        <span className="text-gray-400 flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {new Date(poll.created_at).toLocaleDateString()}
                        </span>
                        <div className="flex gap-3">
                          <span className="text-gray-400 flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            {poll.participantCount}
                          </span>
                          <span className={`flex items-center gap-1 ${poll.engagementRate > 50 ? 'text-emerald-300' :
                            poll.engagementRate > 20 ? 'text-orange-200' :
                              'text-gray-400'
                            }`}>
                            <TrendingUp className="h-4 w-4" />
                            {poll.engagementRate}%
                          </span>
                        </div>
                      </CardDescription>
                    </CardHeader>

                    <CardContent className="pt-0">
                      {poll.options.slice(0, 2).map((option) => {
                        const percentage = poll.totalVotes > 0
                          ? Math.round((option.votes_count / poll.totalVotes) * 100)
                          : 0;
                        return (
                          <div key={option.id} className="mb-3">
                            <div className="mb-1 flex justify-between text-sm">
                              <span className="text-white truncate font-medium">{option.option_text}</span>
                              <span className="text-orange-300 font-bold">{percentage}%</span>
                            </div>
                            <Progress value={percentage} className="h-2 bg-gray-700" />
                          </div>
                        );
                      })}
                      {poll.options.length > 2 && (
                        <p className="mt-3 rounded-full bg-[#0D1425]/50 py-1 text-center text-sm text-gray-400">
                          +{poll.options.length - 2} more options
                        </p>
                      )}

                      {/* Top Choice Highlight */}
                      {(() => {
                        const topChoice = poll.options?.reduce((prev, current) =>
                          (prev.votes_count > current.votes_count) ? prev : current
                          , { votes_count: -1 });

                        return topChoice && topChoice.votes_count > 0 && (
                          <div className="mt-4 rounded-lg border border-orange-400/15 bg-orange-500/8 p-3">
                            <div className="mb-1 flex items-center gap-2">
                              <Trophy className="h-4 w-4 text-orange-200" />
                              <span className="text-xs font-semibold text-orange-100">Community Choice</span>
                            </div>
                            <p className="text-white text-sm font-medium truncate">
                              {topChoice.option_text}
                            </p>
                            <p className="text-gray-400 text-xs mt-1">
                              {Math.round((topChoice.votes_count / poll.totalVotes) * 100)}% of votes
                            </p>
                          </div>
                        )
                      })()}
                    </CardContent>

                    <CardFooter>
                      <div className="flex gap-2 w-full">
                        <Button
                          className="flex-1 rounded-xl bg-gradient-to-r from-orange-500 to-amber-400 py-2.5 font-semibold text-slate-950 hover:from-orange-400 hover:to-amber-300"
                          onClick={() => {
                            navigate(`/polls/${poll.id}`);
                            trackEvent('Poll', 'open_detail', poll.id);
                          }}
                        >
                          {isExpiredPoll ? (
                            <>
                              <BarChart3 className="mr-2 h-4 w-4" />
                              View Results
                            </>
                          ) : (
                            <>
                              <Vote className="mr-2 h-4 w-4" />
                              Vote Now
                            </>
                          )}
                        </Button>
                        <div className="flex gap-1">
                          <UITooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                className="border-white/10 bg-[#0D1425] text-gray-300 hover:bg-[#1a2332] hover:text-white"
                                onClick={() => navigate(`/polls/${poll.id}/analytics`)}
                              >
                                <Activity className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent className="border-white/10 bg-[#1E293B] text-white">
                              <p>View Analytics</p>
                            </TooltipContent>
                          </UITooltip>
                          <UITooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                className="border-white/10 bg-[#0D1425] text-gray-300 hover:bg-[#1a2332] hover:text-white"
                                onClick={() => openShareModal(poll)}
                              >
                                {copiedPollId === poll.id ? (
                                  <Check className="h-4 w-4 text-green-400" />
                                ) : (
                                  <Share2 className="h-4 w-4" />
                                )}
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent className="border-white/10 bg-[#1E293B] text-white">
                              <p>Share Poll</p>
                            </TooltipContent>
                          </UITooltip>
                        </div>
                      </div>
                    </CardFooter>
                  </Card>
                );
              })}
            </div>

            {/* Load More */}
            {hasMore && (
              <div className="text-center mt-12">
                <Button
                  onClick={loadMore}
                  disabled={loading}
                  className="border border-white/10 bg-white/5 px-8 py-6 rounded-xl text-white hover:bg-white/10"
                  size="lg"
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Loading...
                    </div>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-5 w-5" />
                      Load More Polls
                    </>
                  )}
                </Button>
              </div>
            )}
        </PageShell>

        {/* Render Modals */}
        <ShareModal />
      </TooltipProvider>
    );
  }

  return null;
};

export default Polls;
