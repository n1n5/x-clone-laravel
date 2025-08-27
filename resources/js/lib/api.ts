import axios from 'axios';

const api = axios.create({
    baseURL: '/api',
    headers: {
        'Content-Type': 'application/json',
        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
    },
});

export const createPost = async (formData: FormData) => {
    try {
        const response = await api.post('/posts', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || ''
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