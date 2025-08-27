import { SharedData, User } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { ProfileInfo } from './profile-info';
import { Avatar, AvatarImage } from './ui/avatar';

const menuList = [
    {
        id: 1,
        name: 'Home',
        link: '/',
        icon: 'home.svg',
    },
    {
        id: 2,
        name: 'Explore',
        link: '/',
        icon: 'explore.svg',
    },
    {
        id: 3,
        name: 'Notifications',
        link: '/',
        icon: 'notifications.svg',
    },
    {
        id: 4,
        name: 'Bookmarks',
        link: '/',
        icon: 'bookmarks.svg',
    },
    {
        id: 5,
        name: 'Communities',
        link: '/',
        icon: 'communities.svg',
    },
    {
        id: 6,
        name: 'Profile',
        link: '/',
        icon: 'profile.svg',
    },
    {
        id: 7,
        name: 'More',
        link: '/',
        icon: 'more.svg',
    },
];

export function LeftBar() {
    const { auth } = usePage<SharedData>().props;
    const user = auth.user as User | null;

    const menuItems = menuList.map((item) => {
        if (item.name === 'Profile' && auth.user) {
            return {
                ...item,
                link: `/profile/${auth.user.username}`,
            };
        }
        return item;
    });

    return (
        <div className="sticky top-0 flex h-screen flex-col justify-between pt-2 pb-8">
            <div className="flex flex-col items-center gap-4 text-lg 2xl:items-start">
                <div className="flex flex-col gap-4">
                    {menuItems.map((item) => (
                        <Link href={item.link} key={item.id} className="flex items-center gap-4 rounded-full p-2 hover:bg-hoverCustom">
                            <img src={`/icons/${item.icon}`} alt={item.name} width={24} height={24} />
                            <span className="hidden text-textDarkMode 2xl:inline">{item.name}</span>
                        </Link>
                    ))}
                </div>
                <Link href="/post" className="flex h-12 w-12 cursor-pointer items-center justify-center rounded-full bg-hoverCustom 2xl:hidden">
                    <img src="/icons/post.svg" alt="Post" height={24} width={24} />
                </Link>
                <Link href="/post" className="hidden cursor-pointer rounded-full bg-hoverCustom px-20 py-2 font-bold text-textDarkMode 2xl:block">
                    Post
                </Link>
            </div>
            <div className="flex items-center justify-between">
                {user && (
                    <div className="flex items-center gap-2">
                        <Avatar>
                            <AvatarImage src={user.avatar_path || '/icons/profile.svg'} alt="Avatar" height={100} width={100} />
                        </Avatar>
                        <div className="hidden flex-col 2xl:flex">
                            <span className="font-bold text-textDarkMode">{user.name}</span>
                            <span className="text-sm text-textCustom">@{user.username}</span>
                        </div>
                    </div>
                )}
                <ProfileInfo />
            </div>
        </div>
    );
}
