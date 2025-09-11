'use client';

import { Description, Dialog, DialogTitle } from '@headlessui/react';
import { useEffect, useRef, useState } from 'react';
import { deletePost, updatePost } from '../../lib/api';

const userMenuList = [
    {
        id: 1,
        name: 'Edit post',
        icon: 'edit.svg',
    },
    {
        id: 2,
        name: 'Delete post',
        icon: 'delete.svg',
    },
];

type PostInfoProps = {
    is_own_profile: boolean;
    postId: number;
    postBody?: string;
};

export function PostInfo({ is_own_profile, postId, postBody }: PostInfoProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [editBody, setEditBody] = useState(postBody ?? '');
    const [isSaving, setIsSaving] = useState(false);
    const [editError, setEditError] = useState<string | null>(null);
    const menuRef = useRef(null);

    useEffect(() => {
        if (isEditOpen) {
            setEditBody(postBody ?? '');
            setEditError(null);
        }
    }, [isEditOpen, postBody]);

    const handleEdit = () => {
        setIsEditOpen(true);
        setIsOpen(false);
    };

    const handleDelete = async () => {
        setIsDeleting(true);
        try {
            await deletePost(postId);
            setIsDeleteOpen(false);
            window.location.reload();
        } catch (error) {
            console.error('Failed to delete post:', error);
        } finally {
            setIsDeleting(false);
        }
    };

    const handleEditSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        setEditError(null);

        try {
            await updatePost(postId, editBody);
            setIsEditOpen(false);
            setTimeout(() => window.location.reload(), 100);
        } catch (error) {
            setEditError('Failed to update post. Please try again.');
            console.error('Edit post error:', error);
        } finally {
            setIsSaving(false);
        }
    };
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !(menuRef.current as HTMLElement).contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    return (
        <>
            {is_own_profile && (
                <div className="relative inline-block text-left" ref={menuRef}>
                    <button onClick={() => setIsOpen((prev) => !prev)} className="cursor-pointer text-textDarkMode">
                        ...
                    </button>
                    {isOpen && (
                        <div className="absolute right-0 z-10 mt-2 w-72 origin-top-right rounded-xl border-[1px] border-borderCustom bg-postInfo">
                            <div className="py-2">
                                {userMenuList.map((item) => (
                                    <button
                                        key={item.id}
                                        onClick={item.name === 'Edit post' ? handleEdit : () => setIsDeleteOpen(true)}
                                        className="flex w-full cursor-pointer items-center rounded-md p-1 px-4 py-3 text-textDarkMode hover:bg-hoverCustom"
                                    >
                                        <div className="mr-3">
                                            <img src={`/icons/${item.icon}`} alt={item.name} width={24} height={24} />
                                        </div>
                                        {item.name}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}

            <Dialog open={isEditOpen} onClose={() => setIsEditOpen(false)} className="fixed inset-0 z-50 flex items-center justify-center">
                <div className="fixed inset-0 bg-black/50" />
                <div className="relative z-10 w-full max-w-md rounded-xl bg-postInfo p-6 text-textDarkMode">
                    <DialogTitle className="mb-4 text-lg font-bold">Edit post</DialogTitle>
                    <form onSubmit={handleEditSubmit} className="flex flex-col gap-4">
                        <div className="flex-1">
                            <input
                                type="text"
                                name="body"
                                value={editBody}
                                onChange={(e) => setEditBody(e.target.value)}
                                className="w-full bg-transparent text-xl text-textDarkMode outline-none placeholder:text-textCustom"
                                placeholder="What's happening?"
                                maxLength={280}
                            />
                            {editError && <p className="mt-1 text-sm text-iconPink">{editError}</p>}
                        </div>

                        <div className="mt-4 flex items-center justify-between">
                            <span className="text-sm text-textCustom">{editBody.length}/280 characters</span>
                            <div className="flex gap-2">
                                <button
                                    type="button"
                                    onClick={() => setIsEditOpen(false)}
                                    className="cursor-pointer rounded-md bg-hoverCustom px-4 py-2"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSaving || editBody.length === 0}
                                    className={`cursor-pointer rounded-md bg-iconBlue px-4 py-2 ${
                                        isSaving || editBody.length === 0 ? 'cursor-not-allowed' : ''
                                    }`}
                                >
                                    {isSaving ? 'Saving...' : 'Save'}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </Dialog>

            <Dialog open={isDeleteOpen} onClose={() => setIsDeleteOpen(false)} className="fixed inset-0 z-50 flex items-center justify-center">
                <div className="fixed inset-0 bg-black/50" />
                <div className="relative z-10 rounded-xl bg-postInfo p-6 text-textDarkMode">
                    <DialogTitle className="text-lg font-bold">Delete Post</DialogTitle>
                    <Description className="mt-2">Are you sure you want to delete this post? This action cannot be undone.</Description>

                    <div className="mt-6 flex justify-end space-x-3">
                        <button onClick={() => setIsDeleteOpen(false)} className="cursor-pointer rounded-md bg-hoverCustom px-4 py-2">
                            Cancel
                        </button>
                        <button
                            onClick={handleDelete}
                            disabled={isDeleting}
                            className={`cursor-pointer rounded-md bg-iconPink px-4 py-2 ${isDeleting ? 'cursor-not-allowed' : ''}`}
                        >
                            {isDeleting ? 'Deleting...' : 'Delete'}
                        </button>
                    </div>
                </div>
            </Dialog>
        </>
    );
}
