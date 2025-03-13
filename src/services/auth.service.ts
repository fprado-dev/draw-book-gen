import { supabase } from './supabase';

export const loginWithEmailAndPassword = async (email: string, password: string) => {
  try {
    const { data: { user }, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { user, error: error?.message };
  } catch (error: any) {
    return { user: null, error: error.message };
  }
};

export const signUpWithEmailAndPassword = async (email: string, password: string) => {
  try {
    const { data: { user }, error } = await supabase.auth.signUp({
      email,
      password,
    });
    return { user, error: error?.message };
  } catch (error: any) {
    return { user: null, error: error.message };
  }
};

export const logoutUser = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    return { error: error?.message };
  } catch (error: any) {
    return { error: error.message };
  }
};

export const getCurrentUser = async () => {
  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    return { user, error: error?.message };
  } catch (error: any) {
    return { user: null, error: error.message };
  }
};