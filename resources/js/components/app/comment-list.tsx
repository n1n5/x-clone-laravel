'use client';

import { getComments } from '@/lib/api';
import { PostComment } from '@/types';
import { format } from 'date-fns';
import { useEffect, useState } from 'react';
import { Avatar, AvatarImage } from './ui/avatar';

interface CommentListProps {
    postId: number;
    refreshComments?: number;
}

export function CommentList({ postId, refreshComments }: CommentListProps) {
    const [comments, setComments] = useState<PostComment[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchComments = async () => {
            try {
                const data = await getComments(postId);
                setComments(data);
            } catch (error) {
                console.error('Failed to fetch comments:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchComments();
    }, [postId, refreshComments]);

    if (loading) {
        return <div className="mt-4 text-textCustom">Loading comments...</div>;
    }

    if (comments.length === 0) {
        return <div className="mt-4 text-textCustom">No comments yet.</div>;
    }

    const getImageSrc = (path: string) => (path.startsWith('http') ? path : `/${path}`);

    return (
        <div className="border-y-[1px] border-borderCustom p-4">
            {comments.map((comment) => (
                <div key={comment.id} className="flex gap-4 p-4">
                    <Avatar>
                        <AvatarImage
                            src={comment.user.avatar_path ? getImageSrc(comment.user.avatar_path) : '/icons/profile.svg'}
                            alt={comment.user.username}
                            height={100}
                            width={100}
                        />
                    </Avatar>
                    <div>
                        <div className="flex flex-wrap items-center gap-2">
                            <h1 className="text-md font-bold text-textDarkMode">{comment.user.name}</h1>
                            <span className="text-textCustom">@{comment.user.username}</span>
                            <span className="text-textCustom">{format(new Date(comment.created_at), 'h:mm a MMM d, yyyy')}</span>
                        </div>
                        <p className="text-textDarkMode">{comment.comment}</p>
                    </div>
                </div>
            ))}
        </div>
    );
}
