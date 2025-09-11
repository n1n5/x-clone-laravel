'use client';

import { likePost, repostPost, unlikePost } from '@/lib/api';
import { useState } from 'react';

interface PostInteractionProps {
    postId: number;
    initialLikeCount: number;
    initialIsLiked: boolean;
    initialRepostCount: number;
    initialIsReposted: boolean;
    commentCount: number;
}

export function PostInteraction({
    postId,
    initialLikeCount,
    initialIsLiked,
    initialRepostCount,
    initialIsReposted,
    commentCount,
}: PostInteractionProps) {
    const [isLiked, setIsLiked] = useState(initialIsLiked);
    const [likeCount, setLikeCount] = useState(initialLikeCount);
    const [repostCount, setRepostCount] = useState(initialRepostCount);
    const [isReposting, setIsReposting] = useState(false);
    const [isReposted, setIsReposted] = useState(initialIsReposted);

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

    const handleRepost = async () => {
        if (isReposting) return;

        try {
            setIsReposting(true);

            const newRepostedState = !isReposted;
            setIsReposted(newRepostedState);

            const response = await repostPost(postId);

            setRepostCount(response.repost_count);
            setIsReposted(response.is_reposted);
        } catch (error) {
            console.error('Failed to repost:', error);
            setIsReposted((prev) => !prev);
        } finally {
            setIsReposting(false);
        }
    };

    return (
        <div className="my-2 flex items-center justify-between gap-4 text-textCustom lg:gap-16">
            <div className="flex flex-1 items-center justify-between">
                <button className="flex items-center gap-2 hover:text-iconBlue">
                    <span className="inline-block h-[20px] w-[20px] bg-current [mask-image:url(/icons/comment.svg)] [mask-size:contain] [-webkit-mask-image:url(/icons/comment.svg)] [-webkit-mask-size:contain]" />
                    {commentCount}
                </button>
                <button
                    className={`flex cursor-pointer items-center gap-2 ${isReposted ? 'text-iconGreen' : 'hover:text-iconGreen'}`}
                    onClick={handleRepost}
                    disabled={isReposting}
                >
                    <span className="inline-block h-[20px] w-[20px] bg-current [mask-image:url(/icons/repost.svg)] [mask-size:contain] [-webkit-mask-image:url(/icons/repost.svg)] [-webkit-mask-size:contain]" />
                    {repostCount}
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
            </div>
        </div>
    );
}
