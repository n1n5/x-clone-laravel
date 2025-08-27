import axios from 'axios';

const getCSRFToken = () => document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '';

const api = axios.create({
    baseURL: '/api',
    headers: {
        'Content-Type': 'application/json',
        'X-CSRF-TOKEN': getCSRFToken(),
    },
});

export const createPost = async (formData: FormData) => {
    try {
        const response = await api.post('/posts', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'X-CSRF-TOKEN': getCSRFToken(),
            }
        });
        return response.data;
    } catch (error: any) {
        console.error('Error creating post:', error);
        return {
            error: true,
            message: error.response?.data?.message || 'Failed to create post',
            errors: error.response?.data?.errors || {}
        };
    }
};

export const updatePost = async (postId: number, body: string) => {
    try {
        const response = await api.put(`/posts/${postId}`, { body });
        return response.data;
    } catch (error) {
        console.error('Error updating post:', error);
        throw error;
    }
};

export const getPosts = async () => {
    try {
        const response = await api.get('/posts');
        return response.data;
    } catch (error) {
        console.error('Error fetching posts:', error);
        throw error;
    }
};

export const getUserPosts = async (userId: number) => {
    try {
        const response = await api.get(`/users/${userId}/posts`);
        return response.data;
    } catch (error) {
        console.error('Error fetching user posts:', error);
        throw error;
    }
};

export const deletePost = async (postId: number) => {
    try {
        const response = await api.delete(`/posts/${postId}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting post:', error);
        throw error;
    }
};

export const likePost = async (postId: number) => {
    try {
        const response = await api.post(`/posts/${postId}/reactions`);
        return response.data;
    } catch (error) {
        console.error('Error liking post:', error);
        throw error;
    }
};

export const unlikePost = async (postId: number) => {
    try {
        const response = await api.delete(`/posts/${postId}/reactions`);
        return response.data;
    } catch (error) {
        console.error('Error unliking post:', error);
        throw error;
    }
};