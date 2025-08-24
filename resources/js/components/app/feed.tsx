import { useEffect, useState } from 'react';
import { Post } from './post';

interface PostData {
    id: number;
    body: string;
    user: {
        name: string;
        username: string;
        avatar_path: string;
    };
    created_at: string;
}

interface FeedProps {
    user_id?: number;
}

export function Feed({ user_id }: FeedProps) {
    const [posts, setPosts] = useState<PostData[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const url = user_id ? `/api/users/${user_id}/posts` : '/api/posts';
                const response = await fetch(url);
                const data = await response.json();
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
        return <div className="p-4 text-center">No posts found</div>;
    }

    return (
        <div>
            {posts.map((post) => (
                <Post key={post.id} post={post} />
            ))}
        </div>
    );
}
