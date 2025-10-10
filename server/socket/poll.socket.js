// // server/socket/poll.socket.js
// import { supabase } from '../supabaseClient.js';

// export const handlePollSocket = (io) => {
//   io.on("connection", (socket) => {
//     console.log(`a user connected ${socket.id}`);
    
//     // Joining a poll room
//     const handleJoinPoll = (pollId) => {
//       if (!pollId) {
//         socket.emit("pollError", { message: "Poll ID is required" });
//         return;
//       }
//       socket.join(pollId);
//       console.log(`User ${socket.id} joined poll room: ${pollId}`);
//       socket.emit("joinedPoll", { pollId });
//     };
    
//     // Voting in a poll
//     const handleVote = async (data) => {
//       console.log("Vote received:", data);
      
//       if (!data || !data.pollId || !data.optionId) {
//         socket.emit("pollError", { message: "Invalid vote data" });
//         return;
//       }
      
//       try {
//         // Check if user has already voted (only if userId is provided)
//         if (data.userId) {
//           const { data: existingVote, error: checkError } = await supabase
//             .from('votes')
//             .select('*')
//             .eq('poll_id', data.pollId)
//             .eq('user_id', data.userId);
            
//           if (checkError) throw checkError;
          
//           if (existingVote && existingVote.length > 0) {
//             socket.emit("pollError", { message: "You have already voted in this poll" });
//             return;
//           }
//         }
        
//         // Record the vote in the database
//         const { data: vote, error: voteError } = await supabase
//           .from('votes')
//           .insert([{
//             poll_id: data.pollId,
//             option_id: data.optionId,
//             user_id: data.userId || null // Allow anonymous votes
//           }]);
          
//         if (voteError) throw voteError;
        
//         console.log("Vote recorded successfully");
        
//         // Update the vote count for the option
//         console.log("Updating vote count for option:", data.optionId);
//         const { error: updateError } = await supabase.rpc('increment_vote', {
//           option_id: data.optionId
//         });
        
//         if (updateError) throw updateError;
        
//         console.log("Vote count updated successfully");
        
//         // Get updated poll data
//         console.log("Fetching updated poll data for poll:", data.pollId);
//         const pollData = await getPollDataService(data.pollId);
//         console.log("Updated poll data:", pollData);
        
//         // Broadcast updated results to all clients in the poll room
//         io.to(data.pollId).emit("pollDataUpdated", { data: pollData });
//         console.log("Poll data updated and broadcasted");
        
//       } catch (error) {
//         console.error("Error processing vote:", error);
//         socket.emit("pollError", { message: "Failed to process vote" });
//       }
//     };
    
//     // Disconnecting
//     const handleDisconnect = () => {
//       console.log(`User disconnected: ${socket.id}`);
//     };
    
//     // Register event handlers
//     socket.on("joinPoll", handleJoinPoll);
//     socket.on("vote", handleVote);
//     socket.on("disconnect", handleDisconnect);
//   });
// };

// // Helper function to get poll data with options and vote counts
// async function getPollDataService(pollId) {
//   try {
//     console.log("Querying Supabase for poll with ID:", pollId);
    
//     // First get the poll
//     const { data: poll, error: pollError } = await supabase
//       .from('polls')
//       .select('*')
//       .eq('id', pollId)
//       .single();
      
//     if (pollError) {
//       console.error("Supabase error fetching poll:", pollError);
//       throw pollError;
//     }
    
//     console.log("Poll data from Supabase:", poll);
    
//     // Then get the options for this poll
//     const { data: options, error: optionsError } = await supabase
//       .from('options')
//       .select('*')
//       .eq('poll_id', pollId);
      
//     if (optionsError) {
//       console.error("Supabase error fetching options:", optionsError);
//       throw optionsError;
//     }
    
//     console.log("Options data from Supabase:", options);
    
//     // Calculate total votes
//     const totalVotes = options.reduce((sum, option) => sum + option.votes_count, 0);
//     console.log("Total votes calculated:", totalVotes);
    
