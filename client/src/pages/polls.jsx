// // import React, { useState, useEffect, useContext } from 'react';
// // import { useNavigate } from 'react-router-dom';
// // import { useSocketContext } from '../context/SocketContext';
// // import { UserAuth } from '../context/AuthContext';
// // import { supabase } from '../supabaseClient';
// // import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
// // import PasswordProtectedPoll from '../components/ProtectedRoute/PasswordProtectedPoll.jsx'

// // const Polls = ({ pollId }) => {
// //   const [polls, setPolls] = useState([]);
// //   const [poll, setPoll] = useState(null);
// //   const [selectedOption, setSelectedOption] = useState(null);
// //   const [hasVoted, setHasVoted] = useState(false);
// //   const [loading, setLoading] = useState(true);
// //   const [error, setError] = useState(null);
// //   const [userVote, setUserVote] = useState(null);
// //   const [isExpired, setIsExpired] = useState(false);
// //   const [isPasswordProtected, setIsPasswordProtected] = useState(false);
// //   const [isCreator, setIsCreator] = useState(false);
// //   const [isAuthenticated, setIsAuthenticated] = useState(false);
// //   const socketContext = useSocketContext() ?? {};
// //   const socket = socketContext.socket;
// //   const { user } = UserAuth();
// //   const navigate = useNavigate();
// // //testing
// //   useEffect(() => {
// //     console.log("Polls component received pollId:", pollId);
// //   }, [pollId]);
  

// //   useEffect(() => {
// //     if (!pollId) {
// //       const fetchAllPolls = async () => {
// //         try {
// //           console.log("Fetching all polls");
// //           const { data: polls, error: pollsError } = await supabase
// //             .from('polls')
// //             .select('*')
// //             .order('created_at', { ascending: false });
            
// //           if (pollsError) throw pollsError;
          
// //           const pollsWithOptions = await Promise.all(
// //             polls.map(async (poll) => {
// //               const { data: options } = await supabase
// //                 .from('options')
// //                 .select('*')
// //                 .eq('poll_id', poll.id);

// //               const totalVotes = options.reduce((sum, option) => sum + option.votes_count, 0);
              
// //               return {
// //                 ...poll,
// //                 options,
// //                 totalVotes
// //               };
// //             })
// //           );
          
// //           setPolls(pollsWithOptions);
// //           setLoading(false);
// //         } catch (err) {
// //           console.error("Error fetching polls:", err);
// //           setError(err.message);
// //           setLoading(false);
// //         }
// //       };
      
// //       fetchAllPolls();
// //     } else {
// //       if (pollId === "undefined") {
// //         console.error("Received 'undefined' as pollId string");
// //         setError("Invalid poll ID");
// //         setLoading(false);
// //         return;
// //       }
      
// //       const fetchPoll = async () => {
// //         try {
// //           console.log("Fetching poll with ID:", pollId);
// //           const { data: poll, error: pollError } = await supabase
// //             .from('polls')
// //             .select('*')
// //             .eq('id', pollId)
// //             .single();
            
// //           if (pollError) throw pollError;
// //           console.log("Poll data received:", poll);
          
// //           // Check if poll is expired
// //           if (poll.expires_at) {
// //             const expirationDate = new Date(poll.expires_at);
// //             const now = new Date();
// //             console.log("Expiration date:", expirationDate);
// //             console.log("Current date:", now);
// //             console.log("Is expired:", now > expirationDate);
// //             if (now > expirationDate) {
// //               setIsExpired(true);
// //             }
// //           }
          
// //           // Check if poll is password protected
// //           setIsPasswordProtected(poll.is_password_protected);

// //           if (user && poll.created_by === user.id) {
// //             setIsCreator(true);
// //             setIsAuthenticated(true);
// //           }

// //           const { data: options, error: optionsError } = await supabase
// //             .from('options')
// //             .select('*')
// //             .eq('poll_id', pollId);
            
// //           if (optionsError) throw optionsError;
// //           console.log("Options data received:", options);
          
// //           let userHasVoted = false;
// //           let existingVote = null;
          
// //           if (user) {
// //             const { data: votes, error: votesError } = await supabase
// //               .from('votes')
// //               .select('*')
// //               .eq('poll_id', pollId)
// //               .eq('user_id', user.id);
              
// //             if (votesError) throw votesError;
            
// //             if (votes && votes.length > 0) {
// //               userHasVoted = true;
// //               existingVote = votes[0];
// //               setSelectedOption(existingVote.option_id);
// //             }
// //           }

// //           const totalVotes = options.reduce((sum, option) => sum + option.votes_count, 0);
// //           setPoll({ ...poll, options, totalVotes });
// //           setHasVoted(userHasVoted);
// //           setUserVote(existingVote);
// //           setLoading(false);
// //         } catch (err) {
// //           console.error("Error fetching poll:", err);
// //           setError(err.message);
// //           setLoading(false);
// //         }
// //       };
      
// //       fetchPoll();
// //     }
// //   }, [pollId, user]);

// //   useEffect(() => {
// //     if (!socket || !pollId || pollId === "undefined") return;
    
// //     socket.emit("joinPoll", pollId);
// //     console.log(`Joined poll room: ${pollId}`);
    
// //     const handlePollDataUpdated = (data) => {
// //       if (data.data.id === pollId) {
// //         console.log("Poll data updated:", data.data);
// //         setPoll(data.data);
// //       }
// //     };
    
// //     socket.on("pollDataUpdated", handlePollDataUpdated);
    
// //     socket.on("pollError", (error) => {
// //       console.error("Socket error:", error);
// //       setError(error.message);
// //     });
    
// //     return () => {
// //       socket.off("pollDataUpdated", handlePollDataUpdated);
// //       socket.off("pollError");
// //     };
// //   }, [socket, pollId]);
  
// //   const handleVote = () => {
// //     if (!selectedOption) return;
    
// //     console.log("Submitting vote for option:", selectedOption);
// //     socket.emit("vote", {
// //       pollId,
// //       optionId: selectedOption,
// //       userId: user?.id || null
// //     });
    
// //     setHasVoted(true);
// //   };
  
// //   if (!pollId) {
// //     if (loading) return <div>Loading polls...</div>;
// //     if (error) return <div>Error: {error}</div>;
// //     if (polls.length === 0) return <div>No polls available</div>;
    
// //     return (
// //       <div className="all-polls-container">
// //         <h2>All Polls</h2>
// //         <div className="polls-list">
// //           {polls.map(poll => (
// //             <div key={poll.id} className="poll-card">
// //               <h3>{poll.question}</h3>
// //               <div className="poll-info">
// //                 <span>Created: {new Date(poll.created_at).toLocaleDateString()}</span>
// //                 <span>Total Votes: {poll.totalVotes}</span>
// //               </div>
// //               <div className="poll-options">
// //                 {poll.options.map(option => (
// //                   <div key={option.id} className="poll-option">
// //                     <span>{option.option_text}</span>
// //                     <span>{option.votes_count} votes</span>
// //                   </div>
// //                 ))}
// //               </div>
// //               <button 
// //                 className="vote-button"
// //                 onClick={() => navigate(`/polls/${poll.id}`)}
// //               >
// //                 Vote in this Poll
// //               </button>
// //             </div>
// //           ))}
// //         </div>
// //       </div>
// //     );
// //   }
  
// //   if (loading) return <div>Loading poll...</div>;
// //   if (error) return <div>Error: {error}</div>;
// //   if (!poll) return <div>Poll not found</div>;
  
  
// //   if (isExpired) {
// //     return (
// //       <div className="poll-container">
// //         <h2>{poll.question}</h2>
// //         <div className="bg-red-500/20 border border-red-500 text-red-200 p-4 rounded-lg">
// //           This poll has expired and is no longer accepting votes.
// //         </div>
// //         <div className="results-section">
// //           <h3>Final Results</h3>
// //           <ResponsiveContainer width="100%" height={300}>
// //             <BarChart data={poll.options}>
// //               <CartesianGrid strokeDasharray="3 3" />
// //               <XAxis dataKey="option_text" />
// //               <YAxis />
// //               <Tooltip />
// //               <Legend />
// //               <Bar dataKey="votes_count" fill="#8884d8" />
// //             </BarChart>
// //           </ResponsiveContainer>
// //         </div>
// //       </div>
// //     );
// //   }

// //   return (
// //     <div className="poll-container">
// //       <h2>{poll.question}</h2>
      
// //       {!hasVoted ? (
// //         <div className="voting-section">
// //           {poll.options.map(option => (
// //             <div key={option.id} className="option">
// //               <input
// //                 type="radio"
// //                 id={`option-${option.id}`}
// //                 name="poll-option"
// //                 value={option.id}
// //                 checked={selectedOption === option.id}
// //                 onChange={() => setSelectedOption(option.id)}
// //               />
// //               <label htmlFor={`option-${option.id}`}>{option.option_text}</label>
// //             </div>
// //           ))}
// //           <button onClick={handleVote} disabled={!selectedOption}>
// //             Submit Vote
// //           </button>
// //         </div>
// //       ) : (
// //         <div className="results-section">
// //           <h3>Live Results</h3>
// //           {userVote && (
// //             <div className="user-vote-info">
// //               You voted for: {poll.options.find(opt => opt.id === userVote.option_id)?.option_text}
// //             </div>
// //           )}
// //           <ResponsiveContainer width="100%" height={300}>
// //             <BarChart data={poll.options}>
// //               <CartesianGrid strokeDasharray="3 3" />
// //               <XAxis dataKey="option_text" />
// //               <YAxis />
// //               <Tooltip />
// //               <Legend />
// //               <Bar dataKey="votes_count" fill="#8884d8" />
// //             </BarChart>
// //           </ResponsiveContainer>
// //         </div>
// //       )}
// //     </div>
// //   );
// // };

// // export default Polls;


// // // import React, { useState, useEffect, useCallback, useMemo } from 'react';
// // // import { useNavigate } from 'react-router-dom';
// // // import { useSocketContext } from '../context/SocketContext';
// // // import { UserAuth } from '../context/AuthContext';
// // // import { supabase } from '../supabaseClient';
// // // import { 
// // //   BarChart, Bar, PieChart, Pie, Cell, LineChart, Line,
// // //   XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
// // // } from 'recharts';
// // // import { 
// // //   Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter 
// // // } from '@/components/ui/card';
// // // import { Button } from '@/components/ui/button';
// // // import { Badge } from '@/components/ui/badge';
// // // import { Progress } from '@/components/ui/progress';
// // // import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
// // // import { 
// // //   Tooltip as UITooltip, 
// // //   TooltipContent, 
// // //   TooltipProvider, 
// // //   TooltipTrigger 
// // // } from '@/components/ui/tooltip';
// // // import { Skeleton } from '@/components/ui/skeleton';
// // // import { 
// // //   Calendar, Users, TrendingUp, BarChart3, Plus, Vote, Zap, Shield, 
// // //   Clock, Trophy, Sparkles, MessageCircle, Eye, Share2, MoreHorizontal,
// // //   Copy, CheckCheck, BarChart4, PieChart as PieChartIcon, LineChart as LineChartIcon
// // // } from 'lucide-react';
// // // import { toast } from 'sonner';

// // // const trackEvent = (category, action, label, value) => {
// // //   if (window.gtag) {
// // //     window.gtag('event', action, {
// // //       event_category: category,
// // //       event_label: label,
// // //       value: value,
// // //     });
// // //   }
// // // };

// // // const trackPageView = (path) => {
// // //   if (window.gtag) {
// // //     window.gtag('config', import.meta.env.VITE_GA_MEASUREMENT_ID, {
// // //       page_path: path,
// // //     });
// // //   }
// // // };

// // // // Color palettes for charts
// // // const COLORS = ['#3B82F6', '#8B5CF6', '#EF4444', '#10B981', '#F59E0B', '#6366F1', '#EC4899', '#84CC16'];

// // // const Polls = ({ pollId }) => {
// // //   const [polls, setPolls] = useState([]);
// // //   const [poll, setPoll] = useState(null);
// // //   const [selectedOption, setSelectedOption] = useState(null);
// // //   const [hasVoted, setHasVoted] = useState(false);
// // //   const [loading, setLoading] = useState(true);
// // //   const [error, setError] = useState(null);
// // //   const [userVote, setUserVote] = useState(null);
// // //   const [isExpired, setIsExpired] = useState(false);
// // //   const [page, setPage] = useState(1);
// // //   const [hasMore, setHasMore] = useState(true);
// // //   const [copiedPollId, setCopiedPollId] = useState(null);
// // //   const [activeChart, setActiveChart] = useState('bar');
  
// // //   const POLLS_PER_PAGE = 12;
  
// // //   const socketContext = useSocketContext();
// // //   const socket = socketContext?.socket;
// // //   const { user } = UserAuth();
// // //   const navigate = useNavigate();

// // //   // Track page views
// // //   useEffect(() => {
// // //     const path = pollId ? `/polls/${pollId}` : '/polls';
// // //     trackPageView(path);
// // //   }, [pollId]);

// // //   // Fetch all polls with socket fallback
// // //   const fetchAllPolls = useCallback(async (pageNum = 1, append = false) => {
// // //     try {
// // //       setLoading(true);
      
// // //       if (socket) {
// // //         socket.emit('getPolls', { page: pageNum, limit: POLLS_PER_PAGE }, (response) => {
// // //           if (response?.error) {
// // //             throw new Error(response.error);
// // //           }
// // //           setPolls(append ? [...polls, ...response.polls] : response.polls);
// // //           setHasMore(response.hasMore);
// // //           setLoading(false);
// // //           trackEvent('Polls', 'view_all', `page_${pageNum}`);
// // //         });
// // //       } else {
// // //         // Fallback to direct Supabase
// // //         const from = (pageNum - 1) * POLLS_PER_PAGE;
// // //         const to = from + POLLS_PER_PAGE - 1;

// // //         const { data: pollsData, error: pollsError, count } = await supabase
// // //           .from('polls')
// // //           .select(`
// // //             *,
// // //             options!inner(
// // //               id,
// // //               option_text,
// // //               votes_count,
// // //               poll_id
// // //             ),
// // //             profiles(
// // //               username,
// // //               avatar_url
// // //             )
// // //           `, { count: 'exact' })
// // //           .order('created_at', { ascending: false })
// // //           .range(from, to);
          
// // //         if (pollsError) throw pollsError;

// // //         // Get participant counts
// // //         const pollIds = pollsData.map(p => p.id);
// // //         const { data: votesData } = await supabase
// // //           .from('votes')
// // //           .select('poll_id, user_id')
// // //           .in('poll_id', pollIds);

// // //         const participantsByPoll = votesData?.reduce((acc, vote) => {
// // //           if (!acc[vote.poll_id]) acc[vote.poll_id] = new Set();
// // //           acc[vote.poll_id].add(vote.user_id);
// // //           return acc;
// // //         }, {}) || {};

// // //         const processedPolls = pollsData.map(poll => {
// // //           const totalVotes = poll.options.reduce((sum, opt) => sum + opt.votes_count, 0);
// // //           const participantCount = participantsByPoll[poll.id]?.size || 0;
          
// // //           return {
// // //             ...poll,
// // //             totalVotes,
// // //             participantCount,
// // //             engagementRate: participantCount > 0 ? Math.round((totalVotes / participantCount) * 100) : 0
// // //           };
// // //         });

// // //         setPolls(append ? [...polls, ...processedPolls] : processedPolls);
// // //         setHasMore(pollsData.length === POLLS_PER_PAGE);
// // //         setLoading(false);
// // //         trackEvent('Polls', 'view_all', `page_${pageNum}`);
// // //       }
// // //     } catch (err) {
// // //       console.error("Error fetching polls:", err);
// // //       setError(err.message);
// // //       setLoading(false);
// // //       trackEvent('Error', 'fetch_polls_failed', err.message);
// // //       toast.error('Failed to load polls');
// // //     }
// // //   }, [socket, polls]);

// // //   // Fetch single poll with socket fallback
// // //   const fetchPoll = useCallback(async () => {
// // //     try {
// // //       setLoading(true);
      
// // //       if (socket) {
// // //         socket.emit('getPoll', pollId, (response) => {
// // //           if (response?.error) {
// // //             throw new Error(response.error);
// // //           }
          
// // //           const pollData = response.data;
// // //           const isExpiredNow = pollData.expires_at && new Date(pollData.expires_at) < new Date();
          
// // //           let userHasVoted = false;
// // //           let existingVote = null;

// // //           if (user) {
// // //             const userVote = pollData.votes?.find(vote => vote.user_id === user.id);
// // //             if (userVote) {
// // //               userHasVoted = true;
// // //               existingVote = userVote;
// // //               setSelectedOption(userVote.option_id);
// // //             }
// // //           }

// // //           setPoll(pollData);
// // //           setHasVoted(userHasVoted);
// // //           setUserVote(existingVote);
// // //           setIsExpired(isExpiredNow);
// // //           setLoading(false);

// // //           trackEvent('Poll', 'view', pollId);
// // //         });
// // //       } else {
// // //         // Fallback to direct Supabase
// // //         const { data: pollData, error: pollError } = await supabase
// // //           .from('polls')
// // //           .select(`
// // //             *,
// // //             options(*),
// // //             profiles(username, avatar_url),
// // //             votes(*)
// // //           `)
// // //           .eq('id', pollId)
// // //           .single();
          
// // //         if (pollError) throw pollError;

// // //         const isExpiredNow = pollData.expires_at && new Date(pollData.expires_at) < new Date();
        
// // //         let userHasVoted = false;
// // //         let existingVote = null;

// // //         if (user) {
// // //           const userVote = pollData.votes?.find(vote => vote.user_id === user.id);
// // //           if (userVote) {
// // //             userHasVoted = true;
// // //             existingVote = userVote;
// // //             setSelectedOption(userVote.option_id);
// // //           }
// // //         }

// // //         const totalVotes = pollData.options.reduce((sum, opt) => sum + opt.votes_count, 0);
// // //         const processedPoll = { ...pollData, totalVotes };

// // //         setPoll(processedPoll);
// // //         setHasVoted(userHasVoted);
// // //         setUserVote(existingVote);
// // //         setIsExpired(isExpiredNow);
// // //         setLoading(false);
// // //         trackEvent('Poll', 'view', pollId);
// // //       }
      
// // //     } catch (err) {
// // //       console.error("Error fetching poll:", err);
// // //       setError(err.message);
// // //       setLoading(false);
// // //       trackEvent('Error', 'fetch_poll_failed', err.message);
// // //       toast.error('Failed to load poll');
// // //     }
// // //   }, [socket, pollId, user]);

// // //   // Initial fetch
// // //   useEffect(() => {
// // //     if (!pollId) {
// // //       fetchAllPolls(1);
// // //     } else if (pollId !== "undefined") {
// // //       fetchPoll();
// // //     } else {
// // //       setError("Invalid poll ID");
// // //       setLoading(false);
// // //     }
// // //   }, [pollId, user]);

// // //   // Socket connection
// // //   useEffect(() => {
// // //     if (!socket || !pollId || pollId === "undefined") return;
    
// // //     socket.emit("joinPoll", pollId);
    
// // //     const handlePollUpdate = (data) => {
// // //       if (data.data.id === pollId) {
// // //         setPoll(data.data);
// // //         trackEvent('Poll', 'real_time_update', pollId);
// // //         toast.success('Poll updated in real-time!');
// // //       }
// // //     };
    
// // //     socket.on("pollDataUpdated", handlePollUpdate);
    
// // //     return () => {
// // //       socket.off("pollDataUpdated", handlePollUpdate);
// // //       socket.emit("leavePoll", pollId);
// // //     };
// // //   }, [socket, pollId]);
  
// // //   const handleVote = useCallback(() => {
// // //     if (!selectedOption) {
// // //       toast.error('Please select an option to vote');
// // //       return;
// // //     }
    
// // //     if (socket) {
// // //       socket.emit("vote", {
// // //         pollId,
// // //         optionId: selectedOption,
// // //         userId: user?.id || null
// // //       });
// // //     } else {
// // //       toast.warning('Real-time voting not available');
// // //     }
    
// // //     setHasVoted(true);
// // //     toast.success('Your vote has been submitted!');
// // //     trackEvent('Poll', 'vote_submitted', pollId, selectedOption);
// // //   }, [selectedOption, socket, pollId, user]);

// // //   const calculateEngagementRate = useCallback((totalVotes, participants) => {
// // //     if (participants === 0) return 0;
// // //     return Math.round((totalVotes / participants) * 100);
// // //   }, []);

// // //   const getTopChoice = useCallback((options) => {
// // //     if (!options || options.length === 0) return null;
// // //     return options.reduce((prev, current) => 
// // //       (prev.votes_count > current.votes_count) ? prev : current
// // //     );
// // //   }, []);

// // //   const getPollStatus = useCallback((poll) => {
// // //     if (poll.expires_at && new Date(poll.expires_at) < new Date()) {
// // //       return 'expired';
// // //     }
// // //     return 'active';
// // //   }, []);

// // //   const copyPollLink = useCallback(async (pollId) => {
// // //     const link = `${window.location.origin}/polls/${pollId}`;
// // //     try {
// // //       await navigator.clipboard.writeText(link);
// // //       setCopiedPollId(pollId);
// // //       toast.success('Poll link copied to clipboard!');
// // //       setTimeout(() => setCopiedPollId(null), 2000);
// // //       trackEvent('Poll', 'share_link', pollId);
// // //     } catch (err) {
// // //       toast.error('Failed to copy link');
// // //     }
// // //   }, []);

// // //   const getInitials = useCallback((username, email) => {
// // //     if (username) return username.substring(0, 2).toUpperCase();
// // //     if (email) return email.substring(0, 2).toUpperCase();
// // //     return 'US';
// // //   }, []);

// // //   const loadMore = useCallback(() => {
// // //     const nextPage = page + 1;
// // //     setPage(nextPage);
// // //     fetchAllPolls(nextPage, true);
// // //     trackEvent('Polls', 'load_more', `page_${nextPage}`);
// // //   }, [page, fetchAllPolls]);

// // //   // Memoized stats calculation
// // //   const stats = useMemo(() => {
// // //     if (!polls.length) return null;
    
// // //     return {
// // //       totalPolls: polls.length,
// // //       totalVotes: polls.reduce((sum, poll) => sum + poll.totalVotes, 0),
// // //       activePolls: polls.filter(poll => getPollStatus(poll) === 'active').length,
// // //       avgEngagement: Math.round(polls.reduce((sum, poll) => sum + poll.engagementRate, 0) / polls.length)
// // //     };
// // //   }, [polls, getPollStatus]);

// // //   // Chart data for single poll
// // //   const chartData = useMemo(() => {
// // //     if (!poll?.options) return [];
    
// // //     return poll.options.map((option, index) => ({
// // //       name: option.option_text,
// // //       votes: option.votes_count,
// // //       percentage: poll.totalVotes > 0 ? Math.round((option.votes_count / poll.totalVotes) * 100) : 0,
// // //       fill: COLORS[index % COLORS.length]
// // //     }));
// // //   }, [poll]);

// // //   // Enhanced loading skeleton with dark background
// // //   if (loading && polls.length === 0) {
// // //     return (
// // //       <div className="min-h-screen bg-gray-900 p-8">
// // //         <div className="max-w-7xl mx-auto">
// // //           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
// // //             {[1, 2, 3, 4].map(i => (
// // //               <Card key={i} className="bg-gray-800 border-gray-700">
// // //                 <CardContent className="p-6">
// // //                   <Skeleton className="h-4 w-20 mb-2 bg-gray-700" />
// // //                   <Skeleton className="h-8 w-16 bg-gray-700" />
// // //                 </CardContent>
// // //               </Card>
// // //             ))}
// // //           </div>
// // //           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
// // //             {[1, 2, 3, 4, 5, 6].map(i => (
// // //               <Card key={i} className="bg-gray-800 border-gray-700">
// // //                 <CardHeader>
// // //                   <Skeleton className="h-6 w-3/4 mb-2 bg-gray-700" />
// // //                   <Skeleton className="h-4 w-1/2 bg-gray-700" />
// // //                 </CardHeader>
// // //                 <CardContent className="space-y-3">
// // //                   <Skeleton className="h-4 w-full bg-gray-700" />
// // //                   <Skeleton className="h-4 w-5/6 bg-gray-700" />
// // //                 </CardContent>
// // //                 <CardFooter>
// // //                   <Skeleton className="h-10 w-full bg-gray-700" />
// // //                 </CardFooter>
// // //               </Card>
// // //             ))}
// // //           </div>
// // //         </div>
// // //       </div>
// // //     );
// // //   }

// // //   // Error state
// // //   if (error) {
// // //     return (
// // //       <div className="min-h-screen bg-gray-900 flex items-center justify-center p-8">
// // //         <Card className="bg-gray-800 border-gray-700 max-w-md text-center">
// // //           <CardContent className="pt-6">
// // //             <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
// // //               <Sparkles className="h-8 w-8 text-red-400" />
// // //             </div>
// // //             <h3 className="text-xl font-semibold text-white mb-2">Unable to Load Polls</h3>
// // //             <p className="text-gray-400 mb-4">{error}</p>
// // //             <Button 
// // //               onClick={() => pollId ? fetchPoll() : fetchAllPolls()}
// // //               className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
// // //             >
// // //               Try Again
// // //             </Button>
// // //           </CardContent>
// // //         </Card>
// // //       </div>
// // //     );
// // //   }

// // //   // Single poll view with enhanced graphics
// // //   if (pollId && poll) {
// // //     if (isExpired) {
// // //       return (
// // //         <div className="min-h-screen bg-gray-900 p-4">
// // //           <div className="max-w-6xl mx-auto">
// // //             <Card className="bg-gray-800 border-gray-700">
// // //               <CardHeader className="text-center">
// // //                 <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
// // //                   {poll.question}
// // //                 </CardTitle>
// // //                 <div className="bg-red-500/20 border border-red-500/30 text-red-200 p-4 rounded-xl mt-4 max-w-md mx-auto">
// // //                   <div className="flex items-center justify-center gap-2">
// // //                     <Clock className="h-5 w-5" />
// // //                     This poll has expired and is no longer accepting votes.
// // //                   </div>
// // //                 </div>
// // //               </CardHeader>
// // //               <CardContent className="pt-6">
// // //                 <h3 className="text-2xl font-semibold text-white text-center mb-8">Final Results</h3>
                
// // //                 {/* Chart Type Selector */}
// // //                 <div className="flex justify-center gap-2 mb-8">
// // //                   {[
// // //                     { key: 'bar', icon: BarChart4, label: 'Bar' },
// // //                     { key: 'pie', icon: PieChartIcon, label: 'Pie' },
// // //                     { key: 'line', icon: LineChartIcon, label: 'Line' }
// // //                   ].map(({ key, icon: Icon, label }) => (
// // //                     <Button
// // //                       key={key}
// // //                       variant={activeChart === key ? "default" : "outline"}
// // //                       onClick={() => setActiveChart(key)}
// // //                       className={`flex items-center gap-2 ${
// // //                         activeChart === key 
// // //                           ? 'bg-blue-600 text-white' 
// // //                           : 'bg-gray-700 text-gray-300 border-gray-600'
// // //                       }`}
// // //                     >
// // //                       <Icon className="h-4 w-4" />
// // //                       {label}
// // //                     </Button>
// // //                   ))}
// // //                 </div>

// // //                 {/* Charts */}
// // //                 <div className="h-96">
// // //                   {activeChart === 'bar' && (
// // //                     <ResponsiveContainer width="100%" height="100%">
// // //                       <BarChart data={chartData}>
// // //                         <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
// // //                         <XAxis dataKey="name" stroke="#9CA3AF" />
// // //                         <YAxis stroke="#9CA3AF" />
// // //                         <Tooltip 
// // //                           contentStyle={{ 
// // //                             backgroundColor: 'rgba(17, 24, 39, 0.9)',
// // //                             border: '1px solid rgba(255, 255, 255, 0.1)',
// // //                             borderRadius: '8px',
// // //                             color: 'white'
// // //                           }}
// // //                         />
// // //                         <Legend />
// // //                         <Bar dataKey="votes" fill="#3B82F6" radius={[4, 4, 0, 0]} />
// // //                       </BarChart>
// // //                     </ResponsiveContainer>
// // //                   )}
                  
// // //                   {activeChart === 'pie' && (
// // //                     <ResponsiveContainer width="100%" height="100%">
// // //                       <PieChart>
// // //                         <Pie
// // //                           data={chartData}
// // //                           cx="50%"
// // //                           cy="50%"
// // //                           labelLine={false}
// // //                           label={({ name, percentage }) => `${name}: ${percentage}%`}
// // //                           outerRadius={120}
// // //                           fill="#8884d8"
// // //                           dataKey="votes"
// // //                         >
// // //                           {chartData.map((entry, index) => (
// // //                             <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
// // //                           ))}
// // //                         </Pie>
// // //                         <Tooltip />
// // //                         <Legend />
// // //                       </PieChart>
// // //                     </ResponsiveContainer>
// // //                   )}
                  
// // //                   {activeChart === 'line' && (
// // //                     <ResponsiveContainer width="100%" height="100%">
// // //                       <LineChart data={chartData}>
// // //                         <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
// // //                         <XAxis dataKey="name" stroke="#9CA3AF" />
// // //                         <YAxis stroke="#9CA3AF" />
// // //                         <Tooltip />
// // //                         <Legend />
// // //                         <Line type="monotone" dataKey="votes" stroke="#3B82F6" strokeWidth={3} dot={{ r: 6 }} />
// // //                       </LineChart>
// // //                     </ResponsiveContainer>
// // //                   )}
// // //                 </div>

// // //                 {/* Detailed Results */}
// // //                 <div className="mt-8 space-y-4">
// // //                   <h4 className="text-xl font-semibold text-white text-center">Detailed Breakdown</h4>
// // //                   {poll.options.map((option, index) => {
// // //                     const percentage = poll.totalVotes > 0 
// // //                       ? Math.round((option.votes_count / poll.totalVotes) * 100) 
// // //                       : 0;
// // //                     return (
// // //                       <div key={option.id} className="bg-gray-700/50 rounded-xl p-4 border border-gray-600">
// // //                         <div className="flex justify-between items-center mb-2">
// // //                           <span className="text-white font-medium text-lg">{option.option_text}</span>
// // //                           <div className="flex items-center gap-3">
// // //                             <span className="text-blue-400 font-bold text-lg">{percentage}%</span>
// // //                             <span className="text-gray-400 text-sm">({option.votes_count} votes)</span>
// // //                           </div>
// // //                         </div>
// // //                         <Progress value={percentage} className="h-3 bg-gray-600" />
// // //                       </div>
// // //                     );
// // //                   })}
// // //                 </div>
// // //               </CardContent>
// // //             </Card>
// // //           </div>
// // //         </div>
// // //       );
// // //     }

// // //     return (
// // //       <div className="min-h-screen bg-gray-900 p-4">
// // //         <div className="max-w-4xl mx-auto">
// // //           <Card className="bg-gray-800 border-gray-700">
// // //             <CardHeader className="text-center">
// // //               <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
// // //                 {poll.question}
// // //               </CardTitle>
// // //               {poll.description && (
// // //                 <CardDescription className="text-gray-300 text-lg mt-2">
// // //                   {poll.description}
// // //                 </CardDescription>
// // //               )}
// // //               {poll.profiles && (
// // //                 <div className="flex items-center justify-center gap-2 mt-4 text-gray-400">
// // //                   <Avatar className="h-6 w-6">
// // //                     <AvatarImage src={poll.profiles.avatar_url} />
// // //                     <AvatarFallback className="text-xs">
// // //                       {getInitials(poll.profiles.username)}
// // //                     </AvatarFallback>
// // //                   </Avatar>
// // //                   <span>Created by {poll.profiles.username}</span>
// // //                 </div>
// // //               )}
// // //             </CardHeader>
// // //             <CardContent className="pt-6">
// // //               {!hasVoted ? (
// // //                 <div className="space-y-4">
// // //                   <h3 className="text-xl font-semibold text-white text-center mb-6">Cast Your Vote</h3>
// // //                   {poll.options.map((option, index) => (
// // //                     <div 
// // //                       key={option.id} 
// // //                       className={`flex items-center space-x-4 p-4 border-2 rounded-xl transition-all duration-200 cursor-pointer ${
// // //                         selectedOption === option.id 
// // //                           ? 'border-blue-500 bg-blue-500/10 shadow-lg shadow-blue-500/20' 
// // //                           : 'border-gray-600 bg-gray-700/50 hover:border-blue-400 hover:bg-blue-500/5'
// // //                       }`}
// // //                       onClick={() => setSelectedOption(option.id)}
// // //                     >
// // //                       <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
// // //                         selectedOption === option.id 
// // //                           ? 'border-blue-500 bg-blue-500 shadow-inner' 
// // //                           : 'border-gray-500 bg-transparent'
// // //                       }`}>
// // //                         {selectedOption === option.id && (
// // //                           <div className="w-2 h-2 rounded-full bg-white"></div>
// // //                         )}
// // //                       </div>
// // //                       <label className="text-white text-lg font-medium flex-1 cursor-pointer">
// // //                         {option.option_text}
// // //                       </label>
// // //                     </div>
// // //                   ))}
// // //                   <Button 
// // //                     onClick={handleVote} 
// // //                     disabled={!selectedOption}
// // //                     className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-6 text-lg font-semibold rounded-xl mt-6 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
// // //                     size="lg"
// // //                   >
// // //                     <Vote className="mr-3 h-5 w-5" />
// // //                     Submit Vote
// // //                   </Button>
// // //                 </div>
// // //               ) : (
// // //                 <div className="space-y-6">
// // //                   <div className="text-center">
// // //                     <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
// // //                       <Vote className="h-8 w-8 text-green-400" />
// // //                     </div>
// // //                     <h3 className="text-2xl font-semibold text-white mb-2">Thank You for Voting!</h3>
// // //                     {userVote && (
// // //                       <p className="text-gray-300 text-lg">
// // //                         You voted for: <span className="text-blue-400 font-semibold">
// // //                           {poll.options.find(opt => opt.id === userVote.option_id)?.option_text}
// // //                         </span>
// // //                       </p>
// // //                     )}
// // //                   </div>
                  
