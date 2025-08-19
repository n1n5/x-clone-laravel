'use client';

import { Link, useForm } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';

const menuList = [
    {
        id: 1,
        name: 'Profile settings',
        icon: 'block.svg',
        link: '/settings/profile',
    },
    {
        id: 2,
        name: 'Logout',
        icon: 'block.svg',
    },
];

export function ProfileInfo() {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef(null);
    const { post } = useForm();

    const handleLogout = () => {
        post(route('logout'));
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !(menuRef.current as HTMLElement).contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    return (
        <div className="relative inline-block text-left" ref={menuRef}>
            <button onClick={() => setIsOpen((prev) => !prev)} className="hidden cursor-pointer font-bold text-textDarkMode 2xl:block">
                ...
            </button>
            {isOpen && (
                <div className="absolute top-full right-0 z-10 mt-2 w-72 origin-top-right translate-y-[-140%] rounded-xl border-[1px] border-borderCustom bg-postInfo">
                    <div className="py-2">
                        {menuList.map((item) => (
                            <Link
                                key={item.id}
                                href={item.link ?? '/'}
                                onClick={() => {
                                    if (item.name === 'Logout') {
                                        handleLogout();
                                    } else {
                                        setIsOpen(false);
                                    }
                                }}
                                className={'flex w-full cursor-pointer items-center rounded-md p-1 px-4 py-3 text-textDarkMode hover:bg-hoverCustom'}
                            >
                                <div className="mr-3">
                                    <img src={`/icons/${item.icon}`} alt={item.name} width={24} height={24} />
                                </div>
                                {item.name}
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
