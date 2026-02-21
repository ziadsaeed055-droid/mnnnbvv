-- Create AI Chat History Table
CREATE TABLE IF NOT EXISTS ai_chat_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  response TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_ai_chat_history_user_id ON ai_chat_history(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_chat_history_created_at ON ai_chat_history(created_at);

-- Enable RLS
ALTER TABLE ai_chat_history ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own chat history" ON ai_chat_history
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own chat history" ON ai_chat_history
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own chat history" ON ai_chat_history
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own chat history" ON ai_chat_history
  FOR DELETE USING (auth.uid() = user_id);
