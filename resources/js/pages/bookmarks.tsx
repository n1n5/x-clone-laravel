'use client';

import { LeftBar } from '@/components/app/left-bar';
import { Post } from '@/components/app/post';
import { RightBar } from '@/components/app/right-bar';
import { getBookmarks, unbookmarkPost } from '@/lib/api';
import { Bookmark } from '@/types';
import { Head } from '@inertiajs/react';
import { useEffect, useState } from 'react';

interface BookmarksResponse {
    data: Bookmark[];
    last_page: number;
}

export default function Bookmarks() {
    const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);
    const [isRemoving, setIsRemoving] = useState<number | null>(null);

    useEffect(() => {
        const fetchBookmarks = async () => {
            try {
                setLoading(true);
                const response = await getBookmarks(currentPage);
                setBookmarks((prev) => (currentPage === 1 ? response.data : [...prev, ...response.data]));
                setLastPage(response.last_page);
            } catch (err) {
                setError('Failed to load bookmarks');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchBookmarks();
    }, [currentPage]);

    const handleRemoveBookmark = async (bookmarkId: number) => {
        if (isRemoving) return;

        try {
            setIsRemoving(bookmarkId);
            await unbookmarkPost(bookmarkId);
            setBookmarks((prev) => prev.filter((b) => b.id !== bookmarkId));
        } catch (error) {
            console.error('Failed to remove bookmark:', error);
        } finally {
            setIsRemoving(null);
        }
    };

    return (
        <div className="mx-auto flex max-w-screen-md justify-between lg:max-w-screen-lg xl:max-w-screen-xl 2xl:max-w-screen-2xl">
            <div className="px-2 xs:px-4 2xl:px-8">
                <LeftBar />
            </div>
            <div className="flex-1 border-x-[1px] border-borderCustom lg:min-w-[600px]">
                <Head title="Bookmarks" />
                {loading && currentPage === 1 && <p className="p-4 text-center">Loading bookmarks...</p>}
                {!loading && !error && (
                    <div>
                        {bookmarks.length === 0 ? (
                            <p className="p-4 text-center">No bookmarks yet</p>
                        ) : (
                            <>
                                {bookmarks.map((bookmark) => {
                                    const postWithBookmark = {
                                        ...bookmark.post,
                                        bookmark_id: bookmark.id,
                                    };
                                    return (
                                        <div key={bookmark.id}>
                                            <Post post={postWithBookmark} />
                                        </div>
                                    );
                                })}
                                {currentPage < lastPage && (
                                    <div className="mt-4 flex justify-center">
                                        <button
                                            onClick={() => setCurrentPage((prev) => prev + 1)}
                                            disabled={loading}
                                            className="rounded bg-iconBlue px-4 py-2 text-black"
                                        >
                                            {loading ? 'Loading...' : 'Load More'}
                                        </button>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                )}
            </div>
            <div className="ml-4 hidden flex-1 md:ml-8 lg:flex">
                <RightBar />
            </div>
        </div>
    );
}
