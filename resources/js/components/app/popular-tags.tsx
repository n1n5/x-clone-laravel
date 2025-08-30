import { Link } from '@inertiajs/react';

export function PopularTags() {
    return (
        <div className="flex flex-col gap-4 rounded-2xl border-[1px] border-borderCustom p-4">
            <h1 className="text-xl font-bold text-textCustomDark">{"What's"} Happening</h1>
            <div className="flex gap-4">
                <div className="h-20 w-20 overflow-hidden rounded-xl">
                    <img src="/general/event.jpg" alt="Event" width={120} height={120} className="size-full object-cover" />
                </div>
                <div className="flex-1">
                    <h2 className="font-bold text-textCustomDark">Cat</h2>
                    <span className="text-sm text-textCustom">Felis catus</span>
                </div>
            </div>
            <div>
                <div className="text-semibold flex items-center justify-between text-sm text-textCustom">
                    <span>Technology • Trending</span>
                    <div className="cursor-pointer">...</div>
                </div>
                <h2 className="font-bold text-textCustomDark">OpenAI</h2>
                <span className="text-sm text-textCustom">20K Posts</span>
            </div>
            <div>
                <div className="text-semibold flex items-center justify-between text-sm text-textCustom">
                    <span>Technology • Trending</span>
                    <div className="cursor-pointer">...</div>
                </div>
                <h2 className="font-bold text-textCustomDark">OpenAI</h2>
                <span className="text-sm text-textCustom">20K Posts</span>
            </div>
            <div>
                <div className="text-semibold flex items-center justify-between text-sm text-textCustom">
                    <span>Technology • Trending</span>
                    <div className="cursor-pointer">...</div>
                </div>
                <h2 className="font-bold text-textCustomDark">OpenAI</h2>
                <span className="text-sm text-textCustom">20K Posts</span>
            </div>
            <div>
                <div className="text-semibold flex items-center justify-between text-sm text-textCustom">
                    <span>Technology • Trending</span>
                    <div className="cursor-pointer">...</div>
                </div>
                <h2 className="font-bold text-textCustomDark">OpenAI</h2>
                <span className="text-sm text-textCustom">20K Posts</span>
            </div>
            <Link href={route('home')} className="text-iconBlue">
                Show More
            </Link>
        </div>
    );
}
