import { useState, useCallback, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient, QueryKey } from 'react-query';
import { postService, PostQuery } from '../services/postService';
import { useAuth } from './useAuth';
import { Post, CreatePostRequest, UpdatePostRequest, PostsResponse, PostResponse } from '../types';

// Custom hook for managing posts
export const usePostsAdvanced = (options?: {
  page?: number;
  limit?: number;
  search?: string;
  tags?: string[];
  authorId?: number;
  enabled?: boolean;
}) => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  
  const {
    page = 1,
    limit = 10,
    search,
    tags,
    authorId,
    enabled = true
  } = options || {};

  const queryKey: QueryKey = ['posts', { page, limit, search, tags, authorId }];

  const {
    data: postsData,
    isLoading,
    error,
    refetch,
    isFetching
  } = useQuery<PostsResponse, Error>(
    queryKey,
    () => postService.getPosts({ page, limit, search, tags: tags?.join(','), authorId }),
    {
      enabled,
      staleTime: 5 * 60 * 1000,
      cacheTime: 10 * 60 * 1000,
      keepPreviousData: true,
      onError: (err) => {
        console.error('Error fetching posts:', err);
      }
    }
  );

  const createPostMutation = useMutation(
    (postData: CreatePostRequest) => postService.createPost(postData),
    {
      onSuccess: (newPost) => {
        queryClient.invalidateQueries(['posts']);
        queryClient.setQueryData(['post', newPost.post.id], { post: newPost.post });
      },
      onError: (err) => {
        console.error('Error creating post:', err);
      }
    }
  );

  const updatePostMutation = useMutation(
    ({ id, data }: { id: number; data: UpdatePostRequest }) =>
      postService.updatePost(id, data),
    {
      onSuccess: (updatedPost) => {
        queryClient.setQueryData(['post', updatedPost.post.id], { post: updatedPost.post });
        queryClient.invalidateQueries(['posts']);
      },
      onError: (err) => {
        console.error('Error updating post:', err);
      }
    }
  );

  const deletePostMutation = useMutation(
    (postId: number) => postService.deletePost(postId),
    {
      onSuccess: (_, deletedPostId) => {
        queryClient.removeQueries(['post', deletedPostId]);
        queryClient.invalidateQueries(['posts']);
      },
      onError: (err) => {
        console.error('Error deleting post:', err);
      }
    }
  );

  const likePostMutation = useMutation(
    (postId: number) => postService.likePost(postId),
    {
      onMutate: async (postId) => {
        await queryClient.cancelQueries(['post', postId]);
        await queryClient.cancelQueries(queryKey);

        const previousPost = queryClient.getQueryData<PostResponse>(['post', postId]);
        const previousPosts = queryClient.getQueryData<PostsResponse>(queryKey);

        if (previousPost) {
          queryClient.setQueryData<PostResponse>(['post', postId], (old) => {
            if (!old) return old!;
            const newIsLiked = !old.post.isLiked;
            const likeCount = old.post.likeCount || 0;
            return {
              ...old,
              post: {
                ...old.post,
                isLiked: newIsLiked,
                likeCount: newIsLiked ? likeCount + 1 : likeCount - 1,
              }
            };
          });
        }

        if (previousPosts) {
          queryClient.setQueryData<PostsResponse>(queryKey, (old) => {
            if (!old) return old!;
            return {
              ...old,
              posts: old.posts.map((post: Post) => 
                post.id === postId 
                  ? {
                      ...post,
                      isLiked: !post.isLiked,
                      likeCount: post.isLiked ? (post.likeCount || 1) - 1 : (post.likeCount || 0) + 1,
                    }
                  : post
              ),
            };
          });
        }

        return { previousPost, previousPosts };
      },
      onError: (err, postId, context) => {
        if (context?.previousPost) {
          queryClient.setQueryData(['post', postId], context.previousPost);
        }
        if (context?.previousPosts) {
          queryClient.setQueryData(queryKey, context.previousPosts);
        }
      },
      onSettled: (data, error, postId) => {
        queryClient.invalidateQueries(['post', postId]);
        queryClient.invalidateQueries(['posts']);
      },
    }
  );

  const createPost = useCallback((postData: CreatePostRequest) => {
    return createPostMutation.mutateAsync(postData);
  }, [createPostMutation]);

  const updatePost = useCallback((id: number, data: UpdatePostRequest) => {
    return updatePostMutation.mutateAsync({ id, data });
  }, [updatePostMutation]);

  const deletePost = useCallback((postId: number) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      return deletePostMutation.mutateAsync(postId);
    }
    return Promise.reject();
  }, [deletePostMutation]);

  const likePost = useCallback((postId: number) => {
    if (!user) {
      throw new Error('Must be logged in to like posts');
    }
    return likePostMutation.mutateAsync(postId);
  }, [likePostMutation, user]);

  const canEditPost = useCallback((post: Post) => {
    return user && (user.id === post.authorId || user.role === 'admin');
  }, [user]);

  const canDeletePost = useCallback((post: Post) => {
    return user && (user.id === post.authorId || user.role === 'admin');
  }, [user]);

  return {
    posts: postsData?.posts || [],
    pagination: postsData?.pagination,
    isLoading,
    isFetching,
    isCreating: createPostMutation.isLoading,
    isUpdating: updatePostMutation.isLoading,
    isDeleting: deletePostMutation.isLoading,
    isLiking: likePostMutation.isLoading,
    error: error as Error | null,
    createError: createPostMutation.error as Error | null,
    updateError: updatePostMutation.error as Error | null,
    deleteError: deletePostMutation.error as Error | null,
    likeError: likePostMutation.error as Error | null,
    createPost,
    updatePost,
    deletePost,
    likePost,
    refetch,
    canEditPost,
    canDeletePost,
    resetCreateError: createPostMutation.reset,
    resetUpdateError: updatePostMutation.reset,
    resetDeleteError: deletePostMutation.reset,
    resetLikeError: likePostMutation.reset,
  };
};