// // //                   <div className="bg-gray-700/50 rounded-xl p-6 border border-gray-600">
// // //                     <h4 className="text-xl font-semibold text-white text-center mb-6">Live Results</h4>
                    
// // //                     {/* Chart Type Selector */}
// // //                     <div className="flex justify-center gap-2 mb-6">
// // //                       {[
// // //                         { key: 'bar', icon: BarChart4, label: 'Bar' },
// // //                         { key: 'pie', icon: PieChartIcon, label: 'Pie' }
// // //                       ].map(({ key, icon: Icon, label }) => (
// // //                         <Button
// // //                           key={key}
// // //                           variant={activeChart === key ? "default" : "outline"}
// // //                           onClick={() => setActiveChart(key)}
// // //                           className={`flex items-center gap-2 ${
// // //                             activeChart === key 
// // //                               ? 'bg-blue-600 text-white' 
// // //                               : 'bg-gray-700 text-gray-300 border-gray-600'
// // //                           }`}
// // //                           size="sm"
// // //                         >
// // //                           <Icon className="h-4 w-4" />
// // //                           {label}
// // //                         </Button>
// // //                       ))}
// // //                     </div>

// // //                     {/* Chart */}
// // //                     <div className="h-80 mb-6">
// // //                       {activeChart === 'bar' && (
// // //                         <ResponsiveContainer width="100%" height="100%">
// // //                           <BarChart data={chartData}>
// // //                             <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
// // //                             <XAxis dataKey="name" stroke="#9CA3AF" />
// // //                             <YAxis stroke="#9CA3AF" />
// // //                             <Tooltip 
// // //                               contentStyle={{ 
// // //                                 backgroundColor: 'rgba(17, 24, 39, 0.9)',
// // //                                 border: '1px solid rgba(255, 255, 255, 0.1)',
// // //                                 borderRadius: '8px',
// // //                                 color: 'white'
// // //                               }}
// // //                             />
// // //                             <Bar dataKey="votes" fill="#3B82F6" radius={[4, 4, 0, 0]} />
// // //                           </BarChart>
// // //                         </ResponsiveContainer>
// // //                       )}
                      
// // //                       {activeChart === 'pie' && (
// // //                         <ResponsiveContainer width="100%" height="100%">
// // //                           <PieChart>
// // //                             <Pie
// // //                               data={chartData}
// // //                               cx="50%"
// // //                               cy="50%"
// // //                               labelLine={false}
// // //                               label={({ name, percentage }) => `${name}: ${percentage}%`}
// // //                               outerRadius={100}
// // //                               fill="#8884d8"
// // //                               dataKey="votes"
// // //                             >
// // //                               {chartData.map((entry, index) => (
// // //                                 <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
// // //                               ))}
// // //                             </Pie>
// // //                             <Tooltip />
// // //                           </PieChart>
// // //                         </ResponsiveContainer>
// // //                       )}
// // //                     </div>

// // //                     {/* Detailed Results */}
// // //                     <div className="space-y-3">
// // //                       {poll.options.map((option, index) => {
// // //                         const percentage = poll.totalVotes > 0 
// // //                           ? Math.round((option.votes_count / poll.totalVotes) * 100) 
// // //                           : 0;
// // //                         const isUserVote = userVote && userVote.option_id === option.id;
                        
// // //                         return (
// // //                           <div key={option.id} className="space-y-2">
// // //                             <div className="flex justify-between items-center">
// // //                               <div className="flex items-center gap-3 flex-1">
// // //                                 <span className="text-white font-medium">
// // //                                   {option.option_text}
// // //                                 </span>
// // //                                 {isUserVote && (
// // //                                   <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30 text-xs">
// // //                                     Your Vote
// // //                                   </Badge>
// // //                                 )}
// // //                               </div>
// // //                               <span className="text-blue-400 font-bold text-lg bg-blue-500/20 px-3 py-1 rounded-full min-w-16 text-center">
// // //                                 {percentage}%
// // //                               </span>
// // //                             </div>
// // //                             <Progress 
// // //                               value={percentage} 
// // //                               className={`h-3 bg-gray-600 ${
// // //                                 isUserVote ? 'bg-blue-500/30' : ''
// // //                               }`}
// // //                             />
// // //                             <div className="flex justify-between text-sm text-gray-400">
// // //                               <span>{option.votes_count} votes</span>
// // //                               <span>{percentage}% of total</span>
// // //                             </div>
// // //                           </div>
// // //                         );
// // //                       })}
// // //                     </div>
                    
// // //                     {poll.totalVotes > 0 && (
// // //                       <div className="mt-6 p-4 bg-gray-600/30 rounded-lg border border-gray-500">
// // //                         <div className="flex items-center justify-between">
// // //                           <span className="text-gray-300">Total Votes Cast:</span>
// // //                           <span className="text-white font-bold text-lg">{poll.totalVotes}</span>
// // //                         </div>
// // //                       </div>
// // //                     )}
// // //                   </div>
// // //                 </div>
// // //               )}
// // //             </CardContent>
// // //           </Card>
// // //         </div>
// // //       </div>
// // //     );
// // //   }

// // //   // All polls list view with enhanced design
// // //   if (!pollId) {
// // //     if (polls.length === 0) {
// // //       return (
// // //         <div className="min-h-screen bg-gray-900 flex items-center justify-center p-8">
// // //           <div className="text-center max-w-2xl">
// // //             <div className="w-32 h-32 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl">
// // //               <Vote className="h-16 w-16 text-blue-400" />
// // //             </div>
// // //             <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent mb-6">
// // //               Start the Conversation
// // //             </h1>
// // //             <p className="text-xl text-gray-300 mb-8 leading-relaxed">
// // //               Create your first interactive poll and engage your audience with real-time voting, analytics, and beautiful visualizations.
// // //             </p>
// // //             <Button 
// // //               onClick={() => {
// // //                 navigate('/create-poll');
// // //                 trackEvent('Navigation', 'create_first_poll');
// // //               }}
// // //               className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-6 text-lg rounded-xl shadow-2xl hover:shadow-3xl transition-all duration-300"
// // //               size="lg"
// // //             >
// // //               <Plus className="mr-3 h-5 w-5" />
// // //               Create First Poll
// // //             </Button>
// // //           </div>
// // //         </div>
// // //       );
// // //     }
    
// // //     return (
// // //       <TooltipProvider>
// // //         <div className="min-h-screen bg-gray-900 text-white p-4">
// // //           <div className="max-w-7xl mx-auto">
// // //             {/* Enhanced Stats Section */}
// // //             {stats && (
// // //               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
// // //                 <Card className="bg-gray-800 border-gray-700 hover:border-blue-500/30 transition-all duration-300">
// // //                   <CardContent className="p-6">
// // //                     <div className="flex items-center justify-between">
// // //                       <div>
// // //                         <p className="text-gray-400 text-sm font-medium">Total Polls</p>
// // //                         <p className="text-3xl font-bold text-white mt-1">{stats.totalPolls}</p>
// // //                       </div>
// // //                       <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
// // //                         <BarChart3 className="h-6 w-6 text-blue-400" />
// // //                       </div>
// // //                     </div>
// // //                   </CardContent>
// // //                 </Card>
                
// // //                 <Card className="bg-gray-800 border-gray-700 hover:border-green-500/30 transition-all duration-300">
// // //                   <CardContent className="p-6">
// // //                     <div className="flex items-center justify-between">
// // //                       <div>
// // //                         <p className="text-gray-400 text-sm font-medium">Total Votes</p>
// // //                         <p className="text-3xl font-bold text-white mt-1">{stats.totalVotes.toLocaleString()}</p>
// // //                       </div>
// // //                       <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
// // //                         <Users className="h-6 w-6 text-green-400" />
// // //                       </div>
// // //                     </div>
// // //                   </CardContent>
// // //                 </Card>
                
// // //                 <Card className="bg-gray-800 border-gray-700 hover:border-purple-500/30 transition-all duration-300">
// // //                   <CardContent className="p-6">
// // //                     <div className="flex items-center justify-between">
// // //                       <div>
// // //                         <p className="text-gray-400 text-sm font-medium">Active Polls</p>
// // //                         <p className="text-3xl font-bold text-white mt-1">{stats.activePolls}</p>
// // //                       </div>
// // //                       <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
// // //                         <MessageCircle className="h-6 w-6 text-purple-400" />
// // //                       </div>
// // //                     </div>
// // //                   </CardContent>
// // //                 </Card>
                
// // //                 <Card className="bg-gray-800 border-gray-700 hover:border-yellow-500/30 transition-all duration-300">
// // //                   <CardContent className="p-6">
// // //                     <div className="flex items-center justify-between">
// // //                       <div>
// // //                         <p className="text-gray-400 text-sm font-medium">Avg. Engagement</p>
// // //                         <p className="text-3xl font-bold text-white mt-1">{stats.avgEngagement}%</p>
// // //                       </div>
// // //                       <div className="w-12 h-12 bg-yellow-500/20 rounded-xl flex items-center justify-center">
// // //                         <TrendingUp className="h-6 w-6 text-yellow-400" />
// // //                       </div>
// // //                     </div>
// // //                   </CardContent>
// // //                 </Card>
// // //               </div>
// // //             )}
            
// // //             {/* Action Bar */}
// // //             <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 p-6 bg-gray-800 border border-gray-700 rounded-2xl">
// // //               <div>
// // //                 <h2 className="text-2xl font-bold text-white mb-2">Community Polls</h2>
// // //                 <p className="text-gray-400">Discover and participate in real-time discussions</p>
// // //               </div>
// // //               <div className="flex gap-3">
// // //                 <Button 
// // //                   variant="outline"
// // //                   className="border-gray-600 bg-gray-700 hover:bg-gray-600 text-white"
// // //                 >
// // //                   <Eye className="mr-2 h-4 w-4" />
// // //                   Filter
// // //                 </Button>
// // //                 <Button 
// // //                   onClick={() => navigate('/create-poll')}
// // //                   className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg"
// // //                 >
// // //                   <Plus className="mr-2 h-4 w-4" />
// // //                   New Poll
// // //                 </Button>
// // //               </div>
// // //             </div>
            
// // //             {/* Enhanced Polls Grid */}
// // //             <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
// // //               {polls.map(poll => {
// // //                 const topChoice = getTopChoice(poll.options);
// // //                 const status = getPollStatus(poll);
// // //                 const isExpiredPoll = status === 'expired';
// // //                 const isTrending = poll.totalVotes > 50;
// // //                 const engagementColor = poll.engagementRate > 70 ? 'text-green-400' : 
// // //                                       poll.engagementRate > 40 ? 'text-yellow-400' : 'text-red-400';

// // //                 return (
// // //                   <Card key={poll.id} className="bg-gray-800 border-gray-700 hover:border-blue-500/30 transition-all duration-300 group hover:shadow-2xl">
// // //                     <CardHeader className="pb-4">
// // //                       <div className="flex justify-between items-start mb-3">
// // //                         <div className="flex items-center gap-2">
// // //                           <Avatar className="h-8 w-8 border border-gray-600">
// // //                             <AvatarImage src={poll.profiles?.avatar_url} />
// // //                             <AvatarFallback className="bg-gradient-to-br from-blue-600 to-purple-600 text-xs">
// // //                               {getInitials(poll.profiles?.username, poll.created_by)}
// // //                             </AvatarFallback>
// // //                           </Avatar>
// // //                           <div className="flex gap-1">
// // //                             {poll.is_password_protected && (
// // //                               <Badge className="bg-yellow-500/20 text-yellow-300 border-yellow-500/30">
// // //                                 <Shield className="h-3 w-3" />
// // //                               </Badge>
// // //                             )}
// // //                             {isTrending && (
// // //                               <Badge className="bg-green-500/20 text-green-300 border-green-500/30">
// // //                                 <Zap className="h-3 w-3" />
// // //                               </Badge>
// // //                             )}
// // //                             {isExpiredPoll && (
// // //                               <Badge className="bg-red-500/20 text-red-300 border-red-500/30">
// // //                                 <Clock className="h-3 w-3" />
// // //                               </Badge>
// // //                             )}
// // //                           </div>
// // //                         </div>
// // //                       </div>
                      
// // //                       <CardTitle className="text-lg text-white line-clamp-2 group-hover:text-blue-400 transition-colors">
// // //                         {poll.question}
// // //                       </CardTitle>
                      
// // //                       <CardDescription className="flex items-center justify-between text-sm mt-3">
// // //                         <span className="text-gray-400 flex items-center gap-1">
// // //                           <Calendar className="h-4 w-4" />
// // //                           {new Date(poll.created_at).toLocaleDateString()}
// // //                         </span>
// // //                         <div className="flex gap-3">
// // //                           <span className="text-gray-400 flex items-center gap-1">
// // //                             <Users className="h-4 w-4" />
// // //                             {poll.participantCount}
// // //                           </span>
// // //                           <span className={`flex items-center gap-1 ${engagementColor}`}>
// // //                             <TrendingUp className="h-4 w-4" />
// // //                             {poll.engagementRate}%
// // //                           </span>
// // //                         </div>
// // //                       </CardDescription>
// // //                     </CardHeader>
                    
// // //                     <CardContent className="pt-0">
// // //                       {poll.options.slice(0, 2).map((option) => {
// // //                         const percentage = poll.totalVotes > 0 
// // //                           ? Math.round((option.votes_count / poll.totalVotes) * 100) 
// // //                           : 0;
// // //                         return (
// // //                           <div key={option.id} className="mb-3">
// // //                             <div className="flex justify-between text-sm mb-1">
// // //                               <span className="text-white truncate font-medium">{option.option_text}</span>
// // //                               <span className="text-blue-400 font-bold">{percentage}%</span>
// // //                             </div>
// // //                             <Progress value={percentage} className="h-2 bg-gray-700" />
// // //                           </div>
// // //                         );
// // //                       })}
// // //                       {poll.options.length > 2 && (
// // //                         <p className="text-gray-400 text-sm text-center mt-3 bg-gray-700 py-1 rounded-full">
// // //                           +{poll.options.length - 2} more options
// // //                         </p>
// // //                       )}
// // //                     </CardContent>
                    
// // //                     <CardFooter>
// // //                       <div className="flex gap-2 w-full">
// // //                         <Button 
// // //                           className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-2.5 rounded-xl shadow-lg"
// // //                           onClick={() => {
// // //                             navigate(`/polls/${poll.id}`);
// // //                             trackEvent('Poll', 'open_detail', poll.id);
// // //                           }}
// // //                         >
// // //                           {isExpiredPoll ? (
// // //                             <>
// // //                               <BarChart3 className="mr-2 h-4 w-4" />
// // //                               View Results
// // //                             </>
// // //                           ) : (
// // //                             <>
// // //                               <Vote className="mr-2 h-4 w-4" />
// // //                               Vote Now
// // //                             </>
// // //                           )}
// // //                         </Button>
// // //                         <UITooltip>
// // //                           <TooltipTrigger asChild>
// // //                             <Button 
// // //                               variant="outline" 
// // //                               size="sm"
// // //                               className="border-gray-600 bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white"
// // //                               onClick={() => copyPollLink(poll.id)}
// // //                             >
// // //                               {copiedPollId === poll.id ? (
// // //                                 <CheckCheck className="h-4 w-4 text-green-400" />
// // //                               ) : (
// // //                                 <Share2 className="h-4 w-4" />
// // //                               )}
// // //                             </Button>
// // //                           </TooltipTrigger>
// // //                           <TooltipContent>
// // //                             <p>Copy poll link</p>
// // //                           </TooltipContent>
// // //                         </UITooltip>
// // //                       </div>
// // //                     </CardFooter>
// // //                   </Card>
// // //                 );
// // //               })}
// // //             </div>

// // //             {/* Load More */}
// // //             {hasMore && (
// // //               <div className="text-center mt-12">
// // //                 <Button 
// // //                   onClick={loadMore}
// // //                   disabled={loading}
// // //                   className="bg-gray-800 border border-gray-700 hover:bg-gray-700 text-white px-8 py-6 rounded-xl"
// // //                   size="lg"
// // //                 >
// // //                   {loading ? (
// // //                     <div className="flex items-center gap-2">
// // //                       <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
// // //                       Loading...
// // //                     </div>
// // //                   ) : (
// // //                     <>
// // //                       <Sparkles className="mr-2 h-5 w-5" />
// // //                       Load More Polls
// // //                     </>
// // //                   )}
// // //                 </Button>
// // //               </div>
// // //             )}
// // //           </div>
// // //         </div>
// // //       </TooltipProvider>
// // //     );
// // //   }
  
// // //   return null;
// // // };

// // // export default Polls;




// // // import React, { useState, useEffect, useCallback, useMemo } from 'react';
// // // import { useNavigate } from 'react-router-dom';
// // // import { useSocketContext } from '../context/SocketContext';
// // // import { UserAuth } from '../context/AuthContext';
// // // import { supabase } from '../supabaseClient';
// // // import { ResponsiveBar } from '@nivo/bar';
// // // import { ResponsivePie } from '@nivo/pie';
// // // import { ResponsiveLine } from '@nivo/line';
// // // import { ResponsiveRadar } from '@nivo/radar';
// // // import { ResponsiveSunburst } from '@nivo/sunburst';
// // // import { 
// // //   Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter 
// // // } from '@/components/ui/card';
// // // import { Button } from '@/components/ui/button';
// // // import { Badge } from '@/components/ui/badge';
// // // import { Progress } from '@/components/ui/progress';
// // // import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
// // // import {
// // //   Dialog,
// // //   DialogContent,
// // //   DialogDescription,
// // //   DialogFooter,
// // //   DialogHeader,
// // //   DialogTitle,
// // // } from '@/components/ui/dialog';
// // // import { Input } from '@/components/ui/input';
// // // import { Label } from '@/components/ui/label';
// // // import { 
// // //   Tooltip as UITooltip, 
// // //   TooltipContent, 
// // //   TooltipProvider, 
// // //   TooltipTrigger 
// // // } from '@/components/ui/tooltip';
// // // import { Skeleton } from '@/components/ui/skeleton';
// // // import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
// // // import { 
// // //   Calendar, Users, TrendingUp, BarChart3, Plus, Vote, Zap, Shield, 
// // //   Clock, Trophy, Sparkles, MessageCircle, Eye, Share2, MoreHorizontal,
// // //   Copy, CheckCheck, BarChart4, PieChart as PieChartIcon, LineChart as LineChartIcon,
// // //   Lock, X, QrCode, Download, Mail, FileText, Twitter, Linkedin, Facebook,
// // //   ExternalLink, AlertCircle, Activity, Maximize2
// // // } from 'lucide-react';
// // // import { toast } from 'sonner';

// // // const trackEvent = (category, action, label, value) => {
// // //   if (window.gtag) {
// // //     window.gtag('event', action, {
// // //       event_category: category,
// // //       event_label: label,
// // //       value: value,
// // //     });
// // //   }
// // // };

// // // const trackPageView = (path) => {
// // //   if (window.gtag) {
// // //     window.gtag('config', import.meta.env.VITE_GA_MEASUREMENT_ID, {
// // //       page_path: path,
// // //     });
// // //   }
// // // };

// // // const NIVO_COLORS = ['#3B82F6', '#8B5CF6', '#EF4444', '#10B981', '#F59E0B', '#6366F1', '#EC4899', '#84CC16'];

// // // const Polls = ({ pollId }) => {
// // //   const [polls, setPolls] = useState([]);
// // //   const [poll, setPoll] = useState(null);
// // //   const [selectedOption, setSelectedOption] = useState(null);
// // //   const [hasVoted, setHasVoted] = useState(false);
// // //   const [loading, setLoading] = useState(true);
// // //   const [error, setError] = useState(null);
// // //   const [userVote, setUserVote] = useState(null);
// // //   const [isExpired, setIsExpired] = useState(false);
// // //   const [page, setPage] = useState(1);
// // //   const [hasMore, setHasMore] = useState(true);
// // //   const [copiedPollId, setCopiedPollId] = useState(null);
// // //   const [activeChart, setActiveChart] = useState('bar');
  
// // //   // Enhanced features state
// // //   const [passwordModalOpen, setPasswordModalOpen] = useState(false);
// // //   const [shareModalOpen, setShareModalOpen] = useState(false);
// // //   const [analyticsModalOpen, setAnalyticsModalOpen] = useState(false);
// // //   const [selectedSharePoll, setSelectedSharePoll] = useState(null);
// // //   const [password, setPassword] = useState('');
// // //   const [pendingPollId, setPendingPollId] = useState(null);
  
// // //   const POLLS_PER_PAGE = 12;
  
// // //   const socketContext = useSocketContext();
// // //   const socket = socketContext?.socket;
// // //   const { user } = UserAuth();
// // //   const navigate = useNavigate();

// // //   useEffect(() => {
// // //     const path = pollId ? `/polls/${pollId}` : '/polls';
// // //     trackPageView(path);
// // //   }, [pollId]);

// // //   // Fetch all polls
// // //   const fetchAllPolls = useCallback(async (pageNum = 1, append = false) => {
// // //     try {
// // //       setLoading(true);
      
// // //       if (socket) {
// // //         socket.emit('getPolls', { page: pageNum, limit: POLLS_PER_PAGE }, (response) => {
// // //           if (response?.error) throw new Error(response.error);
// // //           setPolls(append ? [...polls, ...response.polls] : response.polls);
// // //           setHasMore(response.hasMore);
// // //           setLoading(false);
// // //           trackEvent('Polls', 'view_all', `page_${pageNum}`);
// // //         });
// // //       } else {
// // //         const from = (pageNum - 1) * POLLS_PER_PAGE;
// // //         const to = from + POLLS_PER_PAGE - 1;

// // //         const { data: pollsData, error: pollsError } = await supabase
// // //           .from('polls')
// // //           .select(`
// // //             *,
// // //             options!inner(id, option_text, votes_count, poll_id),
// // //             profiles(username, avatar_url)
// // //           `)
// // //           .order('created_at', { ascending: false })
// // //           .range(from, to);
          
// // //         if (pollsError) throw pollsError;

// // //         const pollIds = pollsData.map(p => p.id);
// // //         const { data: votesData } = await supabase
// // //           .from('votes')
// // //           .select('poll_id, user_id')
// // //           .in('poll_id', pollIds);

// // //         const participantsByPoll = votesData?.reduce((acc, vote) => {
// // //           if (!acc[vote.poll_id]) acc[vote.poll_id] = new Set();
// // //           acc[vote.poll_id].add(vote.user_id);
// // //           return acc;
// // //         }, {}) || {};

// // //         const processedPolls = pollsData.map(poll => {
// // //           const totalVotes = poll.options.reduce((sum, opt) => sum + opt.votes_count, 0);
// // //           const participantCount = participantsByPoll[poll.id]?.size || 0;
          
// // //           return {
// // //             ...poll,
// // //             totalVotes,
// // //             participantCount,
// // //             engagementRate: participantCount > 0 ? Math.round((totalVotes / participantCount) * 100) : 0
// // //           };
// // //         });

// // //         setPolls(append ? [...polls, ...processedPolls] : processedPolls);
// // //         setHasMore(pollsData.length === POLLS_PER_PAGE);
// // //         setLoading(false);
// // //         trackEvent('Polls', 'view_all', `page_${pageNum}`);
// // //       }
// // //     } catch (err) {
// // //       console.error("Error fetching polls:", err);
// // //       setError(err.message);
// // //       setLoading(false);
// // //       toast.error('Failed to load polls');
// // //     }
// // //   }, [socket, polls]);

// // //   // Fetch single poll with password check
// // //   const fetchPoll = useCallback(async (providedPassword = null) => {
// // //     try {
// // //       setLoading(true);
      
// // //       if (socket) {
// // //         socket.emit('getPoll', { pollId, password: providedPassword }, (response) => {
// // //           if (response?.error) {
// // //             if (response.error === 'Password required' || response.error === 'Invalid password') {
// // //               setPendingPollId(pollId);
// // //               setPasswordModalOpen(true);
// // //               setLoading(false);
// // //               return;
// // //             }
// // //             throw new Error(response.error);
// // //           }
          
// // //           const pollData = response.data;
// // //           const isExpiredNow = pollData.expires_at && new Date(pollData.expires_at) < new Date();
          
// // //           let userHasVoted = false;
// // //           let existingVote = null;

// // //           if (user) {
// // //             const userVote = pollData.votes?.find(vote => vote.user_id === user.id);
// // //             if (userVote) {
// // //               userHasVoted = true;
// // //               existingVote = userVote;
// // //               setSelectedOption(userVote.option_id);
// // //             }
// // //           }

// // //           setPoll(pollData);
// // //           setHasVoted(userHasVoted);
// // //           setUserVote(existingVote);
// // //           setIsExpired(isExpiredNow);
// // //           setPasswordModalOpen(false);
// // //           setLoading(false);
// // //           trackEvent('Poll', 'view', pollId);
// // //         });
// // //       } else {
// // //         const { data: pollCheck, error: checkError } = await supabase
// // //           .from('polls')
// // //           .select('is_password_protected, password_hash')
// // //           .eq('id', pollId)
// // //           .single();

// // //         if (checkError) throw checkError;

// // //         if (pollCheck.is_password_protected && !providedPassword) {
// // //           setPendingPollId(pollId);
// // //           setPasswordModalOpen(true);
// // //           setLoading(false);
// // //           return;
// // //         }

// // //         const { data: pollData, error: pollError } = await supabase
// // //           .from('polls')
// // //           .select(`
// // //             *,
// // //             options(*),
// // //             profiles(username, avatar_url),
// // //             votes(*)
// // //           `)
// // //           .eq('id', pollId)
// // //           .single();
          
// // //         if (pollError) throw pollError;

// // //         const isExpiredNow = pollData.expires_at && new Date(pollData.expires_at) < new Date();
        
// // //         let userHasVoted = false;
// // //         let existingVote = null;

// // //         if (user) {
// // //           const userVote = pollData.votes?.find(vote => vote.user_id === user.id);
// // //           if (userVote) {
// // //             userHasVoted = true;
// // //             existingVote = userVote;
// // //             setSelectedOption(userVote.option_id);
// // //           }
// // //         }

// // //         const totalVotes = pollData.options.reduce((sum, opt) => sum + opt.votes_count, 0);
// // //         const processedPoll = { ...pollData, totalVotes };

// // //         setPoll(processedPoll);
// // //         setHasVoted(userHasVoted);
// // //         setUserVote(existingVote);
// // //         setIsExpired(isExpiredNow);
// // //         setPasswordModalOpen(false);
// // //         setLoading(false);
// // //         trackEvent('Poll', 'view', pollId);
// // //       }
      
// // //     } catch (err) {
// // //       console.error("Error fetching poll:", err);
// // //       setError(err.message);
// // //       setLoading(false);
// // //       toast.error('Failed to load poll');
// // //     }
// // //   }, [socket, pollId, user]);

// // //   // Initial fetch
// // //   useEffect(() => {
// // //     if (!pollId) {
// // //       fetchAllPolls(1);
// // //     } else if (pollId !== "undefined") {
// // //       fetchPoll();
// // //     } else {
// // //       setError("Invalid poll ID");
// // //       setLoading(false);
// // //     }
// // //   }, [pollId, user]);

// // //   // Socket connection
// // //   useEffect(() => {
// // //     if (!socket || !pollId || pollId === "undefined") return;
    
// // //     socket.emit("joinPoll", pollId);
    
// // //     const handlePollUpdate = (data) => {
// // //       if (data.data.id === pollId) {
// // //         setPoll(data.data);
// // //         trackEvent('Poll', 'real_time_update', pollId);
// // //         toast.success('Poll updated in real-time!');
// // //       }
// // //     };
    
// // //     socket.on("pollDataUpdated", handlePollUpdate);
    
// // //     return () => {
// // //       socket.off("pollDataUpdated", handlePollUpdate);
// // //       socket.emit("leavePoll", pollId);
// // //     };
// // //   }, [socket, pollId]);
  
// // //   const handleVote = useCallback(() => {
// // //     if (!selectedOption) {
// // //       toast.error('Please select an option to vote');
// // //       return;
// // //     }
    
// // //     if (socket) {
// // //       socket.emit("vote", {
// // //         pollId,
// // //         optionId: selectedOption,
// // //         userId: user?.id || null
// // //       });
// // //     } else {
// // //       toast.warning('Real-time voting not available');
// // //     }
    
// // //     setHasVoted(true);
// // //     toast.success('Your vote has been submitted!');
// // //     trackEvent('Poll', 'vote_submitted', pollId, selectedOption);
// // //   }, [selectedOption, socket, pollId, user]);

// // //   const handlePasswordSubmit = useCallback(() => {
// // //     if (!password.trim()) {
// // //       toast.error('Please enter a password');
// // //       return;
// // //     }
// // //     fetchPoll(password);
// // //     setPassword('');
// // //   }, [password, fetchPoll]);

// // //   const handleSkipPassword = useCallback(() => {
// // //     setPasswordModalOpen(false);
// // //     setPendingPollId(null);
// // //     setPassword('');
// // //     navigate('/polls');
// // //     toast.info('Viewing public polls');
// // //   }, [navigate]);

// // //   const copyPollLink = useCallback(async (pollId) => {
// // //     const link = `${window.location.origin}/polls/${pollId}`;
// // //     try {
// // //       await navigator.clipboard.writeText(link);
// // //       setCopiedPollId(pollId);
// // //       toast.success('Poll link copied to clipboard!');
// // //       setTimeout(() => setCopiedPollId(null), 2000);
// // //       trackEvent('Poll', 'share_link', pollId);
// // //     } catch (err) {
// // //       toast.error('Failed to copy link');
// // //     }
// // //   }, []);

// // //   const openShareModal = useCallback((poll) => {
// // //     setSelectedSharePoll(poll);
// // //     setShareModalOpen(true);
// // //     trackEvent('Poll', 'open_share_modal', poll.id);
// // //   }, []);

// // //   const openAnalytics = useCallback((poll) => {
// // //     setPoll(poll);
// // //     setAnalyticsModalOpen(true);
// // //     trackEvent('Poll', 'open_analytics', poll.id);
// // //   }, []);

// // //   const getInitials = useCallback((username, email) => {
// // //     if (username) return username.substring(0, 2).toUpperCase();
// // //     if (email) return email.substring(0, 2).toUpperCase();
// // //     return 'US';
// // //   }, []);

// // //   const loadMore = useCallback(() => {
// // //     const nextPage = page + 1;
// // //     setPage(nextPage);
// // //     fetchAllPolls(nextPage, true);
// // //     trackEvent('Polls', 'load_more', `page_${nextPage}`);
// // //   }, [page, fetchAllPolls]);

// // //   const getPollStatus = useCallback((poll) => {
// // //     if (poll.expires_at && new Date(poll.expires_at) < new Date()) {
// // //       return 'expired';
// // //     }
// // //     return 'active';
// // //   }, []);

// // //   const getTopChoice = useCallback((options) => {
// // //     if (!options || options.length === 0) return null;
// // //     return options.reduce((prev, current) => 
// // //       (prev.votes_count > current.votes_count) ? prev : current
// // //     );
// // //   }, []);

// // //   // Memoized stats
// // //   const stats = useMemo(() => {
// // //     if (!polls.length) return null;
    
// // //     return {
// // //       totalPolls: polls.length,
// // //       totalVotes: polls.reduce((sum, poll) => sum + poll.totalVotes, 0),
// // //       activePolls: polls.filter(poll => getPollStatus(poll) === 'active').length,
// // //       avgEngagement: Math.round(polls.reduce((sum, poll) => sum + poll.engagementRate, 0) / polls.length)
// // //     };
// // //   }, [polls, getPollStatus]);

// // //   // Nivo chart data transformations
// // //   const nivoBarData = useMemo(() => {
// // //     if (!poll?.options) return [];
// // //     return poll.options.map((option, index) => ({
// // //       id: option.option_text,
// // //       option: option.option_text,
// // //       votes: option.votes_count,
// // //       color: NIVO_COLORS[index % NIVO_COLORS.length]
// // //     }));
// // //   }, [poll]);

