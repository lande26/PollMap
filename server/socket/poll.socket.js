// server/socket/poll.socket.js
import { supabase } from '../supabaseClient.js';

export const handlePollSocket = (io) => {
  io.on("connection", (socket) => {
    console.log(`a user connected ${socket.id}`);
    
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
    
    // Voting in a poll
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
            user_id: data.userId || null // Allow anonymous votes
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
        
        // Get updated poll data
        console.log("Fetching updated poll data for poll:", data.pollId);
        const pollData = await getPollDataService(data.pollId);
        console.log("Updated poll data:", pollData);
        
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
    socket.on("joinPoll", handleJoinPoll);
    socket.on("vote", handleVote);
    socket.on("disconnect", handleDisconnect);
  });
};

// Helper function to get poll data with options and vote counts
async function getPollDataService(pollId) {
  try {
    console.log("Querying Supabase for poll with ID:", pollId);
    
    // First get the poll
    const { data: poll, error: pollError } = await supabase
      .from('polls')
      .select('*')
      .eq('id', pollId)
      .single();
      
    if (pollError) {
      console.error("Supabase error fetching poll:", pollError);
      throw pollError;
    }
    
    console.log("Poll data from Supabase:", poll);
    
    // Then get the options for this poll
    const { data: options, error: optionsError } = await supabase
      .from('options')
      .select('*')
      .eq('poll_id', pollId);
      
    if (optionsError) {
      console.error("Supabase error fetching options:", optionsError);
      throw optionsError;
    }
    
    console.log("Options data from Supabase:", options);
    
    // Calculate total votes
    const totalVotes = options.reduce((sum, option) => sum + option.votes_count, 0);
    console.log("Total votes calculated:", totalVotes);
    
    return {
      ...poll,
      options,
      totalVotes
    };
  } catch (error) {
    console.error('Error in getPollDataService:', error);
    throw error;
  }
}