export const usePost = (postId: number, enabled = true) => {
  const queryClient = useQueryClient();

  const {
    data: postData,
    isLoading,
    error,
    refetch
  } = useQuery<PostResponse, Error>(
    ['post', postId],
    () => postService.getPostById(postId),
    {
      enabled: enabled && !!postId,
      staleTime: 5 * 60 * 1000,
      cacheTime: 10 * 60 * 1000,
    }
  );

  useEffect(() => {
    if (postData?.post.tags && postData.post.tags.length > 0) {
      queryClient.prefetchQuery(
        ['posts', { tags: postData.post.tags.slice(0, 3) }],
        () => postService.getPosts({ tags: postData.post.tags?.slice(0, 3).join(','), limit: 5 }),
        {
          staleTime: 10 * 60 * 1000,
        }
      );
    }
  }, [postData, queryClient]);

  return {
    post: postData?.post || null,
    isLoading,
    error,
    refetch,
  };
};

export const useDrafts = () => {
  const { user } = useAuth();
  
  return useQuery<PostsResponse, Error>(
    ['posts', 'drafts', user?.id],
    () => postService.getPosts({ 
      authorId: user?.id,
      limit: 50 
    }),
    {
      enabled: !!user,
      staleTime: 2 * 60 * 1000,
    }
  );
};

export const usePostView = (postId: number) => {
  const [hasViewed, setHasViewed] = useState(false);

  const trackView = useCallback(() => {
    if (!hasViewed && postId) {
      setHasViewed(true);
    }
  }, [postId, hasViewed]);

  return {
    trackView,
    hasViewed,
  };
};

export const usePostSearch = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const { posts, isLoading, error } = usePostsAdvanced({
    search: debouncedSearchTerm,
    tags: selectedTags,
    enabled: debouncedSearchTerm.length > 0 || selectedTags.length > 0,
  });

  const addTag = useCallback((tag: string) => {
    setSelectedTags(prev => Array.from(new Set([...prev, tag])));
  }, []);

  const removeTag = useCallback((tag: string) => {
    setSelectedTags(prev => prev.filter(t => t !== tag));
  }, []);

  const clearSearch = useCallback(() => {
    setSearchTerm('');
    setDebouncedSearchTerm('');
    setSelectedTags([]);
  }, []);

  return {
    searchTerm,
    setSearchTerm,
    selectedTags,
    addTag,
    removeTag,
    clearSearch,
    posts: debouncedSearchTerm.length > 0 || selectedTags.length > 0 ? posts : [],
    isLoading,
    error,
    hasQuery: debouncedSearchTerm.length > 0 || selectedTags.length > 0,
  };
};