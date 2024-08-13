// supabase auth service.js
import { supabase } from './useSuperbaseQuery';

export const getUser = async () => {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) {
    console.error('Error fetching user:', error);
    throw error;
  }

  return user;
};

export const getSession = () => {
  return supabase.auth.session();
};

export const signUp = async (email, password) => {
  const { data, error } = await supabase.auth.signUp({ email, password });

  if (error) {
    console.error('Sign up error:', error);
    throw error;
  }

  return data;
};

export const signIn = async (email, password) => {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    console.error('Sign in error:', error);
    throw error;
  }

  return data;
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();

  if (error) {
    console.error('Sign out error:', error);
    throw error;
  }
};

export default supabase;
