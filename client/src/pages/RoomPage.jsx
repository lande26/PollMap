import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSocketContext } from '../context/SocketContext';
import { UserAuth } from '../context/AuthContext';
import { supabase } from '../supabaseClient';
import {
    Card, CardContent, CardHeader, CardTitle, CardDescription
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
    Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger
} from '@/components/ui/sheet';
import {
    Dialog, DialogContent, DialogDescription, DialogFooter,
    DialogHeader, DialogTitle, DialogClose, DialogTrigger
} from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
    DropdownMenu, DropdownMenuContent, DropdownMenuItem,
    DropdownMenuTrigger, DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import {
    Tooltip as UITooltip, TooltipContent, TooltipProvider, TooltipTrigger
} from '@/components/ui/tooltip';
import {
    Copy, CheckCheck, Users, Crown, BarChart3, MessageCircle,
    MoreVertical, LogOut, Power, Link2, ArrowLeft, Loader2,
    ThumbsUp, Check, Send, Plus, CheckCircle2
} from 'lucide-react';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

const RoomPage = () => {
    const { roomCode } = useParams();
    const navigate = useNavigate();
    const { socket } = useSocketContext();
    const { user } = UserAuth();

    // Room state
    const [room, setRoom] = useState(null);
    const [participants, setParticipants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [copiedCode, setCopiedCode] = useState(false);

    // Polls state
    const [polls, setPolls] = useState([]);
    const [userPolls, setUserPolls] = useState([]);
    const [linkPollOpen, setLinkPollOpen] = useState(false);
    const [selectedPollId, setSelectedPollId] = useState('');
    const [linkLoading, setLinkLoading] = useState(false);

    // Invite Link state
    const [showInviteDialog, setShowInviteDialog] = useState(false);
    const [inviteLink, setInviteLink] = useState('');
    const [inviteLoading, setInviteLoading] = useState(false);

    // Q&A state
    const [questions, setQuestions] = useState([]);
    const [questionInput, setQuestionInput] = useState('');
    const [askLoading, setAskLoading] = useState(false);
    const [qnaSort, setQnaSort] = useState('top');

    const isHost = room?.host_id === user?.id;

    // ── Join room & load data ──
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

        // Real-time listeners
        socket.on('room:participants-updated', ({ participants }) => {
            setParticipants(participants);
        });

        socket.on('room:polls-updated', ({ polls }) => {
            setPolls(polls);
        });

        socket.on('room:ended', () => {
            setRoom(prev => prev ? { ...prev, is_active: false } : prev);
            toast.info('The host has ended this session');
        });

        socket.on('qna:new-question', ({ question }) => {
            setQuestions(prev => [question, ...prev]);
        });

        socket.on('qna:vote-updated', ({ questionId, action, userId }) => {
            setQuestions(prev => prev.map(q => {
                if (q.id !== questionId) return q;
                const newVoteCount = action === 'added' ? q.vote_count + 1 : q.vote_count - 1;
                const newHasVoted = userId === user?.id ? action === 'added' : q.has_voted;
                return { ...q, vote_count: newVoteCount, has_voted: newHasVoted };
            }));
        });

        socket.on('qna:question-answered', ({ questionId }) => {
            setQuestions(prev => prev.map(q =>
                q.id === questionId ? { ...q, is_answered: true } : q
            ));
        });

        socket.on('disconnect', (reason) => {
            if (reason === "io server disconnect") {
                socket.connect();
            }
            toast.error('Connection lost. Reconnecting...');
        });

        const handleReconnect = () => {
            toast.success('Reconnected!');
            // Re-join to ensure the user is still in the room context on the server
            socket.emit('room:join', { code: roomCode }, () => { });
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

    // Fetch user's unlinked polls for linking
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

    // ── Actions ──
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
            const link = `${window.location.origin}/rooms/join/${response.token}`;
            setInviteLink(link);
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
            setUserPolls(prev => prev.filter(p => p.id !== selectedPollId));
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

        // Optimistically update UI
        setQuestions(prev => prev.map(q => {
            if (q.id === questionId) {
                const isUpvoting = !q.has_voted;
                return {
                    ...q,
                    has_voted: isUpvoting,
                    vote_count: q.vote_count + (isUpvoting ? 1 : -1)
                };
            }
            return q;
        }));

        socket.emit('qna:upvote', { questionId, code: roomCode }, (response) => {
            if (response && response.error) {
                // Revert optimistic update
                setQuestions(prev => prev.map(q => {
                    if (q.id === questionId) {
                        const isUpvoting = !q.has_voted; // current inverted state
                        return {
                            ...q,
                            has_voted: isUpvoting,
                            vote_count: q.vote_count + (isUpvoting ? 1 : -1)
                        };
                    }
                    return q;
                }));
                toast.error(response.error);
            }
        });
    };

    const handleMarkAnswered = (questionId) => {
        if (!socket?.connected || !room) return;
        socket.emit('qna:mark-answered', { questionId, roomId: room.id, code: roomCode });
    };

    // ── Sort questions ──
    const sortedQuestions = [...questions].sort((a, b) => {
        if (qnaSort === 'top') return b.vote_count - a.vote_count;
        if (qnaSort === 'new') return new Date(b.created_at) - new Date(a.created_at);
        if (qnaSort === 'answered') return (b.is_answered ? 1 : 0) - (a.is_answered ? 1 : 0);
        return 0;
    });

    const unansweredQuestions = sortedQuestions.filter(q => !q.is_answered);
    const answeredQuestions = sortedQuestions.filter(q => q.is_answered);

    // ── Loading state ──
    if (loading) {
        return (
            <div className="min-h-screen pt-28 pb-8 px-4">
                <div className="mx-auto max-w-7xl space-y-6">
                    <Skeleton className="h-24 w-full bg-white/10 rounded-xl" />
                    <div className="grid lg:grid-cols-[1fr_320px] gap-6">
                        <Skeleton className="h-[500px] bg-white/10 rounded-xl" />
                        <Skeleton className="h-[500px] bg-white/10 rounded-xl" />
                    </div>
                </div>
            </div>
        );
    }

    if (!room) return null;

    // ── Participant Sidebar ──
    const ParticipantsList = () => (
        <ScrollArea className="h-[calc(100vh-320px)]">
            <div className="space-y-1 pr-2">
                {participants.map((p) => (
                    <div
                        key={p.user_id}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/5 transition"
                    >
                        <Avatar className="h-8 w-8">
                            <AvatarImage src={p.avatar_url} />
                            <AvatarFallback className="bg-indigo-500/20 text-indigo-300 text-xs font-semibold">
                                {p.username?.[0]?.toUpperCase() || '?'}
                            </AvatarFallback>
                        </Avatar>
                        <span className="text-sm text-white truncate flex-1">{p.username || 'Anonymous'}</span>
                        {p.user_id === room.host_id && (
                            <Crown className="h-4 w-4 text-amber-400 flex-shrink-0" />
                        )}
                    </div>
                ))}
            </div>
        </ScrollArea>
    );

    return (
        <div className="min-h-screen pt-28 pb-8 px-4 md:px-6 lg:px-8">
            <div className="mx-auto max-w-7xl space-y-6">

                {/* ──── Room Header ──── */}
                <Card className="bg-[#0f1729]/70 backdrop-blur-xl border-indigo-500/20 shadow-lg shadow-indigo-500/5">
                    <CardContent className="py-5 px-6">
                        <div className="flex items-center justify-between flex-wrap gap-4">
                            {/* Left side: Room details */}
                            <div>
                                <h1 className="text-2xl font-bold text-white mb-1">
                                    {room.name || 'Live Poll Room'}
                                </h1>
                                <p className="text-sm text-indigo-300 flex items-center gap-2">
                                    <span className="relative flex h-2 w-2">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                                    </span>
                                    Active Session
                                </p>
                            </div>

                            {/* Right side: actions */}
                            <div className="flex items-center gap-3">
                                {/* Room Code CTA */}
                                <Button
                                    variant="outline"
                                    onClick={copyCode}
                                    className="border-indigo-400/40 text-indigo-200 bg-indigo-500/10 hover:bg-indigo-500/20 hover:text-white font-mono tracking-widest text-sm h-10 px-4"
                                >
                                    {copiedCode ? <CheckCheck className="h-4 w-4 mr-2 text-emerald-400" /> : <Copy className="h-4 w-4 mr-2" />}
                                    {roomCode}
                                </Button>

                                {/* Mobile participants */}
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
                                    <SheetContent className="bg-[#0f1729] border-l-indigo-500/20 text-white">
                                        <SheetHeader>
                                            <SheetTitle className="text-white flex items-center gap-2">
                                                <Users className="h-5 w-5 text-indigo-400" />
                                                Participants ({participants.length})
                                            </SheetTitle>
                                        </SheetHeader>
                                        <div className="mt-4">
                                            <ParticipantsList />
                                        </div>
                                    </SheetContent>
                                </Sheet>

                                {/* Host controls dropdown */}
                                {isHost && room.is_active && (
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                className="h-10 w-10 border-white/20 text-white bg-white/5 hover:bg-white/10 hover:text-white"
                                            >
                                                <MoreVertical className="h-5 w-5" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent className="bg-[#0f1729] border-indigo-500/30 text-white w-48">
                                            <DropdownMenuItem
                                                className="text-gray-300 focus:bg-indigo-500/15 focus:text-white cursor-pointer"
                                                onClick={() => navigate('/create-poll', { state: { roomId: room.id, roomCode } })}
                                            >
                                                <Plus className="mr-2 h-4 w-4" />
                                                Create New Poll
                                            </DropdownMenuItem>
                                            <DropdownMenuItem
                                                className="text-gray-300 focus:bg-indigo-500/15 focus:text-white cursor-pointer"
                                                onClick={() => setLinkPollOpen(true)}
                                            >
                                                <Link2 className="mr-2 h-4 w-4" />
                                                Link Existing Poll
                                            </DropdownMenuItem>
                                            <DropdownMenuItem
                                                className="text-gray-300 focus:bg-indigo-500/15 focus:text-white cursor-pointer"
                                                onClick={handleGenerateLink}
                                            >
                                                <Link2 className="mr-2 h-4 w-4" />
                                                One-Time Join Link
                                            </DropdownMenuItem>
                                            <DropdownMenuSeparator className="bg-white/10" />
                                            <DropdownMenuItem
                                                className="text-red-400 focus:bg-red-500/15 focus:text-red-300 cursor-pointer"
                                                onClick={handleEndSession}
                                            >
                                                <Power className="mr-2 h-4 w-4" />
                                                End Session
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* ──── Main Content ──── */}
                <div className="grid lg:grid-cols-[1fr_320px] gap-6">

                    {/* ── Tabs (Polls + Q&A) ── */}
                    <Tabs defaultValue="qna" className="w-full">
                        <TabsList className="w-full bg-[#0f1729]/70 backdrop-blur-sm border border-indigo-400/20 p-1.5 h-12 gap-1">
                            <TabsTrigger
                                value="polls"
                                className="flex-1 h-9 rounded-lg data-[state=active]:bg-indigo-600 data-[state=active]:text-white data-[state=active]:shadow-md text-gray-400 hover:text-gray-200 transition-all font-medium"
                            >
                                <BarChart3 className="h-4 w-4 mr-2" />
                                Polls ({polls.length})
                            </TabsTrigger>
                            <TabsTrigger
                                value="qna"
                                className="flex-1 h-9 rounded-lg data-[state=active]:bg-indigo-600 data-[state=active]:text-white data-[state=active]:shadow-md text-gray-400 hover:text-gray-200 transition-all font-medium"
                            >
                                <MessageCircle className="h-4 w-4 mr-2" />
                                Q&A ({questions.length})
                            </TabsTrigger>
                        </TabsList>

                        {/* ── Polls Tab ── */}
                        <TabsContent value="polls" className="mt-5">
                            <Card className="bg-[#0f1729]/50 border-white/10">
                                <CardContent className="pt-6 pb-4">
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        transition={{ duration: 0.2 }}
                                        className="space-y-4"
                                    >
                                        {/* Link Poll Action (Host) */}
                                        {isHost && room.is_active && (
                                            <Dialog open={linkPollOpen} onOpenChange={setLinkPollOpen}>
                                                <DialogTrigger asChild>
                                                    <Button className="w-full bg-indigo-600/10 text-indigo-400 hover:bg-indigo-600/20 border border-indigo-500/20 border-dashed h-12">
                                                        <Link2 className="h-4 w-4 mr-2" />
                                                        Link Existing Poll to Room
                                                    </Button>
                                                </DialogTrigger>
                                                <DialogContent className="bg-[#0f1729] border-indigo-500/30 text-white">
                                                    <DialogHeader>
                                                        <DialogTitle className="text-white">Link an Existing Poll</DialogTitle>
                                                        <DialogDescription className="text-gray-400">
                                                            Select a poll you've created to run in this room.
                                                        </DialogDescription>
                                                    </DialogHeader>
                                                    <div className="py-4">
                                                        {userPolls.length === 0 ? (
                                                            <div className="text-center py-6 text-gray-400 text-sm border border-white/10 rounded-lg border-dashed">
                                                                No unlinked polls available.<br />
                                                                <Button variant="link" className="text-indigo-400 mt-2" onClick={() => navigate('/create-poll', { state: { roomId: room.id, roomCode } })}>
                                                                    Create a new one
                                                                </Button>
                                                            </div>
                                                        ) : (
                                                            <Select value={selectedPollId} onValueChange={setSelectedPollId}>
                                                                <SelectTrigger className="w-full bg-white/5 border-indigo-500/30 text-white">
                                                                    <SelectValue placeholder="Select a poll..." />
                                                                </SelectTrigger>
                                                                <SelectContent className="bg-[#0f1729] border-indigo-500/30 text-white max-h-60">
                                                                    <ScrollArea className="h-full">
                                                                        {userPolls.map(up => (
                                                                            <SelectItem key={up.id} value={up.id} className="text-gray-200 focus:bg-indigo-500/20 focus:text-white cursor-pointer py-2.5">
                                                                                <div className="flex flex-col gap-1">
                                                                                    <span className="font-medium truncate max-w-[250px]">{up.question}</span>
                                                                                    <span className="text-[10px] text-gray-500">{new Date(up.created_at).toLocaleDateString()}</span>
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
                                                            <Button variant="ghost" className="text-gray-400 hover:text-white hover:bg-white/10">Cancel</Button>
                                                        </DialogClose>
                                                        <Button
                                                            onClick={handleLinkPoll}
                                                            disabled={!selectedPollId || linkLoading}
                                                            className="bg-indigo-600 hover:bg-indigo-700 text-white"
                                                        >
                                                            {linkLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                                            Link Poll
                                                        </Button>
                                                    </DialogFooter>
                                                </DialogContent>
                                            </Dialog>
                                        )}

                                        {polls.length === 0 ? (
                                            <Card className="bg-[#0f1729]/30 border-white/10 border-dashed">
                                                <CardContent className="flex flex-col items-center justify-center py-16">
                                                    <div className="w-16 h-16 rounded-2xl bg-indigo-500/15 flex items-center justify-center mb-4">
                                                        <BarChart3 className="w-8 h-8 text-indigo-400/60" />
                                                    </div>
                                                    <p className="text-gray-400 text-sm">No active polls in this room.</p>
                                                </CardContent>
                                            </Card>
                                        ) : (
                                            <div className="grid grid-cols-1 gap-4">
                                                {polls.map((poll) => (
                                                    <Card key={poll.id} className="bg-[#0f1729]/40 border-white/10 hover:bg-[#0f1729]/60 transition cursor-pointer group" onClick={() => navigate(`/polls/${poll.id}`)}>
                                                        <CardContent className="p-4 flex items-center justify-between">
                                                            <div className="pr-4">
                                                                <h3 className="text-white font-medium line-clamp-2 group-hover:text-indigo-300 transition-colors">
                                                                    {poll.question}
                                                                </h3>
                                                                <p className="text-xs text-gray-500 mt-1.5 flex items-center gap-1.5">
                                                                    <BarChart3 className="h-3 w-3" />
                                                                    {poll.options?.[0]?.votes_count !== undefined ? 'Live Results' : 'Waiting for votes'}
                                                                </p>
                                                            </div>
                                                            <Button variant="secondary" size="sm" className="bg-white/5 hover:bg-indigo-600 hover:text-white text-gray-300 transition-colors opacity-0 group-hover:opacity-100 shrink-0 hidden sm:inline-flex">
                                                                View
                                                            </Button>
                                                        </CardContent>
                                                    </Card>
                                                ))}
                                            </div>
                                        )}
                                    </motion.div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* ── Q&A Tab ── */}
                        <TabsContent value="qna" className="mt-5">
                            <Card className="bg-[#0f1729]/50 border-white/10">
                                <CardContent className="pt-6 pb-4">
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        transition={{ duration: 0.2 }}
                                        className="space-y-4"
                                    >
                                        {/* Q&A Input */}
                                        <div className="flex gap-2 relative">
                                            <Input
                                                placeholder={user ? "Ask a question..." : "Sign in to ask..."}
                                                value={questionInput}
                                                onChange={(e) => setQuestionInput(e.target.value)}
                                                onKeyDown={(e) => e.key === 'Enter' && handleAskQuestion()}
                                                maxLength={500}
                                                disabled={!user}
                                                className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 pr-12 focus:border-indigo-500"
                                            />
                                            <Button
                                                className="absolute right-1 top-1 bottom-1 h-auto bg-indigo-600 hover:bg-indigo-700 text-white"
                                                size="sm"
                                                onClick={handleAskQuestion}
                                                disabled={!questionInput.trim() || !user}
                                            >
                                                <Send className="h-4 w-4" />
                                            </Button>
                                        </div>

                                        {/* Sort Filters */}
                                        {questions.length > 0 && (
                                            <div className="flex gap-2">
                                                {['top', 'new', 'answered'].map((sortType) => (
                                                    <Button
                                                        key={sortType}
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => setQnaSort(sortType)}
                                                        className={`text-xs h-7 px-3 rounded-full transition-all border ${qnaSort === sortType
                                                            ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30'
                                                            : 'text-gray-400 hover:text-white border-transparent hover:bg-white/5'
                                                            }`}
                                                    >
                                                        {sortType.charAt(0).toUpperCase() + sortType.slice(1)}
                                                    </Button>
                                                ))}
                                            </div>
                                        )}

                                        {/* Questions List */}
                                        <ScrollArea className="h-[400px] pr-4">
                                            {questions.length === 0 ? (
                                                <div className="text-center py-16">
                                                    <MessageCircle className="h-12 w-12 text-indigo-500/20 mx-auto mb-3" />
                                                    <p className="text-gray-400 text-sm">No questions asked yet.</p>
                                                    <p className="text-gray-500 text-xs mt-1">Be the first to ask a question!</p>
                                                </div>
                                            ) : (
                                                <div className="space-y-3 pb-4">
                                                    {questions.map((q) => (
                                                        <div key={q.id} className={`bg-white/5 border rounded-xl p-4 flex gap-4 transition-all ${q.is_answered ? 'opacity-60 border-green-500/20 bg-green-500/5' : 'border-white/5 hover:border-white/10'}`}>
                                                            {/* Upvote Button */}
                                                            <div className="flex flex-col items-center gap-1 min-w-[2.5rem]">
                                                                <button
                                                                    className={`p-1.5 rounded-lg transition-all flex flex-col items-center justify-center ${q.has_voted ? 'text-indigo-400 bg-indigo-500/10' : 'text-gray-500 hover:text-indigo-400 hover:bg-white/5'}`}
                                                                    onClick={() => handleUpvote(q.id, q.has_voted)}
                                                                >
                                                                    <ThumbsUp className={`h-4 w-4 ${q.has_voted ? 'fill-current' : ''}`} />
                                                                    <span className="text-xs font-semibold mt-1">{q.vote_count}</span>
                                                                </button>
                                                            </div>
                                                            {/* Question Content */}
                                                            <div className="flex-1 min-w-0">
                                                                <div className="flex items-start justify-between gap-2">
                                                                    <p className="text-gray-200 text-sm md:text-base leading-relaxed break-words">{q.content}</p>

                                                                    {isHost && !q.is_answered && (
                                                                        <Button
                                                                            variant="ghost"
                                                                            size="sm"
                                                                            className="h-7 w-7 p-0 shrink-0 text-gray-500 hover:text-green-400 hover:bg-green-400/10"
                                                                            onClick={() => handleMarkAnswered(q.id)}
                                                                            title="Mark as answered"
                                                                        >
                                                                            <CheckCircle2 className="h-4 w-4" />
                                                                        </Button>
                                                                    )}
                                                                </div>
                                                                <div className="flex items-center gap-2 mt-2 flex-wrap">
                                                                    <span className="text-xs text-gray-400">{q.author}</span>
                                                                    <span className="text-[10px] text-gray-600">•</span>
                                                                    <span className="text-xs text-gray-500">{new Date(q.created_at).toLocaleDateString()}</span>

                                                                    {q.is_answered && (
                                                                        <Badge className="ml-auto bg-green-500/20 text-green-300 border-green-500/30 text-[10px] px-2 py-0">
                                                                            Answered
                                                                        </Badge>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </ScrollArea>
                                    </motion.div>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>

                    {/* ──── Participants Sidebar (desktop) ──── */}
                    <div className="hidden lg:block">
                        <Card className="bg-[#0f1729]/50 border-white/10 sticky top-28">
                            <CardHeader className="pb-3">
                                <CardTitle className="text-white text-sm font-semibold flex items-center gap-2">
                                    <Users className="h-4 w-4 text-indigo-400" />
                                    Participants ({participants.length})
                                </CardTitle>
                            </CardHeader>
                            <Separator className="bg-white/10" />
                            <CardContent className="pt-3">
                                <ParticipantsList />
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* ──── Invite Link Dialog ──── */}
                <Dialog open={showInviteDialog} onOpenChange={setShowInviteDialog}>
                    <DialogContent className="bg-[#0f1729] border-indigo-500/30 text-white">
                        <DialogHeader>
                            <DialogTitle className="text-white">One-Time Join Link</DialogTitle>
                            <DialogDescription className="text-gray-400">
                                Share this link with one person. It will expire after use or in 24 hours.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="py-4">
                            {inviteLoading ? (
                                <div className="flex justify-center py-4">
                                    <Loader2 className="h-6 w-6 animate-spin text-indigo-500" />
                                </div>
                            ) : (
                                <div className="flex items-center gap-2">
                                    <Input
                                        readOnly
                                        value={inviteLink}
                                        className="bg-white/5 border-indigo-400/20 text-gray-300 font-mono text-sm"
                                    />
                                    <Button size="icon" onClick={copyInviteLink} className="shrink-0 bg-indigo-600 hover:bg-indigo-700">
                                        <Copy className="h-4 w-4" />
                                    </Button>
                                </div>
                            )}
                        </div>
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    );
};

export default RoomPage;
