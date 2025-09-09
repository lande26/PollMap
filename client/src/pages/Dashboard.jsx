// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { UserAuth } from '../context/AuthContext';
// import { supabase } from '../supabaseClient';
// import Polls from './polls.jsx';
// import { BarChart3, Bookmark, PlusCircle, Users, LogOut } from 'lucide-react';

// const Dashboard = () => {
//   const navigate = useNavigate();
//   const { session, signOut, user } = UserAuth();
//   const [polls, setPolls] = useState([]);
//   const [selectedPollId, setSelectedPollId] = useState(null);
//   const [loading, setLoading] = useState(true);
  
//   const userEmail = session?.user?.email;
//   const firstName = userEmail 
//     ? userEmail.split('@')[0].replace(/[^a-zA-Z]/g, '') || 'User'
//     : 'User';

//   // Fetch user's polls
//   useEffect(() => {
//     const fetchPolls = async () => {
//       try {
//         const { data, error } = await supabase
//           .from('polls')
//           .select('*')
//           .order('created_at', { ascending: false });
          
//         if (error) throw error;
//         setPolls(data || []);
//         setLoading(false);
//       } catch (error) {
//         console.error('Error fetching polls:', error);
//         setLoading(false);
//       }
//     };
    
//     fetchPolls();
//   }, []);

//   const handleSignOut = async () => {
//     await signOut();
//     navigate('/');
//   };

//   const handleCreatePoll = () => {
//     navigate('/create-poll');
//   };

//   return (
//     <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-gray-900 to-black">
//       {/* Background decoration */}
//       <div className="absolute inset-0 z-0">
//         <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-900/20 to-transparent"></div>
//         <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-purple-900/20 to-transparent"></div>
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
//               className="bg-gray-800 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-medium flex items-center gap-2 transition-colors"
//             >
//               <BarChart3 size={20} />
//               Browse Polls
//             </button>
//             <button 
//               onClick={handleSignOut}
//               className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-3 rounded-lg font-medium flex items-center gap-2 transition-colors"
//             >
//               <LogOut size={20} />
//             </button>
//           </div>
//         </div>
        
//         {/* Feature Cards */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
//           <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
//             <div className="flex items-center gap-4 mb-4">
//               <div className="bg-blue-500/20 p-3 rounded-lg">
//                 <PlusCircle size={24} className="text-blue-400" />
//               </div>
//               <h2 className="text-xl font-semibold text-white">Create Polls</h2>
//             </div>
//             <p className="text-gray-300">
//               Create custom polls on any topic, add options, set permissions, and see responses in real-time.
//             </p>
//           </div>
          
//           <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
//             <div className="flex items-center gap-4 mb-4">
//               <div className="bg-purple-500/20 p-3 rounded-lg">
//                 <Users size={24} className="text-purple-400" />
//               </div>
//               <h2 className="text-xl font-semibold text-white">Vote & Participate</h2>
//             </div>
//             <p className="text-gray-300">
//               Browse public polls or join private ones. Cast your vote and see real-time results.
//             </p>
//           </div>
          
//           <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
//             <div className="flex items-center gap-4 mb-4">
//               <div className="bg-green-500/20 p-3 rounded-lg">
//                 <Bookmark size={24} className="text-green-400" />
//               </div>
//               <h2 className="text-xl font-semibold text-white">Bookmark & Track</h2>
//             </div>
//             <p className="text-gray-300">
//               Save polls for later, view past participation, and stay updated on topics you care about.
//             </p>
//           </div>
//         </div>
        
