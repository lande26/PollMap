import { supabase } from '../supabaseClient.js';
import { createClient } from '@supabase/supabase-js';
import { randomUUID } from 'crypto';
import dotenv from 'dotenv';
dotenv.config();

/**
 * Create a Supabase client authenticated as the socket user.
 * This ensures RLS policies (e.g. auth.uid() = host_id) are satisfied.
 */
function getUserSupabase(socket) {
    const token = socket.handshake?.auth?.token;
    if (!token) return supabase; // fallback to default (anon)

    return createClient(
        process.env.SUPABASE_URL,
        process.env.SUPABASE_SERVICE_ROLE_KEY, // still the anon key in this env
        {
            global: {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            },
        }
    );
}

/**
 * Generate a unique 6-character alphanumeric room code.
 */
function generateRoomCode() {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // no I/O/0/1 to avoid confusion
    let code = '';
    for (let i = 0; i < 6; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
}

/**
 * Unified Room + Q&A socket handler.
 * All events use `io.to(roomCode)` for broadcasting.
 */
export const handleRoomSocket = (io, pubClient) => {
    io.on('connection', (socket) => {

        // ───────────────────────────────────
        //  ROOM: GENERATE ONE-TIME LINK
        // ───────────────────────────────────
        socket.on('room:generate-link', async ({ roomId, code }, callback) => {
            const user = socket.user;
            if (!user || user.role === 'guest') {
                return callback?.({ error: 'Authentication required' });
            }

            try {
                // Verify host
                const { data: room } = await supabase
                    .from('rooms')
                    .select('host_id')
                    .eq('id', roomId)
                    .single();

                if (!room || room.host_id !== user.id) {
                    return callback?.({ error: 'Only the host can generate invite links' });
                }

                const token = randomUUID();
                // Store in Redis: token -> roomCode, expires in 24h (86400s)
                await pubClient.set(`room:onetime:${token}`, code, {
                    EX: 86400 // 24 hours
                });

                callback?.({ token });
            } catch (err) {
                console.error(`ROOM : Error in room:generate-link:`, err);
                callback?.({ error: 'Failed to generate link' });
            }
        });

        // ───────────────────────────────────
        //  ROOM: JOIN BY LINK
        // ───────────────────────────────────
        socket.on('room:join-link', async ({ token }, callback) => {
            const user = socket.user;
            if (!user || user.role === 'guest') {
                return callback?.({ error: 'Authentication required' });
            }

            try {
                // Get and delete the token to ensure one-time usage
                // Note: GETDEL is available in Redis 6.2+. If using older Redis, use MULTI/EXEC or Lua.
                // Assuming modern Redis as per typical setups.
                const code = await pubClient.getDel(`room:onetime:${token}`);

                if (!code) {
                    return callback?.({ error: 'This invite link is invalid or has already been used.' });
                }

                // Proceed to join room using the retrieved code
                // Reusing the logic from 'room:join' would be best, but for now copying essential parts
                // or just calling a shared function if available. 
                // Since this is a standalone handler, I'll replicate the join logic for simplicity but reuse imports.

                const { data: room, error } = await supabase
                    .from('rooms')
                    .select('*')
                    .eq('code', code)
                    .single();

                if (error || !room) {
                    return callback?.({ error: 'Room not found' });
                }

                if (!room.is_active) {
                    return callback?.({ error: 'This room session has ended' });
                }

                // Check participant count
                const { count } = await supabase
                    .from('room_participants')
                    .select('*', { count: 'exact', head: true })
                    .eq('room_id', room.id);

                if (count >= room.max_participants) {
                    return callback?.({ error: 'Room is full' });
                }

                // Upsert participant
                const userDb = getUserSupabase(socket);
                await userDb
                    .from('room_participants')
                    .upsert({ room_id: room.id, user_id: user.id }, { onConflict: 'room_id,user_id' });

                socket.join(code);

                // Get host profile
                const { data: hostProfile } = await supabase
                    .from('profiles')
                    .select('username, avatar_url')
                    .eq('id', room.host_id)
                    .single();

                // Broadcast updated participant list
                // Need to import/use getParticipants helper if defined outside handleRoomSocket.
                // It seems helpers are defined below or need to be moved up.
                // For now, I'll assuming getParticipants is available in scope or needs to be defined.
                // Wait, examining original file: getParticipants was called in room:join.
                // It must be defined in the file.

                // Helper to get participants from DB
                const getParticipants = async (rid) => {
                    const { data } = await supabase
                        .from('room_participants')
                        .select('user_id, profiles(username, avatar_url)')
                        .eq('room_id', rid);

                    return data?.map(p => ({
                        user_id: p.user_id,
                        username: p.profiles?.username,
                        avatar_url: p.profiles?.avatar_url
                    })) || [];
                };

                const participants = await getParticipants(room.id);
                io.to(code).emit('room:participants-updated', { participants });

                callback?.({
                    room: { ...room, host: hostProfile },
                    participants,
                    code // Return code so frontend knows where they joined
                });

            } catch (err) {
                console.error(`ROOM: Error in room:join-link:`, err);
                callback?.({ error: 'Internal server error' });
            }
        });

        // ───────────────────────────────────
        //  ROOM: CREATE
        // ───────────────────────────────────
        socket.on('room:create', async ({ name }, callback) => {
            const user = socket.user;
            if (!user || user.role === 'guest') {
                return callback?.({ error: 'Authentication required' });
            }

            try {
                const code = generateRoomCode();


                const userDb = getUserSupabase(socket);

                const { data: room, error } = await userDb
                    .from('rooms')
                    .insert({ name, code, host_id: user.id })
                    .select()
                    .single();

                if (error) {
                    console.error(`ROOM: Create failed:`, error.message);
                    return callback?.({ error: 'Failed to create room' });
                }

                // Host auto-joins
                socket.join(code);
                await userDb.from('room_participants').insert({
                    room_id: room.id,
                    user_id: user.id,
                });


                callback?.({ room });
            } catch (err) {
                console.error(`ROOM: Unexpected error in room:create:`, err);
                callback?.({ error: 'Internal server error' });
            }
        });

        // ───────────────────────────────────
        //  ROOM: JOIN
        // ───────────────────────────────────
        socket.on('room:join', async ({ code }, callback) => {
            const user = socket.user;
            if (!user || user.role === 'guest') {
                return callback?.({ error: 'Authentication required' });
            }

            try {


                const { data: room, error } = await supabase
                    .from('rooms')
                    .select('*')
                    .eq('code', code)
                    .single();

                if (error || !room) {

                    return callback?.({ error: 'Room not found' });
                }

                if (!room.is_active) {
                    return callback?.({ error: 'This room session has ended' });
                }

                // Check participant count
                const { count } = await supabase
                    .from('room_participants')
                    .select('*', { count: 'exact', head: true })
                    .eq('room_id', room.id);

                if (count >= room.max_participants) {
                    return callback?.({ error: 'Room is full' });
                }

                // Upsert participant (ignore if already joined)
                const userDb = getUserSupabase(socket);
                await userDb
                    .from('room_participants')
                    .upsert({ room_id: room.id, user_id: user.id }, { onConflict: 'room_id,user_id' });

                socket.join(code);

                // Get host profile
                const { data: hostProfile } = await supabase
                    .from('profiles')
                    .select('username, avatar_url')
                    .eq('id', room.host_id)
                    .single();

                // Broadcast updated participant list
                const participants = await getParticipants(room.id);
                io.to(code).emit('room:participants-updated', { participants });


                callback?.({
                    room: { ...room, host: hostProfile },
                    participants,
                });
            } catch (err) {
                console.error(`ROOM: Unexpected error in room:join:`, err);
                callback?.({ error: 'Internal server error' });
            }
        });

        // ───────────────────────────────────
        //  ROOM: LEAVE
        // ───────────────────────────────────
        socket.on('room:leave', async ({ roomId, code }) => {
            const user = socket.user;
            if (!user || user.role === 'guest') return;

            try {

                socket.leave(code);

                await getUserSupabase(socket)
                    .from('room_participants')
                    .delete()
                    .eq('room_id', roomId)
                    .eq('user_id', user.id);

                const participants = await getParticipants(roomId);
                io.to(code).emit('room:participants-updated', { participants });

            } catch (err) {
                console.error(`ROOM: Error in room:leave:`, err);
            }
        });

        // ───────────────────────────────────
        //  ROOM: GET (details + participants)
        // ───────────────────────────────────
        socket.on('room:get', async ({ code }, callback) => {
            try {
                const { data: room, error } = await supabase
                    .from('rooms')
                    .select('*')
                    .eq('code', code)
                    .single();

                if (error || !room) {
                    return callback?.({ error: 'Room not found' });
                }

                const { data: hostProfile } = await supabase
                    .from('profiles')
                    .select('username, avatar_url')
                    .eq('id', room.host_id)
                    .single();

                const participants = await getParticipants(room.id);

                callback?.({
                    room: { ...room, host: hostProfile },
                    participants,
                });
            } catch (err) {
                console.error(`ROOM: Error in room:get:`, err);
                callback?.({ error: 'Internal server error' });
            }
        });

        // ───────────────────────────────────
        //  ROOM: END SESSION (host only)
        // ───────────────────────────────────
        socket.on('room:end', async ({ roomId, code }, callback) => {
            const user = socket.user;
            if (!user || user.role === 'guest') {
                return callback?.({ error: 'Authentication required' });
            }

            try {
                // Verify host
                const { data: room } = await supabase
                    .from('rooms')
                    .select('host_id')
                    .eq('id', roomId)
                    .single();

                if (!room || room.host_id !== user.id) {
                    return callback?.({ error: 'Only the host can end the session' });
                }

                await getUserSupabase(socket)
                    .from('rooms')
                    .update({ is_active: false })
                    .eq('id', roomId);

                io.to(code).emit('room:ended', { roomId });

                callback?.({ success: true });
            } catch (err) {
                console.error(`ROOM: Error in room:end:`, err);
                callback?.({ error: 'Internal server error' });
            }
        });

        // ───────────────────────────────────
        //  ROOM: LINK POLL (host only)
        // ───────────────────────────────────
        socket.on('room:link-poll', async ({ roomId, pollId, code }, callback) => {
            const user = socket.user;
            if (!user || user.role === 'guest') {
                return callback?.({ error: 'Authentication required' });
            }

            try {
                // Verify host
                const { data: room } = await supabase
                    .from('rooms')
                    .select('host_id')
                    .eq('id', roomId)
                    .single();

                if (!room || room.host_id !== user.id) {
                    return callback?.({ error: 'Only the host can link polls' });
                }

                const { error } = await getUserSupabase(socket)
                    .from('polls')
                    .update({ room_id: roomId })
                    .eq('id', pollId);

                if (error) {
                    return callback?.({ error: 'Failed to link poll' });
                }

                // Broadcast updated poll list
                const polls = await getRoomPolls(roomId);
                io.to(code).emit('room:polls-updated', { polls });


                callback?.({ success: true, polls });
            } catch (err) {
                console.error(`ROOM: Error in room:link-poll:`, err);
                callback?.({ error: 'Internal server error' });
            }
        });

        // ───────────────────────────────────
        //  ROOM: GET POLLS
        // ───────────────────────────────────
        socket.on('room:get-polls', async ({ roomId }, callback) => {
            try {
                const polls = await getRoomPolls(roomId);
                callback?.({ polls });
            } catch (err) {
                console.error(`ROOM: Error in room:get-polls:`, err);
                callback?.({ error: 'Internal server error' });
            }
        });

        // ───────────────────────────────────
        //  Q&A: GET QUESTIONS
        // ───────────────────────────────────
        socket.on('qna:get', async ({ roomId, code }, callback) => {
            try {
                const { data: questions, error } = await supabase
                    .from('questions')
                    .select(`
                        id, room_id, user_id, content, is_answered, is_approved, created_at,
                        profiles!user_id(username, avatar_url),
                        question_votes(user_id)
                    `)
                    .eq('room_id', roomId)
                    .order('created_at', { ascending: false });

                if (error) {
                    console.error(`Error fetching questions:`, error.message);
                    return callback?.({ error: 'Failed to load questions' });
                }

                const userId = socket.user?.id;
                const formatted = (questions || []).map(q => ({
                    ...q,
                    author: q.profiles?.username || 'Anonymous',
                    author_avatar: q.profiles?.avatar_url || null,
                    vote_count: q.question_votes?.length || 0,
                    has_voted: userId ? q.question_votes?.some(v => v.user_id === userId) : false,
                }));


                callback?.({ questions: formatted });
            } catch (err) {
                console.error(`Unexpected error in qna:get:`, err);
                callback?.({ error: 'Failed to load questions' });
            }
        });

        // ───────────────────────────────────
        //  Q&A: ASK QUESTION
        // ───────────────────────────────────
        socket.on('qna:ask', async ({ roomId, content, code }, callback) => {
            const user = socket.user;
            if (!user || user.role === 'guest') {
                return callback?.({ error: 'Login required to ask questions' });
            }

            if (!content?.trim()) {
                return callback?.({ error: 'Question cannot be empty' });
            }

            try {
                const { data: question, error } = await getUserSupabase(socket)
                    .from('questions')
                    .insert({
                        room_id: roomId,
                        user_id: user.id,
                        content: content.trim(),
                        is_answered: false,
                        is_approved: true,
                    })
                    .select(`
                        id, room_id, user_id, content, is_answered, is_approved, created_at,
                        profiles!user_id(username, avatar_url)
                    `)
                    .single();

                if (error) {
                    console.error(`Insert failed:`, error.message);
                    return callback?.({ error: 'Failed to submit question' });
                }

                const newQuestion = {
                    ...question,
                    author: question.profiles?.username || 'Anonymous',
                    author_avatar: question.profiles?.avatar_url || null,
                    vote_count: 0,
                    has_voted: false,
                    question_votes: [],
                };

                io.to(code).emit('qna:new-question', { question: newQuestion });

                callback?.({ question: newQuestion });
            } catch (err) {
                console.error(`Unexpected error in qna:ask:`, err);
                callback?.({ error: 'Failed to submit question' });
            }
        });

        // ───────────────────────────────────
        //  Q&A: UPVOTE (toggle)
        // ───────────────────────────────────
        socket.on('qna:upvote', async ({ questionId, code }, callback) => {
            const user = socket.user;
            if (!user || user.role === 'guest') {
                return callback?.({ error: 'Login required to vote' });
            }

            try {
                // Check if already voted
                const { data: existing } = await getUserSupabase(socket)
                    .from('question_votes')
                    .select('question_id')
                    .eq('question_id', questionId)
                    .eq('user_id', user.id)
                    .maybeSingle();

                if (existing) {
                    // Remove vote
                    await getUserSupabase(socket)
                        .from('question_votes')
                        .delete()
                        .eq('question_id', questionId)
                        .eq('user_id', user.id);

                    io.to(code).emit('qna:vote-updated', {
                        questionId,
                        action: 'removed',
                        userId: user.id,
                    });

                } else {
                    // Add vote
                    await getUserSupabase(socket)
                        .from('question_votes')
                        .insert({ question_id: questionId, user_id: user.id });

                    io.to(code).emit('qna:vote-updated', {
                        questionId,
                        action: 'added',
                        userId: user.id,
                    });

                }

                callback?.({ success: true });
            } catch (err) {
                console.error(`Error in qna:upvote:`, err);
                callback?.({ error: 'Failed to update vote' });
            }
        });

        // ───────────────────────────────────
        //  Q&A: MARK ANSWERED (host only)
        // ───────────────────────────────────
        socket.on('qna:mark-answered', async ({ questionId, roomId, code }, callback) => {
            const user = socket.user;
            if (!user || user.role === 'guest') {
                return callback?.({ error: 'Authentication required' });
            }

            try {
                // Verify host
                const { data: room } = await supabase
                    .from('rooms')
                    .select('host_id')
                    .eq('id', roomId)
                    .single();

                if (!room || room.host_id !== user.id) {
                    return callback?.({ error: 'Only the host can mark questions as answered' });
                }

                const { error } = await getUserSupabase(socket)
                    .from('questions')
                    .update({ is_answered: true })
                    .eq('id', questionId);

                if (error) {
                    return callback?.({ error: 'Failed to mark as answered' });
                }

                io.to(code).emit('qna:question-answered', { questionId });

                callback?.({ success: true });
            } catch (err) {
                console.error(`Error in qna:mark-answered:`, err);
                callback?.({ error: 'Internal server error' });
            }
        });
    });


};

// ───────────────────────────────────
//  HELPERS
// ───────────────────────────────────

async function getParticipants(roomId) {
    const { data } = await supabase
        .from('room_participants')
        .select('user_id, joined_at, profiles!user_id(username, avatar_url)')
        .eq('room_id', roomId)
        .order('joined_at', { ascending: true });

    return (data || []).map(p => ({
        user_id: p.user_id,
        username: p.profiles?.username || 'Anonymous',
        avatar_url: p.profiles?.avatar_url || null,
        joined_at: p.joined_at,
    }));
}

async function getRoomPolls(roomId) {
    const { data } = await supabase
        .from('polls')
        .select('id, question, created_at, expires_at, is_public')
        .eq('room_id', roomId)
        .order('created_at', { ascending: false });

    return data || [];
}
