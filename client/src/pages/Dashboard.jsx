// // // import React, { useState, useEffect } from 'react';
// // // import { useNavigate } from 'react-router-dom';
// // // import { UserAuth } from '../context/AuthContext';
// // // import { supabase } from '../supabaseClient';
// // // import Polls from './polls.jsx';
// // // import { BarChart3, Bookmark, PlusCircle, Users, LogOut, Lock, Link } from 'lucide-react';

// // // const Dashboard = () => {
// // //   const navigate = useNavigate();
// // //   const { session, signOut, user } = UserAuth();
// // //   const [polls, setPolls] = useState([]);
// // //   const [selectedPollId, setSelectedPollId] = useState(null);
// // //   const [loading, setLoading] = useState(true);

// // //   const userEmail = session?.user?.email;
// // //   const firstName = userEmail 
// // //     ? userEmail.split('@')[0].replace(/[^a-zA-Z]/g, '') || 'User'
// // //     : 'User';

// // //   useEffect(() => {
// // //     const fetchPolls = async () => {
// // //       try {
// // //         const { data, error } = await supabase
// // //           .from('polls')
// // //           .select(`
// // //             *,
// // //             options (
// // //               id,
// // //               option_text,
// // //               votes_count
// // //             )
// // //           `)
// // //           .eq('created_by', user?.id)
// // //           .order('created_at', { ascending: false });

// // //         if (error) throw error;

// // //         // Calculate total votes for each poll
// // //         const pollsWithTotals = data.map(poll => ({
// // //           ...poll,
// // //           totalVotes: poll.options.reduce((sum, option) => sum + option.votes_count, 0)
// // //         }));

// // //         setPolls(pollsWithTotals);
// // //         setLoading(false);
// // //       } catch (error) {
// // //         console.error('Error fetching polls:', error);
// // //         setLoading(false);
// // //       }
// // //     };

// // //     fetchPolls();
// // //   }, [user]);

// // //   const handleSignOut = async () => {
// // //     await signOut();
// // //     navigate('/');
// // //   };

// // //   const handleCreatePoll = () => {
// // //     navigate('/create-poll');
// // //   };

// // //   const generateJoinLink = async (pollId, isOneTime = false) => {
// // //     try {
// // //       const endpoint = isOneTime ? '/api/generate-one-time-token' : '/api/generate-join-link';
// // //       const response = await fetch(`${import.meta.env.VITE_SITE_URL}${endpoint}`, {
// // //         method: 'POST',
// // //         headers: {
// // //           'Content-Type': 'application/json',
// // //         },
// // //         body: JSON.stringify({ pollId, expiryMinutes: isOneTime ? 1440 : 60 }),
// // //       });
// // //       const data = await response.json();

// // //       navigator.clipboard.writeText(data.tokenLink || data.joinLink);
// // //       alert(`${isOneTime ? 'One-time' : 'Regular'} join link copied to clipboard!`);
// // //     } catch (err) {
// // //       console.error('Error generating join link:', err);
// // //       alert('Failed to generate join link');
// // //     }
// // //   };

// // //   return (
// // //     <div className="min-h-screen relative overflow-hidden bg-gradient-to-br">
// // //       {/* Background decoration */}
// // //       <div className="absolute inset-0 z-0">
// // //         <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-900/20 to-transparent"></div>
// // //         <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-purple-900/20 to-transparent"></div>
// // //       </div>

// // //       <div className="relative z-10 container mx-auto px-4 py-8">
// // //         {/* Header Section */}
// // //         <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10">
// // //           <div className="mb-6 md:mb-0">
// // //             <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
// // //               Welcome back, <span className="text-blue-400">{firstName}!</span>
// // //             </h1>
// // //             <p className="text-lg text-gray-300 max-w-2xl">
// // //               Create, participate, and track polls in real-time with instant feedback and visualizations.
// // //             </p>
// // //           </div>

// // //           <div className="flex flex-wrap gap-3">
// // //             <button 
// // //               onClick={handleCreatePoll}
// // //               className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium flex items-center gap-2 transition-colors"
// // //             >
// // //               <PlusCircle size={20} />
// // //               Create Poll
// // //             </button>
// // //             <button 
// // //               onClick={() => navigate('/polls')}
// // //               className="bg-gray-800 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-medium flex items-center gap-2 transition-colors"
// // //             >
// // //               <BarChart3 size={20} />
// // //               Browse Polls
// // //             </button>
// // //             <button 
// // //               onClick={handleSignOut}
// // //               className="bg-gray-800 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-medium flex items-center gap-2 transition-colors"
// // //             >
// // //               <LogOut size={20} />
// // //             </button>
// // //           </div>
// // //         </div>

// // //         {/* Feature Cards */}
// // //         <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
// // //           <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
// // //             <div className="flex items-center gap-4 mb-4">
// // //               <div className="bg-blue-500/20 p-3 rounded-lg">
// // //                 <PlusCircle size={24} className="text-blue-400" />
// // //               </div>
// // //               <h2 className="text-xl font-semibold text-white">Create Polls</h2>
// // //             </div>
// // //             <p className="text-gray-300">
// // //               Create custom polls on any topic, add options, set permissions, and see responses in real-time.
// // //             </p>
// // //           </div>

// // //           <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
// // //             <div className="flex items-center gap-4 mb-4">
// // //               <div className="bg-purple-500/20 p-3 rounded-lg">
// // //                 <Users size={24} className="text-purple-400" />
// // //               </div>
// // //               <h2 className="text-xl font-semibold text-white">Vote & Participate</h2>
// // //             </div>
// // //             <p className="text-gray-300">
// // //               Browse public polls or join private ones. Cast your vote and see real-time results.
// // //             </p>
// // //           </div>

// // //           <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
// // //             <div className="flex items-center gap-4 mb-4">
// // //               <div className="bg-green-500/20 p-3 rounded-lg">
// // //                 <Bookmark size={24} className="text-green-400" />
// // //               </div>
// // //               <h2 className="text-xl font-semibold text-white">Bookmark & Track</h2>
// // //             </div>
// // //             <p className="text-gray-300">
// // //               Save polls for later, view past participation, and stay updated on topics you care about.
// // //             </p>
// // //           </div>
// // //         </div>

// // //         {/* Polls Section */}
// // //         <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
// // //           <div className="flex justify-between items-center mb-6">
// // //             <div className="flex items-center gap-2">
// // //               <BarChart3 size={24} className="text-white" />
// // //               <h2 className="text-2xl font-bold text-white">Your Polls</h2>
// // //             </div>
// // //             <button 
// // //               onClick={handleCreatePoll}
// // //               className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors"
// // //             >
// // //               <PlusCircle size={18} />
// // //               New Poll
// // //             </button>
// // //           </div>

// // //           {loading ? (
// // //             <div className="flex justify-center items-center h-64">
// // //               <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
// // //             </div>
// // //           ) : polls.length === 0 ? (
// // //             <div className="text-center py-12">
// // //               <div className="mb-4 flex justify-center">
// // //                 <div className="bg-gray-700/50 p-4 rounded-full">
// // //                   <BarChart3 size={40} className="text-gray-400" />
// // //                 </div>
// // //               </div>
// // //               <h3 className="text-xl font-semibold text-white mb-2">No polls yet</h3>
// // //               <p className="text-gray-400 mb-4">Create your first poll to get started</p>
// // //               <button 
// // //                 onClick={handleCreatePoll}
// // //                 className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium flex items-center gap-2 mx-auto transition-colors"
// // //               >
// // //                 <PlusCircle size={18} />
// // //                 Create Poll
// // //               </button>
// // //             </div>
// // //           ) : (
// // //             <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
// // //               {/* Poll List */}
// // //               <div className="bg-gray-700/50 rounded-xl p-4">
// // //                 <h3 className="text-lg font-semibold text-white mb-4">Select a Poll</h3>
// // //                 <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
// // //                   {polls.map(poll => (
// // //                     <div 
// // //                       key={poll.id} 
// // //                       className={`p-4 rounded-lg cursor-pointer transition-all duration-200 ${
// // //                         selectedPollId === poll.id 
// // //                           ? 'bg-blue-600/20 border border-blue-500' 
// // //                           : 'bg-gray-600/50 hover:bg-gray-600'
// // //                       }`}
// // //                       onClick={() => setSelectedPollId(poll.id)}
// // //                     >
// // //                       <div className="flex justify-between items-start">
// // //                         <h4 className="font-medium text-white">{poll.question}</h4>
// // //                         {poll.is_password_protected && (
// // //                           <Lock size={16} className="text-yellow-400 flex-shrink-0 ml-2" />
// // //                         )}
// // //                       </div>
// // //                       <div className="flex justify-between text-sm text-gray-400 mt-2">
// // //                         <span>{new Date(poll.created_at).toLocaleDateString()}</span>
// // //                         <span>{poll.options?.length || 0} options</span>
// // //                       </div>

