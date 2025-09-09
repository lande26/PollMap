// import React, { useState, useEffect, useContext } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useSocketContext } from '../context/SocketContext';
// import { UserAuth } from '../context/AuthContext';
// import { supabase } from '../supabaseClient';
// import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// const Polls = ({ pollId }) => {
//   const [polls, setPolls] = useState([]);
//   const [poll, setPoll] = useState(null);
//   const [selectedOption, setSelectedOption] = useState(null);
//   const [hasVoted, setHasVoted] = useState(false);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const socketContext = useSocketContext() ?? {};
//   const socket = socketContext.socket;
//   const { user } = UserAuth();
//   const navigate = useNavigate();
  
//   // Debug: Log the received pollId
//   useEffect(() => {
//     console.log("Polls component received pollId:", pollId);
//   }, [pollId]);
  
//   // Fetch all polls if no pollId is provided, or fetch specific poll if pollId is provided
//   useEffect(() => {
//     if (!pollId) {
//       // Fetch all polls
//       const fetchAllPolls = async () => {
//         try {
//           console.log("Fetching all polls");
//           const { data: polls, error: pollsError } = await supabase
//             .from('polls')
//             .select('*')
//             .order('created_at', { ascending: false });
            
//           if (pollsError) throw pollsError;
          
//           // For each poll, fetch its options
//           const pollsWithOptions = await Promise.all(
//             polls.map(async (poll) => {
//               const { data: options } = await supabase
//                 .from('options')
//                 .select('*')
//                 .eq('poll_id', poll.id);
                
//               // Calculate total votes
//               const totalVotes = options.reduce((sum, option) => sum + option.votes_count, 0);
              
//               return {
//                 ...poll,
//                 options,
//                 totalVotes
//               };
//             })
//           );
          
//           setPolls(pollsWithOptions);
//           setLoading(false);
//         } catch (err) {
//           console.error("Error fetching polls:", err);
//           setError(err.message);
//           setLoading(false);
//         }
//       };
      
//       fetchAllPolls();
//     } else {
//       // Fetch specific poll
//       if (pollId === "undefined") {
//         console.error("Received 'undefined' as pollId string");
//         setError("Invalid poll ID");
//         setLoading(false);
//         return;
//       }
      
//       const fetchPoll = async () => {
//         try {
//           console.log("Fetching poll with ID:", pollId);
//           const { data: poll, error: pollError } = await supabase
//             .from('polls')
//             .select('*')
//             .eq('id', pollId)
//             .single();
            
//           if (pollError) throw pollError;
//           console.log("Poll data received:", poll);

//           // Options for this poll
//           const { data: options, error: optionsError } = await supabase
//             .from('options')
//             .select('*')
//             .eq('poll_id', pollId);
            
//           if (optionsError) throw optionsError;
//           console.log("Options data received:", options);
          
//           // Calculate total votes
//           const totalVotes = options.reduce((sum, option) => sum + option.votes_count, 0);
//           setPoll({ ...poll, options, totalVotes });
//           setLoading(false);
//         } catch (err) {
//           console.error("Error fetching poll:", err);
//           setError(err.message);
//           setLoading(false);
//         }
//       };
      
//       fetchPoll();
//     }
//   }, [pollId]);
  
//   // Set up socket listeners only when a specific poll is selected
//   useEffect(() => {
//     if (!socket || !pollId || pollId === "undefined") return;
    
//     // Join the poll room
//     socket.emit("joinPoll", pollId);
//     console.log(`Joined poll room: ${pollId}`);
    
//     // Listen for updated poll data
//     const handlePollDataUpdated = (data) => {
//       if (data.data.id === pollId) {
//         console.log("Poll data updated:", data.data);
//         setPoll(data.data);
//       }
//     };
    
//     socket.on("pollDataUpdated", handlePollDataUpdated);
    
//     // Listen for errors
//     socket.on("pollError", (error) => {
//       console.error("Socket error:", error);
//       setError(error.message);
//     });
    
//     return () => {
//       socket.off("pollDataUpdated", handlePollDataUpdated);
//       socket.off("pollError");
//     };
//   }, [socket, pollId]);
  
//   const handleVote = () => {
//     if (!selectedOption) return;
    
//     console.log("Submitting vote for option:", selectedOption);
//     socket.emit("vote", {
//       pollId,
//       optionId: selectedOption,
//       userId: user?.id || null
//     });
    
//     setHasVoted(true);
//   };
  
//   // If no pollId is provided, show all polls
//   if (!pollId) {
//     if (loading) return <div>Loading polls...</div>;
//     if (error) return <div>Error: {error}</div>;
//     if (polls.length === 0) return <div>No polls available</div>;
    
//     return (
//       <div className="all-polls-container">
//         <h2>All Polls</h2>
//         <div className="polls-list">
//           {polls.map(poll => (
//             <div key={poll.id} className="poll-card">
//               <h3>{poll.question}</h3>
//               <div className="poll-info">
//                 <span>Created: {new Date(poll.created_at).toLocaleDateString()}</span>
//                 <span>Total Votes: {poll.totalVotes}</span>
//               </div>
//               <div className="poll-options">
//                 {poll.options.map(option => (
//                   <div key={option.id} className="poll-option">
//                     <span>{option.option_text}</span>
//                     <span>{option.votes_count} votes</span>
//                   </div>
//                 ))}
//               </div>
//               <button 
//                 className="vote-button"
//                 onClick={() => navigate(`/polls/${poll.id}`)}
//               >
//                 Vote in this Poll
//               </button>
//             </div>
//           ))}
//         </div>
//       </div>
//     );
//   }
  
