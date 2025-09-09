'use client';

import { likePost, unlikePost } from '@/lib/api';
import { useState } from 'react';

interface PostInteractionProps {
    postId: number;
    initialLikeCount: number;
    initialIsLiked: boolean;
    commentCount: number;
}

export function PostInteraction({ postId, initialLikeCount, initialIsLiked, commentCount }: PostInteractionProps) {
    const [isLiked, setIsLiked] = useState(initialIsLiked);
    const [likeCount, setLikeCount] = useState(initialLikeCount);

    const handleLike = async () => {
        try {
            if (isLiked) {
                const response = await unlikePost(postId);
                setIsLiked(false);
                setLikeCount(response.like_count);
            } else {
                const response = await likePost(postId);
                setIsLiked(true);
                setLikeCount(response.like_count);
            }
        } catch (error) {
            console.error('Failed to toggle like:', error);
        }
    };

    return (
        <div className="my-2 flex items-center justify-between gap-4 text-textCustom lg:gap-16">
            <div className="flex flex-1 items-center justify-between">
                <button className="flex items-center gap-2 hover:text-iconBlue">
                    <span className="inline-block h-[20px] w-[20px] bg-current [mask-image:url(/icons/comment.svg)] [mask-size:contain] [-webkit-mask-image:url(/icons/comment.svg)] [-webkit-mask-size:contain]" />
                    {commentCount}
                </button>
                <button className="flex cursor-pointer items-center gap-2 hover:text-iconGreen">
                    <span className="inline-block h-[20px] w-[20px] bg-current [mask-image:url(/icons/repost.svg)] [mask-size:contain] [-webkit-mask-image:url(/icons/repost.svg)] [-webkit-mask-size:contain]" />
                    157
                </button>
                <button
                    className={`flex cursor-pointer items-center gap-2 ${isLiked ? 'text-iconPink' : 'hover:text-iconPink'}`}
                    onClick={handleLike}
                >
                    <span className="inline-block h-[20px] w-[20px] bg-current [mask-image:url(/icons/like.svg)] [mask-size:contain] [-webkit-mask-image:url(/icons/like.svg)] [-webkit-mask-size:contain]" />
                    {likeCount}
                </button>
            </div>
            <div className="flex items-center gap-2">
                <button className="flex cursor-pointer hover:text-iconBlue">
                    <span className="inline-block h-[20px] w-[20px] bg-current [mask-image:url(/icons/bookmarks.svg)] [mask-size:contain] [-webkit-mask-image:url(/icons/bookmarks.svg)] [-webkit-mask-size:contain]" />
                </button>
                <button className="flex cursor-pointer hover:text-iconBlue">
                    <span className="inline-block h-[20px] w-[20px] bg-current [mask-image:url(/icons/share.svg)] [mask-size:contain] [-webkit-mask-image:url(/icons/share.svg)] [-webkit-mask-size:contain]" />
                </button>
            </div>
        </div>
    );
}
