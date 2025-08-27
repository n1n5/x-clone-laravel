'use client';

import { getPosts, getUserPosts } from '@/lib/api';
import { Post as PostType } from '@/types';
import { useEffect, useState } from 'react';
import { Post } from './post';

interface FeedProps {
    user_id?: number;
}

export function Feed({ user_id }: FeedProps) {
    const [posts, setPosts] = useState<PostType[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const data = user_id ? await getUserPosts(user_id) : await getPosts();
                setPosts(data);
            } catch (error) {
                console.error('Error fetching posts:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, [user_id]);

    if (loading) {
        return <div className="p-4 text-center">Loading posts...</div>;
    }

    if (posts.length === 0) {
        return <div className="p-4 text-center">No posts yet.</div>;
    }

    return (
        <div>
            {posts.map((post) => (
                <Post key={post.id} post={post} />
            ))}
        </div>
    );
}
