import { Feed } from '@/components/app/feed';
import { LeftBar } from '@/components/app/left-bar';
import { RightBar } from '@/components/app/right-bar';
import { Head, Link } from '@inertiajs/react';

type ProfileProps = {
    user: {
        name: string;
        username: string;
        about: string;
        created_at: string;
    };
    is_own_profile: boolean;
};

export default function ProfilePage({ user }: ProfileProps) {
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
                            <div className="aspect-[3/1] w-full overflow-hidden">
                                <img src="/general/cover.jpg" alt="Cover" height={200} width="auto" />
                            </div>
                            <div className="absolute left-4 aspect-square w-1/5 -translate-y-1/2 overflow-hidden rounded-full border-4 border-postInfo bg-textCustom">
                                <img src="/general/avatar.jpg" alt="Avatar" height={100} width={100} className="size-full object-cover" />
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
