'use client';

import { bookmarkPost, likePost, repostPost, unbookmarkPost, unlikePost } from '@/lib/api';
import { useState } from 'react';

interface PostInteractionProps {
    postId: number;
    initialLikeCount: number;
    initialIsLiked: boolean;
    initialRepostCount: number;
    initialIsReposted: boolean;
    commentCount: number;
    initialBookmarkCount: number;
    initialIsBookmarked: boolean;
    initialBookmarkId?: number | null;
}

export function PostInteraction({
    postId,
    initialLikeCount,
    initialIsLiked,
    initialRepostCount,
    initialIsReposted,
    commentCount,
    initialBookmarkCount,
    initialIsBookmarked,
    initialBookmarkId,
}: PostInteractionProps) {
    const [isBookmarked, setIsBookmarked] = useState(initialIsBookmarked ?? false);
    const [bookmarkCount, setBookmarkCount] = useState(initialBookmarkCount ?? 0);
    const [isBookmarking, setIsBookmarking] = useState(false);
    const [bookmarkId, setBookmarkId] = useState<number | null>(initialIsBookmarked && initialBookmarkId ? initialBookmarkId : null);
    const [isLiked, setIsLiked] = useState(initialIsLiked ?? false);
    const [likeCount, setLikeCount] = useState(initialLikeCount ?? 0);
    const [repostCount, setRepostCount] = useState(initialRepostCount ?? 0);
    const [isReposting, setIsReposting] = useState(false);
    const [isReposted, setIsReposted] = useState(initialIsReposted ?? false);

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

            const response = await repostPost(postId);

            setRepostCount(response.repost_count);
            setIsReposted(response.is_reposted);
        } catch (error) {
            console.error('Failed to repost:', error);
        } finally {
            setIsReposting(false);
        }
    };

    const handleBookmark = async () => {
        if (isBookmarking) return;

        try {
            setIsBookmarking(true);

            if (isBookmarked && bookmarkId) {
                const response = await unbookmarkPost(bookmarkId);
                setIsBookmarked(false);
                setBookmarkCount(response.bookmark_count);
                setBookmarkId(null);
            } else if (isBookmarked && !bookmarkId && initialBookmarkId) {
                const response = await unbookmarkPost(initialBookmarkId);
                setIsBookmarked(false);
                setBookmarkCount(response.bookmark_count);
                setBookmarkId(null);
            } else {
                const response = await bookmarkPost(postId);
                setIsBookmarked(true);
                setBookmarkCount(response.bookmark_count);
                setBookmarkId(response.bookmark_id || null);
            }
        } catch (error) {
            console.error('Failed to toggle bookmark:', error);
            setIsBookmarked(!isBookmarked);
            setBookmarkCount(bookmarkCount);
        } finally {
            setIsBookmarking(false);
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
                <button
                    className={`flex cursor-pointer items-center gap-2 ${isBookmarked ? 'text-iconBlue' : 'hover:text-iconBlue'}`}
                    onClick={handleBookmark}
                    disabled={isBookmarking}
                >
                    <span className="inline-block h-[20px] w-[20px] bg-current [mask-image:url(/icons/bookmarks.svg)] [mask-size:contain] [-webkit-mask-image:url(/icons/bookmarks.svg)] [-webkit-mask-size:contain]" />
                    {bookmarkCount}
                </button>
            </div>
        </div>
    );
}
