import React, { useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSocketContext } from '../context/SocketContext';
import { UserAuth } from '../context/AuthContext';
import { supabase } from '../supabaseClient';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Check,
  CheckCheck,
  CheckCircle2,
  Copy,
  Crown,
  Link2,
  Loader2,
  MessageCircle,
  MoreVertical,
  Plus,
  Power,
  Send,
  ThumbsUp,
  Users,
} from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import PageShell, { GlassSection } from '../components/ui/PageShell.jsx';

const surfaceClass =
  'border border-white/10 bg-[linear-gradient(180deg,rgba(15,24,39,0.84),rgba(9,15,29,0.78))] backdrop-blur-xl';

function RoomPage() {
  const { roomCode } = useParams();
  const navigate = useNavigate();
  const { socket } = useSocketContext();
  const { user } = UserAuth();

  const [room, setRoom] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copiedCode, setCopiedCode] = useState(false);

  const [polls, setPolls] = useState([]);
  const [userPolls, setUserPolls] = useState([]);
  const [linkPollOpen, setLinkPollOpen] = useState(false);
  const [selectedPollId, setSelectedPollId] = useState('');
  const [linkLoading, setLinkLoading] = useState(false);

  const [showInviteDialog, setShowInviteDialog] = useState(false);
  const [inviteLink, setInviteLink] = useState('');
  const [inviteLoading, setInviteLoading] = useState(false);

  const [questions, setQuestions] = useState([]);
  const [questionInput, setQuestionInput] = useState('');
  const [askLoading, setAskLoading] = useState(false);
  const [qnaSort, setQnaSort] = useState('top');

  const isHost = room?.host_id === user?.id;

  useEffect(() => {
    if (!socket?.connected || !roomCode) return;

    socket.emit('room:join', { code: roomCode }, (response) => {
      if (response.error) {
        toast.error(response.error);
        navigate('/rooms');
        return;
      }
      setRoom(response.room);
      setParticipants(response.participants || []);
      setLoading(false);
    });

    socket.emit('room:get', { code: roomCode }, (response) => {
      if (!response.error && response.room) {
        socket.emit('room:get-polls', { roomId: response.room.id }, (res) => {
          if (!res.error) setPolls(res.polls || []);
        });
        socket.emit('qna:get', { roomId: response.room.id, code: roomCode }, (res) => {
          if (!res.error) setQuestions(res.questions || []);
        });
      }
    });

    socket.on('room:participants-updated', ({ participants }) => {
      setParticipants(participants);
    });

    socket.on('room:polls-updated', ({ polls }) => {
      setPolls(polls);
    });

    socket.on('room:ended', () => {
      setRoom((prev) => (prev ? { ...prev, is_active: false } : prev));
      toast.info('The host has ended this session');
    });

    socket.on('qna:new-question', ({ question }) => {
      setQuestions((prev) => [question, ...prev]);
    });

    socket.on('qna:vote-updated', ({ questionId, action, userId }) => {
      setQuestions((prev) =>
        prev.map((q) => {
          if (q.id !== questionId) return q;
          const newVoteCount = action === 'added' ? q.vote_count + 1 : q.vote_count - 1;
          const newHasVoted = userId === user?.id ? action === 'added' : q.has_voted;
          return { ...q, vote_count: newVoteCount, has_voted: newHasVoted };
        }),
      );
    });

    socket.on('qna:question-answered', ({ questionId }) => {
      setQuestions((prev) =>
        prev.map((q) => (q.id === questionId ? { ...q, is_answered: true } : q)),
      );
    });

    socket.on('disconnect', (reason) => {
      if (reason === 'io server disconnect') {
        socket.connect();
      }
      toast.error('Connection lost. Reconnecting...');
    });

    const handleReconnect = () => {
      toast.success('Reconnected!');
      socket.emit('room:join', { code: roomCode }, () => {});
    };

    socket.io.on('reconnect', handleReconnect);

    return () => {
      socket.off('room:participants-updated');
      socket.off('room:polls-updated');
      socket.off('room:ended');
      socket.off('qna:new-question');
      socket.off('qna:vote-updated');
      socket.off('qna:question-answered');
      socket.off('disconnect');
      socket.io.off('reconnect', handleReconnect);
      if (room) {
        socket.emit('room:leave', { roomId: room.id, code: roomCode });
      }
    };
  }, [socket?.connected, roomCode]);

  useEffect(() => {
    const fetchUserPolls = async () => {
      if (!user || !isHost) return;
      const { data } = await supabase
        .from('polls')
        .select('id, question, created_at')
        .eq('created_by', user.id)
        .is('room_id', null)
        .order('created_at', { ascending: false });
      setUserPolls(data || []);
    };

    if (room) fetchUserPolls();
  }, [user, isHost, room]);

  const sortedQuestions = useMemo(() => {
    return [...questions].sort((a, b) => {
      if (qnaSort === 'top') return b.vote_count - a.vote_count;
      if (qnaSort === 'new') return new Date(b.created_at) - new Date(a.created_at);
      if (qnaSort === 'answered') return (b.is_answered ? 1 : 0) - (a.is_answered ? 1 : 0);
      return 0;
    });
  }, [questions, qnaSort]);

  const displayedQuestions = useMemo(() => {
    if (qnaSort === 'answered') {
      return sortedQuestions.filter((q) => q.is_answered);
    }
    return sortedQuestions.filter((q) => !q.is_answered);
  }, [qnaSort, sortedQuestions]);

  const answeredCount = useMemo(
    () => questions.filter((q) => q.is_answered).length,
    [questions],
  );

  const copyCode = () => {
    navigator.clipboard.writeText(roomCode);
    setCopiedCode(true);
    toast.success('Room code copied!');
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleGenerateLink = () => {
    if (!socket?.connected || !room) return;
    setInviteLoading(true);
    setShowInviteDialog(true);
    socket.emit('room:generate-link', { roomId: room.id, code: roomCode }, (response) => {
      setInviteLoading(false);
      if (response.error) {
        toast.error(response.error);
        setShowInviteDialog(false);
        return;
      }
      setInviteLink(`${window.location.origin}/rooms/join/${response.token}`);
    });
  };

  const copyInviteLink = () => {
    navigator.clipboard.writeText(inviteLink);
    toast.success('One-time link copied!');
  };

  const handleEndSession = () => {
    if (!socket?.connected || !room) return;
    socket.emit('room:end', { roomId: room.id, code: roomCode }, (response) => {
      if (response.error) toast.error(response.error);
    });
  };

  const handleLinkPoll = () => {
    if (!selectedPollId || !socket?.connected || !room) return;
    setLinkLoading(true);
    socket.emit('room:link-poll', { roomId: room.id, pollId: selectedPollId, code: roomCode }, (response) => {
      setLinkLoading(false);
      if (response.error) {
        toast.error(response.error);
        return;
      }
      setLinkPollOpen(false);
      setSelectedPollId('');
      toast.success('Poll linked!');
      setUserPolls((prev) => prev.filter((poll) => poll.id !== selectedPollId));
    });
  };

  const handleAskQuestion = () => {
    if (!questionInput.trim() || !socket?.connected || !room) return;
    setAskLoading(true);
    socket.emit('qna:ask', { roomId: room.id, content: questionInput.trim(), code: roomCode }, (response) => {
      setAskLoading(false);
      if (response.error) {
        toast.error(response.error);
        return;
      }
      setQuestionInput('');
    });
  };

  const handleUpvote = (questionId) => {
    if (!socket?.connected) return;

    setQuestions((prev) =>
      prev.map((q) => {
        if (q.id !== questionId) return q;
        const isUpvoting = !q.has_voted;
        return {
          ...q,
          has_voted: isUpvoting,
          vote_count: q.vote_count + (isUpvoting ? 1 : -1),
        };
      }),
    );

    socket.emit('qna:upvote', { questionId, code: roomCode }, (response) => {
      if (response?.error) {
        setQuestions((prev) =>
          prev.map((q) => {
            if (q.id !== questionId) return q;
            const isUpvoting = !q.has_voted;
            return {
              ...q,
              has_voted: isUpvoting,
              vote_count: q.vote_count + (isUpvoting ? 1 : -1),
            };
          }),
        );
        toast.error(response.error);
      }
    });
  };

  const handleMarkAnswered = (questionId) => {
    if (!socket?.connected || !room) return;
    socket.emit('qna:mark-answered', { questionId, roomId: room.id, code: roomCode });
  };

  if (loading) {
    return (
      <PageShell
        width="max-w-7xl"
        badge={<><Users className="h-4 w-4" /><span>Live Session</span></>}
        title="Opening room"
        description="Loading polls, participants, and live Q&A."
      >
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
          <Skeleton className="h-[620px] rounded-[28px] bg-white/8" />
          <Skeleton className="h-[620px] rounded-[28px] bg-white/8" />
        </div>
      </PageShell>
    );
  }

  if (!room) return null;

  const ParticipantsList = () => (
    <ScrollArea className="h-[calc(100vh-360px)]">
      <div className="space-y-2 pr-2">
        {participants.map((participant) => (
          <div
            key={participant.user_id}
            className="flex items-center gap-3 rounded-xl border border-white/8 bg-white/[0.03] px-3 py-2.5"
          >
            <Avatar className="h-9 w-9">
              <AvatarImage src={participant.avatar_url} />
              <AvatarFallback className="bg-orange-500/10 text-orange-200 text-xs font-semibold">
                {participant.username?.[0]?.toUpperCase() || '?'}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-white">
                {participant.username || 'Anonymous'}
              </p>
            </div>
            {participant.user_id === room.host_id ? (
              <Crown className="h-4 w-4 shrink-0 text-amber-300" />
            ) : null}
          </div>
        ))}
      </div>
    </ScrollArea>
  );

  return (
    <PageShell
      width="max-w-7xl"
      badge={<><MessageCircle className="h-4 w-4" /><span>{isHost ? 'Host Session' : 'Room Session'}</span></>}
      title={room.name || 'Live poll room'}
      description={room.is_active
        ? 'Run polls, surface questions, and guide the room in real time from one focused session surface.'
        : 'This room has ended. You can still review the linked polls and discussion.'}
      actions={
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={copyCode}
            className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold tracking-[0.2em] text-white transition hover:bg-white/10"
          >
            {copiedCode ? <CheckCheck className="h-4 w-4 text-emerald-300" /> : <Copy className="h-4 w-4" />}
            {roomCode}
          </button>
          {isHost && room.is_active ? (
            <button
              type="button"
              onClick={handleGenerateLink}
              className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 px-5 py-3 text-sm font-semibold text-white hover:from-orange-400 hover:to-amber-400"
            >
              <Link2 className="h-4 w-4" />
              Invite
            </button>
          ) : null}
        </div>
      }
    >
      <GlassSection className="p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="mb-2 text-xs uppercase tracking-[0.24em] text-slate-500">
              {isHost ? 'Moderator controls active' : 'Participant view'}
            </p>
            <div className="flex items-center gap-2 text-sm text-slate-300">
              <span className="relative flex h-2 w-2">
                <span className={`absolute inline-flex h-full w-full rounded-full opacity-75 ${room.is_active ? 'animate-ping bg-emerald-400' : 'bg-slate-500'}`} />
                <span className={`relative inline-flex h-2 w-2 rounded-full ${room.is_active ? 'bg-emerald-500' : 'bg-slate-500'}`} />
              </span>
              {room.is_active ? 'Active session' : 'Session ended'}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="lg:hidden h-10 w-10 border-white/20 text-white bg-white/5 hover:bg-white/10"
                >
                  <Users className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent className="border-l-white/10 bg-[#0f1729] text-white">
                <SheetHeader>
                  <SheetTitle className="flex items-center gap-2 text-white">
                    <Users className="h-5 w-5 text-orange-300" />
                    Participants ({participants.length})
                  </SheetTitle>
                </SheetHeader>
                <div className="mt-4">
                  <ParticipantsList />
                </div>
              </SheetContent>
            </Sheet>

            {isHost && room.is_active ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-10 w-10 border-white/20 text-white bg-white/5 hover:bg-white/10"
                  >
                    <MoreVertical className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-48 border-white/10 bg-[#0f1729] text-white">
                  <DropdownMenuItem
                    className="cursor-pointer text-gray-300 focus:bg-orange-500/15 focus:text-white"
                    onClick={() => navigate('/create-poll', { state: { roomId: room.id, roomCode, from: `/rooms/${roomCode}` } })}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Create New Poll
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="cursor-pointer text-gray-300 focus:bg-orange-500/15 focus:text-white"
                    onClick={() => setLinkPollOpen(true)}
                  >
                    <Link2 className="mr-2 h-4 w-4" />
                    Link Existing Poll
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="cursor-pointer text-gray-300 focus:bg-orange-500/15 focus:text-white"
                    onClick={handleGenerateLink}
                  >
                    <Link2 className="mr-2 h-4 w-4" />
                    One-Time Join Link
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-white/10" />
                  <DropdownMenuItem
                    className="cursor-pointer text-red-400 focus:bg-red-500/15 focus:text-red-300"
                    onClick={handleEndSession}
                  >
                    <Power className="mr-2 h-4 w-4" />
                    End Session
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : null}
          </div>
        </div>
      </GlassSection>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <Tabs defaultValue="qna" className="w-full">
          <TabsList className="h-12 w-full gap-1 border border-white/10 bg-[rgba(12,19,36,0.74)] p-1.5 backdrop-blur-sm">
            <TabsTrigger
              value="polls"
              className="flex-1 h-9 rounded-lg text-gray-400 font-medium transition-all data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-amber-500 data-[state=active]:text-white"
            >
              <Users className="mr-2 h-4 w-4" />
              Polls ({polls.length})
            </TabsTrigger>
            <TabsTrigger
              value="qna"
              className="flex-1 h-9 rounded-lg text-gray-400 font-medium transition-all data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-amber-500 data-[state=active]:text-white"
            >
              <MessageCircle className="mr-2 h-4 w-4" />
              Q&A ({questions.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="polls" className="mt-5">
            <Card className={surfaceClass}>
              <CardContent className="space-y-4 pt-6 pb-4">
                {isHost && room.is_active ? (
                  <Dialog open={linkPollOpen} onOpenChange={setLinkPollOpen}>
                    <DialogTrigger asChild>
                      <Button className="h-12 w-full border border-orange-400/20 border-dashed bg-orange-500/8 text-orange-200 hover:bg-orange-500/15">
                        <Link2 className="mr-2 h-4 w-4" />
                        Link Existing Poll to Room
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="border-white/10 bg-[#0f1729] text-white">
                      <DialogHeader>
                        <DialogTitle className="text-white">Link an Existing Poll</DialogTitle>
                        <DialogDescription className="text-gray-400">
                          Select a poll you&apos;ve created to run in this room.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="py-4">
                        {userPolls.length === 0 ? (
                          <div className="rounded-lg border border-white/10 border-dashed py-6 text-center text-sm text-gray-400">
                            No unlinked polls available.
                            <br />
                            <Button
                              variant="link"
                              className="mt-2 text-orange-300"
                              onClick={() => navigate('/create-poll', { state: { roomId: room.id, roomCode, from: `/rooms/${roomCode}` } })}
                            >
                              Create a new one
                            </Button>
                          </div>
                        ) : (
                          <Select value={selectedPollId} onValueChange={setSelectedPollId}>
                            <SelectTrigger className="w-full border-white/10 bg-white/5 text-white">
                              <SelectValue placeholder="Select a poll..." />
                            </SelectTrigger>
                            <SelectContent className="max-h-60 border-white/10 bg-[#0f1729] text-white">
                              <ScrollArea className="h-full">
                                {userPolls.map((poll) => (
                                  <SelectItem
                                    key={poll.id}
                                    value={poll.id}
                                    className="cursor-pointer py-2.5 text-gray-200 focus:bg-orange-500/15 focus:text-white"
                                  >
                                    <div className="flex flex-col gap-1">
                                      <span className="max-w-[250px] truncate font-medium">{poll.question}</span>
                                      <span className="text-[10px] text-gray-500">
                                        {new Date(poll.created_at).toLocaleDateString()}
                                      </span>
                                    </div>
                                  </SelectItem>
                                ))}
                              </ScrollArea>
                            </SelectContent>
                          </Select>
                        )}
                      </div>
                      <DialogFooter>
                        <DialogClose asChild>
                          <Button variant="ghost" className="text-gray-400 hover:bg-white/10 hover:text-white">
                            Cancel
                          </Button>
                        </DialogClose>
                        <Button
                          onClick={handleLinkPoll}
                          disabled={!selectedPollId || linkLoading}
                          className="bg-gradient-to-r from-orange-500 to-amber-500 text-white hover:from-orange-400 hover:to-amber-400"
                        >
                          {linkLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                          Link Poll
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                ) : null}

                {polls.length === 0 ? (
                  <Card className="border-white/10 border-dashed bg-white/[0.03]">
                    <CardContent className="flex flex-col items-center justify-center py-16">
                      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-500/10">
                        <Users className="h-8 w-8 text-orange-300/70" />
                      </div>
                      <p className="text-sm text-gray-400">No active polls in this room.</p>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid gap-4">
                    {polls.map((poll) => (
                      <Card
                        key={poll.id}
                        className="group cursor-pointer border-white/10 bg-white/[0.03] transition hover:border-orange-400/20 hover:bg-white/[0.05]"
                        onClick={() => navigate(`/polls/${poll.id}`)}
                      >
                        <CardContent className="flex items-center justify-between p-4">
                          <div className="pr-4">
                            <h3 className="line-clamp-2 font-medium text-white transition-colors group-hover:text-orange-200">
                              {poll.question}
                            </h3>
                            <p className="mt-1.5 flex items-center gap-1.5 text-xs text-gray-500">
                              <MessageCircle className="h-3 w-3" />
                              {poll.options?.[0]?.votes_count !== undefined ? 'Live Results' : 'Waiting for votes'}
                            </p>
                          </div>
                          <Button
                            variant="secondary"
                            size="sm"
                            className="hidden shrink-0 bg-white/5 text-gray-300 opacity-0 transition-colors group-hover:bg-orange-500 group-hover:text-white group-hover:opacity-100 sm:inline-flex"
                          >
                            View
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="qna" className="mt-5">
            <Card className={surfaceClass}>
              <CardContent className="space-y-4 pt-6 pb-4">
                <div className="relative flex gap-2">
                  <Input
                    placeholder={user ? 'Ask a question...' : 'Sign in to ask...'}
                    value={questionInput}
                    onChange={(event) => setQuestionInput(event.target.value)}
                    onKeyDown={(event) => event.key === 'Enter' && handleAskQuestion()}
                    maxLength={500}
                    disabled={!user}
                    className="border-white/10 bg-white/5 pr-12 text-white placeholder:text-gray-500 focus:border-orange-400/50"
                  />
                  <Button
                    className="absolute right-1 top-1 bottom-1 h-auto bg-gradient-to-r from-orange-500 to-amber-500 text-white hover:from-orange-400 hover:to-amber-400"
                    size="sm"
                    onClick={handleAskQuestion}
                    disabled={!questionInput.trim() || !user || askLoading}
                  >
                    {askLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                  </Button>
                </div>

                {questions.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {['top', 'new', 'answered'].map((sortType) => (
                      <Button
                        key={sortType}
                        variant="ghost"
                        size="sm"
                        onClick={() => setQnaSort(sortType)}
                        className={`h-7 rounded-full border px-3 text-xs transition-all ${
                          qnaSort === sortType
                            ? 'border-orange-400/20 bg-orange-500/10 text-orange-200'
                            : 'border-transparent text-gray-400 hover:bg-white/5 hover:text-white'
                        }`}
                      >
                        {sortType.charAt(0).toUpperCase() + sortType.slice(1)}
                      </Button>
                    ))}
                    <Badge className="border-white/10 bg-white/5 text-slate-300">
                      {answeredCount} answered
                    </Badge>
                  </div>
                ) : null}

                <ScrollArea className="h-[440px] pr-4">
                  {displayedQuestions.length === 0 ? (
                    <div className="py-16 text-center">
                      <MessageCircle className="mx-auto mb-3 h-12 w-12 text-orange-500/20" />
                      <p className="text-sm text-gray-400">
                        {questions.length === 0 ? 'No questions asked yet.' : 'No questions in this view.'}
                      </p>
                      <p className="mt-1 text-xs text-gray-500">
                        {questions.length === 0 ? 'Be the first to ask a question.' : 'Change the filter to see more activity.'}
                      </p>
                    </div>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2 }}
                      className="space-y-3 pb-4"
                    >
                      {displayedQuestions.map((question) => (
                        <div
                          key={question.id}
                          className={`flex gap-4 rounded-xl border p-4 transition-all ${
                            question.is_answered
                              ? 'border-emerald-500/20 bg-emerald-500/[0.06] opacity-75'
                              : 'border-white/10 bg-white/[0.03] hover:border-orange-400/20'
                          }`}
                        >
                          <div className="min-w-[2.5rem]">
                            <button
                              className={`flex flex-col items-center justify-center rounded-lg p-1.5 transition-all ${
                                question.has_voted
                                  ? 'bg-orange-500/10 text-orange-300'
                                  : 'text-gray-500 hover:bg-white/5 hover:text-orange-300'
                              }`}
                              onClick={() => handleUpvote(question.id)}
                            >
                              <ThumbsUp className={`h-4 w-4 ${question.has_voted ? 'fill-current' : ''}`} />
                              <span className="mt-1 text-xs font-semibold">{question.vote_count}</span>
                            </button>
                          </div>

                          <div className="min-w-0 flex-1">
                            <div className="flex items-start justify-between gap-2">
                              <p className="break-words text-sm leading-relaxed text-gray-200 md:text-base">
                                {question.content}
                              </p>

                              {isHost && !question.is_answered ? (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-7 w-7 shrink-0 p-0 text-gray-500 hover:bg-emerald-400/10 hover:text-emerald-300"
                                  onClick={() => handleMarkAnswered(question.id)}
                                  title="Mark as answered"
                                >
                                  <CheckCircle2 className="h-4 w-4" />
                                </Button>
                              ) : null}
                            </div>

                            <div className="mt-2 flex flex-wrap items-center gap-2">
                              <span className="text-xs text-gray-400">{question.author}</span>
                              <span className="text-[10px] text-gray-600">•</span>
                              <span className="text-xs text-gray-500">
                                {new Date(question.created_at).toLocaleDateString()}
                              </span>
                              {question.is_answered ? (
                                <Badge className="ml-auto border-emerald-400/20 bg-emerald-500/10 px-2 py-0 text-[10px] text-emerald-200">
                                  Answered
                                </Badge>
                              ) : null}
                            </div>
                          </div>
                        </div>
                      ))}
                    </motion.div>
                  )}
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="hidden lg:block">
          <Card className={`${surfaceClass} sticky top-28`}>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-sm font-semibold text-white">
                <Users className="h-4 w-4 text-orange-300" />
                Participants ({participants.length})
              </CardTitle>
              <CardDescription className="text-slate-400">
                Everyone currently in the session.
              </CardDescription>
            </CardHeader>
            <Separator className="bg-white/10" />
            <CardContent className="pt-3">
              <ParticipantsList />
            </CardContent>
          </Card>
        </div>
      </div>

      <Dialog open={showInviteDialog} onOpenChange={setShowInviteDialog}>
        <DialogContent className="border-white/10 bg-[#0f1729] text-white">
          <DialogHeader>
            <DialogTitle className="text-white">One-Time Join Link</DialogTitle>
            <DialogDescription className="text-gray-400">
              Share this link with one person. It will expire after use or in 24 hours.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            {inviteLoading ? (
              <div className="flex justify-center py-4">
                <Loader2 className="h-6 w-6 animate-spin text-orange-300" />
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Input
                  readOnly
                  value={inviteLink}
                  className="border-white/10 bg-white/5 font-mono text-sm text-gray-300"
                />
                <Button
                  size="icon"
                  onClick={copyInviteLink}
                  className="shrink-0 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400"
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </PageShell>
  );
}

export default RoomPage;
