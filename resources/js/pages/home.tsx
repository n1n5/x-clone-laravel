import { Feed } from '@/components/app/feed';
import { LeftBar } from '@/components/app/left-bar';
import { RightBar } from '@/components/app/right-bar';
import { Head, Link } from '@inertiajs/react';

export default function Welcome() {
    return (
        <>
            <Head title="Welcome">
                <Link rel="preconnect" href="https://fonts.bunny.net" />
                <Link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
            </Head>
            <div className="mx-auto flex max-w-screen-md justify-between lg:max-w-screen-lg xl:max-w-screen-xl 2xl:max-w-screen-2xl">
                <div className="px-2 xs:px-4 2xl:px-8">
                    <LeftBar />
                </div>
                <div className="flex-1 border-x-[1px] border-borderCustom lg:min-w-[600px]">
                    <Feed />
                </div>
                <div className="ml-4 hidden flex-1 md:ml-8 lg:flex">
                    <RightBar />
                </div>
            </div>
        </>
    );
}
