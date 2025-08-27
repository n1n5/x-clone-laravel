import { Post as PostType, SharedData } from '@/types';
import { usePage } from '@inertiajs/react';
import { PostInfo } from './post-info';
import { PostInteraction } from './post-interaction';
import { Avatar, AvatarImage } from './ui/avatar';

export function Post({ post }: { post: PostType }) {
    const { auth } = usePage<SharedData>().props;
    const is_own_profile = auth.user?.id === post.user.id;

    return (
        <div className="border-y-[1px] border-borderCustom p-4">
            {/* 
            <div className="mb-2 flex items-center gap-2 text-sm font-bold text-textCustom">
                <img src="/icons/repost.svg" alt="Repost" height={18} width={18} />
                <span>{post.user.name} reposted</span>
            </div>
            */}
            <div className="flex gap-4">
                <Avatar>
                    <AvatarImage
                        src={
                            post.user.avatar_path
                                ? post.user.avatar_path.startsWith('http')
                                    ? post.user.avatar_path
                                    : `/${post.user.avatar_path}`
                                : '/icons/profile.svg'
                        }
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
                                <img
                                    key={attachment.path}
                                    src={attachment.path.startsWith('http') ? attachment.path : `/${attachment.path}`}
                                    alt="Post attachment"
                                />
                            ))}
                        </div>
                    )}
                    <PostInteraction />
                </div>
            </div>
        </div>
    );
}
