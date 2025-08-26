'use client';

import { useEffect, useRef, useState } from 'react';

const menuList = [
    {
        id: 1,
        name: 'Unfollow user',
        icon: 'unfollow.svg',
    },
    {
        id: 2,
        name: 'Hide posts from user',
        icon: 'hide.svg',
    },
    {
        id: 3,
        name: 'Block user',
        icon: 'block.svg',
    },
    {
        id: 4,
        name: 'Download post',
        icon: 'download.svg',
    },
    {
        id: 5,
        name: 'Report post',
        icon: 'report.svg',
    },
];

const userMenuList = [
    {
        id: 1,
        name: 'Edit post',
        icon: 'edit.svg',
    },
    {
        id: 2,
        name: 'Delete post',
        icon: 'delete.svg',
    },
];

type UserProps = {
    is_own_profile: boolean;
};

export function PostInfo({ is_own_profile }: UserProps) {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef(null);

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
            <button onClick={() => setIsOpen((prev) => !prev)} className="cursor-pointer text-textDarkMode">
                ...
            </button>
            {isOpen && (
                <div className="absolute right-0 z-10 mt-2 w-72 origin-top-right rounded-xl border-[1px] border-borderCustom bg-postInfo">
                    <div className="py-2">
                        {is_own_profile
                            ? userMenuList.map((item) => (
                                  <button
                                      key={item.id}
                                      onClick={() => setIsOpen(false)}
                                      className="flex w-full cursor-pointer items-center rounded-md p-1 px-4 py-3 text-textDarkMode hover:bg-hoverCustom"
                                  >
                                      <div className="mr-3">
                                          <img src={`/icons/${item.icon}`} alt={item.name} width={24} height={24} />
                                      </div>
                                      {item.name}
                                  </button>
                              ))
                            : menuList.map((item) => (
                                  <button
                                      key={item.id}
                                      onClick={() => setIsOpen(false)}
                                      className="flex w-full cursor-pointer items-center rounded-md p-1 px-4 py-3 text-textDarkMode hover:bg-hoverCustom"
                                  >
                                      <div className="mr-3">
                                          <img src={`/icons/${item.icon}`} alt={item.name} width={24} height={24} />
                                      </div>
                                      {item.name}
                                  </button>
                              ))}
                    </div>
                </div>
            )}
        </div>
    );
}