// // //                       {/* Show poll options and vote counts */}
// // //                       {poll.options && poll.options.length > 0 && (
// // //                         <div className="mt-3 space-y-2">
// // //                           {poll.options.map(option => (
// // //                             <div key={option.id} className="flex justify-between text-sm">
// // //                               <span className="text-gray-300 truncate max-w-[70%]">{option.option_text}</span>
// // //                               <span className="text-blue-400">{option.votes_count} votes</span>
// // //                             </div>
// // //                           ))}
// // //                         </div>
// // //                       )}

// // //                       {/* Action buttons */}
// // //                       <div className="flex justify-end gap-2 mt-3">
// // //                         <button
// // //                           onClick={(e) => {
// // //                             e.stopPropagation();
// // //                             generateJoinLink(poll.id);
// // //                           }}
// // //                           className="text-xs bg-gray-600 hover:bg-gray-500 text-white px-2 py-1 rounded flex items-center gap-1"
// // //                         >
// // //                           <Link size={12} />
// // //                           Share Link
// // //                         </button>
// // //                       </div>
// // //                     </div>
// // //                   ))}
// // //                 </div>
// // //               </div>

// // //               {/* Poll Display */}
// // //               <div className="bg-gray-700/50 rounded-xl p-4">
// // //                 {selectedPollId ? (
// // //                   <Polls pollId={selectedPollId} />
// // //                 ) : (
// // //                   <div className="flex flex-col items-center justify-center h-full text-center py-12">
// // //                     <div className="mb-4 bg-gray-600/50 p-4 rounded-full">
// // //                       <BarChart3 size={40} className="text-gray-400" />
// // //                     </div>
// // //                     <h3 className="text-xl font-semibold text-white mb-2">Select a poll to view</h3>
// // //                     <p className="text-gray-400">Choose a poll from the list to see details and vote</p>
// // //                   </div>
// // //                 )}
// // //               </div>
// // //             </div>
// // //           )}
// // //         </div>
// // //       </div>
// // //     </div>
// // //   );
// // // };

// // // export default Dashboard;

// // import React, { useState, useEffect, useRef } from 'react';
// // import { useNavigate } from 'react-router-dom';
// // import { UserAuth } from '../context/AuthContext';
// // import { supabase } from '../supabaseClient';
// // import Polls from './polls.jsx';
// // import { BarChart3, Bookmark, PlusCircle, Users, LogOut, Lock, Copy, Check } from 'lucide-react';

// // // CardSwap Component
// // const Card = React.forwardRef(({ customClass, ...rest }, ref) => (
// //   <div
// //     ref={ref}
// //     {...rest}
// //     className={`absolute top-1/2 left-1/2 rounded-xl border border-white bg-black [transform-style:preserve-3d] [will-change:transform] [backface-visibility:hidden] ${customClass ?? ''} ${rest.className ?? ''}`.trim()}
// //   />
// // ));
// // Card.displayName = 'Card';

// // const CardSwap = ({
// //   width = 500,
// //   height = 400,
// //   cardDistance = 60,
// //   verticalDistance = 70,
// //   delay = 5000,
// //   pauseOnHover = false,
// //   skewAmount = 6,
// //   children
// // }) => {
// //   const childArr = React.useMemo(() => React.Children.toArray(children), [children]);
// //   const refs = React.useMemo(() => childArr.map(() => React.createRef()), [childArr.length]);
// //   const container = useRef(null);
// //   const [currentIndex, setCurrentIndex] = useState(0);

// //   useEffect(() => {
// //     const interval = setInterval(() => {
// //       setCurrentIndex(prev => (prev + 1) % childArr.length);
// //     }, delay);

// //     return () => clearInterval(interval);
// //   }, [delay, childArr.length]);

// //   const rendered = childArr.map((child, i) =>
// //     React.isValidElement(child)
// //       ? React.cloneElement(child, {
// //           key: i,
// //           ref: refs[i],
// //           style: { 
// //             width, 
// //             height, 
// //             transform: `translate(-50%, -50%) translateZ(${i === currentIndex ? 0 : -100 * (Math.abs(i - currentIndex))}px)`,
// //             opacity: i === currentIndex ? 1 : 0.3,
// //             transition: 'all 0.5s ease',
// //             ...(child.props.style ?? {}) 
// //           }
// //         })
// //       : child
// //   );

// //   return (
// //     <div
// //       ref={container}
// //       className="absolute bottom-0 right-0 transform translate-x-[5%] translate-y-[20%] origin-bottom-right perspective-[900px] overflow-visible max-[768px]:translate-x-[25%] max-[768px]:translate-y-[25%] max-[768px]:scale-[0.75] max-[480px]:translate-x-[25%] max-[480px]:translate-y-[25%] max-[480px]:scale-[0.55]"
// //       style={{ width, height }}
// //     >
// //       {rendered}
// //     </div>
// //   );
// // };

// // // SpotlightCard Component
// // const SpotlightCard = ({ children, className = '', spotlightColor = 'rgba(255, 255, 255, 0.25)' }) => {
// //   const divRef = useRef(null);
// //   const [isFocused, setIsFocused] = useState(false);
// //   const [position, setPosition] = useState({ x: 0, y: 0 });
// //   const [opacity, setOpacity] = useState(0);

// //   const handleMouseMove = e => {
// //     if (!divRef.current || isFocused) return;
// //     const rect = divRef.current.getBoundingClientRect();
// //     setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
// //   };

// //   const handleFocus = () => {
// //     setIsFocused(true);
// //     setOpacity(0.6);
// //   };

// //   const handleBlur = () => {
// //     setIsFocused(false);
// //     setOpacity(0);
// //   };

// //   const handleMouseEnter = () => {
// //     setOpacity(0.6);
// //   };

// //   const handleMouseLeave = () => {
// //     setOpacity(0);
// //   };

// //   return (
// //     <div
// //       ref={divRef}
// //       onMouseMove={handleMouseMove}
// //       onFocus={handleFocus}
// //       onBlur={handleBlur}
// //       onMouseEnter={handleMouseEnter}
// //       onMouseLeave={handleMouseLeave}
// //       className={`relative rounded-3xl border  backdrop-blur-sm overflow-hidden ${className}`}
// //     >
// //       <div
// //         className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 ease-in-out"
// //         style={{
// //           opacity,
// //           background: `radial-gradient(circle at ${position.x}px ${position.y}px, ${spotlightColor}, transparent 80%)`
// //         }}
// //       />
// //       {children}
// //     </div>
// //   );
// // };

// // const Dashboard = () => {
// //   const navigate = useNavigate();
// //   const { session, signOut, user } = UserAuth();
// //   const [polls, setPolls] = useState([]);
// //   const [selectedPollId, setSelectedPollId] = useState(null);
// //   const [loading, setLoading] = useState(true);
// //   const [copiedLink, setCopiedLink] = useState(null);

