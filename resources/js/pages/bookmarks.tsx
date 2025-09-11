import { LeftBar } from '@/components/app/left-bar';
import { RightBar } from '@/components/app/right-bar';
import { Head } from '@inertiajs/react';

export default function Bookmarks() {
    return (
        <div className="mx-auto flex max-w-screen-md justify-between lg:max-w-screen-lg xl:max-w-screen-xl 2xl:max-w-screen-2xl">
            <div className="px-2 xs:px-4 2xl:px-8">
                <LeftBar />
            </div>
            <div className="flex-1 border-x-[1px] border-borderCustom lg:min-w-[600px]">
                <Head title="Bookmarks" />
                <div className="p-4">
                    <h1 className="text-2xl font-bold text-textDarkMode">Bookmarks</h1>
                </div>
            </div>
            <div className="ml-4 hidden flex-1 md:ml-8 lg:flex">
                <RightBar />
            </div>
        </div>
    );
}