// // //   const nivoPieData = useMemo(() => {
// // //     if (!poll?.options) return [];
// // //     return poll.options.map((option, index) => ({
// // //       id: option.option_text,
// // //       label: option.option_text,
// // //       value: option.votes_count,
// // //       color: NIVO_COLORS[index % NIVO_COLORS.length]
// // //     }));
// // //   }, [poll]);

// // //   const nivoLineData = useMemo(() => {
// // //     if (!poll?.options) return [];
// // //     return [{
// // //       id: 'votes',
// // //       data: poll.options.map((option, index) => ({
// // //         x: option.option_text,
// // //         y: option.votes_count
// // //       }))
// // //     }];
// // //   }, [poll]);

// // //   const nivoRadarData = useMemo(() => {
// // //     if (!poll?.options) return [];
// // //     return poll.options.map((option) => ({
// // //       option: option.option_text,
// // //       votes: option.votes_count
// // //     }));
// // //   }, [poll]);

// // //   // Password Protection Modal
// // //   const PasswordModal = () => (
// // //     <Dialog open={passwordModalOpen} onOpenChange={setPasswordModalOpen}>
// // //       <DialogContent className="sm:max-w-md bg-gray-800 border-gray-700 text-white">
// // //         <DialogHeader>
// // //           <DialogTitle className="flex items-center gap-2 text-xl">
// // //             <Shield className="h-5 w-5 text-yellow-400" />
// // //             Password Protected Poll
// // //           </DialogTitle>
// // //           <DialogDescription className="text-gray-400 text-base">
// // //             This poll requires a password to access. Enter the password or skip to view public polls.
// // //           </DialogDescription>
// // //         </DialogHeader>
// // //         <div className="space-y-4 py-4">
// // //           <div className="space-y-2">
// // //             <Label htmlFor="password" className="text-gray-300">Password</Label>
// // //             <Input
// // //               id="password"
// // //               type="password"
// // //               placeholder="Enter poll password"
// // //               value={password}
// // //               onChange={(e) => setPassword(e.target.value)}
// // //               className="bg-gray-700 border-gray-600 text-white placeholder:text-gray-500"
// // //               onKeyPress={(e) => {
// // //                 if (e.key === 'Enter') handlePasswordSubmit();
// // //               }}
// // //               autoFocus
// // //             />
// // //           </div>
// // //         </div>
// // //         <DialogFooter className="flex-col sm:flex-row gap-2">
// // //           <Button
// // //             variant="outline"
// // //             onClick={handleSkipPassword}
// // //             className="w-full sm:w-auto border-gray-600 bg-gray-700 hover:bg-gray-600 text-white"
// // //           >
// // //             <Eye className="mr-2 h-4 w-4" />
// // //             Skip - View Public Polls
// // //           </Button>
// // //           <Button
// // //             onClick={handlePasswordSubmit}
// // //             className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
// // //           >
// // //             <Lock className="mr-2 h-4 w-4" />
// // //             Unlock Poll
// // //           </Button>
// // //         </DialogFooter>
// // //       </DialogContent>
// // //     </Dialog>
// // //   );

// // //   // Enhanced Share Modal
// // //   const ShareModal = () => {
// // //     if (!selectedSharePoll) return null;
    
// // //     const pollUrl = `${window.location.origin}/polls/${selectedSharePoll.id}`;
// // //     const shareText = `Check out this poll: ${selectedSharePoll.question}`;

// // //     return (
// // //       <Dialog open={shareModalOpen} onOpenChange={setShareModalOpen}>
// // //         <DialogContent className="sm:max-w-2xl bg-gray-800 border-gray-700 text-white">
// // //           <DialogHeader>
// // //             <DialogTitle className="text-2xl flex items-center gap-2">
// // //               <Share2 className="h-6 w-6 text-blue-400" />
// // //               Share Poll
// // //             </DialogTitle>
// // //             <DialogDescription className="text-gray-400">
// // //               {selectedSharePoll.question}
// // //             </DialogDescription>
// // //           </DialogHeader>
          
// // //           <Tabs defaultValue="link" className="w-full">
// // //             <TabsList className="grid w-full grid-cols-3 bg-gray-700">
// // //               <TabsTrigger value="link">Link</TabsTrigger>
// // //               <TabsTrigger value="social">Social</TabsTrigger>
// // //               <TabsTrigger value="embed">Embed</TabsTrigger>
// // //             </TabsList>
            
// // //             <TabsContent value="link" className="space-y-4 mt-4">
// // //               <div className="flex gap-2">
// // //                 <Input
// // //                   value={pollUrl}
// // //                   readOnly
// // //                   className="bg-gray-700 border-gray-600 text-white"
// // //                 />
// // //                 <Button
// // //                   onClick={() => copyPollLink(selectedSharePoll.id)}
// // //                   className="bg-blue-600 hover:bg-blue-700"
// // //                 >
// // //                   {copiedPollId === selectedSharePoll.id ? (
// // //                     <CheckCheck className="h-4 w-4" />
// // //                   ) : (
// // //                     <Copy className="h-4 w-4" />
// // //                   )}
// // //                 </Button>
// // //               </div>
              
// // //               <div className="bg-gray-700/50 rounded-lg p-4 border border-gray-600">
// // //                 <div className="flex items-center justify-center">
// // //                   <div className="bg-white p-4 rounded-lg">
// // //                     <QrCode className="h-32 w-32 text-gray-900" />
// // //                   </div>
// // //                 </div>
// // //                 <p className="text-center text-gray-400 text-sm mt-3">
// // //                   Scan QR code to access poll
// // //                 </p>
// // //               </div>
// // //             </TabsContent>
            
// // //             <TabsContent value="social" className="space-y-3 mt-4">
// // //               <Button
// // //                 className="w-full bg-[#1DA1F2] hover:bg-[#1a8cd8] text-white justify-start"
// // //                 onClick={() => {
// // //                   window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(pollUrl)}`);
// // //                   trackEvent('Share', 'twitter', selectedSharePoll.id);
// // //                 }}
// // //               >
// // //                 <Twitter className="mr-2 h-4 w-4" />
// // //                 Share on Twitter
// // //               </Button>
              
// // //               <Button
// // //                 className="w-full bg-[#0077B5] hover:bg-[#006399] text-white justify-start"
// // //                 onClick={() => {
// // //                   window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(pollUrl)}`);
// // //                   trackEvent('Share', 'linkedin', selectedSharePoll.id);
// // //                 }}
// // //               >
// // //                 <Linkedin className="mr-2 h-4 w-4" />
// // //                 Share on LinkedIn
// // //               </Button>
              
// // //               <Button
// // //                 className="w-full bg-[#1877F2] hover:bg-[#145dbf] text-white justify-start"
// // //                 onClick={() => {
// // //                   window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(pollUrl)}`);
// // //                   trackEvent('Share', 'facebook', selectedSharePoll.id);
// // //                 }}
// // //               >
// // //                 <Facebook className="mr-2 h-4 w-4" />
// // //                 Share on Facebook
// // //               </Button>
              
// // //               <Button
// // //                 className="w-full bg-gray-700 hover:bg-gray-600 text-white justify-start"
// // //                 onClick={() => {
// // //                   if (navigator.share) {
// // //                     navigator.share({
// // //                       title: selectedSharePoll.question,
// // //                       url: pollUrl
// // //                     });
// // //                   }
// // //                   trackEvent('Share', 'native', selectedSharePoll.id);
// // //                 }}
// // //               >
// // //                 <ExternalLink className="mr-2 h-4 w-4" />
// // //                 More Options
// // //               </Button>
// // //             </TabsContent>
            
// // //             <TabsContent value="embed" className="space-y-4 mt-4">
// // //               <div className="space-y-2">
// // //                 <Label className="text-gray-300">Embed Code</Label>
// // //                 <textarea
// // //                   value={`<iframe src="${pollUrl}/embed" width="100%" height="400" frameborder="0"></iframe>`}
// // //                   readOnly
// // //                   className="w-full h-24 bg-gray-700 border-gray-600 text-white rounded-md p-3 font-mono text-sm"
// // //                 />
// // //               </div>
// // //               <Button
// // //                 className="w-full bg-blue-600 hover:bg-blue-700"
// // //                 onClick={() => {
// // //                   navigator.clipboard.writeText(`<iframe src="${pollUrl}/embed" width="100%" height="400" frameborder="0"></iframe>`);
// // //                   toast.success('Embed code copied!');
// // //                 }}
// // //               >
// // //                 <Copy className="mr-2 h-4 w-4" />
// // //                 Copy Embed Code
// // //               </Button>
// // //             </TabsContent>
// // //           </Tabs>
// // //         </DialogContent>
// // //       </Dialog>
// // //     );
// // //   };

// // //   // Professional Analytics Dashboard Modal
// // //   const AnalyticsModal = () => {
// // //     if (!poll) return null;

// // //     return (
// // //       <Dialog open={analyticsModalOpen} onOpenChange={setAnalyticsModalOpen}>
// // //         <DialogContent className="max-w-7xl max-h-[90vh] overflow-y-auto bg-gray-900 border-gray-700 text-white">
// // //           <DialogHeader>
// // //             <DialogTitle className="text-3xl flex items-center gap-3">
// // //               <Activity className="h-8 w-8 text-blue-400" />
// // //               Advanced Analytics Dashboard
// // //             </DialogTitle>
// // //             <DialogDescription className="text-gray-400 text-lg">
// // //               {poll.question}
// // //             </DialogDescription>
// // //           </DialogHeader>

// // //           <div className="space-y-6 mt-6">
// // //             {/* Key Metrics */}
// // //             <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
// // //               <Card className="bg-gray-800 border-gray-700">
// // //                 <CardContent className="p-4">
// // //                   <div className="flex items-center justify-between">
// // //                     <div>
// // //                       <p className="text-gray-400 text-sm">Total Votes</p>
// // //                       <p className="text-3xl font-bold text-white">{poll.totalVotes}</p>
// // //                     </div>
// // //                     <Users className="h-8 w-8 text-blue-400" />
// // //                   </div>
// // //                 </CardContent>
// // //               </Card>
              
// // //               <Card className="bg-gray-800 border-gray-700">
// // //                 <CardContent className="p-4">
// // //                   <div className="flex items-center justify-between">
// // //                     <div>
// // //                       <p className="text-gray-400 text-sm">Options</p>
// // //                       <p className="text-3xl font-bold text-white">{poll.options?.length || 0}</p>
// // //                     </div>
// // //                     <Vote className="h-8 w-8 text-purple-400" />
// // //                   </div>
// // //                 </CardContent>
// // //               </Card>
              
// // //               <Card className="bg-gray-800 border-gray-700">
// // //                 <CardContent className="p-4">
// // //                   <div className="flex items-center justify-between">
// // //                     <div>
// // //                       <p className="text-gray-400 text-sm">Top Choice</p>
// // //                       <p className="text-xl font-bold text-white truncate">
// // //                         {getTopChoice(poll.options)?.option_text || 'N/A'}
// // //                       </p>
// // //                     </div>
// // //                     <Trophy className="h-8 w-8 text-yellow-400" />
// // //                   </div>
// // //                 </CardContent>
// // //               </Card>
              
// // //               <Card className="bg-gray-800 border-gray-700">
// // //                 <CardContent className="p-4">
// // //                   <div className="flex items-center justify-between">
// // //                     <div>
// // //                       <p className="text-gray-400 text-sm">Status</p>
// // //                       <Badge className={isExpired ? 'bg-red-500/20 text-red-300' : 'bg-green-500/20 text-green-300'}>
// // //                         {isExpired ? 'Expired' : 'Active'}
// // //                       </Badge>
// // //                     </div>
// // //                     <Clock className="h-8 w-8 text-green-400" />
// // //                   </div>
// // //                 </CardContent>
// // //               </Card>
// // //             </div>

// // //             {/* Chart Selector */}
// // //             <div className="flex flex-wrap gap-2 justify-center">
// // //               {[
// // //                 { key: 'bar', icon: BarChart4, label: 'Bar Chart' },
// // //                 { key: 'pie', icon: PieChartIcon, label: 'Pie Chart' },
// // //                 { key: 'line', icon: LineChartIcon, label: 'Line Chart' },
// // //                 { key: 'radar', icon: Activity, label: 'Radar Chart' }
// // //               ].map(({ key, icon: Icon, label }) => (
// // //                 <Button
// // //                   key={key}
// // //                   variant={activeChart === key ? "default" : "outline"}
// // //                   onClick={() => setActiveChart(key)}
// // //                   className={`flex items-center gap-2 ${
// // //                     activeChart === key 
// // //                       ? 'bg-blue-600 text-white hover:bg-blue-700' 
// // //                       : 'bg-gray-800 text-gray-300 border-gray-600 hover:bg-gray-700'
// // //                   }`}
// // //                 >
// // //                   <Icon className="h-4 w-4" />
// // //                   {label}
// // //                 </Button>
// // //               ))}
// // //             </div>

// // //             {/* Nivo Charts */}
// // //             <Card className="bg-gray-800 border-gray-700">
// // //               <CardContent className="p-6">
// // //                 <div style={{ height: '500px' }}>
// // //                   {activeChart === 'bar' && (
// // //                     <ResponsiveBar
// // //                       data={nivoBarData}
// // //                       keys={['votes']}
// // //                       indexBy="option"
// // //                       margin={{ top: 50, right: 130, bottom: 100, left: 60 }}
// // //                       padding={0.3}
// // //                       valueScale={{ type: 'linear' }}
// // //                       colors={{ scheme: 'nivo' }}
// // //                       borderRadius={8}
// // //                       borderColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
// // //                       axisTop={null}
// // //                       axisRight={null}
// // //                       axisBottom={{
// // //                         tickSize: 5,
// // //                         tickPadding: 5,
// // //                         tickRotation: -45,
// // //                         legend: 'Options',
// // //                         legendPosition: 'middle',
// // //                         legendOffset: 70
// // //                       }}
// // //                       axisLeft={{
// // //                         tickSize: 5,
// // //                         tickPadding: 5,
// // //                         tickRotation: 0,
// // //                         legend: 'Votes',
// // //                         legendPosition: 'middle',
// // //                         legendOffset: -50
// // //                       }}
// // //                       labelSkipWidth={12}
// // //                       labelSkipHeight={12}
// // //                       labelTextColor="#ffffff"
// // //                       animate={true}
// // //                       motionConfig="gentle"
// // //                       theme={{
// // //                         axis: {
// // //                           ticks: { text: { fill: '#9CA3AF' } },
// // //                           legend: { text: { fill: '#D1D5DB' } }
// // //                         },
// // //                         grid: { line: { stroke: '#374151' } },
// // //                         tooltip: {
// // //                           container: {
// // //                             background: '#1F2937',
// // //                             color: '#ffffff',
// // //                             fontSize: 14,
// // //                             borderRadius: 8,
// // //                             boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)'
// // //                           }
// // //                         }
// // //                       }}
// // //                     />
// // //                   )}

// // //                   {activeChart === 'pie' && (
// // //                     <ResponsivePie
// // //                       data={nivoPieData}
// // //                       margin={{ top: 40, right: 200, bottom: 40, left: 80 }}
// // //                       innerRadius={0.5}
// // //                       padAngle={2}
// // //                       cornerRadius={8}
// // //                       activeOuterRadiusOffset={8}
// // //                       colors={{ scheme: 'nivo' }}
// // //                       borderWidth={2}
// // //                       borderColor={{ from: 'color', modifiers: [['darker', 0.2]] }}
// // //                       arcLinkLabelsSkipAngle={10}
// // //                       arcLinkLabelsTextColor="#D1D5DB"
// // //                       arcLinkLabelsThickness={2}
// // //                       arcLinkLabelsColor={{ from: 'color' }}
// // //                       arcLabelsSkipAngle={10}
// // //                       arcLabelsTextColor="#ffffff"
// // //                       legends={[
// // //                         {
// // //                           anchor: 'right',
// // //                           direction: 'column',
// // //                           justify: false,
// // //                           translateX: 140,
// // //                           translateY: 0,
// // //                           itemsSpacing: 12,
// // //                           itemWidth: 120,
// // //                           itemHeight: 20,
// // //                           itemTextColor: '#D1D5DB',
// // //                           itemDirection: 'left-to-right',
// // //                           itemOpacity: 1,
// // //                           symbolSize: 16,
// // //                           symbolShape: 'circle'
// // //                         }
// // //                       ]}
// // //                       animate={true}
// // //                       motionConfig="gentle"
// // //                       theme={{
// // //                         tooltip: {
// // //                           container: {
// // //                             background: '#1F2937',
// // //                             color: '#ffffff',
// // //                             fontSize: 14,
// // //                             borderRadius: 8,
// // //                             boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)'
// // //                           }
// // //                         }
// // //                       }}
// // //                     />
// // //                   )}

// // //                   {activeChart === 'line' && (
// // //                     <ResponsiveLine
// // //                       data={nivoLineData}
// // //                       margin={{ top: 50, right: 110, bottom: 100, left: 60 }}
// // //                       xScale={{ type: 'point' }}
// // //                       yScale={{ type: 'linear', min: 'auto', max: 'auto', stacked: false }}
// // //                       curve="cardinal"
// // //                       axisTop={null}
// // //                       axisRight={null}
// // //                       axisBottom={{
// // //                         tickSize: 5,
// // //                         tickPadding: 5,
// // //                         tickRotation: -45,
// // //                         legend: 'Options',
// // //                         legendOffset: 70,
// // //                         legendPosition: 'middle'
// // //                       }}
// // //                       axisLeft={{
// // //                         tickSize: 5,
// // //                         tickPadding: 5,
// // //                         tickRotation: 0,
// // //                         legend: 'Votes',
// // //                         legendOffset: -50,
// // //                         legendPosition: 'middle'
// // //                       }}
// // //                       pointSize={12}
// // //                       pointColor={{ theme: 'background' }}
// // //                       pointBorderWidth={3}
// // //                       pointBorderColor={{ from: 'serieColor' }}
// // //                       pointLabelYOffset={-12}
// // //                       useMesh={true}
// // //                       colors={{ scheme: 'nivo' }}
// // //                       lineWidth={4}
// // //                       enableGridX={false}
// // //                       animate={true}
// // //                       motionConfig="gentle"
// // //                       theme={{
// // //                         axis: {
// // //                           ticks: { text: { fill: '#9CA3AF' } },
// // //                           legend: { text: { fill: '#D1D5DB' } }
// // //                         },
// // //                         grid: { line: { stroke: '#374151' } },
// // //                         tooltip: {
// // //                           container: {
// // //                             background: '#1F2937',
// // //                             color: '#ffffff',
// // //                             fontSize: 14,
// // //                             borderRadius: 8,
// // //                             boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)'
// // //                           }
// // //                         }
// // //                       }}
// // //                     />
// // //                   )}

// // //                   {activeChart === 'radar' && (
// // //                     <ResponsiveRadar
// // //                       data={nivoRadarData}
// // //                       keys={['votes']}
// // //                       indexBy="option"
// // //                       maxValue="auto"
// // //                       margin={{ top: 70, right: 80, bottom: 70, left: 80 }}
// // //                       curve="linearClosed"
// // //                       borderWidth={3}
// // //                       borderColor={{ from: 'color' }}
// // //                       gridLevels={5}
// // //                       gridShape="circular"
// // //                       gridLabelOffset={36}
// // //                       enableDots={true}
// // //                       dotSize={10}
// // //                       dotColor={{ theme: 'background' }}
// // //                       dotBorderWidth={2}
// // //                       dotBorderColor={{ from: 'color' }}
// // //                       colors={{ scheme: 'nivo' }}
// // //                       fillOpacity={0.25}
// // //                       blendMode="multiply"
// // //                       animate={true}
// // //                       motionConfig="gentle"
// // //                       theme={{
// // //                         axis: {
// // //                           ticks: { text: { fill: '#9CA3AF' } },
// // //                           legend: { text: { fill: '#D1D5DB' } }
// // //                         },
// // //                         grid: { line: { stroke: '#374151' } },
// // //                         tooltip: {
// // //                           container: {
// // //                             background: '#1F2937',
// // //                             color: '#ffffff',
// // //                             fontSize: 14,
// // //                             borderRadius: 8,
// // //                             boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)'
// // //                           }
// // //                         }
// // //                       }}
// // //                     />
// // //                   )}
// // //                 </div>
// // //               </CardContent>
// // //             </Card>

// // //             {/* Detailed Breakdown */}
// // //             <Card className="bg-gray-800 border-gray-700">
// // //               <CardHeader>
// // //                 <CardTitle className="text-xl">Detailed Breakdown</CardTitle>
// // //               </CardHeader>
// // //               <CardContent>
// // //                 <div className="space-y-4">
// // //                   {poll.options?.map((option, index) => {
// // //                     const percentage = poll.totalVotes > 0 
// // //                       ? Math.round((option.votes_count / poll.totalVotes) * 100) 
// // //                       : 0;
// // //                     return (
// // //                       <div key={option.id} className="space-y-2">
// // //                         <div className="flex justify-between items-center">
// // //                           <div className="flex items-center gap-3">
// // //                             <div 
// // //                               className="w-4 h-4 rounded-full" 
// // //                               style={{ backgroundColor: NIVO_COLORS[index % NIVO_COLORS.length] }}
// // //                             />
// // //                             <span className="text-white font-medium">{option.option_text}</span>
// // //                           </div>
// // //                           <div className="flex items-center gap-4">
// // //                             <span className="text-blue-400 font-bold text-lg">{percentage}%</span>
// // //                             <span className="text-gray-400">{option.votes_count} votes</span>
// // //                           </div>
// // //                         </div>
// // //                         <Progress value={percentage} className="h-2 bg-gray-700" />
// // //                       </div>
// // //                     );
// // //                   })}
// // //                 </div>
// // //               </CardContent>
// // //             </Card>

// // //             {/* Export Options */}
// // //             <div className="flex justify-end gap-3">
// // //               <Button
// // //                 variant="outline"
// // //                 className="border-gray-600 bg-gray-800 hover:bg-gray-700 text-white"
// // //                 onClick={() => {
// // //                   toast.info('PDF export coming soon!');
// // //                   trackEvent('Analytics', 'export_pdf', poll.id);
// // //                 }}
// // //               >
// // //                 <Download className="mr-2 h-4 w-4" />
// // //                 Export as PDF
// // //               </Button>
// // //               <Button
// // //                 variant="outline"
// // //                 className="border-gray-600 bg-gray-800 hover:bg-gray-700 text-white"
// // //                 onClick={() => {
// // //                   toast.info('Image export coming soon!');
// // //                   trackEvent('Analytics', 'export_image', poll.id);
// // //                 }}
// // //               >
// // //                 <Download className="mr-2 h-4 w-4" />
// // //                 Export as Image
// // //               </Button>
// // //             </div>
// // //           </div>
// // //         </DialogContent>
// // //       </Dialog>
// // //     );
// // //   };

// // //   // Loading skeleton
// // //   if (loading && polls.length === 0) {
// // //     return (
// // //       <div className="min-h-screen bg-gray-900 p-8">
// // //         <div className="max-w-7xl mx-auto">
// // //           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
// // //             {[1, 2, 3, 4].map(i => (
// // //               <Card key={i} className="bg-gray-800 border-gray-700">
// // //                 <CardContent className="p-6">
// // //                   <Skeleton className="h-4 w-20 mb-2 bg-gray-700" />
// // //                   <Skeleton className="h-8 w-16 bg-gray-700" />
// // //                 </CardContent>
// // //               </Card>
// // //             ))}
// // //           </div>
// // //           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
// // //             {[1, 2, 3, 4, 5, 6].map(i => (
// // //               <Card key={i} className="bg-gray-800 border-gray-700">
// // //                 <CardHeader>
// // //                   <Skeleton className="h-6 w-3/4 mb-2 bg-gray-700" />
// // //                   <Skeleton className="h-4 w-1/2 bg-gray-700" />
// // //                 </CardHeader>
// // //                 <CardContent className="space-y-3">
// // //                   <Skeleton className="h-4 w-full bg-gray-700" />
// // //                   <Skeleton className="h-4 w-5/6 bg-gray-700" />
// // //                 </CardContent>
// // //                 <CardFooter>
// // //                   <Skeleton className="h-10 w-full bg-gray-700" />
// // //                 </CardFooter>
// // //               </Card>
// // //             ))}
// // //           </div>
// // //         </div>
// // //       </div>
// // //     );
// // //   }

// // //   // Error state
// // //   if (error) {
// // //     return (
// // //       <div className="min-h-screen bg-gray-900 flex items-center justify-center p-8">
// // //         <Card className="bg-gray-800 border-gray-700 max-w-md text-center">
// // //           <CardContent className="pt-6">
// // //             <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
// // //               <AlertCircle className="h-8 w-8 text-red-400" />
// // //             </div>
// // //             <h3 className="text-xl font-semibold text-white mb-2">Unable to Load Polls</h3>
// // //             <p className="text-gray-400 mb-4">{error}</p>
// // //             <Button 
// // //               onClick={() => pollId ? fetchPoll() : fetchAllPolls()}
// // //               className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
// // //             >
// // //               Try Again
// // //             </Button>
// // //           </CardContent>
// // //         </Card>
// // //       </div>
// // //     );
// // //   }

// // //   // Single poll view
// // //   if (pollId && poll) {
// // //     if (isExpired) {
// // //       return (
// // //         <div className="min-h-screen bg-gray-900 p-4">
// // //           <div className="max-w-6xl mx-auto">
// // //             <Card className="bg-gray-800 border-gray-700">
// // //               <CardHeader className="text-center">
// // //                 <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
// // //                   {poll.question}
// // //                 </CardTitle>
// // //                 <div className="bg-red-500/20 border border-red-500/30 text-red-200 p-4 rounded-xl mt-4 max-w-md mx-auto">
// // //                   <div className="flex items-center justify-center gap-2">
// // //                     <Clock className="h-5 w-5" />
// // //                     This poll has expired and is no longer accepting votes.
// // //                   </div>
// // //                 </div>
// // //               </CardHeader>
// // //               <CardContent className="pt-6">
// // //                 <h3 className="text-2xl font-semibold text-white text-center mb-8">Final Results</h3>
                
// // //                 {/* Chart Type Selector */}
// // //                 <div className="flex flex-wrap justify-center gap-2 mb-8">
// // //                   {[
// // //                     { key: 'bar', icon: BarChart4, label: 'Bar' },
// // //                     { key: 'pie', icon: PieChartIcon, label: 'Pie' },
// // //                     { key: 'line', icon: LineChartIcon, label: 'Line' },
// // //                     { key: 'radar', icon: Activity, label: 'Radar' }
// // //                   ].map(({ key, icon: Icon, label }) => (
// // //                     <Button
// // //                       key={key}
// // //                       variant={activeChart === key ? "default" : "outline"}
// // //                       onClick={() => setActiveChart(key)}
// // //                       className={`flex items-center gap-2 ${
// // //                         activeChart === key 
// // //                           ? 'bg-blue-600 text-white hover:bg-blue-700' 
// // //                           : 'bg-gray-700 text-gray-300 border-gray-600 hover:bg-gray-600'
// // //                       }`}
// // //                     >
// // //                       <Icon className="h-4 w-4" />
// // //                       {label}
// // //                     </Button>
// // //                   ))}
// // //                 </div>

// // //                 {/* Nivo Charts */}
// // //                 <div style={{ height: '500px' }}>
// // //                   {activeChart === 'bar' && (
// // //                     <ResponsiveBar
// // //                       data={nivoBarData}
// // //                       keys={['votes']}
// // //                       indexBy="option"
// // //                       margin={{ top: 50, right: 130, bottom: 100, left: 60 }}
// // //                       padding={0.3}
// // //                       colors={{ scheme: 'nivo' }}
// // //                       borderRadius={8}
// // //                       axisBottom={{
// // //                         tickRotation: -45,
// // //                         legend: 'Options',
// // //                         legendPosition: 'middle',
// // //                         legendOffset: 70
// // //                       }}
// // //                       axisLeft={{
// // //                         legend: 'Votes',
// // //                         legendPosition: 'middle',
// // //                         legendOffset: -50
// // //                       }}
// // //                       labelTextColor="#ffffff"
// // //                       animate={true}
// // //                       theme={{
// // //                         axis: {
// // //                           ticks: { text: { fill: '#9CA3AF' } },
// // //                           legend: { text: { fill: '#D1D5DB' } }
// // //                         },
// // //                         grid: { line: { stroke: '#374151' } },
// // //                         tooltip: {
// // //                           container: {
// // //                             background: '#1F2937',
// // //                             color: '#ffffff',
// // //                             borderRadius: 8
// // //                           }
// // //                         }
// // //                       }}
// // //                     />
// // //                   )}

// // //                   {activeChart === 'pie' && (
// // //                     <ResponsivePie
// // //                       data={nivoPieData}
// // //                       margin={{ top: 40, right: 200, bottom: 40, left: 80 }}
// // //                       innerRadius={0.5}
// // //                       padAngle={2}
// // //                       cornerRadius={8}
// // //                       colors={{ scheme: 'nivo' }}
// // //                       arcLabelsTextColor="#ffffff"
// // //                       legends={[
// // //                         {
// // //                           anchor: 'right',
// // //                           direction: 'column',
// // //                           translateX: 140,
// // //                           itemTextColor: '#D1D5DB',
// // //                           itemWidth: 120,
// // //                           itemHeight: 20
// // //                         }
// // //                       ]}
// // //                       theme={{
// // //                         tooltip: {
// // //                           container: { background: '#1F2937', color: '#ffffff', borderRadius: 8 }
// // //                         }
// // //                       }}
// // //                     />
// // //                   )}

// // //                   {activeChart === 'line' && (
// // //                     <ResponsiveLine
// // //                       data={nivoLineData}
// // //                       margin={{ top: 50, right: 110, bottom: 100, left: 60 }}
// // //                       xScale={{ type: 'point' }}
// // //                       yScale={{ type: 'linear' }}
// // //                       curve="cardinal"
// // //                       axisBottom={{
// // //                         tickRotation: -45,
// // //                         legend: 'Options',
// // //                         legendOffset: 70,
// // //                         legendPosition: 'middle'
// // //                       }}
// // //                       axisLeft={{
// // //                         legend: 'Votes',
// // //                         legendOffset: -50,
// // //                         legendPosition: 'middle'
// // //                       }}
// // //                       pointSize={12}
// // //                       colors={{ scheme: 'nivo' }}
// // //                       lineWidth={4}
// // //                       theme={{
// // //                         axis: {
// // //                           ticks: { text: { fill: '#9CA3AF' } },
// // //                           legend: { text: { fill: '#D1D5DB' } }
// // //                         },
// // //                         grid: { line: { stroke: '#374151' } },
// // //                         tooltip: {
// // //                           container: { background: '#1F2937', color: '#ffffff', borderRadius: 8 }
// // //                         }
// // //                       }}
// // //                     />
// // //                   )}

// // //                   {activeChart === 'radar' && (
// // //                     <ResponsiveRadar
// // //                       data={nivoRadarData}
// // //                       keys={['votes']}
// // //                       indexBy="option"
// // //                       margin={{ top: 70, right: 80, bottom: 70, left: 80 }}
// // //                       borderWidth={3}
// // //                       colors={{ scheme: 'nivo' }}
// // //                       gridLevels={5}
// // //                       theme={{
// // //                         grid: { line: { stroke: '#374151' } },
// // //                         tooltip: {
// // //                           container: { background: '#1F2937', color: '#ffffff', borderRadius: 8 }
// // //                         }
// // //                       }}
// // //                     />
// // //                   )}
// // //                 </div>

// // //                 {/* Detailed Results */}
// // //                 <div className="mt-8 space-y-4">
// // //                   <h4 className="text-xl font-semibold text-white text-center">Detailed Breakdown</h4>
// // //                   {poll.options.map((option, index) => {
// // //                     const percentage = poll.totalVotes > 0 
// // //                       ? Math.round((option.votes_count / poll.totalVotes) * 100) 
// // //                       : 0;
// // //                     return (
// // //                       <div key={option.id} className="bg-gray-700/50 rounded-xl p-4 border border-gray-600">
// // //                         <div className="flex justify-between items-center mb-2">
// // //                           <span className="text-white font-medium text-lg">{option.option_text}</span>
// // //                           <div className="flex items-center gap-3">
// // //                             <span className="text-blue-400 font-bold text-lg">{percentage}%</span>
// // //                             <span className="text-gray-400 text-sm">({option.votes_count} votes)</span>
// // //                           </div>
// // //                         </div>
// // //                         <Progress value={percentage} className="h-3 bg-gray-600" />
// // //                       </div>
// // //                     );
// // //                   })}
// // //                 </div>

