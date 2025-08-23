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

export function Feed() {
    const [posts, setPosts] = useState<PostData[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await fetch('/api/posts');
                const data = await response.json();
                setPosts(data);
            } catch (error) {
                console.error('Error fetching posts:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, []);

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
