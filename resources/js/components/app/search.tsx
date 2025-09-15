'use client';

import { Dialog, DialogContent } from '@/components/app/ui/dialog';
import { searchUsers } from '@/lib/api';
import { User } from '@/types';
import { router, usePage } from '@inertiajs/react';
import { useState } from 'react';

export function Search() {
    const page = usePage<{ auth: { user: { id: number } } }>();
    const currentUserId = page.props.auth.user?.id;

    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchResults, setSearchResults] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const handleSearch = async () => {
        if (!searchTerm.trim()) {
            setSearchResults([]);
            return;
        }

        setIsLoading(true);
        try {
            const results = await searchUsers(searchTerm, currentUserId);
            setSearchResults(results);
            setIsModalOpen(true);
        } catch (error) {
            console.error('Search error:', error);
            setSearchResults([]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };

    const handleUserClick = (username: string) => {
        router.visit(`/profile/${username}`);
        setIsModalOpen(false);
        setSearchTerm('');
    };

    return (
        <div className="flex items-center gap-4 rounded-full bg-hoverCustom px-4 py-2">
            <img src="/icons/search.svg" alt="Search" width={16} height={16} onClick={handleSearch} className="cursor-pointer" />
            <input
                name="search"
                type="text"
                placeholder="Search users"
                className="bg-transparent text-textDarkMode outline-none placeholder:text-textCustom"
                value={searchTerm}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
            />

            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="max-h-[60vh] overflow-y-auto">
                    <div className="space-y-2">
                        {isLoading ? (
                            <div className="flex justify-center py-4">
                                <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-iconBlue"></div>
                            </div>
                        ) : searchResults.length > 0 ? (
                            searchResults.map((user) => (
                                <div
                                    key={user.id}
                                    className="flex cursor-pointer items-center gap-3 rounded p-2 hover:bg-hoverCustom"
                                    onClick={() => handleUserClick(user.username)}
                                >
                                    <img src={user.avatar_path || '/icons/profile.svg'} alt={user.name} className="h-10 w-10 rounded-full" />
                                    <div>
                                        <div className="font-bold text-textDarkMode">{user.name}</div>
                                        <div className="text-sm text-textCustom">@{user.username}</div>
                                    </div>
                                </div>
                            ))
                        ) : searchTerm ? (
                            <div className="py-4 text-center text-textCustom">No users found for "{searchTerm}"</div>
                        ) : null}
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