// // //                 {/* Action Buttons */}
// // //                 <div className="mt-8 flex justify-center gap-3">
// // //                   <Button
// // //                     onClick={() => openAnalytics(poll)}
// // //                     className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
// // //                   >
// // //                     <Maximize2 className="mr-2 h-4 w-4" />
// // //                     Full Analytics
// // //                   </Button>
// // //                   <Button
// // //                     onClick={() => openShareModal(poll)}
// // //                     variant="outline"
// // //                     className="border-gray-600 bg-gray-700 hover:bg-gray-600 text-white"
// // //                   >
// // //                     <Share2 className="mr-2 h-4 w-4" />
// // //                     Share Results
// // //                   </Button>
// // //                 </div>
// // //               </CardContent>
// // //             </Card>
// // //           </div>
// // //         </div>
// // //       );
// // //     }

// // //     // Active poll view
// // //     return (
// // //       <div className="min-h-screen bg-gray-900 p-4">
// // //         <div className="max-w-4xl mx-auto">
// // //           <Card className="bg-gray-800 border-gray-700">
// // //             <CardHeader className="text-center">
// // //               <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
// // //                 {poll.question}
// // //               </CardTitle>
// // //               {poll.description && (
// // //                 <CardDescription className="text-gray-300 text-lg mt-2">
// // //                   {poll.description}
// // //                 </CardDescription>
// // //               )}
// // //               {poll.profiles && (
// // //                 <div className="flex items-center justify-center gap-2 mt-4 text-gray-400">
// // //                   <Avatar className="h-6 w-6">
// // //                     <AvatarImage src={poll.profiles.avatar_url} />
// // //                     <AvatarFallback className="text-xs">
// // //                       {getInitials(poll.profiles.username)}
// // //                     </AvatarFallback>
// // //                   </Avatar>
// // //                   <span>Created by {poll.profiles.username}</span>
// // //                 </div>
// // //               )}
// // //             </CardHeader>
// // //             <CardContent className="pt-6">
// // //               {!hasVoted ? (
// // //                 <div className="space-y-4">
// // //                   <h3 className="text-xl font-semibold text-white text-center mb-6">Cast Your Vote</h3>
// // //                   {poll.options.map((option) => (
// // //                     <div 
// // //                       key={option.id} 
// // //                       className={`flex items-center space-x-4 p-4 border-2 rounded-xl transition-all duration-200 cursor-pointer ${
// // //                         selectedOption === option.id 
// // //                           ? 'border-blue-500 bg-blue-500/10 shadow-lg shadow-blue-500/20' 
// // //                           : 'border-gray-600 bg-gray-700/50 hover:border-blue-400 hover:bg-blue-500/5'
// // //                       }`}
// // //                       onClick={() => setSelectedOption(option.id)}
// // //                     >
// // //                       <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
// // //                         selectedOption === option.id 
// // //                           ? 'border-blue-500 bg-blue-500' 
// // //                           : 'border-gray-500 bg-transparent'
// // //                       }`}>
// // //                         {selectedOption === option.id && (
// // //                           <div className="w-2 h-2 rounded-full bg-white"></div>
// // //                         )}
// // //                       </div>
// // //                       <label className="text-white text-lg font-medium flex-1 cursor-pointer">
// // //                         {option.option_text}
// // //                       </label>
// // //                     </div>
// // //                   ))}
// // //                   <Button 
// // //                     onClick={handleVote} 
// // //                     disabled={!selectedOption}
// // //                     className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-6 text-lg font-semibold rounded-xl mt-6 disabled:opacity-50"
// // //                     size="lg"
// // //                   >
// // //                     <Vote className="mr-3 h-5 w-5" />
// // //                     Submit Vote
// // //                   </Button>
// // //                 </div>
// // //               ) : (
// // //                 <div className="space-y-6">
// // //                   <div className="text-center">
// // //                     <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
// // //                       <CheckCheck className="h-8 w-8 text-green-400" />
// // //                     </div>
// // //                     <h3 className="text-2xl font-semibold text-white mb-2">Thank You for Voting!</h3>
// // //                     {userVote && (
// // //                       <p className="text-gray-300 text-lg">
// // //                         You voted for: <span className="text-blue-400 font-semibold">
// // //                           {poll.options.find(opt => opt.id === userVote.option_id)?.option_text}
// // //                         </span>
// // //                       </p>
// // //                     )}
// // //                   </div>
                  
// // //                   <div className="bg-gray-700/50 rounded-xl p-6 border border-gray-600">
// // //                     <h4 className="text-xl font-semibold text-white text-center mb-6">Live Results</h4>
                    
// // //                     {/* Chart Selector */}
// // //                     <div className="flex flex-wrap justify-center gap-2 mb-6">
// // //                       {[
// // //                         { key: 'bar', icon: BarChart4, label: 'Bar' },
// // //                         { key: 'pie', icon: PieChartIcon, label: 'Pie' },
// // //                         { key: 'radar', icon: Activity, label: 'Radar' }
// // //                       ].map(({ key, icon: Icon, label }) => (
// // //                         <Button
// // //                           key={key}
// // //                           variant={activeChart === key ? "default" : "outline"}
// // //                           onClick={() => setActiveChart(key)}
// // //                           size="sm"
// // //                           className={`flex items-center gap-2 ${
// // //                             activeChart === key 
// // //                               ? 'bg-blue-600 text-white hover:bg-blue-700' 
// // //                               : 'bg-gray-700 text-gray-300 border-gray-600 hover:bg-gray-600'
// // //                           }`}
// // //                         >
// // //                           <Icon className="h-4 w-4" />
// // //                           {label}
// // //                         </Button>
// // //                       ))}
// // //                     </div>

// // //                     {/* Chart */}
// // //                     <div style={{ height: '400px' }} className="mb-6">
// // //                       {activeChart === 'bar' && (
// // //                         <ResponsiveBar
// // //                           data={nivoBarData}
// // //                           keys={['votes']}
// // //                           indexBy="option"
// // //                           margin={{ top: 20, right: 20, bottom: 80, left: 50 }}
// // //                           colors={{ scheme: 'nivo' }}
// // //                           borderRadius={6}
// // //                           axisBottom={{
// // //                             tickRotation: -45
// // //                           }}
// // //                           labelTextColor="#ffffff"
// // //                           theme={{
// // //                             axis: { ticks: { text: { fill: '#9CA3AF' } } },
// // //                             grid: { line: { stroke: '#374151' } },
// // //                             tooltip: {
// // //                               container: { background: '#1F2937', color: '#ffffff', borderRadius: 8 }
// // //                             }
// // //                           }}
// // //                         />
// // //                       )}
                      
// // //                       {activeChart === 'pie' && (
// // //                         <ResponsivePie
// // //                           data={nivoPieData}
// // //                           margin={{ top: 20, right: 120, bottom: 20, left: 20 }}
// // //                           innerRadius={0.5}
// // //                           colors={{ scheme: 'nivo' }}
// // //                           arcLabelsTextColor="#ffffff"
// // //                           legends={[
// // //                             {
// // //                               anchor: 'right',
// // //                               direction: 'column',
// // //                               translateX: 100,
// // //                               itemTextColor: '#D1D5DB',
// // //                               itemWidth: 100,
// // //                               itemHeight: 18
// // //                             }
// // //                           ]}
// // //                           theme={{
// // //                             tooltip: {
// // //                               container: { background: '#1F2937', color: '#ffffff', borderRadius: 8 }
// // //                             }
// // //                           }}
// // //                         />
// // //                       )}

// // //                       {activeChart === 'radar' && (
// // //                         <ResponsiveRadar
// // //                           data={nivoRadarData}
// // //                           keys={['votes']}
// // //                           indexBy="option"
// // //                           margin={{ top: 50, right: 50, bottom: 50, left: 50 }}
// // //                           colors={{ scheme: 'nivo' }}
// // //                           borderWidth={3}
// // //                           theme={{
// // //                             grid: { line: { stroke: '#374151' } },
// // //                             tooltip: {
// // //                               container: { background: '#1F2937', color: '#ffffff', borderRadius: 8 }
// // //                             }
// // //                           }}
// // //                         />
// // //                       )}
// // //                     </div>

// // //                     {/* Detailed Results */}
// // //                     <div className="space-y-3">
// // //                       {poll.options.map((option) => {
// // //                         const percentage = poll.totalVotes > 0 
// // //                           ? Math.round((option.votes_count / poll.totalVotes) * 100) 
// // //                           : 0;
// // //                         const isUserVote = userVote && userVote.option_id === option.id;
                        
// // //                         return (
// // //                           <div key={option.id} className="space-y-2">
// // //                             <div className="flex justify-between items-center">
// // //                               <div className="flex items-center gap-3 flex-1">
// // //                                 <span className="text-white font-medium">
// // //                                   {option.option_text}
// // //                                 </span>
// // //                                 {isUserVote && (
// // //                                   <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30 text-xs">
// // //                                     Your Vote
// // //                                   </Badge>
// // //                                 )}
// // //                               </div>
// // //                               <span className="text-blue-400 font-bold text-lg bg-blue-500/20 px-3 py-1 rounded-full min-w-16 text-center">
// // //   {percentage}%
// // // </span>
// // //                             </div>
// // //                             <Progress 
// // //                               value={percentage} 
// // //                               className={`h-3 bg-gray-600 ${
// // //                                 isUserVote ? '!bg-blue-500/50' : ''
// // //                               }`}
// // //                             />
// // //                             <div className="flex justify-between text-sm text-gray-400">
// // //                               <span>{option.votes_count} votes</span>
// // //                               <span>{percentage}% of total</span>
// // //                             </div>
// // //                           </div>
// // //                         );
// // //                       })}
// // //                     </div>
                    
// // //                     {poll.totalVotes > 0 && (
// // //                       <div className="mt-6 p-4 bg-gray-600/30 rounded-lg border border-gray-500">
// // //                         <div className="flex items-center justify-between">
// // //                           <span className="text-gray-300">Total Votes Cast:</span>
// // //                           <span className="text-white font-bold text-lg">{poll.totalVotes}</span>
// // //                         </div>
// // //                       </div>
// // //                     )}
// // //                   </div>

// // //                   {/* Action Buttons */}
// // //                   <div className="flex flex-col sm:flex-row gap-3 justify-center">
// // //                     <Button
// // //                       onClick={() => openAnalytics(poll)}
// // //                       className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
// // //                     >
// // //                       <Activity className="mr-2 h-4 w-4" />
// // //                       Advanced Analytics
// // //                     </Button>
// // //                     <Button
// // //                       onClick={() => openShareModal(poll)}
// // //                       variant="outline"
// // //                       className="border-gray-600 bg-gray-700 hover:bg-gray-600 text-white"
// // //                     >
// // //                       <Share2 className="mr-2 h-4 w-4" />
// // //                       Share Results
// // //                     </Button>
// // //                   </div>
// // //                 </div>
// // //               )}
// // //             </CardContent>
// // //           </Card>
// // //         </div>
// // //       </div>
// // //     );
// // //   }

// // //   // All polls list view
// // //   if (!pollId) {
// // //     if (polls.length === 0) {
// // //       return (
// // //         <div className="min-h-screen bg-gray-900 flex items-center justify-center p-8">
// // //           <div className="text-center max-w-2xl">
// // //             <div className="w-32 h-32 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl">
// // //               <Vote className="h-16 w-16 text-blue-400" />
// // //             </div>
// // //             <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent mb-6">
// // //               Start the Conversation
// // //             </h1>
// // //             <p className="text-xl text-gray-300 mb-8 leading-relaxed">
// // //               Create your first interactive poll and engage your audience with real-time voting, analytics, and beautiful visualizations.
// // //             </p>
// // //             <Button 
// // //               onClick={() => {
// // //                 navigate('/create-poll');
// // //                 trackEvent('Navigation', 'create_first_poll');
// // //               }}
// // //               className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-6 text-lg rounded-xl shadow-2xl hover:shadow-3xl transition-all duration-300"
// // //               size="lg"
// // //             >
// // //               <Plus className="mr-3 h-5 w-5" />
// // //               Create First Poll
// // //             </Button>
// // //           </div>
// // //         </div>
// // //       );
// // //     }
    
// // //     return (
// // //       <TooltipProvider>
// // //         <div className="min-h-screen bg-gray-900 text-white p-4">
// // //           <div className="max-w-7xl mx-auto">
// // //             {/* Enhanced Stats Section */}
// // //             {stats && (
// // //               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
// // //                 <Card className="bg-gray-800 border-gray-700 hover:border-blue-500/30 transition-all duration-300">
// // //                   <CardContent className="p-6">
// // //                     <div className="flex items-center justify-between">
// // //                       <div>
// // //                         <p className="text-gray-400 text-sm font-medium">Total Polls</p>
// // //                         <p className="text-3xl font-bold text-white mt-1">{stats.totalPolls}</p>
// // //                       </div>
// // //                       <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
// // //                         <BarChart3 className="h-6 w-6 text-blue-400" />
// // //                       </div>
// // //                     </div>
// // //                   </CardContent>
// // //                 </Card>
                
// // //                 <Card className="bg-gray-800 border-gray-700 hover:border-green-500/30 transition-all duration-300">
// // //                   <CardContent className="p-6">
// // //                     <div className="flex items-center justify-between">
// // //                       <div>
// // //                         <p className="text-gray-400 text-sm font-medium">Total Votes</p>
// // //                         <p className="text-3xl font-bold text-white mt-1">{stats.totalVotes.toLocaleString()}</p>
// // //                       </div>
// // //                       <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
// // //                         <Users className="h-6 w-6 text-green-400" />
// // //                       </div>
// // //                     </div>
// // //                   </CardContent>
// // //                 </Card>
                
// // //                 <Card className="bg-gray-800 border-gray-700 hover:border-purple-500/30 transition-all duration-300">
// // //                   <CardContent className="p-6">
// // //                     <div className="flex items-center justify-between">
// // //                       <div>
// // //                         <p className="text-gray-400 text-sm font-medium">Active Polls</p>
// // //                         <p className="text-3xl font-bold text-white mt-1">{stats.activePolls}</p>
// // //                       </div>
// // //                       <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
// // //                         <MessageCircle className="h-6 w-6 text-purple-400" />
// // //                       </div>
// // //                     </div>
// // //                   </CardContent>
// // //                 </Card>
                
// // //                 <Card className="bg-gray-800 border-gray-700 hover:border-yellow-500/30 transition-all duration-300">
// // //                   <CardContent className="p-6">
// // //                     <div className="flex items-center justify-between">
// // //                       <div>
// // //                         <p className="text-gray-400 text-sm font-medium">Avg. Engagement</p>
// // //                         <p className="text-3xl font-bold text-white mt-1">{stats.avgEngagement}%</p>
// // //                       </div>
// // //                       <div className="w-12 h-12 bg-yellow-500/20 rounded-xl flex items-center justify-center">
// // //                         <TrendingUp className="h-6 w-6 text-yellow-400" />
// // //                       </div>
// // //                     </div>
// // //                   </CardContent>
// // //                 </Card>
// // //               </div>
// // //             )}
            
// // //             {/* Action Bar */}
// // //             <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 p-6 bg-gray-800 border border-gray-700 rounded-2xl">
// // //               <div>
// // //                 <h2 className="text-2xl font-bold text-white mb-2">Community Polls</h2>
// // //                 <p className="text-gray-400">Discover and participate in real-time discussions</p>
// // //               </div>
// // //               <div className="flex gap-3">
// // //                 <Button 
// // //                   variant="outline"
// // //                   className="border-gray-600 bg-gray-700 hover:bg-gray-600 text-white"
// // //                 >
// // //                   <Eye className="mr-2 h-4 w-4" />
// // //                   Filter
// // //                 </Button>
// // //                 <Button 
// // //                   onClick={() => navigate('/create-poll')}
// // //                   className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg"
// // //                 >
// // //                   <Plus className="mr-2 h-4 w-4" />
// // //                   New Poll
// // //                 </Button>
// // //               </div>
// // //             </div>
            
// // //             {/* Enhanced Polls Grid */}
// // //             <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
// // //               {polls.map(poll => {
// // //                 const topChoice = getTopChoice(poll.options);
// // //                 const status = getPollStatus(poll);
// // //                 const isExpiredPoll = status === 'expired';
// // //                 const isTrending = poll.totalVotes > 50;
// // //                 const engagementColor = poll.engagementRate > 70 ? 'text-green-400' : 
// // //                                       poll.engagementRate > 40 ? 'text-yellow-400' : 'text-red-400';

// // //                 return (
// // //                   <Card key={poll.id} className="bg-gray-800 border-gray-700 hover:border-blue-500/30 transition-all duration-300 group hover:shadow-2xl">
// // //                     <CardHeader className="pb-4">
// // //                       <div className="flex justify-between items-start mb-3">
// // //                         <div className="flex items-center gap-2">
// // //                           <Avatar className="h-8 w-8 border border-gray-600">
// // //                             <AvatarImage src={poll.profiles?.avatar_url} />
// // //                             <AvatarFallback className="bg-gradient-to-br from-blue-600 to-purple-600 text-xs">
// // //                               {getInitials(poll.profiles?.username, poll.created_by)}
// // //                             </AvatarFallback>
// // //                           </Avatar>
// // //                           <div className="flex gap-1">
// // //                             {poll.is_password_protected && (
// // //                               <Badge className="bg-yellow-500/20 text-yellow-300 border-yellow-500/30">
// // //                                 <Shield className="h-3 w-3" />
// // //                               </Badge>
// // //                             )}
// // //                             {isTrending && (
// // //                               <Badge className="bg-green-500/20 text-green-300 border-green-500/30">
// // //                                 <Zap className="h-3 w-3" />
// // //                               </Badge>
// // //                             )}
// // //                             {isExpiredPoll && (
// // //                               <Badge className="bg-red-500/20 text-red-300 border-red-500/30">
// // //                                 <Clock className="h-3 w-3" />
// // //                               </Badge>
// // //                             )}
// // //                           </div>
// // //                         </div>
// // //                         <Button 
// // //                           variant="ghost" 
// // //                           size="sm"
// // //                           className="h-8 w-8 p-0 text-gray-400 hover:text-white"
// // //                           onClick={() => openShareModal(poll)}
// // //                         >
// // //                           <Share2 className="h-4 w-4" />
// // //                         </Button>
// // //                       </div>
                      
// // //                       <CardTitle className="text-lg text-white line-clamp-2 group-hover:text-blue-400 transition-colors cursor-pointer"
// // //                         onClick={() => {
// // //                           navigate(`/polls/${poll.id}`);
// // //                           trackEvent('Poll', 'open_detail', poll.id);
// // //                         }}
// // //                       >
// // //                         {poll.question}
// // //                       </CardTitle>
                      
// // //                       <CardDescription className="flex items-center justify-between text-sm mt-3">
// // //                         <span className="text-gray-400 flex items-center gap-1">
// // //                           <Calendar className="h-4 w-4" />
// // //                           {new Date(poll.created_at).toLocaleDateString()}
// // //                         </span>
// // //                         <div className="flex gap-3">
// // //                           <span className="text-gray-400 flex items-center gap-1">
// // //                             <Users className="h-4 w-4" />
// // //                             {poll.participantCount}
// // //                           </span>
// // //                           <span className={`flex items-center gap-1 ${engagementColor}`}>
// // //                             <TrendingUp className="h-4 w-4" />
// // //                             {poll.engagementRate}%
// // //                           </span>
// // //                         </div>
// // //                       </CardDescription>
// // //                     </CardHeader>
                    
// // //                     <CardContent className="pt-0">
// // //                       {poll.options.slice(0, 2).map((option) => {
// // //                         const percentage = poll.totalVotes > 0 
// // //                           ? Math.round((option.votes_count / poll.totalVotes) * 100) 
// // //                           : 0;
// // //                         return (
// // //                           <div key={option.id} className="mb-3">
// // //                             <div className="flex justify-between text-sm mb-1">
// // //                               <span className="text-white truncate font-medium">{option.option_text}</span>
// // //                               <span className="text-blue-400 font-bold">{percentage}%</span>
// // //                             </div>
// // //                             <Progress value={percentage} className="h-2 bg-gray-700" />
// // //                           </div>
// // //                         );
// // //                       })}
// // //                       {poll.options.length > 2 && (
// // //                         <p className="text-gray-400 text-sm text-center mt-3 bg-gray-700 py-1 rounded-full">
// // //                           +{poll.options.length - 2} more options
// // //                         </p>
// // //                       )}

// // //                       {/* Top Choice Highlight */}
// // //                       {topChoice && topChoice.votes_count > 0 && (
// // //                         <div className="mt-4 p-3 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-lg">
// // //                           <div className="flex items-center gap-2 mb-1">
// // //                             <Trophy className="h-4 w-4 text-yellow-500" />
// // //                             <span className="text-xs font-semibold text-yellow-400">Community Choice</span>
// // //                           </div>
// // //                           <p className="text-white text-sm font-medium truncate">
// // //                             {topChoice.option_text}
// // //                           </p>
// // //                           <p className="text-gray-400 text-xs mt-1">
// // //                             {Math.round((topChoice.votes_count / poll.totalVotes) * 100)}% of votes
// // //                           </p>
// // //                         </div>
// // //                       )}
// // //                     </CardContent>
                    
// // //                     <CardFooter>
// // //                       <div className="flex gap-2 w-full">
// // //                         <Button 
// // //                           className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-2.5 rounded-xl shadow-lg"
// // //                           onClick={() => {
// // //                             navigate(`/polls/${poll.id}`);
// // //                             trackEvent('Poll', 'open_detail', poll.id);
// // //                           }}
// // //                         >
// // //                           {isExpiredPoll ? (
// // //                             <>
// // //                               <BarChart3 className="mr-2 h-4 w-4" />
// // //                               View Results
// // //                             </>
// // //                           ) : (
// // //                             <>
// // //                               <Vote className="mr-2 h-4 w-4" />
// // //                               Vote Now
// // //                             </>
// // //                           )}
// // //                         </Button>
// // //                         <div className="flex gap-1">
// // //                           <UITooltip>
// // //                             <TooltipTrigger asChild>
// // //                               <Button 
// // //                                 variant="outline" 
// // //                                 size="sm"
// // //                                 className="border-gray-600 bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white"
// // //                                 onClick={() => openAnalytics(poll)}
// // //                               >
// // //                                 <Activity className="h-4 w-4" />
// // //                               </Button>
// // //                             </TooltipTrigger>
// // //                             <TooltipContent>
// // //                               <p>View Analytics</p>
// // //                             </TooltipContent>
// // //                           </UITooltip>
// // //                           <UITooltip>
// // //                             <TooltipTrigger asChild>
// // //                               <Button 
// // //                                 variant="outline" 
// // //                                 size="sm"
// // //                                 className="border-gray-600 bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white"
// // //                                 onClick={() => openShareModal(poll)}
// // //                               >
// // //                                 {copiedPollId === poll.id ? (
// // //                                   <CheckCheck className="h-4 w-4 text-green-400" />
// // //                                 ) : (
// // //                                   <Share2 className="h-4 w-4" />
// // //                                 )}
// // //                               </Button>
// // //                             </TooltipTrigger>
// // //                             <TooltipContent>
// // //                               <p>Share Poll</p>
// // //                             </TooltipContent>
// // //                           </UITooltip>
// // //                         </div>
// // //                       </div>
// // //                     </CardFooter>
// // //                   </Card>
// // //                 );
// // //               })}
// // //             </div>

// // //             {/* Load More */}
// // //             {hasMore && (
// // //               <div className="text-center mt-12">
// // //                 <Button 
// // //                   onClick={loadMore}
// // //                   disabled={loading}
// // //                   className="bg-gray-800 border border-gray-700 hover:bg-gray-700 text-white px-8 py-6 rounded-xl"
// // //                   size="lg"
// // //                 >
// // //                   {loading ? (
// // //                     <div className="flex items-center gap-2">
// // //                       <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
// // //                       Loading...
// // //                     </div>
// // //                   ) : (
// // //                     <>
// // //                       <Sparkles className="mr-2 h-5 w-5" />
// // //                       Load More Polls
// // //                     </>
// // //                   )}
// // //                 </Button>
// // //               </div>
// // //             )}
// // //           </div>
// // //         </div>

// // //         {/* Render Modals */}
// // //         <PasswordModal />
// // //         <ShareModal />
// // //         <AnalyticsModal />
// // //       </TooltipProvider>
// // //     );
// // //   }
  
// // //   return null;
// // // };

// // // export default Polls;


// // import React, { useState, useEffect, useCallback, useMemo } from 'react';
// // import { useNavigate } from 'react-router-dom';
// // import { useSocketContext } from '../context/SocketContext';
// // import { UserAuth } from '../context/AuthContext';
// // import { supabase } from '../supabaseClient';
// // import { ResponsiveBar } from '@nivo/bar';
// // import { ResponsivePie } from '@nivo/pie';
// // import { ResponsiveLine } from '@nivo/line';
// // import { ResponsiveRadar } from '@nivo/radar';
// // import { 
// //   Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter 
// // } from '@/components/ui/card';
// // import { Button } from '@/components/ui/button';
// // import { Badge } from '@/components/ui/badge';
// // import { Progress } from '@/components/ui/progress';
// // import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
// // import {
// //   Dialog,
// //   DialogContent,
// //   DialogDescription,
// //   DialogFooter,
// //   DialogHeader,
// //   DialogTitle,
// // } from '@/components/ui/dialog';
// // import { Input } from '@/components/ui/input';
// // import { Label } from '@/components/ui/label';
// // import { 
// //   Tooltip as UITooltip, 
// //   TooltipContent, 
// //   TooltipProvider, 
// //   TooltipTrigger 
// // } from '@/components/ui/tooltip';
// // import { Skeleton } from '@/components/ui/skeleton';
// // import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
// // import { 
// //   Calendar, Users, TrendingUp, BarChart3, Plus, Vote, Zap, Shield, 
// //   Clock, Trophy, Sparkles, MessageCircle, Eye, Share2, MoreHorizontal,
// //   Copy, CheckCheck, BarChart4, PieChart as PieChartIcon, LineChart as LineChartIcon,
// //   Lock, X, QrCode, Download, Mail, FileText, Twitter, Linkedin, Facebook,
// //   ExternalLink, AlertCircle, Activity, Maximize2, ArrowLeft
// // } from 'lucide-react';
// // import { toast } from 'sonner';

// // const trackEvent = (category, action, label, value) => {
// //   if (window.gtag) {
// //     window.gtag('event', action, {
// //       event_category: category,
// //       event_label: label,
// //       value: value,
// //     });
// //   }
// // };

// // const trackPageView = (path) => {
// //   if (window.gtag) {
// //     window.gtag('config', import.meta.env.VITE_GA_MEASUREMENT_ID, {
// //       page_path: path,
// //     });
// //   }
// // };

// // const NIVO_COLORS = ['#3B82F6', '#8B5CF6', '#EF4444', '#10B981', '#F59E0B', '#6366F1', '#EC4899', '#84CC16'];

// // const Polls = ({ pollId }) => {
// //   const [polls, setPolls] = useState([]);
// //   const [poll, setPoll] = useState(null);
// //   const [selectedOption, setSelectedOption] = useState(null);
// //   const [hasVoted, setHasVoted] = useState(false);
// //   const [loading, setLoading] = useState(true);
// //   const [error, setError] = useState(null);
// //   const [userVote, setUserVote] = useState(null);
// //   const [isExpired, setIsExpired] = useState(false);
// //   const [page, setPage] = useState(1);
// //   const [hasMore, setHasMore] = useState(true);
// //   const [copiedPollId, setCopiedPollId] = useState(null);
// //   const [activeChart, setActiveChart] = useState('bar');
// //   const [showAnalytics, setShowAnalytics] = useState(false);
  
// //   // Enhanced features state
// //   const [passwordModalOpen, setPasswordModalOpen] = useState(false);
// //   const [shareModalOpen, setShareModalOpen] = useState(false);
// //   const [selectedSharePoll, setSelectedSharePoll] = useState(null);
// //   const [password, setPassword] = useState('');
// //   const [pendingPollId, setPendingPollId] = useState(null);
  
// //   const POLLS_PER_PAGE = 12;
  
// //   const socketContext = useSocketContext();
// //   const socket = socketContext?.socket;
// //   const { user } = UserAuth();
// //   const navigate = useNavigate();

// //   useEffect(() => {
// //     const path = pollId ? `/polls/${pollId}` : '/polls';
// //     trackPageView(path);
// //   }, [pollId]);

// //   // Fetch all polls
// //   const fetchAllPolls = useCallback(async (pageNum = 1, append = false) => {
// //     try {
// //       setLoading(true);
      
// //       if (socket) {
// //         socket.emit('getPolls', { page: pageNum, limit: POLLS_PER_PAGE }, (response) => {
// //           if (response?.error) throw new Error(response.error);
// //           setPolls(append ? [...polls, ...response.polls] : response.polls);
// //           setHasMore(response.hasMore);
// //           setLoading(false);
// //           trackEvent('Polls', 'view_all', `page_${pageNum}`);
// //         });
// //       } else {
// //         const from = (pageNum - 1) * POLLS_PER_PAGE;
// //         const to = from + POLLS_PER_PAGE - 1;

// //         const { data: pollsData, error: pollsError } = await supabase
// //           .from('polls')
// //           .select(`
// //             *,
// //             options!inner(id, option_text, votes_count, poll_id),
// //             profiles(username, avatar_url)
// //           `)
// //           .order('created_at', { ascending: false })
// //           .range(from, to);
          
// //         if (pollsError) throw pollsError;

// //         const pollIds = pollsData.map(p => p.id);
// //         const { data: votesData } = await supabase
// //           .from('votes')
// //           .select('poll_id, user_id')
// //           .in('poll_id', pollIds);

// //         const participantsByPoll = votesData?.reduce((acc, vote) => {
// //           if (!acc[vote.poll_id]) acc[vote.poll_id] = new Set();
// //           acc[vote.poll_id].add(vote.user_id);
// //           return acc;
// //         }, {}) || {};

// //         const processedPolls = pollsData.map(poll => {
// //           const totalVotes = poll.options.reduce((sum, opt) => sum + opt.votes_count, 0);
// //           const participantCount = participantsByPoll[poll.id]?.size || 0;
          
// //           return {
// //             ...poll,
// //             totalVotes,
// //             participantCount,
// //             engagementRate: participantCount > 0 ? Math.round((totalVotes / participantCount) * 100) : 0
// //           };
// //         });

// //         setPolls(append ? [...polls, ...processedPolls] : processedPolls);
// //         setHasMore(pollsData.length === POLLS_PER_PAGE);
// //         setLoading(false);
// //         trackEvent('Polls', 'view_all', `page_${pageNum}`);
// //       }
// //     } catch (err) {
// //       console.error("Error fetching polls:", err);
// //       setError(err.message);
// //       setLoading(false);
// //       toast.error('Failed to load polls');
// //     }
// //   }, [socket, polls]);

// //   // Fetch single poll with password check
// //   const fetchPoll = useCallback(async (providedPassword = null) => {
// //     try {
// //       setLoading(true);
      
// //       if (socket) {
// //         socket.emit('getPoll', { pollId, password: providedPassword }, (response) => {
// //           if (response?.error) {
// //             if (response.error === 'Password required' || response.error === 'Invalid password') {
// //               setPendingPollId(pollId);
// //               setPasswordModalOpen(true);
// //               setLoading(false);
// //               return;
// //             }
// //             throw new Error(response.error);
// //           }
          
// //           const pollData = response.data;
// //           const isExpiredNow = pollData.expires_at && new Date(pollData.expires_at) < new Date();
          
// //           let userHasVoted = false;
// //           let existingVote = null;

// //           if (user) {
// //             const userVote = pollData.votes?.find(vote => vote.user_id === user.id);
// //             if (userVote) {
// //               userHasVoted = true;
// //               existingVote = userVote;
// //               setSelectedOption(userVote.option_id);
// //             }
// //           }

// //           setPoll(pollData);
// //           setHasVoted(userHasVoted);
// //           setUserVote(existingVote);
// //           setIsExpired(isExpiredNow);
// //           setPasswordModalOpen(false);
// //           setLoading(false);
// //           trackEvent('Poll', 'view', pollId);
// //         });
// //       } else {
// //         const { data: pollCheck, error: checkError } = await supabase
// //           .from('polls')
// //           .select('is_password_protected, password_hash')
// //           .eq('id', pollId)
// //           .single();

// //         if (checkError) throw checkError;

// //         if (pollCheck.is_password_protected && !providedPassword) {
// //           setPendingPollId(pollId);
// //           setPasswordModalOpen(true);
// //           setLoading(false);
// //           return;
// //         }

// //         const { data: pollData, error: pollError } = await supabase
// //           .from('polls')
// //           .select(`
// //             *,
// //             options(*),
// //             profiles(username, avatar_url),
// //             votes(*)
// //           `)
// //           .eq('id', pollId)
// //           .single();
          
// //         if (pollError) throw pollError;

// //         const isExpiredNow = pollData.expires_at && new Date(pollData.expires_at) < new Date();
        
// //         let userHasVoted = false;
// //         let existingVote = null;

// //         if (user) {
// //           const userVote = pollData.votes?.find(vote => vote.user_id === user.id);
// //           if (userVote) {
// //             userHasVoted = true;
// //             existingVote = userVote;
// //             setSelectedOption(userVote.option_id);
// //           }
// //         }

