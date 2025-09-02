import { followUser, getNonFollowedUsers } from '@/lib/api';
import { User } from '@/types';
import { Link } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { Avatar, AvatarImage } from './ui/avatar';

export function Recommendations() {
    const [users, setUsers] = useState<User[]>([]);
    const [followedUsers, setFollowedUsers] = useState<number[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getNonFollowedUsers()
            .then((data) => {
                setUsers(data);
                setLoading(false);
            })
            .catch((error) => {
                console.error('Error fetching users:', error);
                setLoading(false);
            });
    }, []);

    const handleUserFollowed = (userId: number) => {
        setFollowedUsers((prev) => [...prev, userId]);
    };

    const filteredUsers = users.filter((user) => !followedUsers.includes(user.id));

    if (loading) return <div className="p-4 text-textCustom">Loading recommendations...</div>;
    if (filteredUsers.length === 0) return null;

    return (
        <div className="flex flex-col gap-4 rounded-2xl border-[1px] border-borderCustom p-4">
            {filteredUsers.map((user) => (
                <UserCard key={user.id} user={user} onFollow={handleUserFollowed} />
            ))}
            <Link href={route('home')} className="text-iconBlue">
                Show More
            </Link>
        </div>
    );
}

function UserCard({ user, onFollow }: { user: User; onFollow: (userId: number) => void }) {
    const [isFollowing, setIsFollowing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleFollow = async () => {
        setIsLoading(true);
        try {
            await followUser(user.id);
            setIsFollowing(true);
            onFollow(user.id);
        } catch (error) {
            console.error('Error following user:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
                <Avatar>
                    <AvatarImage src={user.avatar_path || '/icons/profile.svg'} alt={user.name} />
                </Avatar>
                <div>
                    <h1 className="text-md font-bold text-textDarkMode">{user.name}</h1>
                    <span className="text-sm text-textCustom">@{user.username}</span>
                </div>
            </div>
            <button
                onClick={handleFollow}
                disabled={isLoading || isFollowing}
                className={`cursor-pointer rounded-full px-4 py-1 font-semibold ${
                    isFollowing ? 'bg-textCustom text-textDarkMode' : 'bg-hoverCustom'
                }`}
            >
                {isLoading ? 'Following...' : isFollowing ? 'Following' : 'Follow'}
            </button>
        </div>
    );
}
