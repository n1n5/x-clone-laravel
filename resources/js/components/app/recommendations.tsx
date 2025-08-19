import { Link } from '@inertiajs/react';
import { Avatar, AvatarImage } from './ui/avatar';

export function Recommendations() {
    return (
        <div className="flex flex-col gap-4 rounded-2xl border-[1px] border-borderCustom p-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Avatar>
                        <AvatarImage src="/general/avatar.jpg" alt="John Doe" height={100} width={100} />
                    </Avatar>
                    <div>
                        <h1 className="text-md font-bold text-textDarkMode">John Doe</h1>
                        <span className="text-sm text-textCustom">@johnDoe</span>
                    </div>
                </div>
                <button className="cursor-pointer rounded-full bg-hoverCustom px-4 py-1 font-semibold text-textDarkMode">Follow</button>
            </div>
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Avatar>
                        <AvatarImage src="/general/avatar.jpg" alt="John Doe" height={100} width={100} />
                    </Avatar>
                    <div>
                        <h1 className="text-md font-bold text-textDarkMode">John Doe</h1>
                        <span className="text-sm text-textCustom">@johnDoe</span>
                    </div>
                </div>
                <button className="cursor-pointer rounded-full bg-hoverCustom px-4 py-1 font-semibold text-textDarkMode">Follow</button>
            </div>
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Avatar>
                        <AvatarImage src="/general/avatar.jpg" alt="John Doe" height={100} width={100} />
                    </Avatar>
                    <div>
                        <h1 className="text-md font-bold text-textDarkMode">John Doe</h1>
                        <span className="text-sm text-textCustom">@johnDoe</span>
                    </div>
                </div>
                <button className="cursor-pointer rounded-full bg-hoverCustom px-4 py-1 font-semibold text-textDarkMode">Follow</button>
            </div>
            <Link href="/" className="text-iconBlue">
                Show More
            </Link>
        </div>
    );
}
