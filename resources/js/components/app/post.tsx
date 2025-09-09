import { Post as PostType, SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { PostInfo } from './post-info';
import { PostInteraction } from './post-interaction';
import { Avatar, AvatarImage } from './ui/avatar';

interface PostProps {
    post: PostType;
}

export function Post({ post }: PostProps) {
    const { auth } = usePage<SharedData>().props;
    const isOwnProfile = auth.user?.id === post.user.id;
    const isRepost = post.is_repost;
    const displayPost = isRepost && post.original_post ? post.original_post : post;

    const getImageSrc = (path: string): string => 
        path.startsWith('http') ? path : `/${path}`;

    return (
        <div className="border-y-[1px] border-borderCustom p-4">
            {isRepost && post.original_post && (
                <RepostHeader user={post.user} />
            )}

            <div className="flex gap-4">
                <PostAvatar user={displayPost.user} getImageSrc={getImageSrc} />
                
                <div className="flex flex-1 flex-col gap-2">
                    <PostHeader 
                        post={displayPost}
                        isOwnProfile={isOwnProfile}
                    />

                    <PostContent 
                        post={displayPost}
                        getImageSrc={getImageSrc}
                    />

                    <PostInteraction
                        postId={displayPost.id}
                        initialLikeCount={displayPost.like_count}
                        initialIsLiked={displayPost.is_liked}
                        initialRepostCount={displayPost.repost_count}
                        initialIsReposted={displayPost.is_reposted}
                        commentCount={displayPost.comment_count}
                    />
                </div>
            </div>
        </div>
    );
}

function RepostHeader({ user }: { user: PostType['user'] }) {
    return (
        <div className="mb-2 flex items-center gap-2 text-sm font-bold text-textCustom">
            <img src="/icons/repost.svg" alt="Repost" width={18} height={18} />
            <span>{user.name} reposted</span>
        </div>
    );
}

function PostAvatar({ user, getImageSrc }: { 
    user: PostType['user']; 
    getImageSrc: (path: string) => string; 
}) {
    return (
        <Avatar>
            <AvatarImage
                src={user.avatar_path ? getImageSrc(user.avatar_path) : '/icons/profile.svg'}
                alt={user.username}
                height={100}
                width={100}
            />
        </Avatar>
    );
}

function PostHeader({ post, isOwnProfile }: { 
    post: PostType; 
    isOwnProfile: boolean; 
}) {
    return (
        <div className="flex items-center justify-between gap-2">
            <Link href={route('post.show', { post: post.id })} className="flex-1">
                <div className="flex flex-wrap items-center gap-2">
                    <h1 className="text-md font-bold text-textDarkMode">{post.user.name}</h1>
                    <span className="text-textCustom">@{post.user.username}</span>
                    <span className="text-textCustom">{post.created_at}</span>
                </div>
            </Link>
            <PostInfo 
                is_own_profile={isOwnProfile} 
                postId={post.id} 
                postBody={post.body || ''} 
            />
        </div>
    );
}

function PostContent({ post, getImageSrc }: { 
    post: PostType; 
    getImageSrc: (path: string) => string; 
}) {
    return (
        <Link href={route('post.show', { post: post.id })}>
            <p className="text-textDarkMode">{post.body}</p>
            {post.attachments && post.attachments.length > 0 && (
                <PostAttachments 
                    attachments={post.attachments} 
                    getImageSrc={getImageSrc} 
                />
            )}
        </Link>
    );
}

function PostAttachments({ attachments, getImageSrc }: { 
    attachments: PostType['attachments']; 
    getImageSrc: (path: string) => string; 
}) {
    return (
        <div>
            {attachments?.map((attachment) => (
                <img 
                    key={attachment.path} 
                    src={getImageSrc(attachment.path)} 
                    alt="Post attachment" 
                />
            ))}
        </div>
    );
}