// //   const userEmail = session?.user?.email;
// //   const firstName = userEmail 
// //     ? userEmail.split('@')[0].replace(/[^a-zA-Z]/g, '') || 'User'
// //     : 'User';

// //   useEffect(() => {
// //     const fetchPolls = async () => {
// //       try {
// //         const { data, error } = await supabase
// //           .from('polls')
// //           .select(`
// //             *,
// //             options (
// //               id,
// //               option_text,
// //               votes_count
// //             )
// //           `)
// //           .eq('created_by', user?.id)
// //           .order('created_at', { ascending: false });

// //         if (error) throw error;

// //         const pollsWithTotals = data.map(poll => ({
// //           ...poll,
// //           totalVotes: poll.options.reduce((sum, option) => sum + option.votes_count, 0)
// //         }));

// //         setPolls(pollsWithTotals);
// //         setLoading(false);
// //       } catch (error) {
// //         console.error('Error fetching polls:', error);
// //         setLoading(false);
// //       }
// //     };

// //     fetchPolls();
// //   }, [user]);

// //   const handleSignOut = async () => {
// //     await signOut();
// //     navigate('/');
// //   };

// //   const handleCreatePoll = () => {
// //     navigate('/create-poll');
// //   };

// //   const generateJoinLink = async (pollId) => {
// //     try {
// //       const response = await fetch(`${import.meta.env.VITE_SITE_URL}/api/generate-join-link`, {
// //         method: 'POST',
// //         headers: {
// //           'Content-Type': 'application/json',
// //         },
// //         body: JSON.stringify({ pollId, expiryMinutes: 60 }),
// //       });
// //       const data = await response.json();

// //       await navigator.clipboard.writeText(data.joinLink);
// //       setCopiedLink(pollId);
// //       setTimeout(() => setCopiedLink(null), 2000);
// //     } catch (err) {
// //       console.error('Error generating join link:', err);
// //       alert('Failed to generate join link');
// //     }
// //   };

// //   return (
// //     <div className="min-h-screen relative overflow-hidden ">
// //       {/* Particles.js background simulation */}
// //       <div className="absolute inset-0 overflow-hidden pointer-events-none">
// //         {[...Array(50)].map((_, i) => (
// //           <div
// //             key={i}
// //             className="absolute w-1 h-1 bg-blue-500/20 rounded-full animate-pulse"
// //             style={{
// //               left: `${Math.random() * 100}%`,
// //               top: `${Math.random() * 100}%`,
// //               animationDelay: `${Math.random() * 3}s`,
// //               animationDuration: `${2 + Math.random() * 3}s`
// //             }}
// //           />
// //         ))}
// //       </div>

// //       <div className="relative z-10 container mx-auto px-4 py-8">
// //         {/* Header Section */}
// //         <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10">
// //           <div className="mb-6 md:mb-0">
// //             <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
// //               Welcome back, <span className="text-blue-400">{firstName}!</span>
// //             </h1>
// //             <p className="text-lg text-gray-300 max-w-2xl">
// //               Create, participate, and track polls in real-time with instant feedback and visualizations.
// //             </p>
// //           </div>

// //           <div className="flex flex-wrap gap-3">
// //             <button 
// //               onClick={handleCreatePoll}
// //               className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium flex items-center gap-2 transition-colors"
// //             >
// //               <PlusCircle size={20} />
// //               Create Poll
// //             </button>
// //             <button 
// //               onClick={() => navigate('/polls')}
// //               className="bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white px-6 py-3 rounded-lg font-medium flex items-center gap-2 transition-colors border border-white/20"
// //             >
// //               <BarChart3 size={20} />
// //               Browse Polls
// //             </button>
// //             <button 
// //               onClick={handleSignOut}
// //               className="bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white px-6 py-3 rounded-lg font-medium flex items-center gap-2 transition-colors border border-white/20"
// //             >
// //               <LogOut size={20} />
// //             </button>
// //           </div>
// //         </div>

// //         {/* Feature Cards with CardSwap */}
// //         <div className="relative mb-20 h-[500px] md:h-[450px]">
// //           <CardSwap
// //             width={400}
// //             height={280}
// //             cardDistance={50}
// //             verticalDistance={60}
// //             delay={4000}
// //             pauseOnHover={true}
// //             skewAmount={5}
// //           >
// //             <Card customClass="bg-gradient-to-br from-blue-500/20 to-blue-600/10 backdrop-blur-md border-blue-500/30">
// //               <div className="p-8 h-full flex flex-col justify-center">
// //                 <div className="bg-blue-500/30 w-16 h-16 rounded-2xl flex items-center justify-center mb-6">
// //                   <PlusCircle size={32} className="text-blue-300" />
// //                 </div>
// //                 <h2 className="text-2xl font-bold text-white mb-3">Create Polls</h2>
// //                 <p className="text-gray-200 text-base leading-relaxed">
// //                   Create custom polls on any topic, add options, set permissions, and see responses in real-time.
// //                 </p>
// //               </div>
// //             </Card>

// //             <Card customClass="bg-gradient-to-br from-green-500/20 to-green-600/10 backdrop-blur-md border-green-500/30">
// //               <div className="p-8 h-full flex flex-col justify-center">
// //                 <div className="bg-green-500/30 w-16 h-16 rounded-2xl flex items-center justify-center mb-6">
// //                   <Users size={32} className="text-green-300" />
// //                 </div>
// //                 <h2 className="text-2xl font-bold text-white mb-3">Vote & Participate</h2>
// //                 <p className="text-gray-200 text-base leading-relaxed">
// //                   Browse public polls or join private ones. Cast your vote and see real-time results.
// //                 </p>
// //               </div>
// //             </Card>

// //             <Card customClass="bg-gradient-to-br from-purple-500/20 to-purple-600/10 backdrop-blur-md border-purple-500/30">
// //               <div className="p-8 h-full flex flex-col justify-center">
// //                 <div className="bg-purple-500/30 w-16 h-16 rounded-2xl flex items-center justify-center mb-6">
// //                   <Bookmark size={32} className="text-purple-300" />
// //                 </div>
// //                 <h2 className="text-2xl font-bold text-white mb-3">Bookmark & Track</h2>
// //                 <p className="text-gray-200 text-base leading-relaxed">
// //                   Save polls for later, view past participation, and stay updated on topics you care about.
// //                 </p>
// //               </div>
// //             </Card>
// //           </CardSwap>
// //         </div>

// //         {/* Polls Section with SpotlightCard */}
// //         <SpotlightCard className="p-8" spotlightColor="rgba(59, 130, 246, 0.15)">
// //           <div className="flex justify-between items-center mb-6">
// //             <div className="flex items-center gap-3">
// //               <div className="bg-blue-500/20 p-2 rounded-lg">
// //                 <BarChart3 size={28} className="text-blue-400" />
// //               </div>
// //               <h2 className="text-3xl font-bold text-white">Your Polls</h2>
// //             </div>
// //             <button 
// //               onClick={handleCreatePoll}
// //               className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-medium flex items-center gap-2 transition-colors"
// //             >
// //               <PlusCircle size={18} />
// //               New Poll
// //             </button>
// //           </div>