//     return {
//       ...poll,
//       options,
//       totalVotes
//     };
//   } catch (error) {
//     console.error('Error in getPollDataService:', error);
//     throw error;
//   }
// }


import { supabase } from '../supabaseClient.js';

// Redis cache functions
const createCacheClient = () => {
  // This will be set from server.js
  let redisClient = null;
  
  return {
    setClient: (client) => {
      redisClient = client;
    },
    
    cachePoll: async (pollId, data, expiry = 300) => {
      if (!redisClient) return;
      try {
        await redisClient.setEx(`poll:${pollId}`, expiry, JSON.stringify(data));
        console.log(`Cached poll: ${pollId}`);
      } catch (error) {
        console.error('Redis cache set error:', error);
      }
    },
    
    getCachedPoll: async (pollId) => {
      if (!redisClient) return null;
      try {
        const cached = await redisClient.get(`poll:${pollId}`);
        return cached ? JSON.parse(cached) : null;
      } catch (error) {
        console.error('Redis cache get error:', error);
        return null;
      }
    },
    
    invalidatePollCache: async (pollId) => {
      if (!redisClient) return;
      try {
        await redisClient.del(`poll:${pollId}`);
        console.log(`Invalidated cache for poll: ${pollId}`);
      } catch (error) {
        console.error('Redis cache delete error:', error);
      }
    },
    
    cachePollsList: async (key, data, expiry = 60) => {
      if (!redisClient) return;
      try {
        await redisClient.setEx(`polls:${key}`, expiry, JSON.stringify(data));
      } catch (error) {
        console.error('Redis cache set error:', error);
      }
    },
    
    getCachedPollsList: async (key) => {
      if (!redisClient) return null;
      try {
        const cached = await redisClient.get(`polls:${key}`);
        return cached ? JSON.parse(cached) : null;
      } catch (error) {
        console.error('Redis cache get error:', error);
        return null;
      }
    }
  };
};

export const cacheService = createCacheClient();

