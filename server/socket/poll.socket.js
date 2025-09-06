import {supabase} from '../supabaseClient.js';

export const handlePollSocket = (io) =>{
    io.on("connection", (socket) => {
      console.log(`a user connected ${socket.id}`);

      //joining a poll room
      const handleJoinPoll = (pollId) => {
      if (!pollId) {
        socket.emit("pollError", { message: "Poll ID is required" });
        return;
      }
      socket.join(pollId);
      console.log(`User ${socket.id} joined poll room: ${pollId}`);
      socket.emit("joinedPoll", { pollId });
    };
    
     //voting in a poll
     const handleVote = async (data) =>{
        if (!data || !data.pollId || !data.optionId) {
        socket.emit("pollError", { message: "Invalid vote data" });
        return;
      }
      console.log("Vote received:", data);

      try{
        const {data : vote, error : voteError} = await supabase
        .from('votes')
        .insert([{
          poll_id : data.pollId,
          option_id : data.optionId,
          user_id : data.userId || null,
        }]);
      
        if(voteError) throw voteError;

        // update vote count
        const { error: updateError } = await supabase.rpc('increment_vote',{
           option_id: data.optionId
        });

        if(updateError) throw updateError;

        //get updated poll data
        const pollData = await getPollDataService(data.pollId);
        io.to(data.pollId).emit("pollDataUpdated", { data: pollData });
      } catch (error) {
        console.error("Error fetching poll data:", error);
        socket.emit("pollError", { message: "Failed to fetch poll data" });
      }
    };

    //get current poll data
    const handleGetPollData = async (pollId) => {
      if (!pollId) {
        socket.emit("pollError", { message: "Poll ID is required" });
        return;
      }
      try {
        const pollData = await getPollDataService(pollId);
        socket.emit("pollData", { data: pollData });
      } catch (error) {
        console.error("Error fetching poll data:", error);
        socket.emit("pollError", { message: "Failed to fetch poll data" });
      }
    };

    //disconnecting
      const handleDisconnect = () => {
      console.log(`User disconnected: ${socket.id}`);
    };
    socket.on("joinPoll", handleJoinPoll);
    socket.on("vote", handleVote);
    socket.on("getPollData", handleGetPollData);
    socket.on("disconnect", handleDisconnect);
  });
};

async function getPollDataService(pollId){
  try{
    const {data : poll, error : pollError} = await supabase
    .from("polls")
      .select(`
        id,
        question,
        created_at,
        options(id, 
        option_text, 
        vote_count),`)
        .eq('id', pollId)
        .single();

      if(pollError) throw pollError;

      const totalVotes = poll.options.reduce((sum, option) => sum + option.vote_count, 0);

      return {
        ...poll,
        totalVotes,
      };
    } catch (error) {
      console.error("Error in getPollDataService:", error);
      throw error;
    }
  }