// //         const totalVotes = pollData.options.reduce((sum, opt) => sum + opt.votes_count, 0);
// //         const processedPoll = { ...pollData, totalVotes };

// //         setPoll(processedPoll);
// //         setHasVoted(userHasVoted);
// //         setUserVote(existingVote);
// //         setIsExpired(isExpiredNow);
// //         setPasswordModalOpen(false);
// //         setLoading(false);
// //         trackEvent('Poll', 'view', pollId);
// //       }
      
// //     } catch (err) {
// //       console.error("Error fetching poll:", err);
// //       setError(err.message);
// //       setLoading(false);
// //       toast.error('Failed to load poll');
// //     }
// //   }, [socket, pollId, user]);

// //   // Initial fetch
// //   useEffect(() => {
// //     if (!pollId) {
// //       fetchAllPolls(1);
// //     } else if (pollId !== "undefined") {
// //       fetchPoll();
// //     } else {
// //       setError("Invalid poll ID");
// //       setLoading(false);
// //     }
// //   }, [pollId, user]);

// //   // Socket connection
// //   useEffect(() => {
// //     if (!socket || !pollId || pollId === "undefined") return;
    
// //     socket.emit("joinPoll", pollId);
    
// //     const handlePollUpdate = (data) => {
// //       if (data.data.id === pollId) {
// //         setPoll(data.data);
// //         trackEvent('Poll', 'real_time_update', pollId);
// //         toast.success('Poll updated in real-time!');
// //       }
// //     };
    
// //     socket.on("pollDataUpdated", handlePollUpdate);
    
// //     return () => {
// //       socket.off("pollDataUpdated", handlePollUpdate);
// //       socket.emit("leavePoll", pollId);
// //     };
// //   }, [socket, pollId]);
  
// //   const handleVote = useCallback(() => {
// //     if (!selectedOption) {
// //       toast.error('Please select an option to vote');
// //       return;
// //     }
    
// //     if (socket) {
// //       socket.emit("vote", {
// //         pollId,
// //         optionId: selectedOption,
// //         userId: user?.id || null
// //       });
// //     } else {
// //       toast.warning('Real-time voting not available');
// //     }
    
// //     setHasVoted(true);
// //     toast.success('Your vote has been submitted!');
// //     trackEvent('Poll', 'vote_submitted', pollId, selectedOption);
// //   }, [selectedOption, socket, pollId, user]);

// //   const handlePasswordSubmit = useCallback(() => {
// //     if (!password.trim()) {
// //       toast.error('Please enter a password');
// //       return;
// //     }
// //     fetchPoll(password);
// //     setPassword('');
// //   }, [password, fetchPoll]);

// //   const handleSkipPassword = useCallback(() => {
// //     setPasswordModalOpen(false);
// //     setPendingPollId(null);
// //     setPassword('');
// //     navigate('/polls');
// //     toast.info('Viewing public polls');
// //   }, [navigate]);

// //   const copyPollLink = useCallback(async (pollId) => {
// //     const link = `${window.location.origin}/polls/${pollId}`;
// //     try {
// //       await navigator.clipboard.writeText(link);
// //       setCopiedPollId(pollId);
// //       toast.success('Poll link copied to clipboard!');
// //       setTimeout(() => setCopiedPollId(null), 2000);
// //       trackEvent('Poll', 'share_link', pollId);
// //     } catch (err) {
// //       toast.error('Failed to copy link');
// //     }
// //   }, []);

// //   const openShareModal = useCallback((poll) => {
// //     setSelectedSharePoll(poll);
// //     setShareModalOpen(true);
// //     trackEvent('Poll', 'open_share_modal', poll.id);
// //   }, []);

// //   const getInitials = useCallback((username, email) => {
// //     if (username) return username.substring(0, 2).toUpperCase();
// //     if (email) return email.substring(0, 2).toUpperCase();
// //     return 'US';
// //   }, []);

// //   const loadMore = useCallback(() => {
// //     const nextPage = page + 1;
// //     setPage(nextPage);
// //     fetchAllPolls(nextPage, true);
// //     trackEvent('Polls', 'load_more', `page_${nextPage}`);
// //   }, [page, fetchAllPolls]);

// //   const getPollStatus = useCallback((poll) => {
// //     if (poll.expires_at && new Date(poll.expires_at) < new Date()) {
// //       return 'expired';
// //     }
// //     return 'active';
// //   }, []);

// //   const getTopChoice = useCallback((options) => {
// //     if (!options || options.length === 0) return null;
// //     return options.reduce((prev, current) => 
// //       (prev.votes_count > current.votes_count) ? prev : current
// //     );
// //   }, []);

// //   // Memoized stats
// //   const stats = useMemo(() => {
// //     if (!polls.length) return null;
    
// //     return {
// //       totalPolls: polls.length,
// //       totalVotes: polls.reduce((sum, poll) => sum + poll.totalVotes, 0),
// //       activePolls: polls.filter(poll => getPollStatus(poll) === 'active').length,
// //       avgEngagement: Math.round(polls.reduce((sum, poll) => sum + poll.engagementRate, 0) / polls.length)
// //     };
// //   }, [polls, getPollStatus]);

// //   // Nivo chart data transformations
// //   const nivoBarData = useMemo(() => {
// //     if (!poll?.options) return [];
// //     return poll.options.map((option, index) => ({
// //       id: option.option_text,
// //       option: option.option_text,
// //       votes: option.votes_count,
// //       color: NIVO_COLORS[index % NIVO_COLORS.length]
// //     }));
// //   }, [poll]);

// //   const nivoPieData = useMemo(() => {
// //     if (!poll?.options) return [];
// //     return poll.options.map((option, index) => ({
// //       id: option.option_text,
// //       label: option.option_text,
// //       value: option.votes_count,
// //       color: NIVO_COLORS[index % NIVO_COLORS.length]
// //     }));
// //   }, [poll]);

// //   const nivoLineData = useMemo(() => {
// //     if (!poll?.options) return [];
// //     return [{
// //       id: 'votes',
// //       data: poll.options.map((option, index) => ({
// //         x: option.option_text,
// //         y: option.votes_count
// //       }))
// //     }];
// //   }, [poll]);

// //   const nivoRadarData = useMemo(() => {
// //     if (!poll?.options) return [];
// //     return poll.options.map((option) => ({
// //       option: option.option_text,
// //       votes: option.votes_count
// //     }));
// //   }, [poll]);

// //   // Password Protection Modal
// //   const PasswordModal = () => (
// //     <Dialog open={passwordModalOpen} onOpenChange={setPasswordModalOpen}>
// //       <DialogContent className="sm:max-w-md bg-gray-800 border-gray-700 text-white">
// //         <DialogHeader>
// //           <DialogTitle className="flex items-center gap-2 text-xl">
// //             <Shield className="h-5 w-5 text-yellow-400" />
// //             Password Protected Poll
// //           </DialogTitle>
// //           <DialogDescription className="text-gray-400 text-base">
// //             This poll requires a password to access. Enter the password or skip to view public polls.
// //           </DialogDescription>
// //         </DialogHeader>
// //         <div className="space-y-4 py-4">
// //           <div className="space-y-2">
// //             <Label htmlFor="password" className="text-gray-300">Password</Label>
// //             <Input
// //               id="password"
// //               type="password"
// //               placeholder="Enter poll password"
// //               value={password}
// //               onChange={(e) => setPassword(e.target.value)}
// //               className="bg-gray-700 border-gray-600 text-white placeholder:text-gray-500"
// //               onKeyPress={(e) => {
// //                 if (e.key === 'Enter') handlePasswordSubmit();
// //               }}
// //               autoFocus
// //             />
// //           </div>
// //         </div>
// //         <DialogFooter className="flex-col sm:flex-row gap-2">
// //           <Button
// //             variant="outline"
// //             onClick={handleSkipPassword}
// //             className="w-full sm:w-auto border-gray-600 bg-gray-700 hover:bg-gray-600 text-white"
// //           >
// //             <Eye className="mr-2 h-4 w-4" />
// //             Skip - View Public Polls
// //           </Button>
// //           <Button
// //             onClick={handlePasswordSubmit}
// //             className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
// //           >
// //             <Lock className="mr-2 h-4 w-4" />
// //             Unlock Poll
// //           </Button>
// //         </DialogFooter>
// //       </DialogContent>
// //     </Dialog>
// //   );

// //   // Enhanced Share Modal
// //   const ShareModal = () => {
// //     if (!selectedSharePoll) return null;
    
// //     const pollUrl = `${window.location.origin}/polls/${selectedSharePoll.id}`;
// //     const shareText = `Check out this poll: ${selectedSharePoll.question}`;

// //     return (
// //       <Dialog open={shareModalOpen} onOpenChange={setShareModalOpen}>
// //         <DialogContent className="sm:max-w-2xl bg-gray-800 border-gray-700 text-white">
// //           <DialogHeader>
// //             <DialogTitle className="text-2xl flex items-center gap-2">
// //               <Share2 className="h-6 w-6 text-blue-400" />
// //               Share Poll
// //             </DialogTitle>
// //             <DialogDescription className="text-gray-400">
// //               {selectedSharePoll.question}
// //             </DialogDescription>
// //           </DialogHeader>
          
// //           <Tabs defaultValue="link" className="w-full">
// //             <TabsList className="grid w-full grid-cols-3 bg-gray-700">
// //               <TabsTrigger value="link">Link</TabsTrigger>
// //               <TabsTrigger value="social">Social</TabsTrigger>
// //               <TabsTrigger value="embed">Embed</TabsTrigger>
// //             </TabsList>
            
// //             <TabsContent value="link" className="space-y-4 mt-4">
// //               <div className="flex gap-2">
// //                 <Input
// //                   value={pollUrl}
// //                   readOnly
// //                   className="bg-gray-700 border-gray-600 text-white"
// //                 />
// //                 <Button
// //                   onClick={() => copyPollLink(selectedSharePoll.id)}
// //                   className="bg-blue-600 hover:bg-blue-700"
// //                 >
// //                   {copiedPollId === selectedSharePoll.id ? (
// //                     <CheckCheck className="h-4 w-4" />
// //                   ) : (
// //                     <Copy className="h-4 w-4" />
// //                   )}
// //                 </Button>
// //               </div>
              
// //               <div className="bg-gray-700/50 rounded-lg p-4 border border-gray-600">
// //                 <div className="flex items-center justify-center">
// //                   <div className="bg-white p-4 rounded-lg">
// //                     <QrCode className="h-32 w-32 text-gray-900" />
// //                   </div>
// //                 </div>
// //                 <p className="text-center text-gray-400 text-sm mt-3">
// //                   Scan QR code to access poll
// //                 </p>
// //               </div>
// //             </TabsContent>
            
// //             <TabsContent value="social" className="space-y-3 mt-4">
// //               <Button
// //                 className="w-full bg-[#1DA1F2] hover:bg-[#1a8cd8] text-white justify-start"
// //                 onClick={() => {
// //                   window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(pollUrl)}`);
// //                   trackEvent('Share', 'twitter', selectedSharePoll.id);
// //                 }}
// //               >
// //                 <Twitter className="mr-2 h-4 w-4" />
// //                 Share on Twitter
// //               </Button>
              
// //               <Button
// //                 className="w-full bg-[#0077B5] hover:bg-[#006399] text-white justify-start"
// //                 onClick={() => {
// //                   window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(pollUrl)}`);
// //                   trackEvent('Share', 'linkedin', selectedSharePoll.id);
// //                 }}
// //               >
// //                 <Linkedin className="mr-2 h-4 w-4" />
// //                 Share on LinkedIn
// //               </Button>
              
// //               <Button
// //                 className="w-full bg-[#1877F2] hover:bg-[#145dbf] text-white justify-start"
// //                 onClick={() => {
// //                   window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(pollUrl)}`);
// //                   trackEvent('Share', 'facebook', selectedSharePoll.id);
// //                 }}
// //               >
// //                 <Facebook className="mr-2 h-4 w-4" />
// //                 Share on Facebook
// //               </Button>
              
// //               <Button
// //                 className="w-full bg-gray-700 hover:bg-gray-600 text-white justify-start"
// //                 onClick={() => {
// //                   if (navigator.share) {
// //                     navigator.share({
// //                       title: selectedSharePoll.question,
// //                       url: pollUrl
// //                     });
// //                   }
// //                   trackEvent('Share', 'native', selectedSharePoll.id);
// //                 }}
// //               >
// //                 <ExternalLink className="mr-2 h-4 w-4" />
// //                 More Options
// //               </Button>
// //             </TabsContent>
            
// //             <TabsContent value="embed" className="space-y-4 mt-4">
// //               <div className="space-y-2">
// //                 <Label className="text-gray-300">Embed Code</Label>
// //                 <textarea
// //                   value={`<iframe src="${pollUrl}/embed" width="100%" height="400" frameborder="0"></iframe>`}
// //                   readOnly
// //                   className="w-full h-24 bg-gray-700 border-gray-600 text-white rounded-md p-3 font-mono text-sm"
// //                 />
// //               </div>
// //               <Button
// //                 className="w-full bg-blue-600 hover:bg-blue-700"
// //                 onClick={() => {
// //                   navigator.clipboard.writeText(`<iframe src="${pollUrl}/embed" width="100%" height="400" frameborder="0"></iframe>`);
// //                   toast.success('Embed code copied!');
// //                 }}
// //               >
// //                 <Copy className="mr-2 h-4 w-4" />
// //                 Copy Embed Code
// //               </Button>
// //             </TabsContent>
// //           </Tabs>
// //         </DialogContent>
// //       </Dialog>
// //     );
// //   };

// //   // Analytics Dashboard Component
// //   const AnalyticsDashboard = () => {
// //     if (!poll) return null;

// //     return (
// //       <div className="min-h-screen bg-gray-900 text-white p-4 md:p-8">
// //         <div className="max-w-7xl mx-auto">
// //           {/* Header */}
// //           <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
// //             <div className="flex items-center gap-3">
// //               <Button
// //                 variant="outline"
// //                 onClick={() => setShowAnalytics(false)}
// //                 className="border-gray-600 bg-gray-800 hover:bg-gray-700 text-white"
// //               >
// //                 <ArrowLeft className="mr-2 h-4 w-4" />
// //                 Back to Poll
// //               </Button>
// //               <h1 className="text-3xl font-bold">Poll Analytics</h1>
// //             </div>
// //             <h2 className="text-xl text-gray-300 truncate max-w-2xl">{poll.question}</h2>
// //           </div>

// //           {/* Key Metrics */}
// //           <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
// //             <Card className="bg-gray-800 border-gray-700">
// //               <CardContent className="p-4">
// //                 <div className="flex items-center justify-between">
// //                   <div>
// //                     <p className="text-gray-400 text-sm">Total Votes</p>
// //                     <p className="text-3xl font-bold text-white">{poll.totalVotes}</p>
// //                   </div>
// //                   <Users className="h-8 w-8 text-blue-400" />
// //                 </div>
// //               </CardContent>
// //             </Card>
            
// //             <Card className="bg-gray-800 border-gray-700">
// //               <CardContent className="p-4">
// //                 <div className="flex items-center justify-between">
// //                   <div>
// //                     <p className="text-gray-400 text-sm">Options</p>
// //                     <p className="text-3xl font-bold text-white">{poll.options?.length || 0}</p>
// //                   </div>
// //                   <Vote className="h-8 w-8 text-purple-400" />
// //                 </div>
// //               </CardContent>
// //             </Card>
            
// //             <Card className="bg-gray-800 border-gray-700">
// //               <CardContent className="p-4">
// //                 <div className="flex items-center justify-between">
// //                   <div>
// //                     <p className="text-gray-400 text-sm">Top Choice</p>
// //                     <p className="text-xl font-bold text-white truncate">
// //                       {getTopChoice(poll.options)?.option_text || 'N/A'}
// //                     </p>
// //                   </div>
// //                   <Trophy className="h-8 w-8 text-yellow-400" />
// //                 </div>
// //               </CardContent>
// //             </Card>
            
// //             <Card className="bg-gray-800 border-gray-700">
// //               <CardContent className="p-4">
// //                 <div className="flex items-center justify-between">
// //                   <div>
// //                     <p className="text-gray-400 text-sm">Status</p>
// //                     <Badge className={isExpired ? 'bg-red-500/20 text-red-300' : 'bg-green-500/20 text-green-300'}>
// //                       {isExpired ? 'Expired' : 'Active'}
// //                     </Badge>
// //                   </div>
// //                   <Clock className="h-8 w-8 text-green-400" />
// //                 </div>
// //               </CardContent>
// //             </Card>
// //           </div>

// //           {/* Chart Selector */}
// //           <div className="flex flex-wrap gap-2 justify-center mb-8">
// //             {[
// //               { key: 'bar', icon: BarChart4, label: 'Bar Chart' },
// //               { key: 'pie', icon: PieChartIcon, label: 'Pie Chart' },
// //               { key: 'line', icon: LineChartIcon, label: 'Line Chart' },
// //               { key: 'radar', icon: Activity, label: 'Radar Chart' }
// //             ].map(({ key, icon: Icon, label }) => (
// //               <Button
// //                 key={key}
// //                 variant={activeChart === key ? "default" : "outline"}
// //                 onClick={() => setActiveChart(key)}
// //                 className={`flex items-center gap-2 ${
// //                   activeChart === key 
// //                     ? 'bg-blue-600 text-white hover:bg-blue-700' 
// //                     : 'bg-gray-800 text-gray-300 border-gray-600 hover:bg-gray-700'
// //                 }`}
// //               >
// //                 <Icon className="h-4 w-4" />
// //                 {label}
// //               </Button>
// //             ))}
// //           </div>

// //           {/* Nivo Charts */}
// //           <Card className="bg-gray-800 border-gray-700 mb-8">
// //             <CardContent className="p-6">
// //               <div style={{ height: '500px' }}>
// //                 {activeChart === 'bar' && (
// //                   <ResponsiveBar
// //                     data={nivoBarData}
// //                     keys={['votes']}
// //                     indexBy="option"
// //                     margin={{ top: 50, right: 130, bottom: 100, left: 60 }}
// //                     padding={0.3}
// //                     valueScale={{ type: 'linear' }}
// //                     colors={{ scheme: 'nivo' }}
// //                     borderRadius={8}
// //                     borderColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
// //                     axisTop={null}
// //                     axisRight={null}
// //                     axisBottom={{
// //                       tickSize: 5,
// //                       tickPadding: 5,
// //                       tickRotation: -45,
// //                       legend: 'Options',
// //                       legendPosition: 'middle',
// //                       legendOffset: 70
// //                     }}
// //                     axisLeft={{
// //                       tickSize: 5,
// //                       tickPadding: 5,
// //                       tickRotation: 0,
// //                       legend: 'Votes',
// //                       legendPosition: 'middle',
// //                       legendOffset: -50
// //                     }}
// //                     labelSkipWidth={12}
// //                     labelSkipHeight={12}
// //                     labelTextColor="#ffffff"
// //                     animate={true}
// //                     motionConfig="gentle"
// //                     theme={{
// //                       axis: {
// //                         ticks: { text: { fill: '#9CA3AF' } },
// //                         legend: { text: { fill: '#D1D5DB' } }
// //                       },
// //                       grid: { line: { stroke: '#374151' } },
// //                       tooltip: {
// //                         container: {
// //                           background: '#1F2937',
// //                           color: '#ffffff',
// //                           fontSize: 14,
// //                           borderRadius: 8,
// //                           boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)'
// //                         }
// //                       }
// //                     }}
// //                   />
// //                 )}

// //                 {activeChart === 'pie' && (
// //                   <ResponsivePie
// //                     data={nivoPieData}
// //                     margin={{ top: 40, right: 200, bottom: 40, left: 80 }}
// //                     innerRadius={0.5}
// //                     padAngle={2}
// //                     cornerRadius={8}
// //                     activeOuterRadiusOffset={8}
// //                     colors={{ scheme: 'nivo' }}
// //                     borderWidth={2}
// //                     borderColor={{ from: 'color', modifiers: [['darker', 0.2]] }}
// //                     arcLinkLabelsSkipAngle={10}
// //                     arcLinkLabelsTextColor="#D1D5DB"
// //                     arcLinkLabelsThickness={2}
// //                     arcLinkLabelsColor={{ from: 'color' }}
// //                     arcLabelsSkipAngle={10}
// //                     arcLabelsTextColor="#ffffff"
// //                     legends={[
// //                       {
// //                         anchor: 'right',
// //                         direction: 'column',
// //                         justify: false,
// //                         translateX: 140,
// //                         translateY: 0,
// //                         itemsSpacing: 12,
// //                         itemWidth: 120,
// //                         itemHeight: 20,
// //                         itemTextColor: '#D1D5DB',
// //                         itemDirection: 'left-to-right',
// //                         itemOpacity: 1,
// //                         symbolSize: 16,
// //                         symbolShape: 'circle'
// //                       }
// //                     ]}
// //                     animate={true}
// //                     motionConfig="gentle"
// //                     theme={{
// //                       tooltip: {
// //                         container: {
// //                           background: '#1F2937',
// //                           color: '#ffffff',
// //                           fontSize: 14,
// //                           borderRadius: 8,
// //                           boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)'
// //                         }
// //                       }
// //                     }}
// //                   />
// //                 )}

// //                 {activeChart === 'line' && (
// //                   <ResponsiveLine
// //                     data={nivoLineData}
// //                     margin={{ top: 50, right: 110, bottom: 100, left: 60 }}
// //                     xScale={{ type: 'point' }}
// //                     yScale={{ type: 'linear', min: 'auto', max: 'auto', stacked: false }}
// //                     curve="cardinal"
// //                     axisTop={null}
// //                     axisRight={null}
// //                     axisBottom={{
// //                       tickSize: 5,
// //                       tickPadding: 5,
// //                       tickRotation: -45,
// //                       legend: 'Options',
// //                       legendOffset: 70,
// //                       legendPosition: 'middle'
// //                     }}
// //                     axisLeft={{
// //                       tickSize: 5,
// //                       tickPadding: 5,
// //                       tickRotation: 0,
// //                       legend: 'Votes',
// //                       legendOffset: -50,
// //                       legendPosition: 'middle'
// //                     }}
// //                     pointSize={12}
// //                     pointColor={{ theme: 'background' }}
// //                     pointBorderWidth={3}
// //                     pointBorderColor={{ from: 'serieColor' }}
// //                     pointLabelYOffset={-12}
// //                     useMesh={true}
// //                     colors={{ scheme: 'nivo' }}
// //                     lineWidth={4}
// //                     enableGridX={false}
// //                     animate={true}
// //                     motionConfig="gentle"
// //                     theme={{
// //                       axis: {
// //                         ticks: { text: { fill: '#9CA3AF' } },
// //                         legend: { text: { fill: '#D1D5DB' } }
// //                       },
// //                       grid: { line: { stroke: '#374151' } },
// //                       tooltip: {
// //                         container: {
// //                           background: '#1F2937',
// //                           color: '#ffffff',
// //                           fontSize: 14,
// //                           borderRadius: 8,
// //                           boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)'
// //                         }
// //                       }
// //                     }}
// //                   />
// //                 )}

// //                 {activeChart === 'radar' && (
// //                   <ResponsiveRadar
// //                     data={nivoRadarData}
// //                     keys={['votes']}
// //                     indexBy="option"
// //                     maxValue="auto"
// //                     margin={{ top: 70, right: 80, bottom: 70, left: 80 }}
// //                     curve="linearClosed"
// //                     borderWidth={3}
// //                     borderColor={{ from: 'color' }}
// //                     gridLevels={5}
// //                     gridShape="circular"
// //                     gridLabelOffset={36}
// //                     enableDots={true}
// //                     dotSize={10}
// //                     dotColor={{ theme: 'background' }}
// //                     dotBorderWidth={2}
// //                     dotBorderColor={{ from: 'color' }}
// //                     colors={{ scheme: 'nivo' }}
// //                     fillOpacity={0.25}
// //                     blendMode="multiply"
// //                     animate={true}
// //                     motionConfig="gentle"
// //                     theme={{
// //                       axis: {
// //                         ticks: { text: { fill: '#9CA3AF' } },
// //                         legend: { text: { fill: '#D1D5DB' } }
// //                       },
// //                       grid: { line: { stroke: '#374151' } },
// //                       tooltip: {
// //                         container: {
// //                           background: '#1F2937',
// //                           color: '#ffffff',
// //                           fontSize: 14,
// //                           borderRadius: 8,
// //                           boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)'
// //                         }
// //                       }
// //                     }}
// //                   />
// //                 )}
// //               </div>
// //             </CardContent>
// //           </Card>

// //           {/* Detailed Breakdown */}
// //           <Card className="bg-gray-800 border-gray-700 mb-8">
// //             <CardHeader>
// //               <CardTitle className="text-xl">Detailed Breakdown</CardTitle>
// //             </CardHeader>
// //             <CardContent>
// //               <div className="space-y-4">
// //                 {poll.options?.map((option, index) => {
// //                   const percentage = poll.totalVotes > 0 
// //                     ? Math.round((option.votes_count / poll.totalVotes) * 100) 
// //                     : 0;
// //                   return (
// //                     <div key={option.id} className="space-y-2">
// //                       <div className="flex justify-between items-center">
// //                         <div className="flex items-center gap-3">
// //                           <div 
// //                             className="w-4 h-4 rounded-full" 
// //                             style={{ backgroundColor: NIVO_COLORS[index % NIVO_COLORS.length] }}
// //                           />
// //                           <span className="text-white font-medium">{option.option_text}</span>
// //                         </div>
// //                         <div className="flex items-center gap-4">
// //                           <span className="text-blue-400 font-bold text-lg">{percentage}%</span>
// //                           <span className="text-gray-400">{option.votes_count} votes</span>
// //                         </div>
// //                       </div>
// //                       <Progress value={percentage} className="h-2 bg-gray-700" />
// //                     </div>
// //                   );
// //                 })}
// //               </div>
// //             </CardContent>
// //           </Card>

// //           {/* Export Options */}
// //           <div className="flex justify-end gap-3">
// //             <Button
// //               variant="outline"
// //               className="border-gray-600 bg-gray-800 hover:bg-gray-700 text-white"
// //               onClick={() => {
// //                 toast.info('PDF export coming soon!');
// //                 trackEvent('Analytics', 'export_pdf', poll.id);
// //               }}
// //             >
// //               <Download className="mr-2 h-4 w-4" />
// //               Export as PDF
// //             </Button>
// //             <Button
// //               variant="outline"
// //               className="border-gray-600 bg-gray-800 hover:bg-gray-700 text-white"
// //               onClick={() => {
// //                 toast.info('Image export coming soon!');
// //                 trackEvent('Analytics', 'export_image', poll.id);
// //               }}
// //             >
// //               <Download className="mr-2 h-4 w-4" />
// //               Export as Image
// //             </Button>
// //           </div>
// //         </div>
// //       </div>
// //     );
// //   };

// //   // Loading skeleton
// //   if (loading && polls.length === 0) {
// //     return (
// //       <div className="min-h-screen bg-gray-900 p-8">
// //         <div className="max-w-7xl mx-auto">
// //           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
// //             {[1, 2, 3, 4].map(i => (
// //               <Card key={i} className="bg-gray-800 border-gray-700">
// //                 <CardContent className="p-6">
// //                   <Skeleton className="h-4 w-20 mb-2 bg-gray-700" />
// //                   <Skeleton className="h-8 w-16 bg-gray-700" />
// //                 </CardContent>
// //               </Card>
// //             ))}
// //           </div>
// //           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
// //             {[1, 2, 3, 4, 5, 6].map(i => (
// //               <Card key={i} className="bg-gray-800 border-gray-700">
// //                 <CardHeader>
// //                   <Skeleton className="h-6 w-3/4 mb-2 bg-gray-700" />
// //                   <Skeleton className="h-4 w-1/2 bg-gray-700" />
// //                 </CardHeader>
// //                 <CardContent className="space-y-3">
// //                   <Skeleton className="h-4 w-full bg-gray-700" />
// //                   <Skeleton className="h-4 w-5/6 bg-gray-700" />
// //                 </CardContent>
// //                 <CardFooter>
// //                   <Skeleton className="h-10 w-full bg-gray-700" />
// //                 </CardFooter>
// //               </Card>
// //             ))}
// //           </div>
// //         </div>
// //       </div>
// //     );
// //   }

// //   // Error state
// //   if (error) {
// //     return (
// //       <div className="min-h-screen bg-gray-900 flex items-center justify-center p-8">
// //         <Card className="bg-gray-800 border-gray-700 max-w-md text-center">
// //           <CardContent className="pt-6">
// //             <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
// //               <AlertCircle className="h-8 w-8 text-red-400" />
// //             </div>
// //             <h3 className="text-xl font-semibold text-white mb-2">Unable to Load Polls</h3>
// //             <p className="text-gray-400 mb-4">{error}</p>
// //             <Button 
// //               onClick={() => pollId ? fetchPoll() : fetchAllPolls()}
// //               className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
// //             >
// //               Try Again
// //             </Button>
// //           </CardContent>
// //         </Card>
// //       </div>
// //     );
// //   }

// //   // Show analytics dashboard if requested
// //   if (showAnalytics && poll) {
// //     return <AnalyticsDashboard />;
// //   }

// //   // Single poll view
// //   if (pollId && poll) {
// //     if (isExpired) {
// //       return (
// //         <div className="min-h-screen bg-gray-900 p-4">
// //           <div className="max-w-6xl mx-auto">
// //             <Card className="bg-gray-800 border-gray-700">
// //               <CardHeader className="text-center">
// //                 <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
// //                   {poll.question}
// //                 </CardTitle>
// //                 <div className="bg-red-500/20 border border-red-500/30 text-red-200 p-4 rounded-xl mt-4 max-w-md mx-auto">
// //                   <div className="flex items-center justify-center gap-2">
// //                     <Clock className="h-5 w-5" />
// //                     This poll has expired and is no longer accepting votes.
// //                   </div>
// //                 </div>
// //               </CardHeader>
// //               <CardContent className="pt-6">
// //                 <h3 className="text-2xl font-semibold text-white text-center mb-8">Final Results</h3>
                
// //                 {/* Chart Type Selector */}
// //                 <div className="flex flex-wrap justify-center gap-2 mb-8">
// //                   {[
// //                     { key: 'bar', icon: BarChart4, label: 'Bar' },
// //                     { key: 'pie', icon: PieChartIcon, label: 'Pie' },
// //                     { key: 'line', icon: LineChartIcon, label: 'Line' },
// //                     { key: 'radar', icon: Activity, label: 'Radar' }
// //                   ].map(({ key, icon: Icon, label }) => (
// //                     <Button
// //                       key={key}
// //                       variant={activeChart === key ? "default" : "outline"}
// //                       onClick={() => setActiveChart(key)}
// //                       className={`flex items-center gap-2 ${
// //                         activeChart === key 
// //                           ? 'bg-blue-600 text-white hover:bg-blue-700' 
// //                           : 'bg-gray-700 text-gray-300 border-gray-600 hover:bg-gray-600'
// //                       }`}
// //                     >
// //                       <Icon className="h-4 w-4" />
// //                       {label}
// //                     </Button>
// //                   ))}
// //                 </div>

// //                 {/* Nivo Charts */}
// //                 <div style={{ height: '500px' }}>
// //                   {activeChart === 'bar' && (
// //                     <ResponsiveBar
// //                       data={nivoBarData}
// //                       keys={['votes']}
// //                       indexBy="option"
// //                       margin={{ top: 50, right: 130, bottom: 100, left: 60 }}
// //                       padding={0.3}
// //                       colors={{ scheme: 'nivo' }}
// //                       borderRadius={8}
// //                       axisBottom={{
// //                         tickRotation: -45,
// //                         legend: 'Options',
// //                         legendPosition: 'middle',
// //                         legendOffset: 70
// //                       }}
// //                       axisLeft={{
// //                         legend: 'Votes',
// //                         legendPosition: 'middle',
// //                         legendOffset: -50
// //                       }}
// //                       labelTextColor="#ffffff"
// //                       animate={true}
// //                       theme={{
// //                         axis: {
// //                           ticks: { text: { fill: '#9CA3AF' } },
// //                           legend: { text: { fill: '#D1D5DB' } }
// //                         },
// //                         grid: { line: { stroke: '#374151' } },
// //                         tooltip: {
// //                           container: {
// //                             background: '#1F2937',
// //                             color: '#ffffff',
// //                             borderRadius: 8
// //                           }
// //                         }
// //                       }}
// //                     />
// //                   )}

// //                   {activeChart === 'pie' && (
// //                     <ResponsivePie
// //                       data={nivoPieData}
// //                       margin={{ top: 40, right: 200, bottom: 40, left: 80 }}
// //                       innerRadius={0.5}
// //                       padAngle={2}
// //                       cornerRadius={8}
// //                       colors={{ scheme: 'nivo' }}
// //                       arcLabelsTextColor="#ffffff"
// //                       legends={[
// //                         {
// //                           anchor: 'right',
// //                           direction: 'column',
// //                           translateX: 140,
// //                           itemTextColor: '#D1D5DB',
// //                           itemWidth: 120,
// //                           itemHeight: 20
// //                         }
// //                       ]}
// //                       theme={{
// //                         tooltip: {
// //                           container: { background: '#1F2937', color: '#ffffff', borderRadius: 8 }
// //                         }
// //                       }}
// //                     />
// //                   )}

