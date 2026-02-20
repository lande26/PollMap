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
        <div className="min-h-screen relative py-8 px-4">
            <div className="absolute inset-0 bg-gradient-to-b via-transparent pointer-events-none" />

            <div className="relative z-10 container mx-auto max-w-5xl">
                {/* Header */}
                <div className="text-center mb-10">
                    <div className="inline-flex items-center gap-2 mb-3 px-4 py-2 rounded-full bg-indigo-500/15 border border-indigo-400/30 backdrop-blur-md">
                        <Zap className="w-4 h-4 text-indigo-300" />
                        <span className="text-sm text-indigo-200 font-medium">Live Sessions</span>
                    </div>
                    <h1 className="text-4xl font-bold text-white mb-2" style={{ fontFamily: 'Lato, sans-serif' }}>
                        Rooms
                    </h1>
                    <p className="text-gray-400 text-base max-w-lg mx-auto">
                        Create or join live rooms to run polls and Q&A sessions in real-time.
                    </p>
                </div>

                {/* Create + Join Section */}
                <div className="grid md:grid-cols-2 gap-6 mb-10">
                    {/* Create Room Card */}
                    <Card className="bg-[#0f1729]/60 backdrop-blur-xl border-indigo-500/20 shadow-2xl shadow-indigo-900/20">
                        <CardHeader className="pb-4">
                            <CardTitle className="text-lg font-bold text-white flex items-center gap-2">
                                <div className="w-8 h-8 rounded-lg bg-indigo-500/25 flex items-center justify-center">
                                    <Plus className="w-4 h-4 text-indigo-300" />
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
                                    <Button className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg shadow-indigo-500/30 h-11">
                                        <Sparkles className="mr-2 h-4 w-4" />
                                        Create New Room
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="bg-[#0f1729] border-indigo-500/30 text-white">
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
                                                className="bg-[#0a0f1c]/40 border-indigo-400/20 text-white placeholder:text-gray-500 focus:border-indigo-400/50"
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
                                            className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white"
                                        >
                                            {createLoading ? 'Creating...' : 'Create Room'}
                                        </Button>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                        </CardContent>
                    </Card>

                    {/* Join Room Card */}
                    <Card className="bg-[#0f1729]/60 backdrop-blur-xl border-emerald-500/20 shadow-2xl shadow-emerald-900/20">
                        <CardHeader className="pb-4">
                            <CardTitle className="text-lg font-bold text-white flex items-center gap-2">
                                <div className="w-8 h-8 rounded-lg bg-emerald-500/25 flex items-center justify-center">
                                    <LogIn className="w-4 h-4 text-emerald-300" />
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
                                    className="bg-[#0a0f1c]/40 border-emerald-400/20 text-white placeholder:text-gray-500 focus:border-emerald-400/50 font-mono text-lg tracking-widest text-center uppercase h-11"
                                />
                                <Button
                                    onClick={handleJoin}
                                    disabled={joinLoading || joinCode.length !== 6}
                                    className="bg-emerald-600 hover:bg-emerald-700 text-white h-11 px-6"
                                >
                                    {joinLoading ? '...' : <ArrowRight className="h-5 w-5" />}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <Separator className="bg-white/10 mb-8" />

                {/* Your Rooms */}
                <div>
                    <h2 className="text-xl font-semibold text-white mb-5 flex items-center gap-2">
                        <DoorOpen className="h-5 w-5 text-indigo-400" />
                        Your Rooms
                    </h2>

                    {loading ? (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
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
                        <Card className="bg-[#0f1729]/30 border-white/10 border-dashed">
                            <CardContent className="flex flex-col items-center justify-center py-12">
                                <div className="w-16 h-16 rounded-2xl bg-indigo-500/15 flex items-center justify-center mb-4">
                                    <DoorOpen className="w-8 h-8 text-indigo-400/60" />
                                </div>
                                <p className="text-gray-400 text-sm mb-4">No rooms yet. Create one to get started!</p>
                                <Button
                                    variant="outline"
                                    className="border-indigo-400/30 text-indigo-300 hover:bg-indigo-500/15"
                                    onClick={() => setCreateOpen(true)}
                                >
                                    <Plus className="mr-2 h-4 w-4" />
                                    Create your first room
                                </Button>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                            <AnimatePresence>
                                {rooms.map((room, index) => (
                                    <motion.div
                                        key={room.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                    >
                                        <Card
                                            className={`bg-[#0f1729]/50 backdrop-blur-sm border-white/10 hover:border-indigo-400/30 transition-all cursor-pointer group ${!room.is_active ? 'opacity-60' : ''
                                                }`}
                                            onClick={() => navigate(`/rooms/${room.code}`)}
                                        >
                                            <CardHeader className="pb-3">
                                                <div className="flex items-center justify-between">
                                                    <CardTitle className="text-white text-base font-semibold group-hover:text-indigo-300 transition-colors">
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
                                            <CardContent className="pt-0 space-y-3">
                                                <div className="flex items-center justify-between text-sm">
                                                    <TooltipProvider>
                                                        <UITooltip>
                                                            <TooltipTrigger asChild>
                                                                <button
                                                                    onClick={(e) => { e.stopPropagation(); copyCode(room.code); }}
                                                                    className="flex items-center gap-1.5 text-gray-400 hover:text-indigo-300 transition font-mono text-xs bg-white/5 px-2 py-1 rounded"
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
                                                    <span className="text-gray-500 text-xs flex items-center gap-1 ml-auto">
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
            </div>
        </div>
    );
};

export default RoomsPage;
