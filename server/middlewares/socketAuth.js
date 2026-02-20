import { supabase } from '../supabaseClient.js';

/**
 * Middleware to authenticate socket connections using Supabase JWT.
 * PERMISSIVE: Allows connections without a token (anonymous guests).
 * If a token is provided, it validates and attaches user info to socket.
 */
export const authorizeUser = async (socket, next) => {
    try {
        const token = socket.handshake.auth.token;

        if (!token) {
            // Allow anonymous connections (e.g., Home, Login pages)
            socket.user = { id: null, email: null, role: 'guest' };
            console.log(`[AUTH] Anonymous socket connected: ${socket.id}`);
            return next();
        }

        // Verify token with Supabase
        const { data: { user }, error } = await supabase.auth.getUser(token);

        if (error || !user) {
            // Token is invalid but we still allow connection as guest
            console.warn(`[AUTH] Invalid token for socket ${socket.id}:`, error?.message);
            socket.user = { id: null, email: null, role: 'guest' };
            return next();
        }

        // Fetch user profile to get role
        const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single();

        if (profileError) {
            console.warn(`[AUTH] Profile fetch error for ${user.id}:`, profileError.message);
        }

        // Attach user to socket session
        socket.user = {
            id: user.id,
            email: user.email,
            role: profile?.role || 'attendee'
        };

        console.log(`Socket authenticated: ${socket.user.id} (${socket.user.role}) — socket ${socket.id}`);
        next();
    } catch (err) {
        console.error('Unexpected socket auth error:', err);
        // Even on error, allow connection as guest to avoid breaking the app
        socket.user = { id: null, email: null, role: 'guest' };
        next();
    }
};