// //                   {activeChart === 'line' && (
// //                     <ResponsiveLine
// //                       data={nivoLineData}
// //                       margin={{ top: 50, right: 110, bottom: 100, left: 60 }}
// //                       xScale={{ type: 'point' }}
// //                       yScale={{ type: 'linear' }}
// //                       curve="cardinal"
// //                       axisBottom={{
// //                         tickRotation: -45,
// //                         legend: 'Options',
// //                         legendOffset: 70,
// //                         legendPosition: 'middle'
// //                       }}
// //                       axisLeft={{
// //                         legend: 'Votes',
// //                         legendOffset: -50,
// //                         legendPosition: 'middle'
// //                       }}
// //                       pointSize={12}
// //                       colors={{ scheme: 'nivo' }}
// //                       lineWidth={4}
// //                       theme={{
// //                         axis: {
// //                           ticks: { text: { fill: '#9CA3AF' } },
// //                           legend: { text: { fill: '#D1D5DB' } }
// //                         },
// //                         grid: { line: { stroke: '#374151' } },
// //                         tooltip: {
// //                           container: { background: '#1F2937', color: '#ffffff', borderRadius: 8 }
// //                         }
// //                       }}
// //                     />
// //                   )}

// //                   {activeChart === 'radar' && (
// //                     <ResponsiveRadar
// //                       data={nivoRadarData}
// //                       keys={['votes']}
// //                       indexBy="option"
// //                       margin={{ top: 70, right: 80, bottom: 70, left: 80 }}
// //                       borderWidth={3}
// //                       colors={{ scheme: 'nivo' }}
// //                       gridLevels={5}
// //                       theme={{
// //                         grid: { line: { stroke: '#374151' } },
// //                         tooltip: {
// //                           container: { background: '#1F2937', color: '#ffffff', borderRadius: 8 }
// //                         }
// //                       }}
// //                     />
// //                   )}
// //                 </div>

// //                 {/* Detailed Results */}
// //                 <div className="mt-8 space-y-4">
// //                   <h4 className="text-xl font-semibold text-white text-center">Detailed Breakdown</h4>
// //                   {poll.options.map((option, index) => {
// //                     const percentage = poll.totalVotes > 0 
// //                       ? Math.round((option.votes_count / poll.totalVotes) * 100) 
// //                       : 0;
// //                     return (
// //                       <div key={option.id} className="bg-gray-700/50 rounded-xl p-4 border border-gray-600">
// //                         <div className="flex justify-between items-center mb-2">
// //                           <span className="text-white font-medium text-lg">{option.option_text}</span>
// //                           <div className="flex items-center gap-3">
// //                             <span className="text-blue-400 font-bold text-lg">{percentage}%</span>
// //                             <span className="text-gray-400 text-sm">({option.votes_count} votes)</span>
// //                           </div>
// //                         </div>
// //                         <Progress value={percentage} className="h-3 bg-gray-600" />
// //                       </div>
// //                     );
// //                   })}
// //                 </div>

// //                 {/* Action Buttons */}
// //                 <div className="mt-8 flex justify-center gap-3">
// //                   <Button
// //                     onClick={() => setShowAnalytics(true)}
// //                     className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
// //                   >
// //                     <Maximize2 className="mr-2 h-4 w-4" />
// //                     Full Analytics
// //                   </Button>
// //                   <Button
// //                     onClick={() => openShareModal(poll)}
// //                     variant="outline"
// //                     className="border-gray-600 bg-gray-700 hover:bg-gray-600 text-white"
// //                   >
// //                     <Share2 className="mr-2 h-4 w-4" />
// //                     Share Results
// //                   </Button>
// //                 </div>
// //               </CardContent>
// //             </Card>
// //           </div>
// //         </div>
// //       );
// //     }

// //     // Active poll view
// //     return (
// //       <div className="min-h-screen bg-gray-900 p-4">
// //         <div className="max-w-4xl mx-auto">
// //           <Card className="bg-gray-800 border-gray-700">
// //             <CardHeader className="text-center">
// //               <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
// //                 {poll.question}
// //               </CardTitle>
// //               {poll.description && (
// //                 <CardDescription className="text-gray-300 text-lg mt-2">
// //                   {poll.description}
// //                 </CardDescription>
// //               )}
// //               {poll.profiles && (
// //                 <div className="flex items-center justify-center gap-2 mt-4 text-gray-400">
// //                   <Avatar className="h-6 w-6">
// //                     <AvatarImage src={poll.profiles.avatar_url} />
// //                     <AvatarFallback className="text-xs">
// //                       {getInitials(poll.profiles.username)}
// //                     </AvatarFallback>
// //                   </Avatar>
// //                   <span>Created by {poll.profiles.username}</span>
// //                 </div>
// //               )}
// //             </CardHeader>
// //             <CardContent className="pt-6">
// //               {!hasVoted ? (
// //                 <div className="space-y-4">
// //                   <h3 className="text-xl font-semibold text-white text-center mb-6">Cast Your Vote</h3>
// //                   {poll.options.map((option) => (
// //                     <div 
// //                       key={option.id} 
// //                       className={`flex items-center space-x-4 p-4 border-2 rounded-xl transition-all duration-200 cursor-pointer ${
// //                         selectedOption === option.id 
// //                           ? 'border-blue-500 bg-blue-500/10 shadow-lg shadow-blue-500/20' 
// //                           : 'border-gray-600 bg-gray-700/50 hover:border-blue-400 hover:bg-blue-500/5'
// //                       }`}
// //                       onClick={() => setSelectedOption(option.id)}
// //                     >
// //                       <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
// //                         selectedOption === option.id 
// //                           ? 'border-blue-500 bg-blue-500' 
// //                           : 'border-gray-500 bg-transparent'
// //                       }`}>
// //                         {selectedOption === option.id && (
// //                           <div className="w-2 h-2 rounded-full bg-white"></div>
// //                         )}
// //                       </div>
// //                       <label className="text-white text-lg font-medium flex-1 cursor-pointer">
// //                         {option.option_text}
// //                       </label>
// //                     </div>
// //                   ))}
// //                   <Button 
// //                     onClick={handleVote} 
// //                     disabled={!selectedOption}
// //                     className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-6 text-lg font-semibold rounded-xl mt-6 disabled:opacity-50"
// //                     size="lg"
// //                   >
// //                     <Vote className="mr-3 h-5 w-5" />
// //                     Submit Vote
// //                   </Button>
// //                 </div>
// //               ) : (
// //                 <div className="space-y-6">
// //                   <div className="text-center">
// //                     <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
// //                       <CheckCheck className="h-8 w-8 text-green-400" />
// //                     </div>
// //                     <h3 className="text-2xl font-semibold text-white mb-2">Thank You for Voting!</h3>
// //                     {userVote && (
// //                       <p className="text-gray-300 text-lg">
// //                         You voted for: <span className="text-blue-400 font-semibold">
// //                           {poll.options.find(opt => opt.id === userVote.option_id)?.option_text}
// //                         </span>
// //                       </p>
// //                     )}
// //                   </div>
                  
// //                   <div className="bg-gray-700/50 rounded-xl p-6 border border-gray-600">
// //                     <h4 className="text-xl font-semibold text-white text-center mb-6">Live Results</h4>
                    
// //                     {/* Chart Selector */}
// //                     <div className="flex flex-wrap justify-center gap-2 mb-6">
// //                       {[
// //                         { key: 'bar', icon: BarChart4, label: 'Bar' },
// //                         { key: 'pie', icon: PieChartIcon, label: 'Pie' },
// //                         { key: 'radar', icon: Activity, label: 'Radar' }
// //                       ].map(({ key, icon: Icon, label }) => (
// //                         <Button
// //                           key={key}
// //                           variant={activeChart === key ? "default" : "outline"}
// //                           onClick={() => setActiveChart(key)}
// //                           size="sm"
// //                           className={`flex items-center gap-2 ${
// //                             activeChart === key 
// //                               ? 'bg-blue-600 text-white hover:bg-blue-700' 
// //                               : 'bg-gray-700 text-gray-300 border-gray-600 hover:bg-gray-600'
// //                           }`}
// //                         >
// //                           <Icon className="h-4 w-4" />
// //                           {label}
// //                         </Button>
// //                       ))}
// //                     </div>

// //                     {/* Chart */}
// //                     <div style={{ height: '400px' }} className="mb-6">
// //                       {activeChart === 'bar' && (
// //                         <ResponsiveBar
// //                           data={nivoBarData}
// //                           keys={['votes']}
// //                           indexBy="option"
// //                           margin={{ top: 20, right: 20, bottom: 80, left: 50 }}
// //                           colors={{ scheme: 'nivo' }}
// //                           borderRadius={6}
// //                           axisBottom={{
// //                             tickRotation: -45
// //                           }}
// //                           labelTextColor="#ffffff"
// //                           theme={{
// //                             axis: { ticks: { text: { fill: '#9CA3AF' } } },
// //                             grid: { line: { stroke: '#374151' } },
// //                             tooltip: {
// //                               container: { background: '#1F2937', color: '#ffffff', borderRadius: 8 }
// //                             }
// //                           }}
// //                         />
// //                       )}
                      
// //                       {activeChart === 'pie' && (
// //                         <ResponsivePie
// //                           data={nivoPieData}
// //                           margin={{ top: 20, right: 120, bottom: 20, left: 20 }}
// //                           innerRadius={0.5}
// //                           colors={{ scheme: 'nivo' }}
// //                           arcLabelsTextColor="#ffffff"
// //                           legends={[
// //                             {
// //                               anchor: 'right',
// //                               direction: 'column',
// //                               translateX: 100,
// //                               itemTextColor: '#D1D5DB',
// //                               itemWidth: 100,
// //                               itemHeight: 18
// //                             }
// //                           ]}
// //                           theme={{
// //                             tooltip: {
// //                               container: { background: '#1F2937', color: '#ffffff', borderRadius: 8 }
// //                             }
// //                           }}
// //                         />
// //                       )}

// //                       {activeChart === 'radar' && (
// //                         <ResponsiveRadar
// //                           data={nivoRadarData}
// //                           keys={['votes']}
// //                           indexBy="option"
// //                           margin={{ top: 50, right: 50, bottom: 50, left: 50 }}
// //                           colors={{ scheme: 'nivo' }}
// //                           borderWidth={3}
// //                           theme={{
// //                             grid: { line: { stroke: '#374151' } },
// //                             tooltip: {
// //                               container: { background: '#1F2937', color: '#ffffff', borderRadius: 8 }
// //                             }
// //                           }}
// //                         />
// //                       )}
// //                     </div>

// //                     {/* Detailed Results */}
// //                     <div className="space-y-3">
// //                       {poll.options.map((option) => {
// //                         const percentage = poll.totalVotes > 0 
// //                           ? Math.round((option.votes_count / poll.totalVotes) * 100) 
// //                           : 0;
// //                         const isUserVote = userVote && userVote.option_id === option.id;
                        
// //                         return (
// //                           <div key={option.id} className="space-y-2">
// //                             <div className="flex justify-between items-center">
// //                               <div className="flex items-center gap-3 flex-1">
// //                                 <span className="text-white font-medium">
// //                                   {option.option_text}
// //                                 </span>
// //                                 {isUserVote && (
// //                                   <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30 text-xs">
// //                                     Your Vote
// //                                   </Badge>
// //                                 )}
// //                               </div>
// //                               <span className="text-blue-400 font-bold text-lg bg-blue-500/20 px-3 py-1 rounded-full min-w-16 text-center">
// //                                 {percentage}%
// //                               </span>
// //                             </div>
// //                             <Progress 
// //                               value={percentage} 
// //                               className={`h-3 bg-gray-600 ${
// //                                 isUserVote ? '!bg-blue-500/50' : ''
// //                               }`}
// //                             />
// //                             <div className="flex justify-between text-sm text-gray-400">
// //                               <span>{option.votes_count} votes</span>
// //                               <span>{percentage}% of total</span>
// //                             </div>
// //                           </div>
// //                         );
// //                       })}
// //                     </div>
                    
// //                     {poll.totalVotes > 0 && (
// //                       <div className="mt-6 p-4 bg-gray-600/30 rounded-lg border border-gray-500">
// //                         <div className="flex items-center justify-between">
// //                           <span className="text-gray-300">Total Votes Cast:</span>
// //                           <span className="text-white font-bold text-lg">{poll.totalVotes}</span>
// //                         </div>
// //                       </div>
// //                     )}
// //                   </div>

// //                   {/* Action Buttons */}
// //                   <div className="flex flex-col sm:flex-row gap-3 justify-center">
// //                     <Button
// //                       onClick={() => setShowAnalytics(true)}
// //                       className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
// //                     >
// //                       <Activity className="mr-2 h-4 w-4" />
// //                       Advanced Analytics
// //                     </Button>
// //                     <Button
// //                       onClick={() => openShareModal(poll)}
// //                       variant="outline"
// //                       className="border-gray-600 bg-gray-700 hover:bg-gray-600 text-white"
// //                     >
// //                       <Share2 className="mr-2 h-4 w-4" />
// //                       Share Results
// //                     </Button>
// //                   </div>
// //                 </div>
// //               )}
// //             </CardContent>
// //           </Card>
// //         </div>
// //       </div>
// //     );
// //   }

// //   // All polls list view
// //   if (!pollId) {
// //     if (polls.length === 0) {
// //       return (
// //         <div className="min-h-screen bg-gray-900 flex items-center justify-center p-8">
// //           <div className="text-center max-w-2xl">
// //             <div className="w-32 h-32 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl">
// //               <Vote className="h-16 w-16 text-blue-400" />
// //             </div>
// //             <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent mb-6">
// //               Start the Conversation
// //             </h1>
// //             <p className="text-xl text-gray-300 mb-8 leading-relaxed">
// //               Create your first interactive poll and engage your audience with real-time voting, analytics, and beautiful visualizations.
// //             </p>
// //             <Button 
// //               onClick={() => {
// //                 navigate('/create-poll');
// //                 trackEvent('Navigation', 'create_first_poll');
// //               }}
// //               className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-6 text-lg rounded-xl shadow-2xl hover:shadow-3xl transition-all duration-300"
// //               size="lg"
// //             >
// //               <Plus className="mr-3 h-5 w-5" />
// //               Create First Poll
// //             </Button>
// //           </div>
// //         </div>
// //       );
// //     }
    
// //     return (
// //       <TooltipProvider>
// //         <div className="min-h-screen bg-gray-900 text-white p-4">
// //           <div className="max-w-7xl mx-auto">
// //             {/* Enhanced Stats Section */}
// //             {stats && (
// //               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
// //                 <Card className="bg-gray-800 border-gray-700 hover:border-blue-500/30 transition-all duration-300">
// //                   <CardContent className="p-6">
// //                     <div className="flex items-center justify-between">
// //                       <div>
// //                         <p className="text-gray-400 text-sm font-medium">Total Polls</p>
// //                         <p className="text-3xl font-bold text-white mt-1">{stats.totalPolls}</p>
// //                       </div>
// //                       <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
// //                         <BarChart3 className="h-6 w-6 text-blue-400" />
// //                       </div>
// //                     </div>
// //                   </CardContent>
// //                 </Card>
                
// //                 <Card className="bg-gray-800 border-gray-700 hover:border-green-500/30 transition-all duration-300">
// //                   <CardContent className="p-6">
// //                     <div className="flex items-center justify-between">
// //                       <div>
// //                         <p className="text-gray-400 text-sm font-medium">Total Votes</p>
// //                         <p className="text-3xl font-bold text-white mt-1">{stats.totalVotes.toLocaleString()}</p>
// //                       </div>
// //                       <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
// //                         <Users className="h-6 w-6 text-green-400" />
// //                       </div>
// //                     </div>
// //                   </CardContent>
// //                 </Card>
                
// //                 <Card className="bg-gray-800 border-gray-700 hover:border-purple-500/30 transition-all duration-300">
// //                   <CardContent className="p-6">
// //                     <div className="flex items-center justify-between">
// //                       <div>
// //                         <p className="text-gray-400 text-sm font-medium">Active Polls</p>
// //                         <p className="text-3xl font-bold text-white mt-1">{stats.activePolls}</p>
// //                       </div>
// //                       <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
// //                         <MessageCircle className="h-6 w-6 text-purple-400" />
// //                       </div>
// //                     </div>
// //                   </CardContent>
// //                 </Card>
                
// //                 <Card className="bg-gray-800 border-gray-700 hover:border-yellow-500/30 transition-all duration-300">
// //                   <CardContent className="p-6">
// //                     <div className="flex items-center justify-between">
// //                       <div>
// //                         <p className="text-gray-400 text-sm font-medium">Avg. Engagement</p>
// //                         <p className="text-3xl font-bold text-white mt-1">{stats.avgEngagement}%</p>
// //                       </div>
// //                       <div className="w-12 h-12 bg-yellow-500/20 rounded-xl flex items-center justify-center">
// //                         <TrendingUp className="h-6 w-6 text-yellow-400" />
// //                       </div>
// //                     </div>
// //                   </CardContent>
// //                 </Card>
// //               </div>
// //             )}
            
// //             {/* Action Bar */}
// //             <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 p-6 bg-gray-800 border border-gray-700 rounded-2xl">
// //               <div>
// //                 <h2 className="text-2xl font-bold text-white mb-2">Community Polls</h2>
// //                 <p className="text-gray-400">Discover and participate in real-time discussions</p>
// //               </div>
// //               <div className="flex gap-3">
// //                 <Button 
// //                   variant="outline"
// //                   className="border-gray-600 bg-gray-700 hover:bg-gray-600 text-white"
// //                 >
// //                   <Eye className="mr-2 h-4 w-4" />
// //                   Filter
// //                 </Button>
// //                 <Button 
// //                   onClick={() => navigate('/create-poll')}
// //                   className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg"
// //                 >
// //                   <Plus className="mr-2 h-4 w-4" />
// //                   New Poll
// //                 </Button>
// //               </div>
// //             </div>
            
// //             {/* Enhanced Polls Grid */}
// //             <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
// //               {polls.map(poll => {
// //                 const topChoice = getTopChoice(poll.options);
// //                 const status = getPollStatus(poll);
// //                 const isExpiredPoll = status === 'expired';
// //                 const isTrending = poll.totalVotes > 50;
// //                 const engagementColor = poll.engagementRate > 70 ? 'text-green-400' : 
// //                                       poll.engagementRate > 40 ? 'text-yellow-400' : 'text-red-400';

// //                 return (
// //                   <Card key={poll.id} className="bg-gray-800 border-gray-700 hover:border-blue-500/30 transition-all duration-300 group hover:shadow-2xl">
// //                     <CardHeader className="pb-4">
// //                       <div className="flex justify-between items-start mb-3">
// //                         <div className="flex items-center gap-2">
// //                           <Avatar className="h-8 w-8 border border-gray-600">
// //                             <AvatarImage src={poll.profiles?.avatar_url} />
// //                             <AvatarFallback className="bg-gradient-to-br from-blue-600 to-purple-600 text-xs">
// //                               {getInitials(poll.profiles?.username, poll.created_by)}
// //                             </AvatarFallback>
// //                           </Avatar>
// //                           <div className="flex gap-1">
// //                             {poll.is_password_protected && (
// //                               <Badge className="bg-yellow-500/20 text-yellow-300 border-yellow-500/30">
// //                                 <Shield className="h-3 w-3" />
// //                               </Badge>
// //                             )}
// //                             {isTrending && (
// //                               <Badge className="bg-green-500/20 text-green-300 border-green-500/30">
// //                                 <Zap className="h-3 w-3" />
// //                               </Badge>
// //                             )}
// //                             {isExpiredPoll && (
// //                               <Badge className="bg-red-500/20 text-red-300 border-red-500/30">
// //                                 <Clock className="h-3 w-3" />
// //                               </Badge>
// //                             )}
// //                           </div>
// //                         </div>
// //                         <Button 
// //                           variant="ghost" 
// //                           size="sm"
// //                           className="h-8 w-8 p-0 text-gray-400 hover:text-white"
// //                           onClick={() => openShareModal(poll)}
// //                         >
// //                           <Share2 className="h-4 w-4" />
// //                         </Button>
// //                       </div>
                      
// //                       <CardTitle className="text-lg text-white line-clamp-2 group-hover:text-blue-400 transition-colors cursor-pointer"
// //                         onClick={() => {
// //                           navigate(`/polls/${poll.id}`);
// //                           trackEvent('Poll', 'open_detail', poll.id);
// //                         }}
// //                       >
// //                         {poll.question}
// //                       </CardTitle>
                      
// //                       <CardDescription className="flex items-center justify-between text-sm mt-3">
// //                         <span className="text-gray-400 flex items-center gap-1">
// //                           <Calendar className="h-4 w-4" />
// //                           {new Date(poll.created_at).toLocaleDateString()}
// //                         </span>
// //                         <div className="flex gap-3">
// //                           <span className="text-gray-400 flex items-center gap-1">
// //                             <Users className="h-4 w-4" />
// //                             {poll.participantCount}
// //                           </span>
// //                           <span className={`flex items-center gap-1 ${engagementColor}`}>
// //                             <TrendingUp className="h-4 w-4" />
// //                             {poll.engagementRate}%
// //                           </span>
// //                         </div>
// //                       </CardDescription>
// //                     </CardHeader>
                    
// //                     <CardContent className="pt-0">
// //                       {poll.options.slice(0, 2).map((option) => {
// //                         const percentage = poll.totalVotes > 0 
// //                           ? Math.round((option.votes_count / poll.totalVotes) * 100) 
// //                           : 0;
// //                         return (
// //                           <div key={option.id} className="mb-3">
// //                             <div className="flex justify-between text-sm mb-1">
// //                               <span className="text-white truncate font-medium">{option.option_text}</span>
// //                               <span className="text-blue-400 font-bold">{percentage}%</span>
// //                             </div>
// //                             <Progress value={percentage} className="h-2 bg-gray-700" />
// //                           </div>
// //                         );
// //                       })}
// //                       {poll.options.length > 2 && (
// //                         <p className="text-gray-400 text-sm text-center mt-3 bg-gray-700 py-1 rounded-full">
// //                           +{poll.options.length - 2} more options
// //                         </p>
// //                       )}

// //                       {/* Top Choice Highlight */}
// //                       {topChoice && topChoice.votes_count > 0 && (
// //                         <div className="mt-4 p-3 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-lg">
// //                           <div className="flex items-center gap-2 mb-1">
// //                             <Trophy className="h-4 w-4 text-yellow-500" />
// //                             <span className="text-xs font-semibold text-yellow-400">Community Choice</span>
// //                           </div>
// //                           <p className="text-white text-sm font-medium truncate">
// //                             {topChoice.option_text}
// //                           </p>
// //                           <p className="text-gray-400 text-xs mt-1">
// //                             {Math.round((topChoice.votes_count / poll.totalVotes) * 100)}% of votes
// //                           </p>
// //                         </div>
// //                       )}
// //                     </CardContent>
                    
// //                     <CardFooter>
// //                       <div className="flex gap-2 w-full">
// //                         <Button 
// //                           className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-2.5 rounded-xl shadow-lg"
// //                           onClick={() => {
// //                             navigate(`/polls/${poll.id}`);
// //                             trackEvent('Poll', 'open_detail', poll.id);
// //                           }}
// //                         >
// //                           {isExpiredPoll ? (
// //                             <>
// //                               <BarChart3 className="mr-2 h-4 w-4" />
// //                               View Results
// //                             </>
// //                           ) : (
// //                             <>
// //                               <Vote className="mr-2 h-4 w-4" />
// //                               Vote Now
// //                             </>
// //                           )}
// //                         </Button>
// //                         <div className="flex gap-1">
// //                           <UITooltip>
// //                             <TooltipTrigger asChild>
// //                               <Button 
// //                                 variant="outline" 
// //                                 size="sm"
// //                                 className="border-gray-600 bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white"
// //                                 onClick={() => {
// //                                   setPoll(poll);
// //                                   setShowAnalytics(true);
// //                                 }}
// //                               >
// //                                 <Activity className="h-4 w-4" />
// //                               </Button>
// //                             </TooltipTrigger>
// //                             <TooltipContent>
// //                               <p>View Analytics</p>
// //                             </TooltipContent>
// //                           </UITooltip>
// //                           <UITooltip>
// //                             <TooltipTrigger asChild>
// //                               <Button 
// //                                 variant="outline" 
// //                                 size="sm"
// //                                 className="border-gray-600 bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white"
// //                                 onClick={() => openShareModal(poll)}
// //                               >
// //                                 {copiedPollId === poll.id ? (
// //                                   <CheckCheck className="h-4 w-4 text-green-400" />
// //                                 ) : (
// //                                   <Share2 className="h-4 w-4" />
// //                                 )}
// //                               </Button>
// //                             </TooltipTrigger>
// //                             <TooltipContent>
// //                               <p>Share Poll</p>
// //                             </TooltipContent>
// //                           </UITooltip>
// //                         </div>
// //                       </div>
// //                     </CardFooter>
// //                   </Card>
// //                 );
// //               })}
// //             </div>

// //             {/* Load More */}
// //             {hasMore && (
// //               <div className="text-center mt-12">
// //                 <Button 
// //                   onClick={loadMore}
// //                   disabled={loading}
// //                   className="bg-gray-800 border border-gray-700 hover:bg-gray-700 text-white px-8 py-6 rounded-xl"
// //                   size="lg"
// //                 >
// //                   {loading ? (
// //                     <div className="flex items-center gap-2">
// //                       <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
// //                       Loading...
// //                     </div>
// //                   ) : (
// //                     <>
// //                       <Sparkles className="mr-2 h-5 w-5" />
// //                       Load More Polls
// //                     </>
// //                   )}
// //                 </Button>
// //               </div>
// //             )}
// //           </div>
// //         </div>

// //         {/* Render Modals */}
// //         <PasswordModal />
// //         <ShareModal />
// //       </TooltipProvider>
// //     );
// //   }
  
// //   return null;
// // };

// // export default Polls;


// import React, { useState, useEffect, useCallback, useMemo } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useSocketContext } from '../context/SocketContext';
// import { UserAuth } from '../context/AuthContext';
// import { supabase } from '../supabaseClient';
// import { ResponsiveBar } from '@nivo/bar';
// import { ResponsivePie } from '@nivo/pie';
// import { ResponsiveLine } from '@nivo/line';
// import { ResponsiveRadar } from '@nivo/radar';
// import { 
//   Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter 
// } from '@/components/ui/card';
// import { Button } from '@/components/ui/button';
// import { Badge } from '@/components/ui/badge';
// import { Progress } from '@/components/ui/progress';
// import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
//   DialogClose,
// } from '@/components/ui/dialog';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import { 
//   Tooltip as UITooltip, 
//   TooltipContent, 
//   TooltipProvider, 
//   TooltipTrigger 
// } from '@/components/ui/tooltip';
// import { Skeleton } from '@/components/ui/skeleton';
// import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
// import { 
//   Calendar, Users, TrendingUp, BarChart3, Plus, Vote, Zap, Shield, 
//   Clock, Trophy, Sparkles, MessageCircle, Eye, Share2, MoreHorizontal,
//   Copy, CheckCheck, BarChart4, PieChart as PieChartIcon, LineChart as LineChartIcon,
//   Lock, X, QrCode, Download, Mail, FileText, Twitter, Linkedin, Facebook,
//   ExternalLink, AlertCircle, Activity, Maximize2, ArrowLeft, Check
// } from 'lucide-react';
// import { toast } from 'sonner';

// const trackEvent = (category, action, label, value) => {
//   if (window.gtag) {
//     window.gtag('event', action, {
//       event_category: category,
//       event_label: label,
//       value: value,
//     });
//   }
// };

// const trackPageView = (path) => {
//   if (window.gtag) {
//     window.gtag('config', import.meta.env.VITE_GA_MEASUREMENT_ID, {
//       page_path: path,
//     });
//   }
// };

// const NIVO_COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#6366F1', '#EC4899', '#84CC16'];

// const Polls = ({ pollId }) => {
//   const [polls, setPolls] = useState([]);
//   const [poll, setPoll] = useState(null);
//   const [selectedOption, setSelectedOption] = useState(null);
//   const [hasVoted, setHasVoted] = useState(false);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [userVote, setUserVote] = useState(null);
//   const [isExpired, setIsExpired] = useState(false);
//   const [page, setPage] = useState(1);
//   const [hasMore, setHasMore] = useState(true);
//   const [copiedPollId, setCopiedPollId] = useState(null);
//   const [activeChart, setActiveChart] = useState('bar');
//   const [showAnalytics, setShowAnalytics] = useState(false);
//   const [shareModalOpen, setShareModalOpen] = useState(false);
//   const [selectedSharePoll, setSelectedSharePoll] = useState(null);
//   const [passwordModalOpen, setPasswordModalOpen] = useState(false);
//   const [password, setPassword] = useState('');
//   const [pendingPollId, setPendingPollId] = useState(null);
  
//   const POLLS_PER_PAGE = 12;
  
//   const socketContext = useSocketContext();
//   const socket = socketContext?.socket;
//   const { user } = UserAuth();
//   const navigate = useNavigate();

//   useEffect(() => {
//     const path = pollId ? `/polls/${pollId}` : '/polls';
//     trackPageView(path);
//   }, [pollId]);

//   // Fetch all polls
//   const fetchAllPolls = useCallback(async (pageNum = 1, append = false) => {
//     try {
//       setLoading(true);
      
//       const from = (pageNum - 1) * POLLS_PER_PAGE;
//       const to = from + POLLS_PER_PAGE - 1;

//       const { data: pollsData, error: pollsError } = await supabase
//         .from('polls')
//         .select(`
//           *,
//           options!inner(id, option_text, votes_count, poll_id),
//           profiles(username, avatar_url)
//         `)
//         .order('created_at', { ascending: false })
//         .range(from, to);
        
//       if (pollsError) throw pollsError;

//       const pollIds = pollsData.map(p => p.id);
//       const { data: votesData } = await supabase
//         .from('votes')
//         .select('poll_id, user_id')
//         .in('poll_id', pollIds);

//       const participantsByPoll = votesData?.reduce((acc, vote) => {
//         if (!acc[vote.poll_id]) acc[vote.poll_id] = new Set();
//         acc[vote.poll_id].add(vote.user_id);
//         return acc;
//       }, {}) || {};

//       const processedPolls = pollsData.map(poll => {
//         const totalVotes = poll.options.reduce((sum, opt) => sum + opt.votes_count, 0);
//         const participantCount = participantsByPoll[poll.id]?.size || 0;
        
//         return {
//           ...poll,
//           totalVotes,
//           participantCount,
//           engagementRate: participantCount > 0 ? Math.round((totalVotes / participantCount) * 100) : 0
//         };
//       });

//       setPolls(append ? [...polls, ...processedPolls] : processedPolls);
//       setHasMore(pollsData.length === POLLS_PER_PAGE);
//       setLoading(false);
//       trackEvent('Polls', 'view_all', `page_${pageNum}`);
//     } catch (err) {
//       console.error("Error fetching polls:", err);
//       setError(err.message);
//       setLoading(false);
//       toast.error('Failed to load polls');
//     }
//   }, [polls]);

//   // Fetch single poll
//   const fetchPoll = useCallback(async (providedPassword = null) => {
//     try {
//       setLoading(true);
      
//       // First check if poll is password protected
//       const { data: pollCheck, error: checkError } = await supabase
//         .from('polls')
//         .select('is_password_protected, password_hash')
//         .eq('id', pollId)
//         .single();

//       if (checkError) throw checkError;

//       if (pollCheck.is_password_protected && !providedPassword) {
//         setPendingPollId(pollId);
//         setPasswordModalOpen(true);
//         setLoading(false);
//         return;
//       }

//       // If password protected, verify password
//       if (pollCheck.is_password_protected && providedPassword) {
//         // In a real app, you would hash the provided password and compare
//         // For now, we'll just check if it's not empty
//         if (!providedPassword.trim()) {
//           toast.error('Please enter a password');
//           setLoading(false);
//           return;
//         }
//       }

//       const { data: pollData, error: pollError } = await supabase
//         .from('polls')
//         .select(`
//           *,
//           options(*),
//           profiles(username, avatar_url),
//           votes(*)
//         `)
//         .eq('id', pollId)
//         .single();
        
//       if (pollError) throw pollError;

//       const isExpiredNow = pollData.expires_at && new Date(pollData.expires_at) < new Date();
      
//       let userHasVoted = false;
//       let existingVote = null;

//       if (user) {
//         const userVote = pollData.votes?.find(vote => vote.user_id === user.id);
//         if (userVote) {
//           userHasVoted = true;
//           existingVote = userVote;
//           setSelectedOption(userVote.option_id);
//         }
//       }

