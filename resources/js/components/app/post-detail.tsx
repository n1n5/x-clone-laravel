'use client';

import { Post as PostType, SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { format } from 'date-fns';
import { useState } from 'react';
import { CommentForm } from './comment-form';
import { CommentList } from './comment-list';
import { PostInfo } from './post-info';
import { PostInteraction } from './post-interaction';
import { Avatar, AvatarImage } from './ui/avatar';

export function PostDetail({ post }: { post: PostType }) {
    const { auth } = usePage<SharedData>().props;
    const [commentCount, setCommentCount] = useState(post.comment_count);
    const [refreshComments, setRefreshComments] = useState(0);

    const is_own_profile = auth.user?.id === post.user.id;

    const getImageSrc = (path: string) => (path.startsWith('http') ? path : `/${path}`);

    const handleCommentAdded = () => {
        setCommentCount((prev) => prev + 1);
        setRefreshComments((prev) => prev + 1);
    };

    return (
        <div>
            <div className="sticky top-0 z-10 flex items-center gap-8 bg-postInfo p-4 backdrop-blur-md">
                <Link href={route('home')}>
                    <img src="/profile/icons/back.svg" alt="Back" width={24} height={24} />
                </Link>
            </div>
            <div className="border-y-[1px] border-borderCustom p-4">
                <div className="flex gap-4">
                    <Avatar>
                        <AvatarImage
                            src={post.user.avatar_path ? getImageSrc(post.user.avatar_path) : '/icons/profile.svg'}
                            alt={post.user.username}
                            height={100}
                            width={100}
                        />
                    </Avatar>
                    <div className="flex flex-1 flex-col gap-2">
                        <div className="flex items-center justify-between gap-2">
                            <div className="flex flex-col items-center gap-0">
                                <h1 className="text-md font-bold text-textDarkMode">{post.user.name}</h1>
                                <span className="text-sm text-textCustom">@{post.user.username}</span>
                            </div>
                            <PostInfo is_own_profile={is_own_profile} postId={post.id} postBody={post.body} />
                        </div>

                        <p className="text-lg text-textDarkMode">{post.body}</p>

                        {post.attachments && post.attachments.length > 0 && (
                            <div>
                                {post.attachments.map((attachment) => (
                                    <img key={attachment.path} src={getImageSrc(attachment.path)} alt="Post attachment" />
                                ))}
                            </div>
                        )}

                        <span className="text-textCustom">{format(new Date(post.created_at), 'h:mm a MMM d, yyyy')}</span>

                        <PostInteraction
                            postId={post.id}
                            initialLikeCount={post.like_count}
                            initialIsLiked={post.is_liked}
                            initialRepostCount={post.repost_count}
                            initialIsReposted={post.is_reposted}
                            commentCount={commentCount}
                        />
                    </div>
                </div>
            </div>
            <CommentForm postId={post.id} onCommentAdded={handleCommentAdded} />

            <CommentList postId={post.id} refreshComments={refreshComments} />
        </div>
    );
}
