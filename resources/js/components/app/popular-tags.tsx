'use client';

import { getNonFollowedPosts, getPosts } from '@/lib/api';
import type { Post } from '@/types';
import { Link } from '@inertiajs/react';
import { useEffect, useState } from 'react';

export function PopularTags() {
    const [topPosts, setTopPosts] = useState<Post[]>([]);

    useEffect(() => {
        Promise.all([getPosts(), getNonFollowedPosts()]).then(([userPosts, nonFollowedPosts]) => {
            const allPosts = [...userPosts, ...nonFollowedPosts];
            const uniquePosts = allPosts.filter((post, index, self) => index === self.findIndex((p) => p.id === post.id));

            const postsWithInteractions = uniquePosts.map((post) => ({
                ...post,
                totalInteractions: (post.like_count || 0) + (post.comment_count || 0) + (post.repost_count || 0) + (post.bookmark_count || 0),
            }));

            const sortedPosts = [...postsWithInteractions].sort((a, b) => b.totalInteractions - a.totalInteractions).slice(0, 5);

            setTopPosts(sortedPosts);
        });
    }, []);

    return (
        <div className="flex flex-col gap-4 rounded-2xl border-[1px] border-borderCustom p-4">
            <h1 className="text-xl font-bold text-textCustomDark">{"What's"} Happening</h1>

            {topPosts.map((post) => (
                <Link
                    key={post.id}
                    href={`/post/${post.id}`}
                    className="flex w-full items-center rounded-md p-1 px-4 py-3 text-textDarkMode hover:bg-hoverCustom"
                >
                    <div className="flex gap-4">
                        {post.attachments && post.attachments.length > 0 && (
                            <div className="h-20 w-20 overflow-hidden rounded-xl">
                                <img src={`/${post.attachments[0].path}`} alt="Event" width={120} height={120} className="size-full object-cover" />
                            </div>
                        )}
                        <div className="flex-1">
                            <h2 className="font-bold text-textCustomDark">{post.user?.name || 'Unknown User'}</h2>
                            <span className="text-sm text-textCustom">{post.body || ''}</span>
                        </div>
                    </div>
                </Link>
            ))}
        </div>
    );
}
