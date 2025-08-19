import { PostInfo } from './post-info';
import { PostInteraction } from './post-interaction';
import { Avatar, AvatarImage } from './ui/avatar';

export function Post() {
    return (
        <div className="border-y-[1px] border-borderCustom p-4">
            <div className="mb-2 flex items-center gap-2 text-sm font-bold text-textCustom">
                <img src="/icons/repost.svg" alt="Repost" height={18} width={18} />
                <span>Nina reposted</span>
            </div>
            <div className="flex gap-4">
                <Avatar>
                    <AvatarImage src="/general/avatar.jpg" alt="Avatar" height={100} width={100} />
                </Avatar>
                <div className="flex flex-1 flex-col gap-2">
                    <div className="flex items-center justify-between gap-2">
                        <div className="flex flex-wrap items-center gap-2">
                            <h1 className="text-md font-bold text-textDarkMode">Nina</h1>
                            <span className="text-textCustom">@n1n5</span>
                            <span className="text-textCustom">1 day ago</span>
                        </div>
                        <PostInfo />
                    </div>
                    <p className="text-textDarkMode">
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Aperiam eaque, nemo numquam expedita deleniti recusandae perspiciatis
                        repudiandae at velit saepe odit? Iste iusto dolores corrupti officia dicta debitis praesentium impedit.
                    </p>
                    <img src="/general/post.jpeg" alt="Post" height={600} width={600} />
                    <PostInteraction />
                </div>
            </div>
        </div>
    );
}