// //           {loading ? (
// //             <div className="flex justify-center items-center h-64">
// //               <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
// //             </div>
// //           ) : polls.length === 0 ? (
// //             <div className="text-center py-16">
// //               <div className="mb-6 flex justify-center">
// //                 <div className="bg-blue-500/10 p-6 rounded-full">
// //                   <BarChart3 size={48} className="text-blue-400" />
// //                 </div>
// //               </div>
// //               <h3 className="text-2xl font-semibold text-white mb-3">No polls yet</h3>
// //               <p className="text-gray-400 mb-6 text-lg">Create your first poll to get started</p>
// //               <button 
// //                 onClick={handleCreatePoll}
// //                 className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium flex items-center gap-2 mx-auto transition-colors"
// //               >
// //                 <PlusCircle size={20} />
// //                 Create Poll
// //               </button>
// //             </div>
// //           ) : (
// //             <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
// //               {/* Poll List */}
// //               <SpotlightCard className="p-6" spotlightColor="rgba(59, 130, 246, 0.1)">
// //                 <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
// //                   <BarChart3 size={20} className="text-blue-400" />
// //                   Select a Poll
// //                 </h3>
// //                 <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-blue-500/50 scrollbar-track-transparent">
// //                   {polls.map(poll => (
// //                     <div 
// //                       key={poll.id} 
// //                       className={`p-5 rounded-xl cursor-pointer transition-all duration-200 border ${
// //                         selectedPollId === poll.id 
// //                           ? 'bg-blue-600/20 border-blue-500/50' 
// //                           : 'bg-white/5 hover:bg-white/10 border-white/10'
// //                       }`}
// //                       onClick={() => setSelectedPollId(poll.id)}
// //                     >
// //                       <div className="flex justify-between items-start mb-3">
// //                         <h4 className="font-semibold text-white text-lg flex-1">{poll.question}</h4>
// //                         {poll.is_password_protected && (
// //                           <Lock size={18} className="text-yellow-400 flex-shrink-0 ml-2" />
// //                         )}
// //                       </div>

// //                       <div className="flex justify-between text-sm text-gray-400 mb-3">
// //                         <span>{new Date(poll.created_at).toLocaleDateString()}</span>
// //                         <span>{poll.totalVotes} total votes</span>
// //                       </div>

// //                       {poll.options && poll.options.length > 0 && (
// //                         <div className="space-y-2 mb-3">
// //                           {poll.options.map(option => (
// //                             <div key={option.id} className="flex justify-between items-center text-sm bg-white/5 rounded-lg px-3 py-2">
// //                               <span className="text-gray-300 truncate max-w-[70%]">{option.option_text}</span>
// //                               <span className="text-blue-400 font-medium">{option.votes_count}</span>
// //                             </div>
// //                           ))}
// //                         </div>
// //                       )}

// //                       <button
// //                         onClick={(e) => {
// //                           e.stopPropagation();
// //                           generateJoinLink(poll.id);
// //                         }}
// //                         className="w-full bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors border border-blue-500/30"
// //                       >
// //                         {copiedLink === poll.id ? (
// //                           <>
// //                             <Check size={16} />
// //                             Link Copied!
// //                           </>
// //                         ) : (
// //                           <>
// //                             <Copy size={16} />
// //                             Copy Share Link
// //                           </>
// //                         )}
// //                       </button>
// //                     </div>
// //                   ))}
// //                 </div>
// //               </SpotlightCard>

// //               {/* Poll Display */}
// //               <SpotlightCard className="p-6" spotlightColor="rgba(59, 130, 246, 0.1)">
// //                 {selectedPollId ? (
// //                   <Polls pollId={selectedPollId} />
// //                 ) : (
// //                   <div className="flex flex-col items-center justify-center h-full text-center py-16">
// //                     <div className="mb-6 bg-blue-500/10 p-6 rounded-full">
// //                       <BarChart3 size={48} className="text-blue-400" />
// //                     </div>
// //                     <h3 className="text-2xl font-semibold text-white mb-3">Select a poll to view</h3>
// //                     <p className="text-gray-400 text-lg">Choose a poll from the list to see details and vote</p>
// //                   </div>
// //                 )}
// //               </SpotlightCard>
// //             </div>
// //           )}
// //         </SpotlightCard>

// //         {/* Analytics Section */}
// //         <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
// //           <SpotlightCard className="p-6" spotlightColor="rgba(34, 197, 94, 0.15)">
// //             <div className="flex items-center gap-3 mb-3">
// //               <div className="bg-green-500/20 p-3 rounded-lg">
// //                 <BarChart3 size={24} className="text-green-400" />
// //               </div>
// //               <h3 className="text-lg font-semibold text-white">Total Polls</h3>
// //             </div>
// //             <p className="text-4xl font-bold text-white">{polls.length}</p>
// //             <p className="text-sm text-gray-400 mt-2">Active polling campaigns</p>
// //           </SpotlightCard>

// //           <SpotlightCard className="p-6" spotlightColor="rgba(168, 85, 247, 0.15)">
// //             <div className="flex items-center gap-3 mb-3">
// //               <div className="bg-purple-500/20 p-3 rounded-lg">
// //                 <Users size={24} className="text-purple-400" />
// //               </div>
// //               <h3 className="text-lg font-semibold text-white">Total Votes</h3>
// //             </div>
// //             <p className="text-4xl font-bold text-white">
// //               {polls.reduce((sum, poll) => sum + poll.totalVotes, 0)}
// //             </p>
// //             <p className="text-sm text-gray-400 mt-2">Across all your polls</p>
// //           </SpotlightCard>

// //           <SpotlightCard className="p-6" spotlightColor="rgba(251, 191, 36, 0.15)">
// //             <div className="flex items-center gap-3 mb-3">
// //               <div className="bg-yellow-500/20 p-3 rounded-lg">
// //                 <Bookmark size={24} className="text-yellow-400" />
// //               </div>
// //               <h3 className="text-lg font-semibold text-white">Engagement</h3>
// //             </div>
// //             <p className="text-4xl font-bold text-white">
// //               {polls.length > 0 ? Math.round(polls.reduce((sum, poll) => sum + poll.totalVotes, 0) / polls.length) : 0}
// //             </p>
// //             <p className="text-sm text-gray-400 mt-2">Average votes per poll</p>
// //           </SpotlightCard>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // export default Dashboard;



// import React, { useState, useEffect, useRef } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { UserAuth } from '../context/AuthContext';
// import { supabase } from '../supabaseClient';
// import Polls from './polls.jsx';
// import { BarChart3, Bookmark, PlusCircle, Users, LogOut, Lock, Copy, Check } from 'lucide-react';

// // CardSwap Component
// const Card = React.forwardRef(({ customClass, ...rest }, ref) => (
//   <div
//     ref={ref}
//     {...rest}
//     className={`absolute top-1/2 left-1/2 rounded-xl border border-white bg-black [transform-style:preserve-3d] [will-change:transform] [backface-visibility:hidden] ${customClass ?? ''} ${rest.className ?? ''}`.trim()}
//   />
// ));
// Card.displayName = 'Card';

// const CardSwap = ({
//   width = 500,
//   height = 400,
//   cardDistance = 60,
//   verticalDistance = 70,
//   delay = 5000,
//   pauseOnHover = false,
//   skewAmount = 6,
//   children
// }) => {
//   const childArr = React.useMemo(() => React.Children.toArray(children), [children]);
//   const refs = React.useMemo(() => childArr.map(() => React.createRef()), [childArr.length]);
//   const container = useRef(null);
//   const [currentIndex, setCurrentIndex] = useState(0);

//   useEffect(() => {
//     const interval = setInterval(() => {
//       setCurrentIndex(prev => (prev + 1) % childArr.length);
//     }, delay);

//     return () => clearInterval(interval);
//   }, [delay, childArr.length]);

//   const rendered = childArr.map((child, i) =>
//     React.isValidElement(child)
//       ? React.cloneElement(child, {
//           key: i,
//           ref: refs[i],
//           style: { 
//             width, 
//             height, 
//             transform: `translate(-50%, -50%) translateZ(${i === currentIndex ? 0 : -100 * (Math.abs(i - currentIndex))}px)`,
//             opacity: i === currentIndex ? 1 : 0.3,
//             transition: 'all 0.5s ease',
//             ...(child.props.style ?? {}) 
//           }
//         })
//       : child
//   );

