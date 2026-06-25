import React, { useState, useEffect, useCallback } from 'react';
import { useSocketContext } from '../context/SocketContext';
import { UserAuth } from '../context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
    MessageCircle, ThumbsUp, Send, CheckCircle2,
    ChevronDown, ChevronUp
} from 'lucide-react';
import { toast } from 'sonner';

const QnAPanel = ({ roomId, roomCode, isHost = false }) => {
    const [questions, setQuestions] = useState([]);
    const [newQuestion, setNewQuestion] = useState('');
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [expanded, setExpanded] = useState(true);
    const [sortBy, setSortBy] = useState('votes');

    const socketContext = useSocketContext();
    const socket = socketContext?.socket;
    const { user } = UserAuth();

    useEffect(() => {
        if (!socket || !roomId || !roomCode) {
            setLoading(false);
            return;
        }

        let isMounted = true;

        socket.emit('qna:get', { roomId, code: roomCode }, (response = {}) => {
            if (!isMounted) return;

            if (response.error) {
                toast.error(response.error);
                setLoading(false);
                return;
            }

            setQuestions(response.questions || []);
            setLoading(false);
        });

        const handleNewQuestion = ({ question }) => {
            setQuestions(prev => [question, ...prev]);
        };

        const handleVoteUpdated = ({ questionId, action, userId: voterId }) => {
            setQuestions(prev => prev.map(q => {
                if (q.id !== questionId) return q;
                const newVoteCount = action === 'added' ? q.vote_count + 1 : q.vote_count - 1;
                const newHasVoted = voterId === user?.id ? action === 'added' : q.has_voted;
                return { ...q, vote_count: newVoteCount, has_voted: newHasVoted };
            }));
        };

        const handleAnswered = ({ questionId }) => {
            setQuestions(prev => prev.map(q =>
                q.id === questionId ? { ...q, is_answered: true } : q
            ));
        };

        return () => {
            isMounted = false;
            socket.off('qna:new-question', handleNewQuestion);
            socket.off('qna:vote-updated', handleVoteUpdated);
            socket.off('qna:question-answered', handleAnswered);
        };
    }, [socket, roomId, roomCode, user?.id]);

    const handleSubmit = useCallback((e) => {
        e.preventDefault();
        if (!newQuestion.trim() || !socket || !roomId || !roomCode || submitting) return;

        if (!user) {
            toast.error('Please sign in to ask a question');
            return;
        }

        setSubmitting(true);
        socket.emit(
            'qna:ask',
            { roomId, code: roomCode, content: newQuestion.trim() },
            (response = {}) => {
                setSubmitting(false);

                if (response.error) {
                    toast.error(response.error);
                    return;
                }

                setNewQuestion('');
            }
        );
    }, [newQuestion, socket, roomId, roomCode, user, submitting]);

    const handleUpvote = useCallback((questionId) => {
        if (!user) {
            toast.error('Please sign in to upvote');
            return;
        }
        if (!socket || !roomCode) return;

        socket.emit('qna:upvote', { questionId, code: roomCode }, (response = {}) => {
            if (response.error) {
                toast.error(response.error);
            }
        });
    }, [socket, roomCode, user]);

    const handleMarkAnswered = useCallback((questionId) => {
        if (!socket || !roomId || !roomCode) return;

        socket.emit('qna:mark-answered', { questionId, roomId, code: roomCode }, (response = {}) => {
            if (response.error) {
                toast.error(response.error);
            }
        });
    }, [socket, roomId, roomCode]);

    const sortedQuestions = [...questions].sort((a, b) => {
        if (sortBy === 'votes') return b.vote_count - a.vote_count;
        return new Date(b.created_at) - new Date(a.created_at);
    });

    const answeredCount = questions.filter(q => q.is_answered).length;
    const unansweredQuestions = sortedQuestions.filter(q => !q.is_answered);
    const answeredQuestions = sortedQuestions.filter(q => q.is_answered);

    return (
        <Card className="bg-[#10172A]/80 backdrop-blur border border-gray-700 mt-6">
            <CardHeader
                className="cursor-pointer select-none"
                onClick={() => setExpanded(!expanded)}
            >
                <div className="flex items-center justify-between">
                    <CardTitle className="text-xl font-bold text-white flex items-center gap-3">
                        <div className="w-10 h-10 bg-purple-500/20 rounded-xl flex items-center justify-center">
                            <MessageCircle className="h-5 w-5 text-purple-400" />
                        </div>
                        Q&A
                        {questions.length > 0 && (
                            <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30 text-sm">
                                {questions.length}
                            </Badge>
                        )}
                    </CardTitle>
                    <div className="flex items-center gap-3">
                        {answeredCount > 0 && (
                            <Badge className="bg-green-500/20 text-green-300 border-green-500/30 text-xs">
                                {answeredCount} answered
                            </Badge>
                        )}
                        {expanded ? (
                            <ChevronUp className="h-5 w-5 text-gray-400" />
                        ) : (
                            <ChevronDown className="h-5 w-5 text-gray-400" />
                        )}
                    </div>
                </div>
            </CardHeader>

            {expanded && (
                <CardContent className="space-y-4">
                    {/* Ask Question Form */}
                    <form onSubmit={handleSubmit} className="flex gap-2">
                        <Input
                            value={newQuestion}
                            onChange={(e) => setNewQuestion(e.target.value)}
                            placeholder={user ? "Ask a question..." : "Sign in to ask a question"}
                            disabled={!user || submitting}
                            maxLength={500}
                            className="bg-[#0D1425] border-gray-700 text-white placeholder:text-gray-500 focus:border-purple-500"
                        />
                        <Button
                            type="submit"
                            disabled={!user || !newQuestion.trim() || submitting}
                            className="bg-purple-600 hover:bg-purple-700 text-white px-4"
                        >
                            <Send className="h-4 w-4" />
                        </Button>
                    </form>

                    {/* Sort Controls */}
                    {questions.length > 1 && (
                        <div className="flex gap-2">
                            <button
                                onClick={() => setSortBy('votes')}
                                className={`text-xs px-3 py-1.5 rounded-full transition-all ${sortBy === 'votes'
                                    ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                                    : 'text-gray-400 hover:text-gray-300 border border-transparent'
                                    }`}
                            >
                                Most Voted
                            </button>
                            <button
                                onClick={() => setSortBy('newest')}
                                className={`text-xs px-3 py-1.5 rounded-full transition-all ${sortBy === 'newest'
                                    ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                                    : 'text-gray-400 hover:text-gray-300 border border-transparent'
                                    }`}
                            >
                                Newest
                            </button>
                        </div>
                    )}

                    {/* Loading */}
                    {loading && (
                        <div className="text-center py-8 text-gray-400">
                            <div className="animate-spin w-6 h-6 border-2 border-purple-400 border-t-transparent rounded-full mx-auto mb-2" />
                            Loading questions...
                        </div>
                    )}

                    {/* Empty State */}
                    {!loading && questions.length === 0 && (
                        <div className="text-center py-8">
                            <MessageCircle className="h-10 w-10 text-gray-600 mx-auto mb-3" />
                            <p className="text-gray-400 text-sm">No questions yet. Be the first to ask!</p>
                        </div>
                    )}

                    {/* Unanswered Questions */}
                    {unansweredQuestions.length > 0 && (
                        <div className="space-y-3">
                            {unansweredQuestions.map(q => (
                                <QuestionItem
                                    key={q.id}
                                    question={q}
                                    isHost={isHost}
                                    onUpvote={handleUpvote}
                                    onMarkAnswered={handleMarkAnswered}
                                />
                            ))}
                        </div>
                    )}

                    {/* Answered Questions */}
                    {answeredQuestions.length > 0 && (
                        <div className="space-y-3">
                            <p className="text-xs text-gray-500 uppercase tracking-wider font-medium pt-2">
                                Answered
                            </p>
                            {answeredQuestions.map(q => (
                                <QuestionItem
                                    key={q.id}
                                    question={q}
                                    isHost={isHost}
                                    onUpvote={handleUpvote}
                                    onMarkAnswered={handleMarkAnswered}
                                />
                            ))}
                        </div>
                    )}
                </CardContent>
            )}
        </Card>
    );
};

