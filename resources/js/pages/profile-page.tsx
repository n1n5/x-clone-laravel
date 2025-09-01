'use client';

import { Feed } from '@/components/app/feed';
import { LeftBar } from '@/components/app/left-bar';
import { ProfilePageInfo } from '@/components/app/profile-page-info';
import { RightBar } from '@/components/app/right-bar';
import { followUser, unfollowUser } from '@/lib/api';
import { Head, Link, router } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';

type User = {
    id: number;
    name: string;
    username: string;
    about: string;
    created_at: string;
    cover_path?: string | null;
    avatar_path?: string | null;
};

type ProfileProps = {
    user: User;
    is_own_profile: boolean;
    cover_path: string;
    avatar_path: string;
    is_following: boolean;
    follower_count: number;
    following_count: number;
};

export default function ProfilePage({
    user,
    is_own_profile,
    cover_path,
    avatar_path,
    is_following: initialIsFollowing,
    follower_count: initialFollowerCount,
    following_count: initialFollowingCount,
}: ProfileProps) {
    const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
    const [followerCount, setFollowerCount] = useState(initialFollowerCount);
    const [isLoading, setIsLoading] = useState(false);

    const coverInputRef = useRef<HTMLInputElement>(null);
    const avatarInputRef = useRef<HTMLInputElement>(null);

    const getImagePath = (path: string | null | undefined, defaultPath?: string): string => {
        if (!path) return defaultPath || '';
        return path.startsWith('http') ? path : `/${path}`;
    };

    const [coverImage, setCoverImage] = useState<string | null>(() => getImagePath(cover_path || user.cover_path) || null);

    const [avatarImage, setAvatarImage] = useState(() => getImagePath(avatar_path || user.avatar_path, '/icons/profile.svg'));

    const getCSRFToken = (): string => document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '';

    const handleFollow = async (): Promise<void> => {
        if (isLoading) return;
        setIsLoading(true);

        try {
            const apiCall = isFollowing ? unfollowUser : followUser;
            await apiCall(user.id);

            setIsFollowing((prev) => !prev);
            setFollowerCount((prev) => (isFollowing ? prev - 1 : prev + 1));
        } catch (error) {
            console.error('Error following/unfollowing user:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleImageUpload = (file: File, type: 'cover' | 'avatar'): void => {
        const formData = new FormData();
        const fieldName = type === 'cover' ? 'cover_image' : 'avatar_image';
        formData.append(fieldName, file);

        router.post(`/profile/${user.username}/update-${type}`, formData, {
            forceFormData: true,
            preserveScroll: true,
            onError: (errors) => {
                console.error(`Error uploading ${type} image:`, errors);
                if (type === 'cover') {
                    setCoverImage(getImagePath(user.cover_path) || null);
                } else {
                    setAvatarImage(getImagePath(user.avatar_path, '/icons/profile.svg'));
                }
            },
        });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'cover' | 'avatar'): void => {
        const file = e.target.files?.[0];
        if (file) {
            handleImageUpload(file, type);
        }
    };

    useEffect(() => {
        const newCoverPath = getImagePath(cover_path) || null;
        setCoverImage(newCoverPath);
        if (newCoverPath) {
            user.cover_path = newCoverPath;
        }
    }, [cover_path]);

    return (
        <div className="mx-auto flex max-w-screen-md justify-between lg:max-w-screen-lg xl:max-w-screen-xl 2xl:max-w-screen-2xl">
            <div className="px-2 xs:px-4 2xl:px-8">
                <LeftBar />
            </div>

            <Head title={`${user.name}'s Profile`} />

            <div className="flex-1 border-x-[1px] border-borderCustom lg:min-w-[600px]">
                <div className="sticky top-0 z-10 flex items-center gap-8 bg-postInfo p-4 opacity-85 backdrop-blur-md">
                    <Link href={route('home')}>
                        <img src="icons/back.svg" alt="Back" width={24} height={24} />
                    </Link>
                    <h1 className="text-lg font-bold text-textDarkMode">{user.name}</h1>
                </div>

                <div className="relative w-full">
                    <div className="group aspect-[3/1] w-full overflow-hidden bg-white">
                        {coverImage ? <img src={coverImage} alt="Cover" className="h-full w-full object-cover" /> : <div className="h-full w-full" />}
                        <input type="file" ref={coverInputRef} className="hidden" accept="image/*" onChange={(e) => handleFileChange(e, 'cover')} />
                        {is_own_profile && (
                            <button
                                className="absolute top-2 right-2 cursor-pointer rounded-full bg-textDarkMode px-4 py-1 text-sm font-bold text-postInfo opacity-0 group-hover:opacity-50"
                                type="button"
                                onClick={() => coverInputRef.current?.click()}
                            >
                                Edit
                            </button>
                        )}
                    </div>

                    <div className="group absolute left-4 aspect-square w-1/5 -translate-y-1/2 overflow-hidden rounded-full border-4 border-postInfo bg-postInfo">
                        <img src={avatarImage} alt="Avatar" height={100} width={100} className="size-full object-cover" />
                        <input type="file" ref={avatarInputRef} className="hidden" accept="image/*" onChange={(e) => handleFileChange(e, 'avatar')} />
                        {is_own_profile && (
                            <button
                                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 cursor-pointer rounded-full bg-textDarkMode px-4 py-1 text-sm font-bold text-postInfo opacity-0 group-hover:opacity-50"
                                type="button"
                                onClick={() => avatarInputRef.current?.click()}
                            >
                                Edit
                            </button>
                        )}
                    </div>
                </div>

                <div className="flex w-full items-center justify-end gap-2 p-2">
                    {!is_own_profile ? (
                        <button
                            onClick={handleFollow}
                            disabled={isLoading}
                            className={`cursor-pointer rounded-full px-4 py-2 font-bold max-2xl:hidden ${
                                isFollowing ? 'bg-textCustom text-textDarkMode' : 'bg-hoverCustom'
                            }`}
                        >
                            {isLoading ? 'Processing...' : isFollowing ? 'Unfollow' : 'Follow'}
                        </button>
                    ) : (
                        <div className="rounded-full bg-hoverCustom px-4 py-2 max-2xl:hidden">
                            <ProfilePageInfo />
                        </div>
                    )}
                </div>

                <div className="flex flex-col gap-2 p-4">
                    <div>
                        <h1 className="text-2xl font-bold text-textCustomDark">{user.name}</h1>
                        <span className="text-sm text-textCustom">@{user.username}</span>
                    </div>

                    <p className="text-textDarkMode">{user.about}</p>

                    <div className="flex gap-4 text-[15px] text-iconBlue">
                        <div className="flex items-center gap-2">
                            <img src="/icons/calendar.svg" alt="Calendar" height={20} width={20} />
                            <span>Joined {user.created_at}</span>
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <div className="flex items-center gap-2">
                            <span className="font-bold text-textCustom">{followerCount}</span>
                            <span className="text-[15px] text-textCustom">Followers</span>
                            <span className="font-bold text-textCustom">{initialFollowingCount}</span>
                            <span className="text-[15px] text-textCustom">Following</span>
                        </div>
                    </div>
                </div>

                <div>
                    <Feed user_id={user.id} />
                </div>
            </div>

            <div className="ml-4 hidden flex-1 md:ml-8 lg:flex">
                <RightBar />
            </div>
        </div>
    );
}
