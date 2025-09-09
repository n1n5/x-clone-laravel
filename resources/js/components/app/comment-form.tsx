'use client';

import { createComment } from '@/lib/api';
import { SharedData } from '@/types';
import { usePage } from '@inertiajs/react';
import { useState } from 'react';
import { Avatar, AvatarImage } from './ui/avatar';

interface CommentFormProps {
    postId: number;
    onCommentAdded: () => void;
}

export function CommentForm({ postId, onCommentAdded }: CommentFormProps) {
    const [comment, setComment] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { auth } = usePage<SharedData>().props;

    const getImageSrc = (path: string) => (path.startsWith('http') ? path : `/${path}`);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!comment.trim()) return;

        setIsSubmitting(true);

        try {
            await createComment(postId, comment);
            setComment('');
            onCommentAdded();
        } catch (error) {
            console.error('Failed to post comment:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const isDisabled = isSubmitting || !comment.trim();

    return (
        <form onSubmit={handleSubmit} className="flex items-center justify-between gap-4 p-4">
            <Avatar>
                <AvatarImage
                    src={auth.user?.avatar_path ? getImageSrc(auth.user.avatar_path) : '/icons/profile.svg'}
                    alt={auth.user?.username || 'User'}
                    height={100}
                    width={100}
                />
            </Avatar>
            <div className="flex flex-1 flex-col bg-transparent p-2 text-xl text-textDarkMode outline-none">
                <input
                    type="text"
                    name="comment"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Post your reply"
                    disabled={isSubmitting}
                />
            </div>
            <button type="submit" disabled={isDisabled} className="cursor-pointer rounded-full bg-textDarkMode px-4 py-2 font-bold text-postInfo">
                Reply
            </button>
        </form>
    );
}
