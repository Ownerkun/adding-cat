import React, { createContext, useState, useContext, useEffect } from "react";
import { supabase } from "./config/supabase";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch user profile
  const fetchOrCreateProfile = async (userId) => {
    try {
      // First, try to fetch existing profile
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", userId)
        .single();

      if (error && error.code === "PGRST116") {
        // PGRST116 = no rows returned
        // Profile doesn't exist, so create one
        console.log("Creating new profile for user:", userId);

        const { data: newProfile, error: createError } = await supabase
          .from("users")
          .insert([
            {
              id: userId,
              username: `user_${userId.slice(0, 8)}`, // Default username
              avatar_url: null,
            },
          ])
          .select()
          .single();

        if (createError) {
          console.error("Error creating profile:", createError);
          throw createError;
        }

        setProfile(newProfile);
        return newProfile;
      } else if (error) {
        // Some other error occurred
        throw error;
      }

      // Profile exists, set it
      setProfile(data);
      return data;
    } catch (error) {
      console.error("Error in fetchOrCreateProfile:", error);
      throw error;
    }
  };

  // Update user profile
  const updateProfile = async (updates) => {
    try {
      if (!user) throw new Error("No user logged in");

      const { data, error } = await supabase
        .from("users")
        .update(updates)
        .eq("id", user.id)
        .select()
        .single();

      if (error) throw error;
      setProfile(data);
      return { data, error: null };
    } catch (error) {
      console.error("Error updating profile:", error);
      return { data: null, error };
    }
  };

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchOrCreateProfile(session.user.id).catch((error) => {
          console.error("Error handling initial session:", error);
        });
      }
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setUser(session?.user ?? null);

      if (session?.user) {
        try {
          await fetchOrCreateProfile(session.user.id);
        } catch (error) {
          console.error("Error handling auth state change:", error);
          setProfile(null);
        }
      } else {
        setProfile(null);
      }

      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return { data: null, error };
      }

      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  };

  const signUp = async (email, password, username) => {
    try {
      // Only create auth user - profile will be created on first login
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username: username,
          },
        },
      });

      if (authError) {
        console.error("Auth error:", authError);
        return { data: null, error: authError };
      }

      return {
        data: {
          user: authData.user,
          message:
            "Please check your email to confirm your account before signing in.",
        },
        error: null,
      };
    } catch (error) {
      console.error("Sign up error:", error);
      return {
        data: null,
        error: {
          message: "An unexpected error occurred during sign up.",
        },
      };
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      setProfile(null);
      return { error };
    } catch (error) {
      return { error };
    }
  };

  const resetPassword = async (email) => {
    try {
      const { data, error } = await supabase.auth.resetPasswordForEmail(email);
      return { data, error };
    } catch (error) {
      return { data: null, error };
    }
  };

  const value = {
    user,
    profile,
    loading,
    signIn,
    signUp,
    signOut,
    resetPassword,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
