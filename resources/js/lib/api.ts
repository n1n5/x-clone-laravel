import { User } from '@/types';
import axios, { AxiosResponse } from 'axios';

const getCSRFToken = (): string => document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '';

const api = axios.create({
    baseURL: '/api',
    headers: {
        'Content-Type': 'application/json',
        'X-CSRF-TOKEN': getCSRFToken(),
    },
});

type ApiResponse<T = any> = {
    data?: T;
    error?: boolean;
    message?: string;
    errors?: Record<string, string[]>;
};

const handleApiError = (error: any, action: string): ApiResponse => {
    console.error(`Error ${action}:`, error);
    return {
        error: true,
        message: error.response?.data?.message || `Failed to ${action}`,
        errors: error.response?.data?.errors || {},
    };
};

export const createPost = async (formData: FormData): Promise<ApiResponse> => {
    try {
        const response: AxiosResponse = await api.post('/posts', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'X-CSRF-TOKEN': getCSRFToken(),
            },
        });
        return response.data;
    } catch (error) {
        return handleApiError(error, 'creating post');
    }
};

export const updatePost = async (postId: number, body: string): Promise<any> => {
    try {
        const response: AxiosResponse = await api.put(`/posts/${postId}`, { body });
        return response.data;
    } catch (error) {
        console.error('Error updating post:', error);
        throw error;
    }
};

export const getPosts = async (): Promise<any> => {
    try {
        const response: AxiosResponse = await api.get('/posts');
        return response.data;
    } catch (error) {
        console.error('Error fetching posts:', error);
        throw error;
    }
};

export const getUserPosts = async (userId: number): Promise<any> => {
    try {
        const response: AxiosResponse = await api.get(`/users/${userId}/posts`);
        return response.data;
    } catch (error) {
        console.error('Error fetching user posts:', error);
        throw error;
    }
};

export const deletePost = async (postId: number): Promise<any> => {
    try {
        const response: AxiosResponse = await api.delete(`/posts/${postId}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting post:', error);
        throw error;
    }
};

export const likePost = async (postId: number): Promise<any> => {
    try {
        const response: AxiosResponse = await api.post(`/posts/${postId}/reactions`);
        return response.data;
    } catch (error) {
        console.error('Error liking post:', error);
        throw error;
    }
};

export const unlikePost = async (postId: number): Promise<any> => {
    try {
        const response: AxiosResponse = await api.delete(`/posts/${postId}/reactions`);
        return response.data;
    } catch (error) {
        console.error('Error unliking post:', error);
        throw error;
    }
};

export const followUser = async (userId: number): Promise<any> => {
    try {
        const response: AxiosResponse = await api.post('/follow', { user_id: userId });
        return response.data;
    } catch (error) {
        console.error('Error following user:', error);
        throw error;
    }
};

export const getNonFollowedUsers = async (): Promise<User[]> => {
    try {
        const response: AxiosResponse = await api.get('/non-followed-users');
        return response.data;
    } catch (error) {
        console.error('Error fetching non-followed users:', error);
        throw error;
    }
};

export const unfollowUser = async (userId: number): Promise<any> => {
    try {
        const response: AxiosResponse = await api.post('/unfollow', { user_id: userId });
        return response.data;
    } catch (error) {
        console.error('Error unfollowing user:', error);
        throw error;
    }
};
