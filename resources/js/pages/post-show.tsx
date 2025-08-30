import { LeftBar } from '@/components/app/left-bar';
import { PostDetail } from '@/components/app/post-detail';
import { RightBar } from '@/components/app/right-bar';
import { Head } from '@inertiajs/react';

export default function PostShow({ post }: { post: any }) {
    return (
        <>
            <Head title="Post" />
            <div className="mx-auto flex max-w-screen-md justify-between lg:max-w-screen-lg xl:max-w-screen-xl 2xl:max-w-screen-2xl">
                <div className="px-2 xs:px-4 2xl:px-8">
                    <LeftBar />
                </div>
                <div className="flex-1 border-x-[1px] border-borderCustom lg:min-w-[600px]">
                    <PostDetail post={post} />
                </div>
                <div className="ml-4 hidden flex-1 md:ml-8 lg:flex">
                    <RightBar />
                </div>
            </div>
        </>
    );
}
