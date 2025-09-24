import React, { createContext, useState, useContext, useEffect } from "react";
import { supabase } from "./config/supabase";
import { useAuth } from "./AuthContext";

const PostContext = createContext();

export const PostProvider = ({ children }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  // Fetch all posts
  const fetchPosts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("posts")
        .select(
          `
          *,
          users:user_id (
            username,
            avatar_url
          )
        `
        )
        .order("created_at", { ascending: false });

      if (error) throw error;
      setPosts(data || []);
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
  };

  // Create a new post
  const createPost = async (imageUrl, caption) => {
    try {
      if (!user) throw new Error("User not authenticated");

      const { data, error } = await supabase
        .from("posts")
        .insert([
          {
            user_id: user.id,
            image_url: imageUrl,
            caption: caption,
            like_count: 0,
          },
        ])
        .select()
        .single();

      if (error) throw error;

      // Refresh posts list
      await fetchPosts();
      return { data, error: null };
    } catch (error) {
      console.error("Error creating post:", error);
      return { data: null, error };
    }
  };

  // Upload image to Supabase Storage
  const uploadImage = async (imageUri) => {
    try {
      if (!user) throw new Error("User not authenticated");

      // Generate unique filename
      const filename = `${user.id}/${Date.now()}.jpg`;

      // Convert image to blob
      const response = await fetch(imageUri);
      const blob = await response.blob();

      // Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from("posts") // Make sure you have a 'posts' bucket in Supabase Storage
        .upload(filename, blob, {
          contentType: "image/jpeg",
        });

      if (error) throw error;

      // Get public URL
      const {
        data: { publicUrl },
      } = supabase.storage.from("posts").getPublicUrl(filename);

      return { url: publicUrl, error: null };
    } catch (error) {
      console.error("Error uploading image:", error);
      return { url: null, error };
    }
  };

  // Like a post
  const likePost = async (postId) => {
    try {
      if (!user) throw new Error("User not authenticated");

      const { error } = await supabase.from("likes").insert([
        {
          post_id: postId,
          user_id: user.id,
        },
      ]);

      if (error) throw error;

      // Update like count
      await supabase.rpc("increment_like_count", { post_id: postId });
      await fetchPosts(); // Refresh posts

      return { error: null };
    } catch (error) {
      console.error("Error liking post:", error);
      return { error };
    }
  };

  // Unlike a post
  const unlikePost = async (postId) => {
    try {
      if (!user) throw new Error("User not authenticated");

      const { error } = await supabase
        .from("likes")
        .delete()
        .eq("post_id", postId)
        .eq("user_id", user.id);

      if (error) throw error;

      // Update like count
      await supabase.rpc("decrement_like_count", { post_id: postId });
      await fetchPosts(); // Refresh posts

      return { error: null };
    } catch (error) {
      console.error("Error unliking post:", error);
      return { error };
    }
  };

  useEffect(() => {
    if (user) {
      fetchPosts();
    }
  }, [user]);

  const value = {
    posts,
    loading,
    createPost,
    uploadImage,
    likePost,
    unlikePost,
    fetchPosts,
  };

  return <PostContext.Provider value={value}>{children}</PostContext.Provider>;
};

export const usePost = () => {
  const context = useContext(PostContext);
  if (!context) {
    throw new Error("usePost must be used within a PostProvider");
  }
  return context;
};