//   // If pollId is provided, show the specific poll for voting
//   if (loading) return <div>Loading poll...</div>;
//   if (error) return <div>Error: {error}</div>;
//   if (!poll) return <div>Poll not found</div>;
  
//   return (
//     <div className="poll-container">
//       <h2>{poll.question}</h2>
      
//       {!hasVoted ? (
//         <div className="voting-section">
//           {poll.options.map(option => (
//             <div key={option.id} className="option">
//               <input
//                 type="radio"
//                 id={`option-${option.id}`}
//                 name="poll-option"
//                 value={option.id}
//                 onChange={() => setSelectedOption(option.id)}
//               />
//               <label htmlFor={`option-${option.id}`}>{option.option_text}</label>
//             </div>
//           ))}
//           <button onClick={handleVote} disabled={!selectedOption}>
//             Submit Vote
//           </button>
//         </div>
//       ) : (
//         <div className="results-section">
//           <h3>Live Results</h3>
//           <ResponsiveContainer width="100%" height={300}>
//             <BarChart data={poll.options}>
//               <CartesianGrid strokeDasharray="3 3" />
//               <XAxis dataKey="option_text" />
//               <YAxis />
//               <Tooltip />
//               <Legend />
//               <Bar dataKey="votes_count" fill="#8884d8" />
//             </BarChart>
//           </ResponsiveContainer>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Polls;

import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSocketContext } from '../context/SocketContext';
import { UserAuth } from '../context/AuthContext';
import { supabase } from '../supabaseClient';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const Polls = ({ pollId }) => {
  const [polls, setPolls] = useState([]);
  const [poll, setPoll] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userVote, setUserVote] = useState(null); // Track user's vote
  const socketContext = useSocketContext() ?? {};
  const [isExpired, setIsExpired] = useState(false);
  const socket = socketContext.socket;
  const { user } = UserAuth();
  const navigate = useNavigate();
  
  // Debug: Log the received pollId
  useEffect(() => {
    console.log("Polls component received pollId:", pollId);
  }, [pollId]);
  
  // Fetch all polls if no pollId is provided, or fetch specific poll if pollId is provided
  useEffect(() => {
    if (!pollId) {
      // Fetch all polls
      const fetchAllPolls = async () => {
        try {
          console.log("Fetching all polls");
          const { data: polls, error: pollsError } = await supabase
            .from('polls')
            .select('*')
            .order('created_at', { ascending: false });
            
          if (pollsError) throw pollsError;
          
          // For each poll, fetch its options
          const pollsWithOptions = await Promise.all(
            polls.map(async (poll) => {
              const { data: options } = await supabase
                .from('options')
                .select('*')
                .eq('poll_id', poll.id);
                
              // Calculate total votes
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
      // Fetch specific poll
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
          

          if(poll.expires_at && new Date() > new Date(poll.expires_at)){
            setIsExpired(true);
          }
          // Options for this poll
          const { data: options, error: optionsError } = await supabase
            .from('options')
            .select('*')
            .eq('poll_id', pollId);
            
          if (optionsError) throw optionsError;
          console.log("Options data received:", options);
          
          // Check if user has already voted
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
          
          // Calculate total votes
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
  
  // Set up socket listeners only when a specific poll is selected
  useEffect(() => {
    if (!socket || !pollId || pollId === "undefined") return;
    
    // Join the poll room
    socket.emit("joinPoll", pollId);
    console.log(`Joined poll room: ${pollId}`);
    
    // Listen for updated poll data
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
  
  // If no pollId is provided, show all polls
  if (!pollId) {
    if (loading) return <div>Loading polls...</div>;
    if (error) return <div>Error: {error}</div>;
    if (polls.length === 0) return <div>No polls available</div>;
    
    return (
      <div className="all-polls-container">
        <h2>All Polls</h2>
        <div className="polls-list">
          {polls.map(poll => (
            <div key={poll.id} className="poll-card">
              <h3>{poll.question}</h3>
              <div className="poll-info">
                <span>Created: {new Date(poll.created_at).toLocaleDateString()}</span>
                <span>Total Votes: {poll.totalVotes}</span>
              </div>
              <div className="poll-options">
                {poll.options.map(option => (
                  <div key={option.id} className="poll-option">
                    <span>{option.option_text}</span>
                    <span>{option.votes_count} votes</span>
                  </div>
                ))}
              </div>
              <button 
                className="vote-button"
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
  
  // If pollId is provided, show the specific poll for voting
  if (loading) return <div>Loading poll...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!poll) return <div>Poll not found</div>;
  
  return (
    <div className="poll-container">
      <h2>{poll.question}</h2>

      {isExpired && (
        <div className ="bg-red-500/20 border border-red-500 text-red-200 p-4 rounded-lg mb-6">
            This poll has expired and is no longer accepting votes.
        </div>
      )}

      {!hasVoted && !isExpired ? (
        <div className="voting-section">
          {poll.options.map(option => (
            <div key={option.id} className="option">
              <input
                type="radio"
                id={`option-${option.id}`}
                name="poll-option"
                value={option.id}
                checked={selectedOption === option.id}
                onChange={() => setSelectedOption(option.id)}
              />
              <label htmlFor={`option-${option.id}`}>{option.option_text}</label>
            </div>
          ))}
          <button onClick={handleVote} disabled={!selectedOption}>
            Submit Vote
          </button>
        </div>
      ) : (
        <div className="results-section">
          <h3>Live Results</h3>
          {userVote && (
            <div className="user-vote-info">
              You voted for: {poll.options.find(opt => opt.id === userVote.option_id)?.option_text}
            </div>
          )}
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={poll.options}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="option_text" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="votes_count" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default Polls;