-- ================================================
-- PollMap: Add room_id to questions table
-- Run this in your Supabase SQL Editor
-- ================================================

-- Allow questions to be linked directly to rooms (not just polls)
ALTER TABLE questions ADD COLUMN IF NOT EXISTS room_id UUID REFERENCES rooms(id) ON DELETE CASCADE;

-- Make poll_id nullable (questions can belong to a room without a poll)
ALTER TABLE questions ALTER COLUMN poll_id DROP NOT NULL;

-- Index for fast room-based queries
CREATE INDEX IF NOT EXISTS idx_questions_room_id ON questions(room_id);

-- RLS: allow authenticated users to insert questions
CREATE POLICY "Users can ask questions" ON questions FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS: allow question authors and room hosts to update
CREATE POLICY "Users can update own questions" ON questions FOR UPDATE USING (auth.uid() = user_id);