//   return (
//     <div
//       ref={container}
//       className="absolute bottom-0 right-0 transform translate-x-[5%] translate-y-[20%] origin-bottom-right perspective-[900px] overflow-visible max-[768px]:translate-x-[25%] max-[768px]:translate-y-[25%] max-[768px]:scale-[0.75] max-[480px]:translate-x-[25%] max-[480px]:translate-y-[25%] max-[480px]:scale-[0.55]"
//       style={{ width, height }}
//     >
//       {rendered}
//     </div>
//   );
// };

// // SpotlightCard Component
// const SpotlightCard = ({ children, className = '', spotlightColor = 'rgba(255, 255, 255, 0.25)' }) => {
//   const divRef = useRef(null);
//   const [isFocused, setIsFocused] = useState(false);
//   const [position, setPosition] = useState({ x: 0, y: 0 });
//   const [opacity, setOpacity] = useState(0);

//   const handleMouseMove = e => {
//     if (!divRef.current || isFocused) return;
//     const rect = divRef.current.getBoundingClientRect();
//     setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
//   };

//   const handleFocus = () => {
//     setIsFocused(true);
//     setOpacity(0.6);
//   };

//   const handleBlur = () => {
//     setIsFocused(false);
//     setOpacity(0);
//   };

//   const handleMouseEnter = () => {
//     setOpacity(0.6);
//   };

//   const handleMouseLeave = () => {
//     setOpacity(0);
//   };

//   return (
//     <div
//       ref={divRef}
//       onMouseMove={handleMouseMove}
//       onFocus={handleFocus}
//       onBlur={handleBlur}
//       onMouseEnter={handleMouseEnter}
//       onMouseLeave={handleMouseLeave}
//       className={`relative rounded-3xl border  backdrop-blur-sm overflow-hidden ${className}`}
//     >
//       <div
//         className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 ease-in-out"
//         style={{
//           opacity,
//           background: `radial-gradient(circle at ${position.x}px ${position.y}px, ${spotlightColor}, transparent 80%)`
//         }}
//       />
//       {children}
//     </div>
//   );
// };

// const Dashboard = () => {
//   const navigate = useNavigate();
//   const { session, signOut, user } = UserAuth();
//   const [polls, setPolls] = useState([]);
//   const [selectedPollId, setSelectedPollId] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [copiedLink, setCopiedLink] = useState(null);

//   const userEmail = session?.user?.email;
//   const firstName = userEmail 
//     ? userEmail.split('@')[0].replace(/[^a-zA-Z]/g, '') || 'User'
//     : 'User';

//   useEffect(() => {
//     const fetchPolls = async () => {
//       try {
//         const { data, error } = await supabase
//           .from('polls')
//           .select(`
//             *,
//             options (
//               id,
//               option_text,
//               votes_count
//             )
//           `)
//           .eq('created_by', user?.id)
//           .order('created_at', { ascending: false });

//         if (error) throw error;

//         const pollsWithTotals = data.map(poll => ({
//           ...poll,
//           totalVotes: poll.options.reduce((sum, option) => sum + option.votes_count, 0)
//         }));

//         setPolls(pollsWithTotals);
//         setLoading(false);
//       } catch (error) {
//         console.error('Error fetching polls:', error);
//         setLoading(false);
//       }
//     };

//     fetchPolls();
//   }, [user]);

//   const handleSignOut = async () => {
//     await signOut();
//     navigate('/');
//   };

//   const handleCreatePoll = () => {
//     navigate('/create-poll');
//   };

//   const generateJoinLink = async (pollId) => {
//     try {
//       const response = await fetch(`${import.meta.env.VITE_SITE_URL}/api/generate-join-link`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ pollId, expiryMinutes: 60 }),
//       });
//       const data = await response.json();

//       await navigator.clipboard.writeText(data.joinLink);
//       setCopiedLink(pollId);
//       setTimeout(() => setCopiedLink(null), 2000);
//     } catch (err) {
//       console.error('Error generating join link:', err);
//       alert('Failed to generate join link');
//     }
//   };

//   return (
//     <div className="min-h-screen relative overflow-hidden ">
//       {/* Particles.js background simulation */}
//       <div className="absolute inset-0 overflow-hidden pointer-events-none">
//         {[...Array(50)].map((_, i) => (
//           <div
//             key={i}
//             className="absolute w-1 h-1 bg-blue-500/20 rounded-full animate-pulse"
//             style={{
//               left: `${Math.random() * 100}%`,
//               top: `${Math.random() * 100}%`,
//               animationDelay: `${Math.random() * 3}s`,
//               animationDuration: `${2 + Math.random() * 3}s`
//             }}
//           />
//         ))}
//       </div>

//       <div className="relative z-10 container mx-auto px-4 py-8">
//         {/* Header Section */}
//         <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10">
//           <div className="mb-6 md:mb-0">
//             <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
//               Welcome back, <span className="text-blue-400">{firstName}!</span>
//             </h1>
//             <p className="text-lg text-gray-300 max-w-2xl">
//               Create, participate, and track polls in real-time with instant feedback and visualizations.
//             </p>
//           </div>

//           <div className="flex flex-wrap gap-3">
//             <button 
//               onClick={handleCreatePoll}
//               className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium flex items-center gap-2 transition-colors"
//             >
//               <PlusCircle size={20} />
//               Create Poll
//             </button>
//             <button 
//               onClick={() => navigate('/polls')}
//               className="bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white px-6 py-3 rounded-lg font-medium flex items-center gap-2 transition-colors border border-white/20"
//             >
//               <BarChart3 size={20} />
//               Browse Polls
//             </button>
//             <button 
//               onClick={handleSignOut}
//               className="bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white px-6 py-3 rounded-lg font-medium flex items-center gap-2 transition-colors border border-white/20"
//             >
//               <LogOut size={20} />
//             </button>
//           </div>
//         </div>

//         {/* Feature Cards with CardSwap */}
//         <div className="relative mb-20 h-[500px] md:h-[450px]">
//           <CardSwap
//             width={400}
//             height={280}
//             cardDistance={50}
//             verticalDistance={60}
//             delay={4000}
//             pauseOnHover={true}
//             skewAmount={5}
//           >
//             <Card customClass="bg-gradient-to-br from-blue-500/20 to-blue-600/10 backdrop-blur-md border-blue-500/30">
//               <div className="p-8 h-full flex flex-col justify-center">
//                 <div className="bg-blue-500/30 w-16 h-16 rounded-2xl flex items-center justify-center mb-6">
//                   <PlusCircle size={32} className="text-blue-300" />
//                 </div>
//                 <h2 className="text-2xl font-bold text-white mb-3">Create Polls</h2>
//                 <p className="text-gray-200 text-base leading-relaxed">
//                   Create custom polls on any topic, add options, set permissions, and see responses in real-time.
//                 </p>
//               </div>
//             </Card>

//             <Card customClass="bg-gradient-to-br from-green-500/20 to-green-600/10 backdrop-blur-md border-green-500/30">
//               <div className="p-8 h-full flex flex-col justify-center">
//                 <div className="bg-green-500/30 w-16 h-16 rounded-2xl flex items-center justify-center mb-6">
//                   <Users size={32} className="text-green-300" />
//                 </div>
//                 <h2 className="text-2xl font-bold text-white mb-3">Vote & Participate</h2>
//                 <p className="text-gray-200 text-base leading-relaxed">
//                   Browse public polls or join private ones. Cast your vote and see real-time results.
//                 </p>
//               </div>
//             </Card>

//             <Card customClass="bg-gradient-to-br from-purple-500/20 to-purple-600/10 backdrop-blur-md border-purple-500/30">
//               <div className="p-8 h-full flex flex-col justify-center">
//                 <div className="bg-purple-500/30 w-16 h-16 rounded-2xl flex items-center justify-center mb-6">
//                   <Bookmark size={32} className="text-purple-300" />
//                 </div>
//                 <h2 className="text-2xl font-bold text-white mb-3">Bookmark & Track</h2>
//                 <p className="text-gray-200 text-base leading-relaxed">
//                   Save polls for later, view past participation, and stay updated on topics you care about.
//                 </p>
//               </div>
//             </Card>
//           </CardSwap>
//         </div>

