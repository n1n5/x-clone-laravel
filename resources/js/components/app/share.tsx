'use client';

import { useState } from 'react';
import { Avatar, AvatarImage } from './ui/avatar';

const menuList = [
    {
        id: 1,
        name: 'Tag',
        icon: 'tag.svg',
    },
    {
        id: 2,
        name: 'Emoji',
        icon: 'emoji.svg',
    },
    {
        id: 3,
        name: 'Calendar post',
        icon: 'calendar.svg',
    },
    {
        id: 4,
        name: 'Location',
        icon: 'location.svg',
    },
];

export function Share() {
    const [media, setMedia] = useState<File | null>(null);

    const handleMediaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setMedia(e.target.files[0]);
        }
    };

    const previewURL = media ? URL.createObjectURL(media) : null;

    return (
        <form className="flex gap-4 p-4">
            <Avatar>
                <AvatarImage src="/general/avatar.jpg" alt="Avatar" width={100} height={100} />
            </Avatar>
            <div className="flex flex-1 flex-col gap-4">
                <input
                    type="text"
                    name="description"
                    placeholder="What's happening?"
                    className="bg-transparent text-xl outline-none placeholder:text-textCustom"
                />
                {previewURL && (
                    <div className="relative overflow-hidden rounded-xl">
                        <img src={previewURL} alt="Preview" width={600} height={600} />
                    </div>
                )}
                <div>
                    <div className="flex flex-wrap items-center justify-between gap-4">
                        <div className="flex flex-wrap gap-4">
                            <input type="file" name="media" onChange={handleMediaChange} className="hidden" id="file" />
                            <label htmlFor="file">
                                <div className="cursor-pointer">
                                    <img src="/icons/image.svg" alt="Image" width={20} height={20} />
                                </div>
                            </label>
                            {menuList.map((item) => (
                                <button key={item.id} className="cursor-pointer">
                                    <img src={`/icons/${item.icon}`} alt={item.name} width={20} height={20} />
                                </button>
                            ))}
                        </div>
                        <button className="cursor-pointer rounded-full bg-hoverCustom px-4 py-2 font-bold text-textDarkMode">Post</button>
                    </div>
                </div>
            </div>
        </form>
    );
}
