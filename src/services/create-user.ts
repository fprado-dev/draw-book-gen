import { supabase } from './supabase';

async function ensureUserProfilesTable() {
  try {
    // Check if the table exists
    const { error: checkError } = await supabase
      .from('user_profiles')
      .select('count')
      .limit(1);

    if (checkError && checkError.message.includes('relation "user_profiles" does not exist')) {
      // Create the table if it doesn't exist
      const { error: createError } = await supabase
        .rpc('create_user_profiles_table', {
          sql: `
            CREATE TABLE IF NOT EXISTS user_profiles (
              id BIGSERIAL PRIMARY KEY,
              user_id UUID NOT NULL,
              first_name TEXT NOT NULL,
              last_name TEXT NOT NULL,
              birthdate DATE NOT NULL,
              email TEXT NOT NULL,
              created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
              updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
              UNIQUE(user_id)
            );
          `
        });

      if (createError) {
        console.error('Error creating user_profiles table:', createError);
        return { error: createError.message };
      }
    } else if (checkError) {
      console.error('Error checking user_profiles table:', checkError);
      return { error: checkError.message };
    }

    return { error: null };
  } catch (err) {
    console.error('Error ensuring user_profiles table:', err);
    return { error: 'Failed to ensure user_profiles table exists' };
  }
}

type UserProfile = {
  firstName: string;
  lastName: string;
  birthdate: string;
  email: string;
};

export async function createUserProfile(userId: string, profile: UserProfile) {
  try {
    // Ensure the user_profiles table exists
    const { error: tableError } = await ensureUserProfilesTable();
    if (tableError) {
      return { error: tableError };
    }

    const { error } = await supabase
      .from('user_profiles')
      .insert([
        {
          user_id: userId,
          first_name: profile.firstName,
          last_name: profile.lastName,
          birthdate: profile.birthdate,
          email: profile.email,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ]);

    if (error) {
      console.error('Error creating user profile:', error);
      return { error: error.message };
    }

    return { error: null };
  } catch (err) {
    console.error('Error creating user profile:', err);
    return { error: 'Failed to create user profile' };
  }
}