//         {/* Polls Section with SpotlightCard */}
//         <SpotlightCard className="p-8" spotlightColor="rgba(59, 130, 246, 0.15)">
//           <div className="flex justify-between items-center mb-6">
//             <div className="flex items-center gap-3">
//               <div className="bg-blue-500/20 p-2 rounded-lg">
//                 <BarChart3 size={28} className="text-blue-400" />
//               </div>
//               <h2 className="text-3xl font-bold text-white">Your Polls</h2>
//             </div>
//             <button 
//               onClick={handleCreatePoll}
//               className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-medium flex items-center gap-2 transition-colors"
//             >
//               <PlusCircle size={18} />
//               New Poll
//             </button>
//           </div>

//           {loading ? (
//             <div className="flex justify-center items-center h-64">
//               <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
//             </div>
//           ) : polls.length === 0 ? (
//             <div className="text-center py-16">
//               <div className="mb-6 flex justify-center">
//                 <div className="bg-blue-500/10 p-6 rounded-full">
//                   <BarChart3 size={48} className="text-blue-400" />
//                 </div>
//               </div>
//               <h3 className="text-2xl font-semibold text-white mb-3">No polls yet</h3>
//               <p className="text-gray-400 mb-6 text-lg">Create your first poll to get started</p>
//               <button 
//                 onClick={handleCreatePoll}
//                 className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium flex items-center gap-2 mx-auto transition-colors"
//               >
//                 <PlusCircle size={20} />
//                 Create Poll
//               </button>
//             </div>
//           ) : (
//             <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//               {/* Poll List */}
//               <SpotlightCard className="p-6" spotlightColor="rgba(59, 130, 246, 0.1)">
//                 <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
//                   <BarChart3 size={20} className="text-blue-400" />
//                   Select a Poll
//                 </h3>
//                 <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-blue-500/50 scrollbar-track-transparent">
//                   {polls.map(poll => (
//                     <div 
//                       key={poll.id} 
//                       className={`p-5 rounded-xl cursor-pointer transition-all duration-200 border ${
//                         selectedPollId === poll.id 
//                           ? 'bg-blue-600/20 border-blue-500/50' 
//                           : 'bg-white/5 hover:bg-white/10 border-white/10'
//                       }`}
//                       onClick={() => setSelectedPollId(poll.id)}
//                     >
//                       <div className="flex justify-between items-start mb-3">
//                         <h4 className="font-semibold text-white text-lg flex-1">{poll.question}</h4>
//                         {poll.is_password_protected && (
//                           <Lock size={18} className="text-yellow-400 flex-shrink-0 ml-2" />
//                         )}
//                       </div>

//                       <div className="flex justify-between text-sm text-gray-400 mb-3">
//                         <span>{new Date(poll.created_at).toLocaleDateString()}</span>
//                         <span>{poll.totalVotes} total votes</span>
//                       </div>

//                       {poll.options && poll.options.length > 0 && (
//                         <div className="space-y-2 mb-3">
//                           {poll.options.map(option => (
//                             <div key={option.id} className="flex justify-between items-center text-sm bg-white/5 rounded-lg px-3 py-2">
//                               <span className="text-gray-300 truncate max-w-[70%]">{option.option_text}</span>
//                               <span className="text-blue-400 font-medium">{option.votes_count}</span>
//                             </div>
//                           ))}
//                         </div>
//                       )}

//                       <button
//                         onClick={(e) => {
//                           e.stopPropagation();
//                           generateJoinLink(poll.id);
//                         }}
//                         className="w-full bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors border border-blue-500/30"
//                       >
//                         {copiedLink === poll.id ? (
//                           <>
//                             <Check size={16} />
//                             Link Copied!
//                           </>
//                         ) : (
//                           <>
//                             <Copy size={16} />
//                             Copy Share Link
//                           </>
//                         )}
//                       </button>
//                     </div>
//                   ))}
//                 </div>
//               </SpotlightCard>

//               {/* Poll Display */}
//               <SpotlightCard className="p-6" spotlightColor="rgba(59, 130, 246, 0.1)">
//                 {selectedPollId ? (
//                   <Polls pollId={selectedPollId} />
//                 ) : (
//                   <div className="flex flex-col items-center justify-center h-full text-center py-16">
//                     <div className="mb-6 bg-blue-500/10 p-6 rounded-full">
//                       <BarChart3 size={48} className="text-blue-400" />
//                     </div>
//                     <h3 className="text-2xl font-semibold text-white mb-3">Select a poll to view</h3>
//                     <p className="text-gray-400 text-lg">Choose a poll from the list to see details and vote</p>
//                   </div>
//                 )}
//               </SpotlightCard>
//             </div>
//           )}
//         </SpotlightCard>

//         {/* Analytics Section */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
//           <SpotlightCard className="p-6" spotlightColor="rgba(34, 197, 94, 0.15)">
//             <div className="flex items-center gap-3 mb-3">
//               <div className="bg-green-500/20 p-3 rounded-lg">
//                 <BarChart3 size={24} className="text-green-400" />
//               </div>
//               <h3 className="text-lg font-semibold text-white">Total Polls</h3>
//             </div>
//             <p className="text-4xl font-bold text-white">{polls.length}</p>
//             <p className="text-sm text-gray-400 mt-2">Active polling campaigns</p>
//           </SpotlightCard>

//           <SpotlightCard className="p-6" spotlightColor="rgba(168, 85, 247, 0.15)">
//             <div className="flex items-center gap-3 mb-3">
//               <div className="bg-purple-500/20 p-3 rounded-lg">
//                 <Users size={24} className="text-purple-400" />
//               </div>
//               <h3 className="text-lg font-semibold text-white">Total Votes</h3>
//             </div>
//             <p className="text-4xl font-bold text-white">
//               {polls.reduce((sum, poll) => sum + poll.totalVotes, 0)}
//             </p>
//             <p className="text-sm text-gray-400 mt-2">Across all your polls</p>
//           </SpotlightCard>

//           <SpotlightCard className="p-6" spotlightColor="rgba(251, 191, 36, 0.15)">
//             <div className="flex items-center gap-3 mb-3">
//               <div className="bg-yellow-500/20 p-3 rounded-lg">
//                 <Bookmark size={24} className="text-yellow-400" />
//               </div>
//               <h3 className="text-lg font-semibold text-white">Engagement</h3>
//             </div>
//             <p className="text-4xl font-bold text-white">
//               {polls.length > 0 ? Math.round(polls.reduce((sum, poll) => sum + poll.totalVotes, 0) / polls.length) : 0}
//             </p>
//             <p className="text-sm text-gray-400 mt-2">Average votes per poll</p>
//           </SpotlightCard>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Dashboard;


import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserAuth } from '../context/AuthContext';
import { supabase } from '../supabaseClient';
import Polls from './polls.jsx';
import { BarChart3, Bookmark, PlusCircle, Users, LogOut, Lock, Copy, Check } from 'lucide-react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { gsap } from 'gsap';
import { Observer } from 'gsap/Observer';
import { toast } from 'sonner';

gsap.registerPlugin(Observer);

const springValues = {
  damping: 30,
  stiffness: 100,
  mass: 2
};

