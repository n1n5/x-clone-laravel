'use client';

import { Link } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';

export function ProfilePageInfo() {
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
            <button onClick={() => setIsOpen((prev) => !prev)} className="hidden cursor-pointer font-bold text-textDarkMode 2xl:block">
                ...
            </button>
            {isOpen && (
                <div className="absolute right-0 z-10 mt-2 w-72 origin-top-right rounded-xl border-[1px] border-borderCustom bg-postInfo translate-y-[10%]">
                    <div className="py-2">
                        <Link
                            href="/settings/profile"
                            onClick={() => {
                                setIsOpen(false);
                            }}
                            className={'flex w-full cursor-pointer items-center rounded-md p-1 px-4 py-3 text-textDarkMode hover:bg-hoverCustom'}
                        >
                            <div className="mr-3">
                                <img src="/icons/settings.svg" alt="Profile settings" width={24} height={24} />
                            </div>
                            Profile settings
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
}