// ─── Individual Question Component ─────────────────
const QuestionItem = ({ question, isHost, onUpvote, onMarkAnswered }) => {
    const timeAgo = getTimeAgo(question.created_at);

    return (
        <div className={`flex gap-3 p-3 rounded-xl border transition-all ${question.is_answered
            ? 'bg-green-500/5 border-green-500/20 opacity-75'
            : 'bg-[#0D1425]/50 border-gray-700 hover:border-gray-600'
            }`}>
            {/* Upvote Button */}
            <button
                onClick={() => onUpvote(question.id)}
                className={`flex flex-col items-center gap-0.5 min-w-[44px] py-1 rounded-lg transition-all ${question.has_voted
                    ? 'text-purple-400 bg-purple-500/10'
                    : 'text-gray-500 hover:text-purple-400 hover:bg-purple-500/5'
                    }`}
            >
                <ThumbsUp className={`h-4 w-4 ${question.has_voted ? 'fill-current' : ''}`} />
                <span className="text-xs font-semibold">{question.vote_count}</span>
            </button>

            {/* Question Content */}
            <div className="flex-1 min-w-0">
                <p className="text-white text-sm leading-relaxed break-words">
                    {question.content}
                </p>
                <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                    <span className="text-xs text-gray-500">
                        {question.author} · {timeAgo}
                    </span>
                    {question.is_answered && (
                        <Badge className="bg-green-500/20 text-green-300 border-green-500/30 text-[10px] px-1.5 py-0">
                            <CheckCircle2 className="h-3 w-3 mr-0.5" />
                            Answered
                        </Badge>
                    )}
                </div>
            </div>

            {/* Mark Answered (host only) */}
            {isHost && !question.is_answered && (
                <button
                    onClick={() => onMarkAnswered(question.id)}
                    className="text-gray-500 hover:text-green-400 transition-colors self-start p-1"
                    title="Mark as answered"
                >
                    <CheckCircle2 className="h-4 w-4" />
                </button>
            )}
        </div>
    );
};

// ─── Time Ago Utility ──────────────────────────────
function getTimeAgo(dateString) {
    const now = new Date();
    const date = new Date(dateString);
    const seconds = Math.floor((now - date) / 1000);

    if (seconds < 60) return 'just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
}

export default QnAPanel;
