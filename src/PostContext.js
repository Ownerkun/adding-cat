import React, { createContext, useState, useContext, useEffect } from "react";
import { supabase } from "./config/supabase";
import { useAuth } from "./AuthContext";

const PostContext = createContext();

export const PostProvider = ({ children }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  // Fetch all posts with like status for current user
  const fetchPosts = async () => {
    try {
      setLoading(true);

      // First, fetch posts with user info
      const { data: postsData, error } = await supabase
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

      if (!user) {
        // If no user is logged in, set all posts as not liked
        const processedPosts = postsData.map((post) => ({
          ...post,
          isLikedByCurrentUser: false,
        }));
        setPosts(processedPosts || []);
        return;
      }

      // Then, fetch the user's likes separately
      const { data: userLikes, error: likesError } = await supabase
        .from("likes")
        .select("post_id")
        .eq("user_id", user.id);

      if (likesError) throw likesError;

      // Create a Set of post IDs that the user has liked for fast lookup
      const likedPostIds = new Set(userLikes.map((like) => like.post_id));

      // Process posts to include like status for current user
      const processedPosts = postsData.map((post) => ({
        ...post,
        isLikedByCurrentUser: likedPostIds.has(post.id),
      }));

      setPosts(processedPosts || []);
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

      await fetchPosts();
      return { data, error: null };
    } catch (error) {
      console.error("Error creating post:", error);
      return { data: null, error };
    }
  };

  // image upload
  const uploadImage = async (imageUri) => {
    try {
      if (!user) throw new Error("User not authenticated");

      const filename = `${user.id}/${Date.now()}.jpg`;
      console.log("Uploading image:", filename);

      const formData = new FormData();
      formData.append("file", {
        uri: imageUri,
        name: filename,
        type: "image/jpeg",
      });

      const { data, error } = await supabase.storage
        .from("posts")
        .upload(filename, formData, {
          contentType: "image/jpeg",
        });

      if (error) {
        console.error("Supabase upload error:", error);
        throw error;
      }

      const {
        data: { publicUrl },
      } = supabase.storage.from("posts").getPublicUrl(filename);

      console.log("Image uploaded successfully:", publicUrl);
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

      // First check if user already liked this post
      const { data: existingLike, error: checkError } = await supabase
        .from("likes")
        .select("*")
        .eq("post_id", postId)
        .eq("user_id", user.id)
        .single();

      if (existingLike) {
        // User already liked this post, do nothing
        return { error: null };
      }

      const { error } = await supabase
        .from("likes")
        .insert([{ post_id: postId, user_id: user.id }]);

      if (error) throw error;
      await supabase.rpc("increment_like_count", { post_id: postId });
      await fetchPosts();
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

      // First check if user actually liked this post
      const { data: existingLike, error: checkError } = await supabase
        .from("likes")
        .select("*")
        .eq("post_id", postId)
        .eq("user_id", user.id)
        .single();

      if (!existingLike) {
        // User didn't like this post, do nothing
        return { error: null };
      }

      const { error } = await supabase
        .from("likes")
        .delete()
        .eq("post_id", postId)
        .eq("user_id", user.id);

      if (error) throw error;
      await supabase.rpc("decrement_like_count", { post_id: postId });
      await fetchPosts();
      return { error: null };
    } catch (error) {
      console.error("Error unliking post:", error);
      return { error };
    }
  };

  // Delete a post
  const deletePost = async (postId) => {
    try {
      if (!user) throw new Error("User not authenticated");
      const { error } = await supabase
        .from("posts")
        .delete()
        .eq("id", postId)
        .eq("user_id", user.id);
      if (error) throw error;
      await fetchPosts();
      return { error: null };
    } catch (error) {
      console.error("Error deleting post:", error);
      return { error };
    }
  };

  // Update a post
  const updatePost = async (postId, caption) => {
    try {
      if (!user) throw new Error("User not authenticated");

      const { data, error } = await supabase
        .from("posts")
        .update({
          caption: caption,
          updated_at: new Date().toISOString(),
        })
        .eq("id", postId)
        .eq("user_id", user.id)
        .select()
        .single();

      if (error) throw error;

      await fetchPosts();
      return { data, error: null };
    } catch (error) {
      console.error("Error updating post:", error);
      return { data: null, error };
    }
  };

  useEffect(() => {
    if (user) {
      fetchPosts();
    } else {
      // Clear posts when user logs out
      setPosts([]);
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
    deletePost,
    updatePost,
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
