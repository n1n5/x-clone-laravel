'use client';

export function PostInteraction() {
    return (
        <div className="my-2 flex items-center justify-between gap-4 text-textCustom lg:gap-16">
            <div className="flex flex-1 items-center justify-between">
                <button className="flex cursor-pointer items-center gap-2 hover:text-iconBlue">
                    <span className="inline-block h-[20px] w-[20px] bg-current [mask-image:url(/icons/comment.svg)] [mask-size:contain] [-webkit-mask-image:url(/icons/comment.svg)] [-webkit-mask-size:contain]" />
                    157
                </button>
                <button className="flex cursor-pointer items-center gap-2 hover:text-iconGreen">
                    <span className="inline-block h-[20px] w-[20px] bg-current [mask-image:url(/icons/repost.svg)] [mask-size:contain] [-webkit-mask-image:url(/icons/repost.svg)] [-webkit-mask-size:contain]" />
                    157
                </button>
                <button className="flex cursor-pointer items-center gap-2 hover:text-iconPink">
                    <span className="inline-block h-[20px] w-[20px] bg-current [mask-image:url(/icons/like.svg)] [mask-size:contain] [-webkit-mask-image:url(/icons/like.svg)] [-webkit-mask-size:contain]" />
                    157
                </button>
            </div>
            <div className="flex items-center gap-2">
                <button className="flex cursor-pointer hover:text-iconBlue">
                    <span className="inline-block h-[20px] w-[20px] bg-current [mask-image:url(/icons/bookmarks.svg)] [mask-size:contain] [-webkit-mask-image:url(/icons/bookmarks.svg)] [-webkit-mask-size:contain]" />
                </button>
                <button className="flex cursor-pointer hover:text-iconBlue">
                    <span className="inline-block h-[20px] w-[20px] bg-current [mask-image:url(/icons/share.svg)] [mask-size:contain] [-webkit-mask-image:url(/icons/share.svg)] [-webkit-mask-size:contain]" />
                </button>
            </div>
        </div>
    );
}
