'use client';

import { getNonFollowedPosts, getPosts, getUserPosts } from '@/lib/api';
import { Post as ApiPost } from '@/types';
import { useEffect, useState } from 'react';
import { Post } from './post';

interface FeedProps {
    user_id?: number;
    feedType?: 'default' | 'nonFollowed';
}

export function Feed({ user_id, feedType }: FeedProps) {
    const [posts, setPosts] = useState<ApiPost[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                let data;
                if (user_id) {
                    data = await getUserPosts(user_id);
                } else if (feedType === 'nonFollowed') {
                    data = await getNonFollowedPosts();
                } else {
                    data = await getPosts();
                }
                setPosts(data);
            } catch (error) {
                console.error('Error fetching posts:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, [user_id, feedType]);

    if (loading) {
        return <div className="p-4 text-center">Loading posts...</div>;
    }

    if (posts.length === 0) {
        return <div className="p-4 text-center">No posts yet.</div>;
    }

    return (
        <div className="feed-container">
            {posts.map((post) => (
                <Post key={post.id} post={post} />
            ))}
        </div>
    );
}