const TiltedCard = ({
  imageSrc,
  altText = 'Tilted card image',
  captionText = '',
  containerHeight = '300px',
  containerWidth = '100%',
  imageHeight = '300px',
  imageWidth = '300px',
  scaleOnHover = 1.1,
  rotateAmplitude = 14,
  showMobileWarning = true,
  showTooltip = true,
  overlayContent = null,
  displayOverlayContent = false
}) => {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useMotionValue(0), springValues);
  const rotateY = useSpring(useMotionValue(0), springValues);
  const scale = useSpring(1, springValues);
  const opacity = useSpring(0);
  const rotateFigcaption = useSpring(0, {
    stiffness: 350,
    damping: 30,
    mass: 1
  });

  const [lastY, setLastY] = useState(0);

  function handleMouse(e) {
    if (!ref.current) return;

    const rect = ref.current.getBoundingClientRect();
    const offsetX = e.clientX - rect.left - rect.width / 2;
    const offsetY = e.clientY - rect.top - rect.height / 2;

    const rotationX = (offsetY / (rect.height / 2)) * -rotateAmplitude;
    const rotationY = (offsetX / (rect.width / 2)) * rotateAmplitude;

    rotateX.set(rotationX);
    rotateY.set(rotationY);

    x.set(e.clientX - rect.left);
    y.set(e.clientY - rect.top);

    const velocityY = offsetY - lastY;
    rotateFigcaption.set(-velocityY * 0.6);
    setLastY(offsetY);
  }

  function handleMouseEnter() {
    scale.set(scaleOnHover);
    opacity.set(1);
  }

  function handleMouseLeave() {
    opacity.set(0);
    scale.set(1);
    rotateX.set(0);
    rotateY.set(0);
    rotateFigcaption.set(0);
  }

  return (
    <figure
      ref={ref}
      className="relative w-full h-full [perspective:800px] flex flex-col items-center justify-center"
      style={{
        height: containerHeight,
        width: containerWidth
      }}
      onMouseMove={handleMouse}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {showMobileWarning && (
        <div className="absolute top-4 text-center text-sm block sm:hidden">
          This effect is not optimized for mobile. Check on desktop.
        </div>
      )}

      <motion.div
        className="relative [transform-style:preserve-3d]"
        style={{
          width: imageWidth,
          height: imageHeight,
          rotateX,
          rotateY,
          scale
        }}
      >
        <motion.div
          className="absolute top-0 left-0 object-cover rounded-[15px] will-change-transform [transform:translateZ(0)] bg-gradient-to-br from-blue-500/20 to-blue-600/10 backdrop-blur-md border-2 border-blue-500/30"
          style={{
            width: imageWidth,
            height: imageHeight
          }}
        >
          {overlayContent}
        </motion.div>
      </motion.div>

      {showTooltip && (
        <motion.figcaption
          className="pointer-events-none absolute left-0 top-0 rounded-[4px] bg-white px-[10px] py-[4px] text-[10px] text-[#2d2d2d] opacity-0 z-[3] hidden sm:block"
          style={{
            x,
            y,
            opacity,
            rotate: rotateFigcaption
          }}
        >
          {captionText}
        </motion.figcaption>
      )}
    </figure>
  );
};

const FeatureCard = ({ icon, title, description, gradientColors, borderColor }) => (
  <TiltedCard
    imageSrc=""
    altText={title}
    captionText={title}
    containerHeight="300px"
    containerWidth="100%"
    imageHeight="300px"
    imageWidth="100%"
    scaleOnHover={1.05}
    rotateAmplitude={10}
    showMobileWarning={false}
    showTooltip={false}
    displayOverlayContent={true}
    overlayContent={
      <div className={`p-8 h-full flex flex-col justify-center bg-gradient-to-br ${gradientColors} backdrop-blur-md border-2 ${borderColor} rounded-[15px]`}>
        <div className={`${borderColor.replace('border-', 'bg-').replace('/30', '/30')} w-16 h-16 rounded-2xl flex items-center justify-center mb-6`}>
          {icon}
        </div>
        <h2 className="text-2xl font-bold text-white mb-3">{title}</h2>
        <p className="text-gray-200 text-base leading-relaxed">
          {description}
        </p>
      </div>
    }
  />
);

const SpotlightCard = ({ children, className = '', spotlightColor = 'rgba(255, 255, 255, 0.25)' }) => {
  const divRef = useRef(null);
  const [isFocused, setIsFocused] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  const handleMouseMove = e => {
    if (!divRef.current || isFocused) return;
    const rect = divRef.current.getBoundingClientRect();
    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const handleFocus = () => {
    setIsFocused(true);
    setOpacity(0.6);
  };

  const handleBlur = () => {
    setIsFocused(false);
    setOpacity(0);
  };

  const handleMouseEnter = () => {
    setOpacity(0.6);
  };

  const handleMouseLeave = () => {
    setOpacity(0);
  };

  return (
    <div
      ref={divRef}
      onMouseMove={handleMouseMove}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`relative rounded-3xl border backdrop-blur-sm overflow-hidden ${className}`}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 ease-in-out"
        style={{
          opacity,
          background: `radial-gradient(circle at ${position.x}px ${position.y}px, ${spotlightColor}, transparent 80%)`
        }}
      />
      {children}
    </div>
  );
};

const featureItems = [
  {
    content: (
      <div className="p-8 h-full flex flex-col justify-center bg-gradient-to-br from-blue-500/20 to-blue-600/10 backdrop-blur-md border-2 border-blue-500/30 rounded-[15px]">
        <div className="bg-blue-500/30 w-16 h-16 rounded-2xl flex items-center justify-center mb-6">
          <PlusCircle size={32} className="text-blue-300" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-3">Create Polls</h2>
        <p className="text-gray-200 text-base leading-relaxed">
          Create custom polls on any topic, add options, set permissions, and see responses in real-time.
        </p>
      </div>
    )
  },
  {
    content: (
      <div className="p-8 h-full flex flex-col justify-center bg-gradient-to-br from-green-500/20 to-green-600/10 backdrop-blur-md border-2 border-green-500/30 rounded-[15px]">
        <div className="bg-green-500/30 w-16 h-16 rounded-2xl flex items-center justify-center mb-6">
          <Users size={32} className="text-green-300" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-3">Vote & Participate</h2>
        <p className="text-gray-200 text-base leading-relaxed">
          Browse public polls or join private ones. Cast your vote and see real-time results.
        </p>
      </div>
    )
  },
  {
    content: (
      <div className="p-8 h-full flex flex-col justify-center bg-gradient-to-br from-purple-500/20 to-purple-600/10 backdrop-blur-md border-2 border-purple-500/30 rounded-[15px]">
        <div className="bg-purple-500/30 w-16 h-16 rounded-2xl flex items-center justify-center mb-6">
          <Bookmark size={32} className="text-purple-300" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-3">Bookmark & Track</h2>
        <p className="text-gray-200 text-base leading-relaxed">
          Save polls for later, view past participation, and stay updated on topics you care about.
        </p>
      </div>
    )
  }
];

