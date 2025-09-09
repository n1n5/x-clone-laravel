import { Post, PostComment, User } from '@/types';
import axios, { AxiosResponse } from 'axios';

type ApiResponse<T = any> = {
    data?: T;
    error?: boolean;
    message?: string;
    errors?: Record<string, string[]>;
};

const getCSRFToken = (): string => document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '';

const api = axios.create({
    baseURL: '/api',
    headers: {
        'Content-Type': 'application/json',
        'X-CSRF-TOKEN': getCSRFToken(),
    },
});

const handleApiError = <T = any>(error: any, action: string): ApiResponse<T> => {
    console.error(`Error ${action}:`, error);
    return {
        error: true,
        message: error.response?.data?.message || `Failed to ${action}`,
        errors: error.response?.data?.errors || {},
    };
};

const apiRequest = async <T>(method: 'get' | 'post' | 'put' | 'delete', url: string, data?: any, config?: any): Promise<T> => {
    const response: AxiosResponse = await api[method](url, data, config);
    return response.data;
};

// Post operations
export const createPost = async (formData: FormData): Promise<ApiResponse<Post>> => {
    try {
        const response = await apiRequest<ApiResponse<Post>>('post', '/posts', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'X-CSRF-TOKEN': getCSRFToken(),
            },
        });
        return response;
    } catch (error) {
        return handleApiError<Post>(error, 'creating post');
    }
};

export const updatePost = async (postId: number, body: string): Promise<any> => {
    try {
        return await apiRequest('put', `/posts/${postId}`, { body });
    } catch (error) {
        console.error('Error updating post:', error);
        throw error;
    }
};

export const getPosts = async (): Promise<any> => {
    try {
        return await apiRequest('get', '/posts');
    } catch (error) {
        console.error('Error fetching posts:', error);
        throw error;
    }
};

export const getUserPosts = async (userId: number): Promise<any> => {
    try {
        return await apiRequest('get', `/users/${userId}/posts`);
    } catch (error) {
        console.error('Error fetching user posts:', error);
        throw error;
    }
};

export const deletePost = async (postId: number): Promise<any> => {
    try {
        return await apiRequest('delete', `/posts/${postId}`);
    } catch (error) {
        console.error('Error deleting post:', error);
        throw error;
    }
};

export const getNonFollowedPosts = async (): Promise<Post[]> => {
    try {
        return await apiRequest('get', '/posts/non-followed');
    } catch (error) {
        console.error('Error fetching non-followed posts:', error);
        throw error;
    }
};

// Reaction operations
export const likePost = async (postId: number): Promise<any> => {
    try {
        return await apiRequest('post', `/posts/${postId}/reactions`);
    } catch (error) {
        console.error('Error liking post:', error);
        throw error;
    }
};

export const unlikePost = async (postId: number): Promise<any> => {
    try {
        return await apiRequest('delete', `/posts/${postId}/reactions`);
    } catch (error) {
        console.error('Error unliking post:', error);
        throw error;
    }
};

// User operations
export const followUser = async (userId: number): Promise<any> => {
    try {
        return await apiRequest('post', '/follow', { user_id: userId });
    } catch (error) {
        console.error('Error following user:', error);
        throw error;
    }
};

export const unfollowUser = async (userId: number): Promise<any> => {
    try {
        return await apiRequest('post', '/unfollow', { user_id: userId });
    } catch (error) {
        console.error('Error unfollowing user:', error);
        throw error;
    }
};

export const getNonFollowedUsers = async (): Promise<User[]> => {
    try {
        return await apiRequest('get', '/non-followed-users');
    } catch (error) {
        console.error('Error fetching non-followed users:', error);
        throw error;
    }
};

// Comment operations
export const getComments = async (postId: number): Promise<PostComment[]> => {
    try {
        return await apiRequest('get', `/comments/${postId}`);
    } catch (error) {
        console.error('Error fetching comments:', error);
        throw error;
    }
};

export const createComment = async (postId: number, comment: string): Promise<PostComment> => {
    try {
        return await apiRequest('post', '/comments', {
            post_id: postId,
            comment: comment,
        });
    } catch (error) {
        console.error('Error creating comment:', error);
        throw error;
    }
};
