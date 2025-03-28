import { supabase } from './supabase';

export const loginWithEmailAndPassword = async (
  email: string,
  password: string
) => {
  try {
    const {
      data: { user },
      error,
    } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { user, error: error?.message };
  } catch (error: unknown) {
    return { user: null, error };
  }
};

export const signUpWithEmailAndPassword = async (
  email: string,
  password: string
) => {
  const {
    data: { user },
    error,
  } = await supabase.auth.signUp({
    email,
    password,
  });
  if (error) {
    return { user: null, error };
  }
  return { user, error: null };
};

export const logoutUser = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) {
    return { error: error?.message };
  }
};

export const getCurrentUser = async () => {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  if (error) {
    return { user: null, error: error.message };
  }
  return { user };
};