//         {/* Polls Section */}
//         <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
//           <div className="flex justify-between items-center mb-6">
//             <div className="flex items-center gap-2">
//               <BarChart3 size={24} className="text-white" />
//               <h2 className="text-2xl font-bold text-white">Your Polls</h2>
//             </div>
//             <button 
//               onClick={handleCreatePoll}
//               className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors"
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
//             <div className="text-center py-12">
//               <div className="mb-4 flex justify-center">
//                 <div className="bg-gray-700/50 p-4 rounded-full">
//                   <BarChart3 size={40} className="text-gray-400" />
//                 </div>
//               </div>
//               <h3 className="text-xl font-semibold text-white mb-2">No polls yet</h3>
//               <p className="text-gray-400 mb-4">Create your first poll to get started</p>
//               <button 
//                 onClick={handleCreatePoll}
//                 className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium flex items-center gap-2 mx-auto transition-colors"
//               >
//                 <PlusCircle size={18} />
//                 Create Poll
//               </button>
//             </div>
//           ) : (
//             <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//               {/* Poll List */}
//               <div className="bg-gray-700/50 rounded-xl p-4">
//                 <h3 className="text-lg font-semibold text-white mb-4">Select a Poll</h3>
//                 <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
//                   {polls.map(poll => (
//                     <div 
//                       key={poll.id} 
//                       className={`p-4 rounded-lg cursor-pointer transition-all duration-200 ${
//                         selectedPollId === poll.id 
//                           ? 'bg-blue-600/20 border border-blue-500' 
//                           : 'bg-gray-600/50 hover:bg-gray-600'
//                       }`}
//                       onClick={() => setSelectedPollId(poll.id)}
//                     >
//                       <h4 className="font-medium text-white">{poll.question}</h4>
//                       <div className="flex justify-between text-sm text-gray-400 mt-2">
//                         <span>{new Date(poll.created_at).toLocaleDateString()}</span>
//                         <span>{poll.options?.length || 0} options</span>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>
              
//               {/* Poll Display */}
//               <div className="bg-gray-700/50 rounded-xl p-4">
//                 {selectedPollId ? (
//                   <Polls pollId={selectedPollId} />
//                 ) : (
//                   <div className="flex flex-col items-center justify-center h-full text-center py-12">
//                     <div className="mb-4 bg-gray-600/50 p-4 rounded-full">
//                       <BarChart3 size={40} className="text-gray-400" />
//                     </div>
//                     <h3 className="text-xl font-semibold text-white mb-2">Select a poll to view</h3>
//                     <p className="text-gray-400">Choose a poll from the list to see details and vote</p>
//                   </div>
//                 )}
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Dashboard;

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserAuth } from '../context/AuthContext';
import { supabase } from '../supabaseClient';
import Polls from './polls.jsx';
import { BarChart3, Bookmark, PlusCircle, Users, LogOut, Lock, Link } from 'lucide-react';

