import { Link } from '@inertiajs/react';
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
        name: 'Messages',
        link: '/',
        icon: 'messages.svg',
    },
    {
        id: 5,
        name: 'Bookmarks',
        link: '/',
        icon: 'bookmarks.svg',
    },
    {
        id: 6,
        name: 'Communities',
        link: '/',
        icon: 'communities.svg',
    },
    {
        id: 7,
        name: 'Profile',
        link: '/',
        icon: 'profile.svg',
    },
    {
        id: 8,
        name: 'More',
        link: '/',
        icon: 'more.svg',
    },
];

export function LeftBar() {
    return (
        <div className="sticky top-0 flex h-screen flex-col justify-between pt-2 pb-8">
            <div className="flex flex-col items-center gap-4 text-lg 2xl:items-start">
                <div className="flex flex-col gap-4">
                    {menuList.map((item) => (
                        <Link href={item.link} key={item.id} className="flex items-center gap-4 rounded-full p-2 hover:bg-hoverCustom">
                            <img src={`/icons/${item.icon}`} alt={item.name} width={24} height={24} />
                            <span className="hidden text-textDarkMode 2xl:inline">{item.name}</span>
                        </Link>
                    ))}
                </div>
                <button className="flex h-12 w-12 cursor-pointer items-center justify-center rounded-full bg-hoverCustom 2xl:hidden">
                    <img src="/icons/post.svg" alt="Post" height={24} width={24} />
                </button>
                <button className="hidden cursor-pointer rounded-full bg-hoverCustom px-20 py-2 font-bold text-textDarkMode 2xl:block">Post</button>
            </div>
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Avatar>
                        <AvatarImage src="/general/avatar.jpg" alt="Avatar" height={100} width={100} />
                    </Avatar>
                    <div className="hidden flex-col 2xl:flex">
                        <span className="font-bold text-textDarkMode">Nina</span>
                        <span className="text-sm text-textCustom">@n1n5</span>
                    </div>
                </div>
                <div className="hidden cursor-pointer font-bold text-textDarkMode 2xl:block">...</div>
            </div>
        </div>
    );
}
