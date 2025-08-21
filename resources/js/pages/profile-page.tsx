import { Feed } from '@/components/app/feed';
import { LeftBar } from '@/components/app/left-bar';
import { RightBar } from '@/components/app/right-bar';
import { Head, Link, router } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';

type ProfileProps = {
    user: {
        id: number;
        name: string;
        username: string;
        about: string;
        created_at: string;
        cover_path?: string | null;
        avatar_path?: string | null;
    };
    is_own_profile: boolean;
};

export default function ProfilePage({ user, is_own_profile, cover_path, avatar_path }: ProfileProps & { cover_path: string; avatar_path: string }) {
    const [coverImage, setCoverImage] = useState(() => {
        const path = cover_path || user.cover_path;
        return path ? (path.startsWith('http') ? path : `/${path}`) : '/general/cover.jpg';
    });

    const [avatarImage, setAvatarImage] = useState(() => {
        const path = avatar_path || user.avatar_path;
        return path ? (path.startsWith('http') ? path : `/${path}`) : '/general/avatar.png';
    });

    const coverInputRef = useRef<HTMLInputElement>(null);
    const avatarInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (cover_path) {
            const fullPath = cover_path.startsWith('http') ? cover_path : `/${cover_path}`;
            setCoverImage(fullPath);
            user.cover_path = fullPath;
        } else {
            setCoverImage('/general/cover.jpg');
        }
    }, [cover_path]);

    const handleCoverImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = () => {
            const formData = new FormData();
            formData.append('cover_image', file);

            router.post(`/profile/${user.username}/update-cover`, formData, {
                forceFormData: true,
                preserveScroll: true,
                onError: (errors) => {
                    console.error('Error uploading cover image:', errors);
                    setCoverImage(user.cover_path || '/general/cover.jpg');
                },
            });
        };
        reader.readAsDataURL(file);
    };

    const triggerCoverInput = () => {
        coverInputRef.current?.click();
    };

    const handleAvatarImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = () => {
            const formData = new FormData();
            formData.append('avatar_image', file);

            router.post(`/profile/${user.username}/update-avatar`, formData, {
                forceFormData: true,
                preserveScroll: true,
                onError: (errors) => {
                    console.error('Error uploading avatar image:', errors);
                    setAvatarImage(user.avatar_path || '/general/avatar.png');
                },
            });
        };
        reader.readAsDataURL(file);
    };

    const triggerAvatarInput = () => {
        avatarInputRef.current?.click();
    };

    return (
        <div className="mx-auto flex max-w-screen-md justify-between lg:max-w-screen-lg xl:max-w-screen-xl 2xl:max-w-screen-2xl">
            <div className="px-2 xs:px-4 2xl:px-8">
                <LeftBar />
            </div>
            <Head title={`${user.name}'s Profile`} />
            <div className="flex-1 border-x-[1px] border-borderCustom lg:min-w-[600px]">
                <div>
                    <div className="sticky top-0 z-10 flex items-center gap-8 bg-postInfo p-4 opacity-85 backdrop-blur-md">
                        <Link href="/">
                            <img src="icons/back.svg" alt="Back" width={24} height={24} />
                        </Link>
                        <h1 className="text-lg font-bold text-textDarkMode">{user.name}</h1>
                    </div>
                    <div>
                        <div className="relative w-full">
                            <div className="group aspect-[3/1] w-full overflow-hidden">
                                <img src={coverImage} alt="Cover" height={200} width="auto" />
                                <input type="file" ref={coverInputRef} className="hidden" accept="image/*" onChange={handleCoverImageChange} />
                                {is_own_profile && (
                                    <button
                                        className="absolute top-2 right-2 cursor-pointer rounded-full bg-textDarkMode px-4 py-1 text-sm font-bold text-postInfo opacity-0 group-hover:opacity-50"
                                        id="edit-cover"
                                        type="button"
                                        onClick={triggerCoverInput}
                                    >
                                        Edit
                                    </button>
                                )}
                            </div>
                            <div className="group absolute left-4 aspect-square w-1/5 -translate-y-1/2 overflow-hidden rounded-full border-4 border-postInfo bg-textCustom">
                                <img src={avatarImage} alt="Avatar" height={100} width={100} className="size-full object-cover" />
                                <input type="file" ref={avatarInputRef} className="hidden" accept="image/*" onChange={handleAvatarImageChange} />
                                {is_own_profile && (
                                    <button
                                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 cursor-pointer rounded-full bg-textDarkMode px-4 py-1 text-sm font-bold text-postInfo opacity-0 group-hover:opacity-50"
                                        type="button"
                                        onClick={triggerAvatarInput}
                                    >
                                        Edit
                                    </button>
                                )}
                            </div>
                        </div>
                        <div className="flex w-full items-center justify-end gap-2 p-2">
                            <div className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border-[1px] border-borderCustom">
                                <img src="/icons/messages.svg" alt="Messages" height={20} width={20} />
                            </div>
                            <button className="cursor-pointer rounded-full bg-hoverCustom px-4 py-2 font-bold text-textDarkMode">Follow</button>
                        </div>
                        <div className="flex flex-col gap-2 p-4">
                            <div>
                                <h1 className="text-2xl font-bold text-textCustomDark">{user.name}</h1>
                                <span className="text-sm text-textCustom">@{user.username}</span>
                            </div>
                            <p className="text-textDarkMode">{user.about}</p>
                            <div className="flex gap-4 text-[15px] text-iconBlue">
                                <div className="flex items-center gap-2">
                                    <img src="/icons/location.svg" alt="Location" height={20} width={20} />
                                    <span>Bosnia and Herzegovina</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <img src="/icons/calendar.svg" alt="Calendar" height={20} width={20} />
                                    <span>Joined {user.created_at}</span>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <div className="flex items-center gap-2">
                                    <span className="font-bold text-textCustom">100</span>
                                    <span className="text-[15px] text-textCustom">Followers</span>
                                    <span className="font-bold text-textCustom">100</span>
                                    <span className="text-[15px] text-textCustom">Following</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div>
                        <Feed />
                    </div>
                </div>
            </div>
            <div className="ml-4 hidden flex-1 md:ml-8 lg:flex">
                <RightBar />
            </div>
        </div>
    );
}
