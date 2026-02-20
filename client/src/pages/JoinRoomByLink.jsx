import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSocketContext } from '../context/SocketContext';
import { toast } from 'sonner';
import { Loader2, AlertCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const JoinRoomByLink = () => {
    const { token } = useParams();
    const navigate = useNavigate();
    const { socket } = useSocketContext();
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!socket?.connected || !token) return;

        // Small delay to ensure socket is ready and UI doesn't flash too fast
        const timer = setTimeout(() => {
            socket.emit('room:join-link', { token }, (response) => {
                if (response.error) {
                    setError(response.error);
                    setIsLoading(false);
                } else {
                    toast.success('Joined room successfully!');
                    navigate(`/rooms/${response.code}`);
                }
            });
        }, 500);

        return () => clearTimeout(timer);
    }, [socket?.connected, token, navigate]);

    return (
        <div className="min-h-screen pt-20 flex items-center justify-center p-4">
            <Card className="bg-[#10172A]/80 backdrop-blur border border-gray-700 max-w-md w-full">
                <CardContent className="pt-8 text-center">
                    {isLoading ? (
                        <div className="flex flex-col items-center">
                            <Loader2 className="h-12 w-12 text-blue-500 animate-spin mb-4" />
                            <h2 className="text-xl font-semibold text-white">Joining Room...</h2>
                            <p className="text-gray-400 mt-2">Verifying your secure link</p>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center">
                            <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mb-4">
                                <AlertCircle className="h-8 w-8 text-red-500" />
                            </div>
                            <h2 className="text-xl font-semibold text-white mb-2">Join Failed</h2>
                            <p className="text-gray-400 mb-6">{error || 'Invalid or expired link'}</p>
                            <Button
                                onClick={() => navigate('/rooms')}
                                className="bg-blue-600 hover:bg-blue-700 text-white w-full"
                            >
                                Return to Rooms
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default JoinRoomByLink;
