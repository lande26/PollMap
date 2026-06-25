import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSocketContext } from '../context/SocketContext';
import { UserAuth } from '../context/AuthContext';
import { supabase } from '../supabaseClient';
import {
    Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import {
    Dialog, DialogContent, DialogDescription, DialogFooter,
    DialogHeader, DialogTitle, DialogTrigger, DialogClose,
} from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
    Tooltip as UITooltip, TooltipContent, TooltipProvider, TooltipTrigger
} from '@/components/ui/tooltip';
import {
    DoorOpen, Plus, Users, ArrowRight, Copy, CheckCheck, Sparkles,
    LogIn, Crown, Clock, Zap
} from 'lucide-react';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import PageShell, { GlassSection } from '../components/ui/PageShell.jsx';

const RoomsPage = () => {
    const navigate = useNavigate();
    const { socket } = useSocketContext();
    const { user } = UserAuth();

    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [joinCode, setJoinCode] = useState('');
    const [joinLoading, setJoinLoading] = useState(false);
    const [createName, setCreateName] = useState('');
    const [createLoading, setCreateLoading] = useState(false);
    const [createOpen, setCreateOpen] = useState(false);
    const [copiedCode, setCopiedCode] = useState(null);

    // Fetch user's rooms
    useEffect(() => {
        const fetchRooms = async () => {
            if (!user) return;
            setLoading(true);

            // Rooms user hosts
            const { data: hosted } = await supabase
                .from('rooms')
                .select('*, room_participants(count)')
                .eq('host_id', user.id)
                .order('created_at', { ascending: false });

            // Rooms user participates in (not host)
            const { data: participated } = await supabase
                .from('room_participants')
                .select('room_id, rooms(*, room_participants(count))')
                .eq('user_id', user.id);

            const participatedRooms = (participated || [])
                .map(p => p.rooms)
                .filter(r => r && r.host_id !== user.id);

            const allRooms = [...(hosted || []), ...participatedRooms];

            // Deduplicate and sort
            const unique = allRooms.reduce((acc, room) => {
                if (!acc.find(r => r.id === room.id)) acc.push(room);
                return acc;
            }, []);

            unique.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
            setRooms(unique);
            setLoading(false);
        };

        fetchRooms();
    }, [user]);

    const handleCreate = () => {
        if (!createName.trim()) {
            toast.error('Please enter a room name');
            return;
        }
        if (!socket?.connected) {
            toast.error('Socket not connected');
            return;
        }

        setCreateLoading(true);
        socket.emit('room:create', { name: createName.trim() }, (response) => {
            setCreateLoading(false);
            if (response.error) {
                toast.error(response.error);
                return;
            }
            toast.success('Room created!');
            setCreateOpen(false);
            setCreateName('');
            navigate(`/rooms/${response.room.code}`);
        });
    };

    const handleJoin = () => {
        const code = joinCode.trim().toUpperCase();
        if (!code || code.length !== 6) {
            toast.error('Enter a valid 6-character room code');
            return;
        }
        if (!socket?.connected) {
            toast.error('Socket not connected');
            return;
        }

        setJoinLoading(true);
        socket.emit('room:join', { code }, (response) => {
            setJoinLoading(false);
            if (response.error) {
                toast.error(response.error);
                return;
            }
            navigate(`/rooms/${code}`);
        });
    };

    const copyCode = (code) => {
        navigator.clipboard.writeText(code);
        setCopiedCode(code);
        toast.success('Code copied!');
        setTimeout(() => setCopiedCode(null), 2000);
    };

    const formatDate = (dateStr) => {
        const d = new Date(dateStr);
        return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    };

    return (
        <PageShell
            width="max-w-5xl"
            badge={<><Zap className="h-4 w-4 text-orange-200" /><span>Live Sessions</span></>}
            title="Rooms"
            description="Create or join moderated live rooms for polls and Q&A without leaving the shared PollMap shell."
        >

                {/* Create + Join Section */}
                <div className="mb-10 grid gap-5 md:grid-cols-2">
                    {/* Create Room Card */}
                    <GlassSection className="p-1">
                    <Card className="border-orange-400/15 bg-[#0f1729]/60 shadow-none backdrop-blur-xl">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-lg font-bold text-white flex items-center gap-2">
                                <div className="w-8 h-8 rounded-lg bg-orange-500/18 flex items-center justify-center">
                                    <Plus className="w-4 h-4 text-orange-200" />
                                </div>
                                Create a Room
                            </CardTitle>
                            <CardDescription className="text-gray-400 text-sm">
                                Start a new live session and share the code
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Dialog open={createOpen} onOpenChange={setCreateOpen}>
                                <DialogTrigger asChild>
                                    <Button className="h-11 w-full bg-gradient-to-r from-orange-500 to-amber-400 text-slate-950 shadow-lg shadow-orange-500/20 hover:from-orange-400 hover:to-amber-300">
                                        <Sparkles className="mr-2 h-4 w-4" />
                                        Create New Room
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="border-orange-400/15 bg-[#0f1729] text-white">
                                    <DialogHeader>
                                        <DialogTitle className="text-white">Create a Room</DialogTitle>
                                        <DialogDescription className="text-gray-400">
                                            Give your room a name. You'll get a shareable code.
                                        </DialogDescription>
                                    </DialogHeader>
                                    <div className="space-y-4 py-2">
                                        <div className="space-y-2">
                                            <Label htmlFor="room-name" className="text-white text-sm">Room Name</Label>
                                            <Input
                                                id="room-name"
                                                placeholder="e.g. CS101 Lecture"
                                                value={createName}
                                                onChange={(e) => setCreateName(e.target.value)}
                                                onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
                                                className="border-orange-400/15 bg-[#0a0f1c]/40 text-white placeholder:text-gray-500 focus:border-orange-400/40 focus:ring-orange-400/15"
                                            />
                                        </div>
                                    </div>
                                    <DialogFooter>
                                        <DialogClose asChild>
                                            <Button variant="outline" className="border-gray-600/40 text-gray-300 hover:bg-gray-700/30">
                                                Cancel
                                            </Button>
                                        </DialogClose>
                                        <Button
                                            onClick={handleCreate}
                                            disabled={createLoading || !createName.trim()}
                                            className="bg-gradient-to-r from-orange-500 to-amber-400 text-slate-950 hover:from-orange-400 hover:to-amber-300"
                                        >
                                            {createLoading ? 'Creating...' : 'Create Room'}
                                        </Button>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                        </CardContent>
                    </Card>
                    </GlassSection>

                    {/* Join Room Card */}
                    <GlassSection className="p-1">
                    <Card className="border-sky-400/15 bg-[#0f1729]/60 shadow-none backdrop-blur-xl">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-lg font-bold text-white flex items-center gap-2">
                                <div className="w-8 h-8 rounded-lg bg-sky-500/16 flex items-center justify-center">
                                    <LogIn className="w-4 h-4 text-sky-200" />
                                </div>
                                Join a Room
                            </CardTitle>
                            <CardDescription className="text-gray-400 text-sm">
                                Enter a 6-character code to join an active session
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex gap-2">
                                <Input
                                    placeholder="Enter code (e.g. ABC123)"
                                    value={joinCode}
                                    onChange={(e) => setJoinCode(e.target.value.toUpperCase().slice(0, 6))}
                                    onKeyDown={(e) => e.key === 'Enter' && handleJoin()}
                                    maxLength={6}
                                    className="h-11 border-sky-400/15 bg-[#0a0f1c]/40 text-center font-mono text-lg uppercase tracking-widest text-white placeholder:text-gray-500 focus:border-sky-400/40 focus:ring-sky-400/15"
                                />
                                <Button
                                    onClick={handleJoin}
                                    disabled={joinLoading || joinCode.length !== 6}
                                    className="h-11 bg-white/8 px-6 text-white hover:bg-white/12"
                                >
                                    {joinLoading ? '...' : <ArrowRight className="h-5 w-5" />}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                    </GlassSection>
                </div>

                <Separator className="mb-8 bg-white/10" />

                {/* Your Rooms */}
                <div>
                    <h2 className="mb-5 flex items-center gap-2 font-display text-2xl font-semibold text-white">
                        <DoorOpen className="h-5 w-5 text-orange-200" />
                        Your Rooms
                    </h2>

                    {loading ? (
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {[1, 2, 3].map(i => (
                                <Card key={i} className="bg-[#0f1729]/40 border-white/10">
                                    <CardContent className="pt-6 space-y-3">
                                        <Skeleton className="h-5 w-3/4 bg-white/10" />
                                        <Skeleton className="h-4 w-1/2 bg-white/10" />
                                        <Skeleton className="h-8 w-full bg-white/10" />
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    ) : rooms.length === 0 ? (
                        <GlassSection className="border-dashed">
                            <CardContent className="flex flex-col items-center justify-center py-12">
                                <div className="w-16 h-16 rounded-2xl bg-orange-500/12 flex items-center justify-center mb-4">
                                    <DoorOpen className="w-8 h-8 text-orange-200/70" />
                                </div>
                                <p className="text-gray-400 text-sm mb-4">No rooms yet. Create one to get started!</p>
                                <Button
                                    variant="outline"
                                    className="border-orange-400/25 text-orange-200 hover:bg-orange-500/10"
                                    onClick={() => setCreateOpen(true)}
                                >
                                    <Plus className="mr-2 h-4 w-4" />
                                    Create your first room
                                </Button>
                            </CardContent>
                        </GlassSection>
                    ) : (
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            <AnimatePresence>
                                {rooms.map((room, index) => (
                                    <motion.div
                                        key={room.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                    >
                                        <Card
                                            className={`bg-[#0f1729]/50 backdrop-blur-sm border-white/10 hover:border-orange-400/25 transition-all cursor-pointer group ${!room.is_active ? 'opacity-60' : ''
                                                }`}
                                            onClick={() => navigate(`/rooms/${room.code}`)}
                                        >
                                            <CardHeader className="pb-2">
                                                <div className="flex items-center justify-between">
                                                    <CardTitle className="font-display text-lg font-semibold text-white transition-colors group-hover:text-orange-200">
                                                        {room.name}
                                                    </CardTitle>
                                                    <Badge
                                                        variant={room.is_active ? 'default' : 'secondary'}
                                                        className={room.is_active
                                                            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30 text-xs'
                                                            : 'bg-gray-500/20 text-gray-400 border-gray-500/30 text-xs'
                                                        }
                                                    >
                                                        {room.is_active ? '● Live' : 'Ended'}
                                                    </Badge>
                                                </div>
                                            </CardHeader>
                                            <CardContent className="space-y-3 pt-0">
                                                <div className="flex items-center justify-between text-sm">
                                                    <TooltipProvider>
                                                        <UITooltip>
                                                            <TooltipTrigger asChild>
                                                                <button
                                                                    onClick={(e) => { e.stopPropagation(); copyCode(room.code); }}
                                                                    className="flex items-center gap-1.5 rounded-lg bg-white/5 px-2 py-1 font-mono text-xs text-gray-400 transition hover:text-orange-200"
                                                                >
                                                                    {copiedCode === room.code ? <CheckCheck className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                                                                    {room.code}
                                                                </button>
                                                            </TooltipTrigger>
                                                            <TooltipContent>Copy room code</TooltipContent>
                                                        </UITooltip>
                                                    </TooltipProvider>

                                                    <div className="flex items-center gap-1 text-gray-500 text-xs">
                                                        <Users className="h-3 w-3" />
                                                        {room.room_participants?.[0]?.count || 0}
                                                    </div>
                                                </div>

                                                <div className="flex items-center justify-between">
                                                    {room.host_id === user?.id && (
                                                        <Badge variant="outline" className="border-amber-400/30 text-amber-300 text-xs">
                                                            <Crown className="h-3 w-3 mr-1" />
                                                            Host
                                                        </Badge>
                                                    )}
                                                    <span className="ml-auto flex items-center gap-1 text-xs text-gray-500">
                                                        <Clock className="h-3 w-3" />
                                                        {formatDate(room.created_at)}
                                                    </span>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    )}
                </div>
        </PageShell>
    );
};

export default RoomsPage;
