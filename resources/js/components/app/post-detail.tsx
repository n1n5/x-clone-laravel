import { Post as PostType, SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { PostInfo } from './post-info';
import { PostInteraction } from './post-interaction';
import { Avatar, AvatarImage } from './ui/avatar';

export function PostDetail({ post }: { post: PostType }) {
    const { auth } = usePage<SharedData>().props;
    const is_own_profile = auth.user?.id === post.user.id;

    const getImageSrc = (path: string) => (path.startsWith('http') ? path : `/${path}`);

    return (
        <div className="border-y-[1px] border-borderCustom p-4">
            <div className="flex items-center justify-between py-4">
                <Link href={route('home')}>
                    <img src="/profile/icons/back.svg" alt="Back" width={24} height={24} />
                </Link>
            </div>

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
                        <div className="flex flex-wrap items-center gap-2">
                            <h1 className="text-md font-bold text-textDarkMode">{post.user.name}</h1>
                            <span className="text-textCustom">@{post.user.username}</span>
                            <span className="text-textCustom">{post.created_at}</span>
                        </div>
                        <PostInfo is_own_profile={is_own_profile} postId={post.id} postBody={post.body} />
                    </div>
                    <p className="text-textDarkMode">{post.body}</p>

                    {post.attachments && post.attachments.length > 0 && (
                        <div>
                            {post.attachments.map((attachment) => (
                                <img key={attachment.path} src={getImageSrc(attachment.path)} alt="Post attachment" />
                            ))}
                        </div>
                    )}
                    <PostInteraction postId={post.id} initialLikeCount={post.like_count} initialIsLiked={post.is_liked} />
                </div>
            </div>
        </div>
    );
}