//       const totalVotes = pollData.options.reduce((sum, opt) => sum + opt.votes_count, 0);
//       const processedPoll = { ...pollData, totalVotes };

//       setPoll(processedPoll);
//       setHasVoted(userHasVoted);
//       setUserVote(existingVote);
//       setIsExpired(isExpiredNow);
//       setPasswordModalOpen(false);
//       setLoading(false);
//       trackEvent('Poll', 'view', pollId);
//     } catch (err) {
//       console.error("Error fetching poll:", err);
//       setError(err.message);
//       setLoading(false);
//       toast.error('Failed to load poll');
//     }
//   }, [pollId, user]);

//   // Initial fetch
//   useEffect(() => {
//     if (!pollId) {
//       fetchAllPolls(1);
//     } else if (pollId !== "undefined") {
//       fetchPoll();
//     } else {
//       setError("Invalid poll ID");
//       setLoading(false);
//     }
//   }, [pollId, user]);

//   // Socket connection
//   useEffect(() => {
//     if (!socket || !pollId || pollId === "undefined") return;
    
//     socket.emit("joinPoll", pollId);
    
//     const handlePollUpdate = (data) => {
//       if (data.data.id === pollId) {
//         setPoll(data.data);
//         trackEvent('Poll', 'real_time_update', pollId);
//       }
//     };
    
//     socket.on("pollDataUpdated", handlePollUpdate);
    
//     return () => {
//       socket.off("pollDataUpdated", handlePollUpdate);
//       socket.emit("leavePoll", pollId);
//     };
//   }, [socket, pollId]);
  
//   const handleVote = useCallback(async () => {
//     if (!selectedOption) {
//       toast.error('Please select an option to vote');
//       return;
//     }
    
//     try {
//       const { error } = await supabase
//         .from('votes')
//         .insert({
//           poll_id: pollId,
//           option_id: selectedOption,
//           user_id: user?.id || null
//         });
        
//       if (error) throw error;
      
//       // Update vote count
//       await supabase.rpc('increment_vote', { option_id: selectedOption });
      
//       setHasVoted(true);
//       toast.success('Your vote has been submitted!');
//       trackEvent('Poll', 'vote_submitted', pollId, selectedOption);
      
//       // Refresh poll data
//       fetchPoll();
//     } catch (err) {
//       console.error("Error voting:", err);
//       toast.error('Failed to submit vote');
//     }
//   }, [selectedOption, pollId, user, fetchPoll]);

//   const handlePasswordSubmit = useCallback(() => {
//     if (!password.trim()) {
//       toast.error('Please enter a password');
//       return;
//     }
//     fetchPoll(password);
//     setPassword('');
//   }, [password, fetchPoll]);

//   const handleSkipPassword = useCallback(() => {
//     setPasswordModalOpen(false);
//     setPendingPollId(null);
//     setPassword('');
//     navigate('/polls');
//     toast.info('Viewing public polls');
//   }, [navigate]);

//   const copyPollLink = useCallback(async (pollId) => {
//     const link = `${window.location.origin}/polls/${pollId}`;
//     try {
//       await navigator.clipboard.writeText(link);
//       setCopiedPollId(pollId);
//       toast.success('Poll link copied to clipboard!');
//       setTimeout(() => setCopiedPollId(null), 2000);
//       trackEvent('Poll', 'share_link', pollId);
//     } catch (err) {
//       toast.error('Failed to copy link');
//     }
//   }, []);

//   const openShareModal = useCallback((poll) => {
//     setSelectedSharePoll(poll);
//     setShareModalOpen(true);
//     trackEvent('Poll', 'open_share_modal', poll.id);
//   }, []);

//   const getInitials = useCallback((username, email) => {
//     if (username) return username.substring(0, 2).toUpperCase();
//     if (email) return email.substring(0, 2).toUpperCase();
//     return 'US';
//   }, []);

//   const loadMore = useCallback(() => {
//     const nextPage = page + 1;
//     setPage(nextPage);
//     fetchAllPolls(nextPage, true);
//     trackEvent('Polls', 'load_more', `page_${nextPage}`);
//   }, [page, fetchAllPolls]);

//   const getPollStatus = useCallback((poll) => {
//     if (poll.expires_at && new Date(poll.expires_at) < new Date()) {
//       return 'expired';
//     }
//     return 'active';
//   }, []);

//   const getTopChoice = useCallback((options) => {
//     if (!options || options.length === 0) return null;
//     return options.reduce((prev, current) => 
//       (prev.votes_count > current.votes_count) ? prev : current
//     );
//   }, []);

//   // Memoized stats
//   const stats = useMemo(() => {
//     if (!polls.length) return null;
    
//     return {
//       totalPolls: polls.length,
//       totalVotes: polls.reduce((sum, poll) => sum + poll.totalVotes, 0),
//       activePolls: polls.filter(poll => getPollStatus(poll) === 'active').length,
//       avgEngagement: Math.round(polls.reduce((sum, poll) => sum + poll.engagementRate, 0) / polls.length)
//     };
//   }, [polls, getPollStatus]);

//   // Nivo chart data transformations
//   const nivoBarData = useMemo(() => {
//     if (!poll?.options) return [];
//     return poll.options.map((option, index) => ({
//       id: option.option_text,
//       option: option.option_text,
//       votes: option.votes_count,
//       color: NIVO_COLORS[index % NIVO_COLORS.length]
//     }));
//   }, [poll]);

//   const nivoPieData = useMemo(() => {
//     if (!poll?.options) return [];
//     return poll.options.map((option, index) => ({
//       id: option.option_text,
//       label: option.option_text,
//       value: option.votes_count,
//       color: NIVO_COLORS[index % NIVO_COLORS.length]
//     }));
//   }, [poll]);

//   const nivoLineData = useMemo(() => {
//     if (!poll?.options) return [];
//     return [{
//       id: 'votes',
//       data: poll.options.map((option, index) => ({
//         x: option.option_text,
//         y: option.votes_count
//       }))
//     }];
//   }, [poll]);

//   const nivoRadarData = useMemo(() => {
//     if (!poll?.options) return [];
//     return poll.options.map((option) => ({
//       option: option.option_text,
//       votes: option.votes_count
//     }));
//   }, [poll]);

//   // Password Protection Modal
//   const PasswordModal = () => (
//     <Dialog open={passwordModalOpen} onOpenChange={setPasswordModalOpen}>
//       <DialogContent className="sm:max-w-md bg-[#10172A]/90 backdrop-blur border border-gray-700 text-white">
//         <DialogHeader>
//           <DialogTitle className="flex items-center gap-2 text-xl">
//             <Shield className="h-5 w-5 text-yellow-400" />
//             Password Protected Poll
//           </DialogTitle>
//           <DialogDescription className="text-gray-300 text-base">
//             This poll requires a password to access. Enter the password or skip to view public polls.
//           </DialogDescription>
//         </DialogHeader>
//         <div className="space-y-4 py-4">
//           <div className="space-y-2">
//             <Label htmlFor="password" className="text-gray-300">Password</Label>
//             <Input
//               id="password"
//               type="password"
//               placeholder="Enter poll password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               className="bg-[#0D1425] border-gray-700 text-white placeholder:text-gray-500"
//               onKeyPress={(e) => {
//                 if (e.key === 'Enter') handlePasswordSubmit();
//               }}
//               autoFocus
//             />
//           </div>
//         </div>
//         <DialogFooter className="flex-col sm:flex-row gap-2">
//           <Button
//             variant="outline"
//             onClick={handleSkipPassword}
//             className="w-full sm:w-auto border-gray-600 bg-[#0D1425] hover:bg-[#1a2332] text-white"
//           >
//             <Eye className="mr-2 h-4 w-4" />
//             Skip - View Public Polls
//           </Button>
//           <Button
//             onClick={handlePasswordSubmit}
//             className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white"
//           >
//             <Lock className="mr-2 h-4 w-4" />
//             Unlock Poll
//           </Button>
//         </DialogFooter>
//       </DialogContent>
//     </Dialog>
//   );

//   // Share Modal
//   const ShareModal = () => {
//     if (!selectedSharePoll) return null;
    
//     const pollUrl = `${window.location.origin}/polls/${selectedSharePoll.id}`;
//     const shareText = `Check out this poll: ${selectedSharePoll.question}`;

//     return (
//       <Dialog open={shareModalOpen} onOpenChange={setShareModalOpen}>
//         <DialogContent className="sm:max-w-md bg-[#10172A]/90 backdrop-blur border border-gray-700 text-white">
//           <DialogHeader>
//             <DialogTitle className="text-xl flex items-center gap-2">
//               <Share2 className="h-5 w-5 text-blue-400" />
//               Share Poll
//             </DialogTitle>
//             <DialogDescription className="text-gray-300">
//               {selectedSharePoll.question}
//             </DialogDescription>
//           </DialogHeader>
          
//           <div className="space-y-4 py-4">
//             <div className="flex gap-2">
//               <Input
//                 value={pollUrl}
//                 readOnly
//                 className="bg-[#0D1425] border-gray-700 text-white"
//               />
//               <Button
//                 onClick={() => copyPollLink(selectedSharePoll.id)}
//                 className="bg-blue-600 hover:bg-blue-700 text-white"
//               >
//                 {copiedPollId === selectedSharePoll.id ? (
//                   <Check className="h-4 w-4" />
//                 ) : (
//                   <Copy className="h-4 w-4" />
//                 )}
//               </Button>
//             </div>
            
//             <div className="flex flex-wrap gap-2">
//               <Button
//                 className="flex-1 bg-[#1DA1F2] hover:bg-[#1a8cd8] text-white"
//                 onClick={() => {
//                   window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(pollUrl)}`);
//                   trackEvent('Share', 'twitter', selectedSharePoll.id);
//                 }}
//               >
//                 Twitter
//               </Button>
              
//               <Button
//                 className="flex-1 bg-[#0077B5] hover:bg-[#006399] text-white"
//                 onClick={() => {
//                   window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(pollUrl)}`);
//                   trackEvent('Share', 'linkedin', selectedSharePoll.id);
//                 }}
//               >
//                 LinkedIn
//               </Button>
              
//               <Button
//                 className="flex-1 bg-[#1877F2] hover:bg-[#145dbf] text-white"
//                 onClick={() => {
//                   window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(pollUrl)}`);
//                   trackEvent('Share', 'facebook', selectedSharePoll.id);
//                 }}
//               >
//                 Facebook
//               </Button>
//             </div>
//           </div>
//         </DialogContent>
//       </Dialog>
//     );
//   };

//   // Analytics Dashboard Component
//   const AnalyticsDashboard = () => {
//     if (!poll) return null;

//     return (
//       <div className="min-h-screen pt-16">
//         <div className="max-w-7xl mx-auto p-4 md:p-8">
//           {/* Header */}
//           <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
//             <div className="flex items-center gap-3">
//               <Button
//                 variant="outline"
//                 onClick={() => setShowAnalytics(false)}
//                 className="border-gray-600 bg-[#0D1425] hover:bg-[#1a2332] text-white"
//               >
//                 <ArrowLeft className="mr-2 h-4 w-4" />
//                 Back to Poll
//               </Button>
//               <h1 className="text-3xl font-bold text-white">Poll Analytics</h1>
//             </div>
//             <h2 className="text-xl text-gray-300 truncate max-w-2xl">{poll.question}</h2>
//           </div>

//           {/* Key Metrics */}
//           <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
//             <Card className="bg-[#10172A]/80 backdrop-blur border border-gray-700">
//               <CardContent className="p-4">
//                 <div className="flex items-center justify-between">
//                   <div>
//                     <p className="text-gray-400 text-sm">Total Votes</p>
//                     <p className="text-3xl font-bold text-white">{poll.totalVotes}</p>
//                   </div>
//                   <Users className="h-8 w-8 text-blue-400" />
//                 </div>
//               </CardContent>
//             </Card>
            
//             <Card className="bg-[#10172A]/80 backdrop-blur border border-gray-700">
//               <CardContent className="p-4">
//                 <div className="flex items-center justify-between">
//                   <div>
//                     <p className="text-gray-400 text-sm">Options</p>
//                     <p className="text-3xl font-bold text-white">{poll.options?.length || 0}</p>
//                   </div>
//                   <Vote className="h-8 w-8 text-green-400" />
//                 </div>
//               </CardContent>
//             </Card>
            
//             <Card className="bg-[#10172A]/80 backdrop-blur border border-gray-700">
//               <CardContent className="p-4">
//                 <div className="flex items-center justify-between">
//                   <div>
//                     <p className="text-gray-400 text-sm">Top Choice</p>
//                     <p className="text-xl font-bold text-white truncate">
//                       {getTopChoice(poll.options)?.option_text || 'N/A'}
//                     </p>
//                   </div>
//                   <Trophy className="h-8 w-8 text-yellow-400" />
//                 </div>
//               </CardContent>
//             </Card>
            
//             <Card className="bg-[#10172A]/80 backdrop-blur border border-gray-700">
//               <CardContent className="p-4">
//                 <div className="flex items-center justify-between">
//                   <div>
//                     <p className="text-gray-400 text-sm">Status</p>
//                     <Badge className={isExpired ? 'bg-red-500/20 text-red-300' : 'bg-green-500/20 text-green-300'}>
//                       {isExpired ? 'Expired' : 'Active'}
//                     </Badge>
//                   </div>
//                   <Clock className="h-8 w-8 text-gray-400" />
//                 </div>
//               </CardContent>
//             </Card>
//           </div>

//           {/* Chart Selector */}
//           <div className="flex flex-wrap gap-2 justify-center mb-8">
//             {[
//               { key: 'bar', icon: BarChart4, label: 'Bar Chart' },
//               { key: 'pie', icon: PieChartIcon, label: 'Pie Chart' },
//               { key: 'line', icon: LineChartIcon, label: 'Line Chart' },
//               { key: 'radar', icon: Activity, label: 'Radar Chart' }
//             ].map(({ key, icon: Icon, label }) => (
//               <Button
//                 key={key}
//                 variant={activeChart === key ? "default" : "outline"}
//                 onClick={() => setActiveChart(key)}
//                 className={`flex items-center gap-2 ${
//                   activeChart === key 
//                     ? 'bg-blue-600 text-white hover:bg-blue-700' 
//                     : 'bg-[#0D1425] text-white border-gray-600 hover:bg-[#1a2332]'
//                 }`}
//               >
//                 <Icon className="h-4 w-4" />
//                 {label}
//               </Button>
//             ))}
//           </div>

//           {/* Nivo Charts */}
//           <Card className="bg-[#10172A]/80 backdrop-blur border border-gray-700 mb-8">
//             <CardContent className="p-6">
//               <div style={{ height: '500px' }}>
//                 {activeChart === 'bar' && (
//                   <ResponsiveBar
//                     data={nivoBarData}
//                     keys={['votes']}
//                     indexBy="option"
//                     margin={{ top: 50, right: 130, bottom: 100, left: 60 }}
//                     padding={0.3}
//                     valueScale={{ type: 'linear' }}
//                     colors={{ scheme: 'nivo' }}
//                     borderRadius={8}
//                     borderColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
//                     axisTop={null}
//                     axisRight={null}
//                     axisBottom={{
//                       tickSize: 5,
//                       tickPadding: 5,
//                       tickRotation: -45,
//                       legend: 'Options',
//                       legendPosition: 'middle',
//                       legendOffset: 70
//                     }}
//                     axisLeft={{
//                       tickSize: 5,
//                       tickPadding: 5,
//                       tickRotation: 0,
//                       legend: 'Votes',
//                       legendPosition: 'middle',
//                       legendOffset: -50
//                     }}
//                     labelSkipWidth={12}
//                     labelSkipHeight={12}
//                     labelTextColor="#ffffff"
//                     animate={true}
//                     motionConfig="gentle"
//                     theme={{
//                       axis: {
//                         ticks: { text: { fill: '#9CA3AF' } },
//                         legend: { text: { fill: '#D1D5DB' } }
//                       },
//                       grid: { line: { stroke: '#374151' } },
//                       tooltip: {
//                         container: {
//                           background: '#1F2937',
//                           color: '#ffffff',
//                           fontSize: 14,
//                           borderRadius: 8,
//                           boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)'
//                         }
//                       }
//                     }}
//                   />
//                 )}

//                 {activeChart === 'pie' && (
//                   <ResponsivePie
//                     data={nivoPieData}
//                     margin={{ top: 40, right: 200, bottom: 40, left: 80 }}
//                     innerRadius={0.5}
//                     padAngle={2}
//                     cornerRadius={8}
//                     activeOuterRadiusOffset={8}
//                     colors={{ scheme: 'nivo' }}
//                     borderWidth={2}
//                     borderColor={{ from: 'color', modifiers: [['darker', 0.2]] }}
//                     arcLinkLabelsSkipAngle={10}
//                     arcLinkLabelsTextColor="#D1D5DB"
//                     arcLinkLabelsThickness={2}
//                     arcLinkLabelsColor={{ from: 'color' }}
//                     arcLabelsSkipAngle={10}
//                     arcLabelsTextColor="#ffffff"
//                     legends={[
//                       {
//                         anchor: 'right',
//                         direction: 'column',
//                         justify: false,
//                         translateX: 140,
//                         translateY: 0,
//                         itemsSpacing: 12,
//                         itemWidth: 120,
//                         itemHeight: 20,
//                         itemTextColor: '#D1D5DB',
//                         itemDirection: 'left-to-right',
//                         itemOpacity: 1,
//                         symbolSize: 16,
//                         symbolShape: 'circle'
//                       }
//                     ]}
//                     animate={true}
//                     motionConfig="gentle"
//                     theme={{
//                       tooltip: {
//                         container: {
//                           background: '#1F2937',
//                           color: '#ffffff',
//                           fontSize: 14,
//                           borderRadius: 8,
//                           boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)'
//                         }
//                       }
//                     }}
//                   />
//                 )}

//                 {activeChart === 'line' && (
//                   <ResponsiveLine
//                     data={nivoLineData}
//                     margin={{ top: 50, right: 110, bottom: 100, left: 60 }}
//                     xScale={{ type: 'point' }}
//                     yScale={{ type: 'linear', min: 'auto', max: 'auto', stacked: false }}
//                     curve="cardinal"
//                     axisTop={null}
//                     axisRight={null}
//                     axisBottom={{
//                       tickSize: 5,
//                       tickPadding: 5,
//                       tickRotation: -45,
//                       legend: 'Options',
//                       legendOffset: 70,
//                       legendPosition: 'middle'
//                     }}
//                     axisLeft={{
//                       tickSize: 5,
//                       tickPadding: 5,
//                       tickRotation: 0,
//                       legend: 'Votes',
//                       legendOffset: -50,
//                       legendPosition: 'middle'
//                     }}
//                     pointSize={12}
//                     pointColor={{ theme: 'background' }}
//                     pointBorderWidth={3}
//                     pointBorderColor={{ from: 'serieColor' }}
//                     pointLabelYOffset={-12}
//                     useMesh={true}
//                     colors={{ scheme: 'nivo' }}
//                     lineWidth={4}
//                     enableGridX={false}
//                     animate={true}
//                     motionConfig="gentle"
//                     theme={{
//                       axis: {
//                         ticks: { text: { fill: '#9CA3AF' } },
//                         legend: { text: { fill: '#D1D5DB' } }
//                       },
//                       grid: { line: { stroke: '#374151' } },
//                       tooltip: {
//                         container: {
//                           background: '#1F2937',
//                           color: '#ffffff',
//                           fontSize: 14,
//                           borderRadius: 8,
//                           boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)'
//                         }
//                       }
//                     }}
//                   />
//                 )}

//                 {activeChart === 'radar' && (
//                   <ResponsiveRadar
//                     data={nivoRadarData}
//                     keys={['votes']}
//                     indexBy="option"
//                     maxValue="auto"
//                     margin={{ top: 70, right: 80, bottom: 70, left: 80 }}
//                     curve="linearClosed"
//                     borderWidth={3}
//                     borderColor={{ from: 'color' }}
//                     gridLevels={5}
//                     gridShape="circular"
//                     gridLabelOffset={36}
//                     enableDots={true}
//                     dotSize={10}
//                     dotColor={{ theme: 'background' }}
//                     dotBorderWidth={2}
//                     dotBorderColor={{ from: 'color' }}
//                     colors={{ scheme: 'nivo' }}
//                     fillOpacity={0.25}
//                     blendMode="multiply"
//                     animate={true}
//                     motionConfig="gentle"
//                     theme={{
//                       axis: {
//                         ticks: { text: { fill: '#9CA3AF' } },
//                         legend: { text: { fill: '#D1D5DB' } }
//                       },
//                       grid: { line: { stroke: '#374151' } },
//                       tooltip: {
//                         container: {
//                           background: '#1F2937',
//                           color: '#ffffff',
//                           fontSize: 14,
//                           borderRadius: 8,
//                           boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)'
//                         }
//                       }
//                     }}
//                   />
//                 )}
//               </div>
//             </CardContent>
//           </Card>

//           {/* Detailed Breakdown */}
//           <Card className="bg-[#10172A]/80 backdrop-blur border border-gray-700 mb-8">
//             <CardHeader>
//               <CardTitle className="text-xl text-white">Detailed Breakdown</CardTitle>
//             </CardHeader>
//             <CardContent>
//               <div className="space-y-4">
//                 {poll.options?.map((option, index) => {
//                   const percentage = poll.totalVotes > 0 
//                     ? Math.round((option.votes_count / poll.totalVotes) * 100) 
//                     : 0;
//                   return (
//                     <div key={option.id} className="space-y-2">
//                       <div className="flex justify-between items-center">
//                         <div className="flex items-center gap-3">
//                           <div 
//                             className="w-4 h-4 rounded-full" 
//                             style={{ backgroundColor: NIVO_COLORS[index % NIVO_COLORS.length] }}
//                           />
//                           <span className="text-white font-medium">{option.option_text}</span>
//                         </div>
//                         <div className="flex items-center gap-4">
//                           <span className="text-blue-400 font-bold text-lg">{percentage}%</span>
//                           <span className="text-gray-400">{option.votes_count} votes</span>
//                         </div>
//                       </div>
//                       <Progress value={percentage} className="h-2 bg-gray-700" />
//                     </div>
//                   );
//                 })}
//               </div>
//             </CardContent>
//           </Card>

//           {/* Export Options */}
//           <div className="flex justify-end gap-3">
//             <Button
//               variant="outline"
//               className="border-gray-600 bg-[#0D1425] hover:bg-[#1a2332] text-white"
//               onClick={() => {
//                 toast.info('PDF export coming soon!');
//                 trackEvent('Analytics', 'export_pdf', poll.id);
//               }}
//             >
//               <Download className="mr-2 h-4 w-4" />
//               Export as PDF
//             </Button>
//             <Button
//               variant="outline"
//               className="border-gray-600 bg-[#0D1425] hover:bg-[#1a2332] text-white"
//               onClick={() => {
//                 toast.info('Image export coming soon!');
//                 trackEvent('Analytics', 'export_image', poll.id);
//               }}
//             >
//               <Download className="mr-2 h-4 w-4" />
//               Export as Image
//             </Button>
//           </div>
//         </div>
//       </div>
//     );
//   };

//   // Loading skeleton
//   if (loading && polls.length === 0) {
//     return (
//       <div className="min-h-screen pt-16">
//         <div className="max-w-7xl mx-auto p-4">
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
//             {[1, 2, 3, 4].map(i => (
//               <Card key={i} className="bg-[#10172A]/80 backdrop-blur border border-gray-700">
//                 <CardContent className="p-6">
//                   <Skeleton className="h-4 w-20 mb-2 bg-gray-700" />
//                   <Skeleton className="h-8 w-16 bg-gray-700" />
//                 </CardContent>
//               </Card>
//             ))}
//           </div>
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//             {[1, 2, 3, 4, 5, 6].map(i => (
//               <Card key={i} className="bg-[#10172A]/80 backdrop-blur border border-gray-700">
//                 <CardHeader>
//                   <Skeleton className="h-6 w-3/4 mb-2 bg-gray-700" />
//                   <Skeleton className="h-4 w-1/2 bg-gray-700" />
//                 </CardHeader>
//                 <CardContent className="space-y-3">
//                   <Skeleton className="h-4 w-full bg-gray-700" />
//                   <Skeleton className="h-4 w-5/6 bg-gray-700" />
//                 </CardContent>
//                 <CardFooter>
//                   <Skeleton className="h-10 w-full bg-gray-700" />
//                 </CardFooter>
//               </Card>
//             ))}
//           </div>
//         </div>
//       </div>
//     );
//   }

//   // Error state
//   if (error) {
//     return (
//       <div className="min-h-screen pt-16 flex items-center justify-center p-8">
//         <Card className="bg-[#10172A]/80 backdrop-blur border border-gray-700 max-w-md text-center">
//           <CardContent className="pt-6">
//             <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
//               <AlertCircle className="h-8 w-8 text-red-400" />
//             </div>
//             <h3 className="text-xl font-semibold text-white mb-2">Unable to Load Polls</h3>
//             <p className="text-gray-300 mb-4">{error}</p>
//             <Button 
//               onClick={() => pollId ? fetchPoll() : fetchAllPolls()}
//               className="bg-blue-600 hover:bg-blue-700 text-white"
//             >
//               Try Again
//             </Button>
//           </CardContent>
//         </Card>
//       </div>
//     );
//   }

//   // Show analytics dashboard if requested
//   if (showAnalytics && poll) {
//     return <AnalyticsDashboard />;
//   }

//   // Single poll view
//   if (pollId && poll) {
//     if (isExpired) {
//       return (
//         <div className="min-h-screen pt-16">
//           <div className="max-w-6xl mx-auto p-4">
//             <Card className="bg-[#10172A]/80 backdrop-blur border border-gray-700">
//               <CardHeader className="text-center">
//                 <CardTitle className="text-3xl font-bold text-white">
//                   {poll.question}
//                 </CardTitle>
//                 <div className="bg-red-500/20 border border-red-500/30 text-red-200 p-4 rounded-xl mt-4 max-w-md mx-auto">
//                   <div className="flex items-center justify-center gap-2">
//                     <Clock className="h-5 w-5" />
//                     This poll has expired and is no longer accepting votes.
//                   </div>
//                 </div>
//               </CardHeader>
//               <CardContent className="pt-6">
//                 <h3 className="text-2xl font-semibold text-white text-center mb-8">Final Results</h3>
                
//                 {/* Chart Type Selector */}
//                 <div className="flex flex-wrap justify-center gap-2 mb-8">
//                   {[
//                     { key: 'bar', icon: BarChart4, label: 'Bar' },
//                     { key: 'pie', icon: PieChartIcon, label: 'Pie' },
//                     { key: 'line', icon: LineChartIcon, label: 'Line' },
//                     { key: 'radar', icon: Activity, label: 'Radar' }
//                   ].map(({ key, icon: Icon, label }) => (
//                     <Button
//                       key={key}
//                       variant={activeChart === key ? "default" : "outline"}
//                       onClick={() => setActiveChart(key)}
//                       className={`flex items-center gap-2 ${
//                         activeChart === key 
//                           ? 'bg-blue-600 text-white hover:bg-blue-700' 
//                           : 'bg-[#0D1425] text-white border-gray-600 hover:bg-[#1a2332]'
//                       }`}
//                     >
//                       <Icon className="h-4 w-4" />
//                       {label}
//                     </Button>
//                   ))}
//                 </div>

//                 {/* Nivo Charts */}
//                 <div style={{ height: '500px' }}>
//                   {activeChart === 'bar' && (
//                     <ResponsiveBar
//                       data={nivoBarData}
//                       keys={['votes']}
//                       indexBy="option"
//                       margin={{ top: 50, right: 130, bottom: 100, left: 60 }}
//                       padding={0.3}
//                       colors={{ scheme: 'nivo' }}
//                       borderRadius={8}
//                       axisBottom={{
//                         tickRotation: -45,
//                         legend: 'Options',
//                         legendPosition: 'middle',
//                         legendOffset: 70
//                       }}
//                       axisLeft={{
//                         legend: 'Votes',
//                         legendPosition: 'middle',
//                         legendOffset: -50
//                       }}
//                       labelTextColor="#ffffff"
//                       animate={true}
//                       theme={{
//                         axis: {
//                           ticks: { text: { fill: '#9CA3AF' } },
//                           legend: { text: { fill: '#D1D5DB' } }
//                         },
//                         grid: { line: { stroke: '#374151' } },
//                         tooltip: {
//                           container: {
//                             background: '#1F2937',
//                             color: '#ffffff',
//                             borderRadius: 8
//                           }
//                         }
//                       }}
//                     />
//                   )}

//                   {activeChart === 'pie' && (
//                     <ResponsivePie
//                       data={nivoPieData}
//                       margin={{ top: 40, right: 200, bottom: 40, left: 80 }}
//                       innerRadius={0.5}
//                       padAngle={2}
//                       cornerRadius={8}
//                       colors={{ scheme: 'nivo' }}
//                       arcLabelsTextColor="#ffffff"
//                       legends={[
//                         {
//                           anchor: 'right',
//                           direction: 'column',
//                           translateX: 140,
//                           itemTextColor: '#D1D5DB',
//                           itemWidth: 120,
//                           itemHeight: 20
//                         }
//                       ]}
//                       theme={{
//                         tooltip: {
//                           container: { background: '#1F2937', color: '#ffffff', borderRadius: 8 }
//                         }
//                       }}
//                     />
//                   )}

//                   {activeChart === 'line' && (
//                     <ResponsiveLine
//                       data={nivoLineData}
//                       margin={{ top: 50, right: 110, bottom: 100, left: 60 }}
//                       xScale={{ type: 'point' }}
//                       yScale={{ type: 'linear' }}
//                       curve="cardinal"
//                       axisBottom={{
//                         tickRotation: -45,
//                         legend: 'Options',
//                         legendOffset: 70,
//                         legendPosition: 'middle'
//                       }}
//                       axisLeft={{
//                         legend: 'Votes',
//                         legendOffset: -50,
//                         legendPosition: 'middle'
//                       }}
//                       pointSize={12}
//                       colors={{ scheme: 'nivo' }}
//                       lineWidth={4}
//                       theme={{
//                         axis: {
//                           ticks: { text: { fill: '#9CA3AF' } },
//                           legend: { text: { fill: '#D1D5DB' } }
//                         },
//                         grid: { line: { stroke: '#374151' } },
//                         tooltip: {
//                           container: { background: '#1F2937', color: '#ffffff', borderRadius: 8 }
//                         }
//                       }}
//                     />
//                   )}

//                   {activeChart === 'radar' && (
//                     <ResponsiveRadar
//                       data={nivoRadarData}
//                       keys={['votes']}
//                       indexBy="option"
//                       margin={{ top: 70, right: 80, bottom: 70, left: 80 }}
//                       borderWidth={3}
//                       colors={{ scheme: 'nivo' }}
//                       gridLevels={5}
//                       theme={{
//                         grid: { line: { stroke: '#374151' } },
//                         tooltip: {
//                           container: { background: '#1F2937', color: '#ffffff', borderRadius: 8 }
//                         }
//                       }}
//                     />
//                   )}
//                 </div>

//                 {/* Detailed Results */}
//                 <div className="mt-8 space-y-4">
//                   <h4 className="text-xl font-semibold text-white text-center">Detailed Breakdown</h4>
//                   {poll.options.map((option, index) => {
//                     const percentage = poll.totalVotes > 0 
//                       ? Math.round((option.votes_count / poll.totalVotes) * 100) 
//                       : 0;
//                     return (
//                       <div key={option.id} className="bg-[#0D1425]/50 rounded-xl p-4 border border-gray-700">
//                         <div className="flex justify-between items-center mb-2">
//                           <span className="text-white font-medium text-lg">{option.option_text}</span>
//                           <div className="flex items-center gap-3">
//                             <span className="text-blue-400 font-bold text-lg">{percentage}%</span>
//                             <span className="text-gray-400 text-sm">({option.votes_count} votes)</span>
//                           </div>
//                         </div>
//                         <Progress value={percentage} className="h-3 bg-gray-700" />
//                       </div>
//                     );
//                   })}
//                 </div>

//                 {/* Action Buttons */}
//                 <div className="mt-8 flex justify-center gap-3">
//                   <Button
//                     onClick={() => setShowAnalytics(true)}
//                     className="bg-blue-600 hover:bg-blue-700 text-white"
//                   >
//                     <Maximize2 className="mr-2 h-4 w-4" />
//                     Full Analytics
//                   </Button>
//                   <Button
//                     onClick={() => openShareModal(poll)}
//                     variant="outline"
//                     className="border-gray-600 bg-[#0D1425] hover:bg-[#1a2332] text-white"
//                   >
//                     <Share2 className="mr-2 h-4 w-4" />
//                     Share Results
//                   </Button>
//                 </div>
//               </CardContent>
//             </Card>
//           </div>
//         </div>
//       );
//     }