export const handlePollSocket = (io) => {
  io.on("connection", (socket) => {
    console.log(`a user connected ${socket.id}`);
    
    // Get single poll with cache
    const handleGetPoll = async (pollId, callback) => {
      try {
        // Try cache first
        const cachedPoll = await cacheService.getCachedPoll(pollId);
        if (cachedPoll) {
          callback({ data: cachedPoll });
          console.log(`Served poll ${pollId} from cache`);
          return;
        }

        // If not cached, fetch from database
        const pollData = await getPollDataService(pollId);
        
        // Cache the result
        await cacheService.cachePoll(pollId, pollData);

        callback({ data: pollData });
        console.log(`Fetched and cached poll: ${pollId}`);
      } catch (error) {
        console.error('Error fetching poll:', error);
        callback({ error: 'Failed to fetch poll' });
      }
    };

    // Get polls list with cache
    const handleGetPolls = async ({ page = 1, limit = 12 }, callback) => {
      try {
        const cacheKey = `page_${page}_limit_${limit}`;
        
        // Try cache first
        const cachedPolls = await cacheService.getCachedPollsList(cacheKey);
        if (cachedPolls) {
          callback(cachedPolls);
          console.log(`Served polls page ${page} from cache`);
          return;
        }

        // If not cached, fetch from database
        const from = (page - 1) * limit;
        const to = from + limit - 1;

        const { data: polls, error, count } = await supabase
          .from('polls')
          .select(`
            *,
            options(*),
            profiles(username, avatar_url)
          `, { count: 'exact' })
          .order('created_at', { ascending: false })
          .range(from, to);

        if (error) throw error;

        // Process polls data
        const processedPolls = await Promise.all(
          polls.map(async (poll) => {
            const { count: participantCount } = await supabase
              .from('votes')
              .select('user_id', { count: 'exact', head: true })
              .eq('poll_id', poll.id);

            const totalVotes = poll.options.reduce((sum, option) => sum + option.votes_count, 0);
            const engagementRate = participantCount > 0 ? Math.round((totalVotes / participantCount) * 100) : 0;

            return {
              ...poll,
              totalVotes,
              participantCount: participantCount || 0,
              engagementRate
            };
          })
        );

        const result = {
          polls: processedPolls,
          hasMore: polls.length === limit,
          totalCount: count
        };

        // Cache the result
        await cacheService.cachePollsList(cacheKey, result);

        callback(result);
        console.log(`Fetched and cached polls page: ${page}`);
      } catch (error) {
        console.error('Error fetching polls:', error);
        callback({ error: 'Failed to fetch polls' });
      }
    };
    
    // Joining a poll room
    const handleJoinPoll = (pollId) => {
      if (!pollId) {
        socket.emit("pollError", { message: "Poll ID is required" });
        return;
      }
      socket.join(pollId);
      console.log(`User ${socket.id} joined poll room: ${pollId}`);
      socket.emit("joinedPoll", { pollId });
    };
    
    // Voting in a poll with cache invalidation
    const handleVote = async (data) => {
      console.log("Vote received:", data);
      
      if (!data || !data.pollId || !data.optionId) {
        socket.emit("pollError", { message: "Invalid vote data" });
        return;
      }
      
      try {
        // Check if user has already voted (only if userId is provided)
        if (data.userId) {
          const { data: existingVote, error: checkError } = await supabase
            .from('votes')
            .select('*')
            .eq('poll_id', data.pollId)
            .eq('user_id', data.userId);
            
          if (checkError) throw checkError;
          
          if (existingVote && existingVote.length > 0) {
            socket.emit("pollError", { message: "You have already voted in this poll" });
            return;
          }
        }
        
        // Record the vote in the database
        const { data: vote, error: voteError } = await supabase
          .from('votes')
          .insert([{
            poll_id: data.pollId,
            option_id: data.optionId,
            user_id: data.userId || null
          }]);
          
        if (voteError) throw voteError;
        
        console.log("Vote recorded successfully");
        
        // Update the vote count for the option
        console.log("Updating vote count for option:", data.optionId);
        const { error: updateError } = await supabase.rpc('increment_vote', {
          option_id: data.optionId
        });
        
        if (updateError) throw updateError;
        
        console.log("Vote count updated successfully");
        
        // Invalidate cache for this poll
        await cacheService.invalidatePollCache(data.pollId);
        
        // Get updated poll data
        console.log("Fetching updated poll data for poll:", data.pollId);
        const pollData = await getPollDataService(data.pollId);
        console.log("Updated poll data:", pollData);
        
        // Re-cache the updated poll
        await cacheService.cachePoll(data.pollId, pollData);
        
        // Broadcast updated results to all clients in the poll room
        io.to(data.pollId).emit("pollDataUpdated", { data: pollData });
        console.log("Poll data updated and broadcasted");
        
      } catch (error) {
        console.error("Error processing vote:", error);
        socket.emit("pollError", { message: "Failed to process vote" });
      }
    };
    
    // Disconnecting
    const handleDisconnect = () => {
      console.log(`User disconnected: ${socket.id}`);
    };
    
    // Register event handlers
    socket.on("getPoll", handleGetPoll);
    socket.on("getPolls", handleGetPolls);
    socket.on("joinPoll", handleJoinPoll);
    socket.on("vote", handleVote);
    socket.on("disconnect", handleDisconnect);
  });
};

// Helper function to get poll data with options and vote counts
async function getPollDataService(pollId) {
  try {
    console.log("Querying Supabase for poll with ID:", pollId);
    
    // Get poll with options and profiles
    const { data: poll, error: pollError } = await supabase
      .from('polls')
      .select(`
        *,
        options(*),
        profiles(username, avatar_url)
      `)
      .eq('id', pollId)
      .single();
      
    if (pollError) {
      console.error("Supabase error fetching poll:", pollError);
      throw pollError;
    }
    
    console.log("Poll data from Supabase:", poll);
    
    // Calculate total votes
    const totalVotes = poll.options.reduce((sum, option) => sum + option.votes_count, 0);
    console.log("Total votes calculated:", totalVotes);
    
    return {
      ...poll,
      totalVotes
    };
  } catch (error) {
    console.error('Error in getPollDataService:', error);
    throw error;
  }
}