const Dashboard = () => {
  const navigate = useNavigate();
  const { session, signOut, user } = UserAuth();
  const [polls, setPolls] = useState([]);
  const [selectedPollId, setSelectedPollId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copiedLink, setCopiedLink] = useState(null);

  const userEmail = session?.user?.email;
  const firstName = userEmail
    ? userEmail.split('@')[0].replace(/[^a-zA-Z]/g, '') || 'User'
    : 'User';

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

        const pollsWithTotals = data.map(poll => ({
          ...poll,
          totalVotes: poll.options.reduce((sum, option) => sum + option.votes_count, 0)
        }));

        setPolls(pollsWithTotals);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching polls:', error);
        setLoading(false);
      }
    };

    fetchPolls();
  }, [user]);

  const handleCreatePoll = () => {
    navigate('/create-poll');
  };

  const generateJoinLink = async (pollId) => {
    try {
      const link = `${window.location.origin}/polls/${pollId}`;
      await navigator.clipboard.writeText(link);
      setCopiedLink(pollId);
      setTimeout(() => setCopiedLink(null), 2000);
      toast.success('Poll link copied to clipboard');
    } catch (err) {
      console.error('Error Copying link:', err);
      toast.error('Failed to copy link');
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden ">
      <div className="relative z-10 container mx-auto px-4 py-8">

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-16">
          <div className="mb-8 md:mb-0 relative z-10">
            <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 tracking-tight leading-tight "
              style={{ fontFamily: 'Lato, sans-serif' }}>
              Welcome back, <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-indigo-400 animate-gradient-x">
                {firstName}!
              </span>
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl leading-relaxed font-light">
              Create, participate, and track polls in real-time
              <br />
              <span className="text-gray-200 font-medium">with instant feedback and visualizations.</span>
            </p>
          </div>

          <div className="flex flex-wrap gap-4">
            <button
              onClick={handleCreatePoll}
              className="group bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white px-8 py-4 rounded-2xl font-semibold flex items-center gap-3 transition-all duration-300 shadow-lg hover:shadow-blue-500/25 hover:-translate-y-1"
            >
              <PlusCircle size={24} className="group-hover:rotate-90 transition-transform duration-300" />
              Create Poll
            </button>
            <button
              onClick={() => navigate('/polls')}
              className="group bg-white/5 hover:bg-white/10 backdrop-blur-md border border-white/10 text-white px-8 py-4 rounded-2xl font-semibold flex items-center gap-3 transition-all duration-300 hover:border-white/20 hover:-translate-y-1"
            >
              <BarChart3 size={24} className="group-hover:scale-110 transition-transform duration-300" />
              Browse Polls
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <SpotlightCard className="p-6" spotlightColor="rgba(34, 197, 94, 0.15)">
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-green-500/20 p-3 rounded-lg">
                <BarChart3 size={24} className="text-green-400" />
              </div>
              <h3 className="text-lg font-semibold text-white">Total Polls</h3>
            </div>
            <p className="text-4xl font-bold text-white">{polls.length}</p>
            <p className="text-sm font-bold text-gray-400 mt-2">Active polling campaigns</p>
          </SpotlightCard>

          <SpotlightCard className="p-6" spotlightColor="rgba(168, 85, 247, 0.15)">
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-purple-500/20 p-3 rounded-lg">
                <Users size={24} className="text-purple-400" />
              </div>
              <h3 className="text-lg font-semibold text-white">Total Votes</h3>
            </div>
            <p className="text-4xl font-bold text-white">
              {polls.reduce((sum, poll) => sum + poll.totalVotes, 0)}
            </p>
            <p className="text-sm font-bold text-gray-400 mt-2">Across all your polls</p>
          </SpotlightCard>

          <SpotlightCard className="p-6" spotlightColor="rgba(251, 191, 36, 0.15)">
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-yellow-500/20 p-3 rounded-lg">
                <Bookmark size={24} className="text-yellow-400" />
              </div>
              <h3 className="text-lg font-semibold text-white">Engagement</h3>
            </div>
            <p className="text-4xl font-bold text-white">
              {polls.length > 0 ? Math.round(polls.reduce((sum, poll) => sum + poll.totalVotes, 0) / polls.length) : 0}
            </p>
            <p className="text-sm font-bold text-gray-400 mt-2">Average votes per poll</p>
          </SpotlightCard>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10 mb-16">
          <FeatureCard
            icon={<PlusCircle size={24} className="text-blue-300" />}
            title="Create Polls"
            description="Create custom polls on any topic, add options, set permissions, and see responses in real-time."
            gradientColors="from-blue-500/20 to-blue-600/10"
            borderColor="border-blue-500/30"
          />

          <FeatureCard
            icon={<Users size={24} className="text-green-300" />}
            title="Vote & Participate"
            description="Browse public polls or join private ones. Cast your vote and see real-time results."
            gradientColors="from-green-500/20 to-green-600/10"
            borderColor="border-green-500/30"
          />

          <FeatureCard
            icon={<Bookmark size={24} className="text-purple-300" />}
            title="Bookmark & Track"
            description="Save polls for later, view past participation, and stay updated on topics you care about."
            gradientColors="from-purple-500/20 to-purple-600/10"
            borderColor="border-purple-500/30"
          />
        </div>

        {/* Polls Section with SpotlightCard */}
        <SpotlightCard className="p-8" spotlightColor="rgba(59, 130, 246, 0.15)">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-3">
              <div className="bg-blue-500/20 p-2 rounded-lg">
                <BarChart3 size={28} className="text-blue-400" />
              </div>
              <h2 className="text-3xl font-bold text-white">Your Polls</h2>
            </div>
            <button
              onClick={handleCreatePoll}
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-medium flex items-center gap-2 transition-colors"
            >
              <PlusCircle size={18} />
              New Poll
            </button>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : polls.length === 0 ? (
            <div className="text-center py-16">
              <div className="mb-6 flex justify-center">
                <div className="bg-blue-500/10 p-6 rounded-full">
                  <BarChart3 size={48} className="text-blue-400" />
                </div>
              </div>
              <h3 className="text-2xl font-semibold text-white mb-3">No polls yet</h3>
              <p className="text-gray-400 mb-6 text-lg">Create your first poll to get started</p>
              <button
                onClick={handleCreatePoll}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium flex items-center gap-2 mx-auto transition-colors"
              >
                <PlusCircle size={20} />
                Create Poll
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Poll List */}
              <SpotlightCard className="p-6" spotlightColor="rgba(59, 130, 246, 0.1)">
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                  <BarChart3 size={20} className="text-blue-400" />
                  Select a Poll
                </h3>
                <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-blue-500/50 scrollbar-track-transparent">
                  {polls.map(poll => (
                    <div
                      key={poll.id}
                      className={`p-5 rounded-xl cursor-pointer transition-all duration-200 border ${selectedPollId === poll.id
                        ? 'bg-blue-600/20 border-blue-500/50'
                        : 'bg-white/5 hover:bg-white/10 border-white/10'
                        }`}
                      onClick={() => setSelectedPollId(poll.id)}
                    >
                      <div className="flex justify-between items-start mb-3">
                        <h4 className="font-semibold text-white text-lg flex-1">{poll.question}</h4>
                        {poll.is_password_protected && (
                          <Lock size={18} className="text-yellow-400 flex-shrink-0 ml-2" />
                        )}
                      </div>

                      <div className="flex justify-between text-sm text-gray-400 mb-3">
                        <span>{new Date(poll.created_at).toLocaleDateString()}</span>
                        <span>{poll.totalVotes} total votes</span>
                      </div>

                      {poll.options && poll.options.length > 0 && (
                        <div className="space-y-2 mb-3">
                          {poll.options.map(option => (
                            <div key={option.id} className="flex justify-between items-center text-sm bg-white/5 rounded-lg px-3 py-2">
                              <span className="text-gray-300 truncate max-w-[70%]">{option.option_text}</span>
                              <span className="text-blue-400 font-medium">{option.votes_count}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          generateJoinLink(poll.id);
                        }}
                        className="w-full bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors border border-blue-500/30"
                      >
                        {copiedLink === poll.id ? (
                          <>
                            <Check size={16} />
                            Link Copied!
                          </>
                        ) : (
                          <>
                            <Copy size={16} />
                            Copy Share Link
                          </>
                        )}
                      </button>
                    </div>
                  ))}
                </div>
              </SpotlightCard>

              {/* Poll Display */}
              <SpotlightCard className="p-6" spotlightColor="rgba(59, 130, 246, 0.1)">
                {selectedPollId ? (
                  <Polls pollId={selectedPollId} />
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-center py-16">
                    <div className="mb-6 bg-blue-500/10 p-6 rounded-full">
                      <BarChart3 size={48} className="text-blue-400" />
                    </div>
                    <h3 className="text-2xl font-semibold text-white mb-3">Select a poll to view</h3>
                    <p className="text-gray-400 text-lg">Choose a poll from the list to see details and vote</p>
                  </div>
                )}
              </SpotlightCard>
            </div>
          )}
        </SpotlightCard>

      </div>
    </div>
  );
};

export default Dashboard; 