const Dashboard = () => {
  const navigate = useNavigate();
  const { session, signOut, user } = UserAuth();
  const [polls, setPolls] = useState([]);
  const [selectedPollId, setSelectedPollId] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const userEmail = session?.user?.email;
  const firstName = userEmail 
    ? userEmail.split('@')[0].replace(/[^a-zA-Z]/g, '') || 'User'
    : 'User';

  // Fetch user's polls with options
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
        
        // Calculate total votes for each poll
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

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const handleCreatePoll = () => {
    navigate('/create-poll');
  };

  const generateJoinLink = async (pollId) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_SITE_URL}/api/generate-join-link`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ pollId, expiryMinutes: 60 }),
      });
      const data = await response.json();
      
      // Copy to clipboard
      navigator.clipboard.writeText(data.joinLink);
      alert('Join link copied to clipboard!');
    } catch (err) {
      console.error('Error generating join link:', err);
      alert('Failed to generate join link');
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br">
      {/* Background decoration */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-900/20 to-transparent"></div>
        <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-purple-900/20 to-transparent"></div>
      </div>
      
      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10">
          <div className="mb-6 md:mb-0">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
              Welcome back, <span className="text-blue-400">{firstName}!</span>
            </h1>
            <p className="text-lg text-gray-300 max-w-2xl">
              Create, participate, and track polls in real-time with instant feedback and visualizations.
            </p>
          </div>
          
          <div className="flex flex-wrap gap-3">
            <button 
              onClick={handleCreatePoll}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium flex items-center gap-2 transition-colors"
            >
              <PlusCircle size={20} />
              Create Poll
            </button>
            <button 
              onClick={() => navigate('/polls')}
              className="bg-gray-800 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-medium flex items-center gap-2 transition-colors"
            >
              <BarChart3 size={20} />
              Browse Polls
            </button>
            <button 
              onClick={handleSignOut}
              className="bg-gray-800 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-medium flex items-center gap-2 transition-colors"
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>
        
        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-blue-500/20 p-3 rounded-lg">
                <PlusCircle size={24} className="text-blue-400" />
              </div>
              <h2 className="text-xl font-semibold text-white">Create Polls</h2>
            </div>
            <p className="text-gray-300">
              Create custom polls on any topic, add options, set permissions, and see responses in real-time.
            </p>
          </div>
          
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-purple-500/20 p-3 rounded-lg">
                <Users size={24} className="text-purple-400" />
              </div>
              <h2 className="text-xl font-semibold text-white">Vote & Participate</h2>
            </div>
            <p className="text-gray-300">
              Browse public polls or join private ones. Cast your vote and see real-time results.
            </p>
          </div>
          
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-green-500/20 p-3 rounded-lg">
                <Bookmark size={24} className="text-green-400" />
              </div>
              <h2 className="text-xl font-semibold text-white">Bookmark & Track</h2>
            </div>
            <p className="text-gray-300">
              Save polls for later, view past participation, and stay updated on topics you care about.
            </p>
          </div>
        </div>
        
        {/* Polls Section */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2">
              <BarChart3 size={24} className="text-white" />
              <h2 className="text-2xl font-bold text-white">Your Polls</h2>
            </div>
            <button 
              onClick={handleCreatePoll}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors"
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
            <div className="text-center py-12">
              <div className="mb-4 flex justify-center">
                <div className="bg-gray-700/50 p-4 rounded-full">
                  <BarChart3 size={40} className="text-gray-400" />
                </div>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">No polls yet</h3>
              <p className="text-gray-400 mb-4">Create your first poll to get started</p>
              <button 
                onClick={handleCreatePoll}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium flex items-center gap-2 mx-auto transition-colors"
              >
                <PlusCircle size={18} />
                Create Poll
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Poll List */}
              <div className="bg-gray-700/50 rounded-xl p-4">
                <h3 className="text-lg font-semibold text-white mb-4">Select a Poll</h3>
                <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
                  {polls.map(poll => (
                    <div 
                      key={poll.id} 
                      className={`p-4 rounded-lg cursor-pointer transition-all duration-200 ${
                        selectedPollId === poll.id 
                          ? 'bg-blue-600/20 border border-blue-500' 
                          : 'bg-gray-600/50 hover:bg-gray-600'
                      }`}
                      onClick={() => setSelectedPollId(poll.id)}
                    >
                      <div className="flex justify-between items-start">
                        <h4 className="font-medium text-white">{poll.question}</h4>
                        {poll.is_password_protected && (
                          <Lock size={16} className="text-yellow-400 flex-shrink-0 ml-2" />
                        )}
                      </div>
                      <div className="flex justify-between text-sm text-gray-400 mt-2">
                        <span>{new Date(poll.created_at).toLocaleDateString()}</span>
                        <span>{poll.options?.length || 0} options</span>
                      </div>
                      
                      {/* Show poll options and vote counts */}
                      {poll.options && poll.options.length > 0 && (
                        <div className="mt-3 space-y-2">
                          {poll.options.map(option => (
                            <div key={option.id} className="flex justify-between text-sm">
                              <span className="text-gray-300 truncate max-w-[70%]">{option.option_text}</span>
                              <span className="text-blue-400">{option.votes_count} votes</span>
                            </div>
                          ))}
                        </div>
                      )}
                      
                      {/* Action buttons */}
                      <div className="flex justify-end gap-2 mt-3">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            generateJoinLink(poll.id);
                          }}
                          className="text-xs bg-gray-600 hover:bg-gray-500 text-white px-2 py-1 rounded flex items-center gap-1"
                        >
                          <Link size={12} />
                          Share Link
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Poll Display */}
              <div className="bg-gray-700/50 rounded-xl p-4">
                {selectedPollId ? (
                  <Polls pollId={selectedPollId} />
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-center py-12">
                    <div className="mb-4 bg-gray-600/50 p-4 rounded-full">
                      <BarChart3 size={40} className="text-gray-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2">Select a poll to view</h3>
                    <p className="text-gray-400">Choose a poll from the list to see details and vote</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;