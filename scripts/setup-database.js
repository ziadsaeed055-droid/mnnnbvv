import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing SUPABASE environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function setupDatabase() {
  try {
    console.log('Creating ai_chat_history table...')
    
    const { error } = await supabase.rpc('exec', {
      sql: `
        CREATE TABLE IF NOT EXISTS ai_chat_history (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
          session_id TEXT NOT NULL,
          role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
          content TEXT NOT NULL,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );

        CREATE INDEX IF NOT EXISTS idx_chat_history_user_session 
        ON ai_chat_history(user_id, session_id);

        ALTER TABLE ai_chat_history ENABLE ROW LEVEL SECURITY;

        DROP POLICY IF EXISTS "Users can read their own chat history" ON ai_chat_history;
        CREATE POLICY "Users can read their own chat history"
        ON ai_chat_history FOR SELECT
        USING (auth.uid() = user_id);

        DROP POLICY IF EXISTS "Users can insert their own chat messages" ON ai_chat_history;
        CREATE POLICY "Users can insert their own chat messages"
        ON ai_chat_history FOR INSERT
        WITH CHECK (auth.uid() = user_id);
      `
    })

    if (error) {
      console.error('Error creating table:', error)
      process.exit(1)
    }

    console.log('✓ Database setup complete!')
  } catch (err) {
    console.error('Setup failed:', err)
    process.exit(1)
  }
}

setupDatabase()
