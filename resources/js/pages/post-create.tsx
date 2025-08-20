import { Share } from '@/components/app/share';
import { Link } from '@inertiajs/react';

export default function PostNew() {
    return (
        <div className="fixed top-0 left-0 flex h-screen w-screen items-center justify-center bg-postInfo">
            <div className="flex flex-col gap-4 rounded-xl bg-postInfo p-12">
                <div className="flex items-center justify-between">
                    <Link href="/">
                        <img src="/profile/icons/back.svg" alt="Back" width={24} height={24} />
                    </Link>
                </div>
                <div className="flex items-center">
                    <Share />
                </div>
            </div>
        </div>
    );
}