//     // Active poll view
//     return (
//       <div className="min-h-screen pt-16">
//         <div className="max-w-4xl mx-auto p-4">
//           <Card className="bg-[#10172A]/80 backdrop-blur border border-gray-700">
//             <CardHeader className="text-center">
//               <CardTitle className="text-3xl font-bold text-white">
//                 {poll.question}
//               </CardTitle>
//               {poll.description && (
//                 <CardDescription className="text-gray-300 text-lg mt-2">
//                   {poll.description}
//                 </CardDescription>
//               )}
//               {poll.profiles && (
//                 <div className="flex items-center justify-center gap-2 mt-4 text-gray-400">
//                   <Avatar className="h-6 w-6">
//                     <AvatarImage src={poll.profiles.avatar_url} />
//                     <AvatarFallback className="text-xs">
//                       {getInitials(poll.profiles.username)}
//                     </AvatarFallback>
//                   </Avatar>
//                   <span>Created by {poll.profiles.username}</span>
//                 </div>
//               )}
//             </CardHeader>
//             <CardContent className="pt-6">
//               {!hasVoted ? (
//                 <div className="space-y-4">
//                   <h3 className="text-xl font-semibold text-white text-center mb-6">Cast Your Vote</h3>
//                   {poll.options.map((option) => (
//                     <div 
//                       key={option.id} 
//                       className={`flex items-center space-x-4 p-4 border-2 rounded-xl transition-all duration-200 cursor-pointer ${
//                         selectedOption === option.id 
//                           ? 'border-blue-500 bg-blue-500/10' 
//                           : 'border-gray-600 bg-[#0D1425]/50 hover:border-blue-400 hover:bg-blue-500/5'
//                       }`}
//                       onClick={() => setSelectedOption(option.id)}
//                     >
//                       <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
//                         selectedOption === option.id 
//                           ? 'border-blue-500 bg-blue-500' 
//                           : 'border-gray-500 bg-transparent'
//                       }`}>
//                         {selectedOption === option.id && (
//                           <div className="w-2 h-2 rounded-full bg-white"></div>
//                         )}
//                       </div>
//                       <label className="text-white text-lg font-medium flex-1 cursor-pointer">
//                         {option.option_text}
//                       </label>
//                     </div>
//                   ))}
//                   <Button 
//                     onClick={handleVote} 
//                     disabled={!selectedOption}
//                     className="w-full bg-blue-600 hover:bg-blue-700 text-white py-6 text-lg font-semibold rounded-xl mt-6 disabled:opacity-50"
//                     size="lg"
//                   >
//                     <Vote className="mr-3 h-5 w-5" />
//                     Submit Vote
//                   </Button>
//                 </div>
//               ) : (
//                 <div className="space-y-6">
//                   <div className="text-center">
//                     <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
//                       <Check className="h-8 w-8 text-green-400" />
//                     </div>
//                     <h3 className="text-2xl font-semibold text-white mb-2">Thank You for Voting!</h3>
//                     {userVote && (
//                       <p className="text-gray-300 text-lg">
//                         You voted for: <span className="text-blue-400 font-semibold">
//                           {poll.options.find(opt => opt.id === userVote.option_id)?.option_text}
//                         </span>
//                       </p>
//                     )}
//                   </div>
                  
//                   <div className="bg-[#0D1425]/50 rounded-xl p-6 border border-gray-700">
//                     <h4 className="text-xl font-semibold text-white text-center mb-6">Live Results</h4>
                    
//                     {/* Chart Selector */}
//                     <div className="flex flex-wrap justify-center gap-2 mb-6">
//                       {[
//                         { key: 'bar', icon: BarChart4, label: 'Bar' },
//                         { key: 'pie', icon: PieChartIcon, label: 'Pie' },
//                         { key: 'radar', icon: Activity, label: 'Radar' }
//                       ].map(({ key, icon: Icon, label }) => (
//                         <Button
//                           key={key}
//                           variant={activeChart === key ? "default" : "outline"}
//                           onClick={() => setActiveChart(key)}
//                           size="sm"
//                           className={`flex items-center gap-2 ${
//                             activeChart === key 
//                               ? 'bg-blue-600 text-white hover:bg-blue-700' 
//                               : 'bg-[#0D1425] text-white border-gray-600 hover:bg-[#1a2332]'
//                           }`}
//                         >
//                           <Icon className="h-4 w-4" />
//                           {label}
//                         </Button>
//                       ))}
//                     </div>

//                     {/* Chart */}
//                     <div style={{ height: '400px' }} className="mb-6">
//                       {activeChart === 'bar' && (
//                         <ResponsiveBar
//                           data={nivoBarData}
//                           keys={['votes']}
//                           indexBy="option"
//                           margin={{ top: 20, right: 20, bottom: 80, left: 50 }}
//                           colors={{ scheme: 'nivo' }}
//                           borderRadius={6}
//                           axisBottom={{
//                             tickRotation: -45
//                           }}
//                           labelTextColor="#ffffff"
//                           theme={{
//                             axis: { ticks: { text: { fill: '#9CA3AF' } } },
//                             grid: { line: { stroke: '#374151' } },
//                             tooltip: {
//                               container: { background: '#1F2937', color: '#ffffff', borderRadius: 8 }
//                             }
//                           }}
//                         />
//                       )}
                      
//                       {activeChart === 'pie' && (
//                         <ResponsivePie
//                           data={nivoPieData}
//                           margin={{ top: 20, right: 120, bottom: 20, left: 20 }}
//                           innerRadius={0.5}
//                           colors={{ scheme: 'nivo' }}
//                           arcLabelsTextColor="#ffffff"
//                           legends={[
//                             {
//                               anchor: 'right',
//                               direction: 'column',
//                               translateX: 100,
//                               itemTextColor: '#D1D5DB',
//                               itemWidth: 100,
//                               itemHeight: 18
//                             }
//                           ]}
//                           theme={{
//                             tooltip: {
//                               container: { background: '#1F2937', color: '#ffffff', borderRadius: 8 }
//                             }
//                           }}
//                         />
//                       )}

//                       {activeChart === 'radar' && (
//                         <ResponsiveRadar
//                           data={nivoRadarData}
//                           keys={['votes']}
//                           indexBy="option"
//                           margin={{ top: 50, right: 50, bottom: 50, left: 50 }}
//                           colors={{ scheme: 'nivo' }}
//                           borderWidth={3}
//                           theme={{
//                             grid: { line: { stroke: '#374151' } },
//                             tooltip: {
//                               container: { background: '#1F2937', color: '#ffffff', borderRadius: 8 }
//                             }
//                           }}
//                         />
//                       )}
//                     </div>

//                     {/* Detailed Results */}
//                     <div className="space-y-3">
//                       {poll.options.map((option) => {
//                         const percentage = poll.totalVotes > 0 
//                           ? Math.round((option.votes_count / poll.totalVotes) * 100) 
//                           : 0;
//                         const isUserVote = userVote && userVote.option_id === option.id;
                        
//                         return (
//                           <div key={option.id} className="space-y-2">
//                             <div className="flex justify-between items-center">
//                               <div className="flex items-center gap-3 flex-1">
//                                 <span className="text-white font-medium">
//                                   {option.option_text}
//                                 </span>
//                                 {isUserVote && (
//                                   <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30 text-xs">
//                                     Your Vote
//                                   </Badge>
//                                 )}
//                               </div>
//                               <span className="text-blue-400 font-bold text-lg bg-blue-500/20 px-3 py-1 rounded-full min-w-16 text-center">
//                                 {percentage}%
//                               </span>
//                             </div>
//                             <Progress 
//                               value={percentage} 
//                               className={`h-3 bg-gray-700 ${
//                                 isUserVote ? '!bg-blue-500/50' : ''
//                               }`}
//                             />
//                             <div className="flex justify-between text-sm text-gray-400">
//                               <span>{option.votes_count} votes</span>
//                               <span>{percentage}% of total</span>
//                             </div>
//                           </div>
//                         );
//                       })}
//                     </div>
                    
//                     {poll.totalVotes > 0 && (
//                       <div className="mt-6 p-4 bg-[#0D1425]/30 rounded-lg border border-gray-600">
//                         <div className="flex items-center justify-between">
//                           <span className="text-gray-300">Total Votes Cast:</span>
//                           <span className="text-white font-bold text-lg">{poll.totalVotes}</span>
//                         </div>
//                       </div>
//                     )}
//                   </div>

//                   {/* Action Buttons */}
//                   <div className="flex flex-col sm:flex-row gap-3 justify-center">
//                     <Button
//                       onClick={() => setShowAnalytics(true)}
//                       className="bg-blue-600 hover:bg-blue-700 text-white"
//                     >
//                       <Activity className="mr-2 h-4 w-4" />
//                       Advanced Analytics
//                     </Button>
//                     <Button
//                       onClick={() => openShareModal(poll)}
//                       variant="outline"
//                       className="border-gray-600 bg-[#0D1425] hover:bg-[#1a2332] text-white"
//                     >
//                       <Share2 className="mr-2 h-4 w-4" />
//                       Share Results
//                     </Button>
//                   </div>
//                 </div>
//               )}
//             </CardContent>
//           </Card>
//         </div>
//       </div>
//     );
//   }

//   // All polls list view
//   if (!pollId) {
//     if (polls.length === 0) {
//       return (
//         <div className="min-h-screen pt-16 flex items-center justify-center p-8">
//           <div className="text-center max-w-2xl">
//             <div className="w-32 h-32 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-8">
//               <Vote className="h-16 w-16 text-blue-400" />
//             </div>
//             <h1 className="text-5xl font-bold text-white mb-6">
//               Start the Conversation
//             </h1>
//             <p className="text-xl text-gray-300 mb-8 leading-relaxed">
//               Create your first interactive poll and engage your audience with real-time voting, analytics, and beautiful visualizations.
//             </p>
//             <Button 
//               onClick={() => {
//                 navigate('/create-poll');
//                 trackEvent('Navigation', 'create_first_poll');
//               }}
//               className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 text-lg rounded-xl"
//               size="lg"
//             >
//               <Plus className="mr-3 h-5 w-5" />
//               Create First Poll
//             </Button>
//           </div>
//         </div>
//       );
//     }
    
//     return (
//       <TooltipProvider>
//         <div className="min-h-screen pt-16">
//           <div className="max-w-7xl mx-auto p-4">
//             {/* Enhanced Stats Section */}
//             {stats && (
//               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
//                 <Card className="bg-[#10172A]/80 backdrop-blur border border-gray-700">
//                   <CardContent className="p-6">
//                     <div className="flex items-center justify-between">
//                       <div>
//                         <p className="text-gray-400 text-sm font-medium">Total Polls</p>
//                         <p className="text-3xl font-bold text-white mt-1">{stats.totalPolls}</p>
//                       </div>
//                       <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
//                         <BarChart3 className="h-6 w-6 text-blue-400" />
//                       </div>
//                     </div>
//                   </CardContent>
//                 </Card>
                
//                 <Card className="bg-[#10172A]/80 backdrop-blur border border-gray-700">
//                   <CardContent className="p-6">
//                     <div className="flex items-center justify-between">
//                       <div>
//                         <p className="text-gray-400 text-sm font-medium">Total Votes</p>
//                         <p className="text-3xl font-bold text-white mt-1">{stats.totalVotes.toLocaleString()}</p>
//                       </div>
//                       <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
//                         <Users className="h-6 w-6 text-green-400" />
//                       </div>
//                     </div>
//                   </CardContent>
//                 </Card>
                
//                 <Card className="bg-[#10172A]/80 backdrop-blur border border-gray-700">
//                   <CardContent className="p-6">
//                     <div className="flex items-center justify-between">
//                       <div>
//                         <p className="text-gray-400 text-sm font-medium">Active Polls</p>
//                         <p className="text-3xl font-bold text-white mt-1">{stats.activePolls}</p>
//                       </div>
//                       <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
//                         <MessageCircle className="h-6 w-6 text-purple-400" />
//                       </div>
//                     </div>
//                   </CardContent>
//                 </Card>
                
//                 <Card className="bg-[#10172A]/80 backdrop-blur border border-gray-700">
//                   <CardContent className="p-6">
//                     <div className="flex items-center justify-between">
//                       <div>
//                         <p className="text-gray-400 text-sm font-medium">Avg. Engagement</p>
//                         <p className="text-3xl font-bold text-white mt-1">{stats.avgEngagement}%</p>
//                       </div>
//                       <div className="w-12 h-12 bg-yellow-500/20 rounded-xl flex items-center justify-center">
//                         <TrendingUp className="h-6 w-6 text-yellow-400" />
//                       </div>
//                     </div>
//                   </CardContent>
//                 </Card>
//               </div>
//             )}
            
//             {/* Action Bar */}
//             <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 p-6 bg-[#10172A]/80 backdrop-blur border border-gray-700 rounded-2xl">
//               <div>
//                 <h2 className="text-2xl font-bold text-white mb-2">Community Polls</h2>
//                 <p className="text-gray-400">Discover and participate in real-time discussions</p>
//               </div>
//               <div className="flex gap-3">
//                 <Button 
//                   variant="outline"
//                   className="border-gray-600 bg-[#0D1425] hover:bg-[#1a2332] text-white"
//                 >
//                   <Eye className="mr-2 h-4 w-4" />
//                   Filter
//                 </Button>
//                 <Button 
//                   onClick={() => navigate('/create-poll')}
//                   className="bg-blue-600 hover:bg-blue-700 text-white"
//                 >
//                   <Plus className="mr-2 h-4 w-4" />
//                   New Poll
//                 </Button>
//               </div>
//             </div>
            
//             {/* Enhanced Polls Grid */}
//             <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
//               {polls.map(poll => {
//                 const topChoice = getTopChoice(poll.options);
//                 const status = getPollStatus(poll);
//                 const isExpiredPoll = status === 'expired';
//                 const isTrending = poll.totalVotes > 50;
//                 const engagementColor = poll.engagementRate > 70 ? 'text-green-400' : 
//                                       poll.engagementRate > 40 ? 'text-yellow-400' : 'text-red-400';

//                 return (
//                   <Card key={poll.id} className="bg-[#10172A]/80 backdrop-blur border border-gray-700 hover:border-blue-500/30 transition-all duration-300">
//                     <CardHeader className="pb-4">
//                       <div className="flex justify-between items-start mb-3">
//                         <div className="flex items-center gap-2">
//                           <Avatar className="h-8 w-8 border border-gray-600">
//                             <AvatarImage src={poll.profiles?.avatar_url} />
//                             <AvatarFallback className="bg-blue-500/20 text-blue-300 text-xs">
//                               {getInitials(poll.profiles?.username, poll.created_by)}
//                             </AvatarFallback>
//                           </Avatar>
//                           <div className="flex gap-1">
//                             {poll.is_password_protected && (
//                               <Badge className="bg-yellow-500/20 text-yellow-300 border-yellow-500/30">
//                                 <Shield className="h-3 w-3" />
//                               </Badge>
//                             )}
//                             {isTrending && (
//                               <Badge className="bg-green-500/20 text-green-300 border-green-500/30">
//                                 <Zap className="h-3 w-3" />
//                               </Badge>
//                             )}
//                             {isExpiredPoll && (
//                               <Badge className="bg-red-500/20 text-red-300 border-red-500/30">
//                                 <Clock className="h-3 w-3" />
//                               </Badge>
//                             )}
//                           </div>
//                         </div>
//                         <Button 
//                           variant="ghost" 
//                           size="sm"
//                           className="h-8 w-8 p-0 text-gray-400 hover:text-white"
//                           onClick={() => openShareModal(poll)}
//                         >
//                           <Share2 className="h-4 w-4" />
//                         </Button>
//                       </div>
                      
//                       <CardTitle className="text-lg text-white line-clamp-2 group-hover:text-blue-400 transition-colors cursor-pointer"
//                         onClick={() => {
//                           navigate(`/polls/${poll.id}`);
//                           trackEvent('Poll', 'open_detail', poll.id);
//                         }}
//                       >
//                         {poll.question}
//                       </CardTitle>
                      
//                       <CardDescription className="flex items-center justify-between text-sm mt-3">
//                         <span className="text-gray-400 flex items-center gap-1">
//                           <Calendar className="h-4 w-4" />
//                           {new Date(poll.created_at).toLocaleDateString()}
//                         </span>
//                         <div className="flex gap-3">
//                           <span className="text-gray-400 flex items-center gap-1">
//                             <Users className="h-4 w-4" />
//                             {poll.participantCount}
//                           </span>
//                           <span className={`flex items-center gap-1 ${engagementColor}`}>
//                             <TrendingUp className="h-4 w-4" />
//                             {poll.engagementRate}%
//                           </span>
//                         </div>
//                       </CardDescription>
//                     </CardHeader>
                    
//                     <CardContent className="pt-0">
//                       {poll.options.slice(0, 2).map((option) => {
//                         const percentage = poll.totalVotes > 0 
//                           ? Math.round((option.votes_count / poll.totalVotes) * 100) 
//                           : 0;
//                         return (
//                           <div key={option.id} className="mb-3">
//                             <div className="flex justify-between text-sm mb-1">
//                               <span className="text-white truncate font-medium">{option.option_text}</span>
//                               <span className="text-blue-400 font-bold">{percentage}%</span>
//                             </div>
//                             <Progress value={percentage} className="h-2 bg-gray-700" />
//                           </div>
//                         );
//                       })}
//                       {poll.options.length > 2 && (
//                         <p className="text-gray-400 text-sm text-center mt-3 bg-[#0D1425]/50 py-1 rounded-full">
//                           +{poll.options.length - 2} more options
//                         </p>
//                       )}

//                       {/* Top Choice Highlight */}
//                       {topChoice && topChoice.votes_count > 0 && (
//                         <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
//                           <div className="flex items-center gap-2 mb-1">
//                             <Trophy className="h-4 w-4 text-yellow-400" />
//                             <span className="text-xs font-semibold text-yellow-300">Community Choice</span>
//                           </div>
//                           <p className="text-white text-sm font-medium truncate">
//                             {topChoice.option_text}
//                           </p>
//                           <p className="text-gray-400 text-xs mt-1">
//                             {Math.round((topChoice.votes_count / poll.totalVotes) * 100)}% of votes
//                           </p>
//                         </div>
//                       )}
//                     </CardContent>
                    
//                     <CardFooter>
//                       <div className="flex gap-2 w-full">
//                         <Button 
//                           className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-xl"
//                           onClick={() => {
//                             navigate(`/polls/${poll.id}`);
//                             trackEvent('Poll', 'open_detail', poll.id);
//                           }}
//                         >
//                           {isExpiredPoll ? (
//                             <>
//                               <BarChart3 className="mr-2 h-4 w-4" />
//                               View Results
//                             </>
//                           ) : (
//                             <>
//                               <Vote className="mr-2 h-4 w-4" />
//                               Vote Now
//                             </>
//                           )}
//                         </Button>
//                         <div className="flex gap-1">
//                           <UITooltip>
//                             <TooltipTrigger asChild>
//                               <Button 
//                                 variant="outline" 
//                                 size="sm"
//                                 className="border-gray-600 bg-[#0D1425] hover:bg-[#1a2332] text-gray-300 hover:text-white"
//                                 onClick={() => {
//                                   setPoll(poll);
//                                   setShowAnalytics(true);
//                                 }}
//                               >
//                                 <Activity className="h-4 w-4" />
//                               </Button>
//                             </TooltipTrigger>
//                             <TooltipContent>
//                               <p>View Analytics</p>
//                             </TooltipContent>
//                           </UITooltip>
//                           <UITooltip>
//                             <TooltipTrigger asChild>
//                               <Button 
//                                 variant="outline" 
//                                 size="sm"
//                                 className="border-gray-600 bg-[#0D1425] hover:bg-[#1a2332] text-gray-300 hover:text-white"
//                                 onClick={() => openShareModal(poll)}
//                               >
//                                 {copiedPollId === poll.id ? (
//                                   <Check className="h-4 w-4 text-green-400" />
//                                 ) : (
//                                   <Share2 className="h-4 w-4" />
//                                 )}
//                               </Button>
//                             </TooltipTrigger>
//                             <TooltipContent>
//                               <p>Share Poll</p>
//                             </TooltipContent>
//                           </UITooltip>
//                         </div>
//                       </div>
//                     </CardFooter>
//                   </Card>
//                 );
//               })}
//             </div>

//             {/* Load More */}
//             {hasMore && (
//               <div className="text-center mt-12">
//                 <Button 
//                   onClick={loadMore}
//                   disabled={loading}
//                   className="bg-[#0D1425] border border-gray-600 hover:bg-[#1a2332] text-white px-8 py-6 rounded-xl"
//                   size="lg"
//                 >
//                   {loading ? (
//                     <div className="flex items-center gap-2">
//                       <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
//                       Loading...
//                     </div>
//                   ) : (
//                     <>
//                       <Sparkles className="mr-2 h-5 w-5" />
//                       Load More Polls
//                     </>
//                   )}
//                 </Button>
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Render Modals */}
//         <PasswordModal />
//         <ShareModal />
//       </TooltipProvider>
//     );
//   }
  
//   return null;
// };

// export default Polls;

import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSocketContext } from '../context/SocketContext';
import { UserAuth } from '../context/AuthContext';
import { supabase } from '../supabaseClient';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import PasswordProtectedPoll from '../components/ProtectedRoute/PasswordProtectedPoll.jsx';

const Polls = ({ pollId }) => {
  const [polls, setPolls] = useState([]);
  const [poll, setPoll] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userVote, setUserVote] = useState(null);
  const [isExpired, setIsExpired] = useState(false);
  const [isPasswordProtected, setIsPasswordProtected] = useState(false);
  const [isCreator, setIsCreator] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [chartType, setChartType] = useState('bar');
  
  const socketContext = useSocketContext() ?? {};
  const socket = socketContext.socket;
  const { user } = UserAuth();
  const navigate = useNavigate();

  // Color palette for charts
  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#14B8A6', '#F97316'];

  useEffect(() => {
    console.log("Polls component received pollId:", pollId);
  }, [pollId]);

  useEffect(() => {
    if (!pollId) {
      const fetchAllPolls = async () => {
        try {
          console.log("Fetching all polls");
          const { data: polls, error: pollsError } = await supabase
            .from('polls')
            .select('*')
            .order('created_at', { ascending: false });
            
          if (pollsError) throw pollsError;
          
          const pollsWithOptions = await Promise.all(
            polls.map(async (poll) => {
              const { data: options } = await supabase
                .from('options')
                .select('*')
                .eq('poll_id', poll.id);

              const totalVotes = options.reduce((sum, option) => sum + option.votes_count, 0);
              
              return {
                ...poll,
                options,
                totalVotes
              };
            })
          );
          
          setPolls(pollsWithOptions);
          setLoading(false);
        } catch (err) {
          console.error("Error fetching polls:", err);
          setError(err.message);
          setLoading(false);
        }
      };
      
      fetchAllPolls();
    } else {
      if (pollId === "undefined") {
        console.error("Received 'undefined' as pollId string");
        setError("Invalid poll ID");
        setLoading(false);
        return;
      }
      
      const fetchPoll = async () => {
        try {
          console.log("Fetching poll with ID:", pollId);
          const { data: poll, error: pollError } = await supabase
            .from('polls')
            .select('*')
            .eq('id', pollId)
            .single();
            
          if (pollError) throw pollError;
          console.log("Poll data received:", poll);
          
          // Check if poll is expired
          if (poll.expires_at) {
            const expirationDate = new Date(poll.expires_at);
            const now = new Date();
            if (now > expirationDate) {
              setIsExpired(true);
            }
          }
          
          // Check if poll is password protected
          setIsPasswordProtected(poll.is_password_protected);

          if (user && poll.created_by === user.id) {
            setIsCreator(true);
            setIsAuthenticated(true);
          }

          const { data: options, error: optionsError } = await supabase
            .from('options')
            .select('*')
            .eq('poll_id', pollId);
            
          if (optionsError) throw optionsError;
          console.log("Options data received:", options);
          
          let userHasVoted = false;
          let existingVote = null;
          
          if (user) {
            const { data: votes, error: votesError } = await supabase
              .from('votes')
              .select('*')
              .eq('poll_id', pollId)
              .eq('user_id', user.id);
              
            if (votesError) throw votesError;
            
            if (votes && votes.length > 0) {
              userHasVoted = true;
              existingVote = votes[0];
              setSelectedOption(existingVote.option_id);
            }
          }

          const totalVotes = options.reduce((sum, option) => sum + option.votes_count, 0);
          setPoll({ ...poll, options, totalVotes });
          setHasVoted(userHasVoted);
          setUserVote(existingVote);
          setLoading(false);
        } catch (err) {
          console.error("Error fetching poll:", err);
          setError(err.message);
          setLoading(false);
        }
      };
      
      fetchPoll();
    }
  }, [pollId, user]);

  useEffect(() => {
    if (!socket || !pollId || pollId === "undefined") return;
    
    socket.emit("joinPoll", pollId);
    console.log(`Joined poll room: ${pollId}`);
    
    const handlePollDataUpdated = (data) => {
      if (data.data.id === pollId) {
        console.log("Poll data updated:", data.data);
        setPoll(data.data);
      }
    };
    
    socket.on("pollDataUpdated", handlePollDataUpdated);
    
    socket.on("pollError", (error) => {
      console.error("Socket error:", error);
      setError(error.message);
    });
    
    return () => {
      socket.off("pollDataUpdated", handlePollDataUpdated);
      socket.off("pollError");
    };
  }, [socket, pollId]);
  
  const handleVote = () => {
    if (!selectedOption) return;
    
    console.log("Submitting vote for option:", selectedOption);
    socket.emit("vote", {
      pollId,
      optionId: selectedOption,
      userId: user?.id || null
    });
    
    setHasVoted(true);
  };

  const handleAuthenticated = () => {
    setIsAuthenticated(true);
  };

  const toggleAnalytics = () => {
    setShowAnalytics(!showAnalytics);
  };

  // Prepare data for charts
  const prepareChartData = () => {
    if (!poll || !poll.options) return [];
    
    return poll.options.map(option => ({
      name: option.option_text.length > 15 
        ? option.option_text.substring(0, 15) + '...' 
        : option.option_text,
      fullName: option.option_text,
      votes: option.votes_count,
      percentage: poll.totalVotes > 0 
        ? Math.round((option.votes_count / poll.totalVotes) * 100) 
        : 0
    }));
  };

  const chartData = prepareChartData();
  
  if (!pollId) {
    if (loading) return <div className="flex justify-center items-center h-screen"><div className="loader"></div></div>;
    if (error) return <div className="text-red-500 text-center p-4">Error: {error}</div>;
    if (polls.length === 0) return <div className="text-center p-4">No polls available</div>;
    
    return (
      <div className="all-polls-container p-6">
        <h2 className="text-2xl font-bold mb-6 text-white">All Polls</h2>
        <div className="polls-list grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {polls.map(poll => (
            <div key={poll.id} className="poll-card bg-gray-800 rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow">
              <h3 className="text-xl font-semibold mb-3 text-white">{poll.question}</h3>
              <div className="poll-info text-gray-400 text-sm mb-4">
                <span>Created: {new Date(poll.created_at).toLocaleDateString()}</span>
                <span className="ml-4">Total Votes: {poll.totalVotes}</span>
              </div>
              <div className="poll-options mb-4">
                {poll.options.map(option => (
                  <div key={option.id} className="poll-option flex justify-between text-gray-300 mb-2">
                    <span>{option.option_text}</span>
                    <span>{option.votes_count} votes</span>
                  </div>
                ))}
              </div>
              <button 
                className="vote-button bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded transition-colors"
                onClick={() => navigate(`/polls/${poll.id}`)}
              >
                Vote in this Poll
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  }
  
  if (loading) return <div className="flex justify-center items-center h-screen"><div className="loader"></div></div>;
  if (error) return <div className="text-red-500 text-center p-4">Error: {error}</div>;
  if (!poll) return <div className="text-center p-4">Poll not found</div>;
  
  if (isExpired) {
    return (
      <div className="poll-container bg-gray-900 text-white p-6 rounded-lg max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold mb-6">{poll.question}</h2>
        <div className="bg-red-500/20 border border-red-500 text-red-200 p-4 rounded-lg mb-6">
          This poll has expired and is no longer accepting votes.
        </div>
        <div className="results-section">
          <h3 className="text-xl font-semibold mb-4">Final Results</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="name" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151' }}
                labelStyle={{ color: '#F3F4F6' }}
              />
              <Legend wrapperStyle={{ color: '#F3F4F6' }} />
              <Bar dataKey="votes" fill="#3B82F6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  }

  return (
    <div className="poll-container bg-gray-900 text-white p-6 rounded-lg max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">{poll.question}</h2>
        <button 
          onClick={() => navigate('/polls')}
          className="bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded transition-colors"
        >
          Back to Polls
        </button>
      </div>
      
      {!hasVoted ? (
        <div className="voting-section">
          {poll.options.map(option => (
            <div key={option.id} className="option mb-4 p-4 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors">
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="poll-option"
                  value={option.id}
                  checked={selectedOption === option.id}
                  onChange={() => setSelectedOption(option.id)}
                  className="mr-3 h-5 w-5 text-blue-600"
                />
                <span className="text-lg">{option.option_text}</span>
              </label>
            </div>
          ))}
          <button 
            onClick={handleVote} 
            disabled={!selectedOption}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white py-3 px-6 rounded-lg font-medium transition-colors"
          >
            Submit Vote
          </button>
        </div>
      ) : (
        <div className="results-section">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold">Live Results</h3>
            <button 
              onClick={toggleAnalytics}
              className="bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded transition-colors"
            >
              {showAnalytics ? 'Hide' : 'View'} Full Analytics
            </button>
          </div>
          
          {userVote && (
            <div className="user-vote-info bg-blue-500/20 border border-blue-500 text-blue-200 p-4 rounded-lg mb-6">
              You voted for: {poll.options.find(opt => opt.id === userVote.option_id)?.option_text}
            </div>
          )}
          
          {/* Basic Results View */}
          <div className="mb-8">
            {poll.options.map(option => {
              const percentage = poll.totalVotes > 0 
                ? Math.round((option.votes_count / poll.totalVotes) * 100) 
                : 0;
              
              return (
                <div key={option.id} className="mb-4">
                  <div className="flex justify-between mb-1">
                    <span>{option.option_text}</span>
                    <span>{option.votes_count} votes ({percentage}%)</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2.5">
                    <div 
                      className="bg-blue-600 h-2.5 rounded-full transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
          
          {/* Full Analytics View */}
          {showAnalytics && (
            <div className="analytics-section bg-gray-800 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-4">Poll Analytics</h3>
              
              {/* Analytics Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-gray-700 p-4 rounded-lg">
                  <div className="text-gray-400 text-sm">Total Votes</div>
                  <div className="text-2xl font-bold">{poll.totalVotes}</div>
                </div>
                <div className="bg-gray-700 p-4 rounded-lg">
                  <div className="text-gray-400 text-sm">Options</div>
                  <div className="text-2xl font-bold">{poll.options.length}</div>
                </div>
                <div className="bg-gray-700 p-4 rounded-lg">
                  <div className="text-gray-400 text-sm">Top Choice</div>
                  <div className="text-lg font-bold truncate">
                    {poll.options.length > 0 
                      ? poll.options.reduce((prev, current) => 
                          (prev.votes_count > current.votes_count) ? prev : current
                        ).option_text
                      : 'N/A'
                    }
                  </div>
                </div>
                <div className="bg-gray-700 p-4 rounded-lg">
                  <div className="text-gray-400 text-sm">Status</div>
                  <div className="text-lg font-bold text-green-400">Active</div>
                </div>
              </div>
              
              {/* Chart Type Selector */}
              <div className="flex space-x-2 mb-4">
                <button 
                  onClick={() => setChartType('bar')}
                  className={`px-4 py-2 rounded ${chartType === 'bar' ? 'bg-blue-600' : 'bg-gray-700'}`}
                >
                  Bar Chart
                </button>
                <button 
                  onClick={() => setChartType('pie')}
                  className={`px-4 py-2 rounded ${chartType === 'pie' ? 'bg-blue-600' : 'bg-gray-700'}`}
                >
                  Pie Chart
                </button>
              </div>
              
              {/* Charts */}
              <div className="chart-container">
                {chartType === 'bar' ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="name" stroke="#9CA3AF" />
                      <YAxis stroke="#9CA3AF" />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151' }}
                        labelStyle={{ color: '#F3F4F6' }}
                        formatter={(value, name) => [value, 'Votes']}
                        labelFormatter={(label) => {
                          const item = chartData.find(d => d.name === label);
                          return item ? item.fullName : label;
                        }}
                      />
                      <Legend wrapperStyle={{ color: '#F3F4F6' }} />
                      <Bar dataKey="votes" fill="#3B82F6" />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={chartData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percentage }) => `${name}: ${percentage}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="votes"
                      >
                        {chartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151' }}
                        labelStyle={{ color: '#F3F4F6' }}
                        formatter={(value, name) => [value, 'Votes']}
                        labelFormatter={(label) => {
                          const item = chartData.find(d => d.name === label);
                          return item ? item.fullName : label;
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Polls;