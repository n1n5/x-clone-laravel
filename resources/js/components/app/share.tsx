'use client';

import { createPost } from '@/lib/api';
import { router, useForm, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { Avatar, AvatarImage } from './ui/avatar';

export function Share() {
    const { data, setData } = useForm<{
        body: string;
        media: File | null;
    }>({
        body: '',
        media: null,
    });
    const [processing, setProcessing] = useState(false);
    const [errors, setErrors] = useState<Record<string, string | string[]>>({});

    type AuthUser = {
        avatar_path?: string | null;
    };

    const { auth } = usePage<{ auth: { user: AuthUser } }>().props;
    const user = auth.user;
    const avatarUrl = user?.avatar_path ? (user.avatar_path.startsWith('http') ? user.avatar_path : `/${user.avatar_path}`) : '/icons/profile.svg';

    const handleMediaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setData('media', e.target.files[0]);
        }
    };

    const previewURL = data.media ? URL.createObjectURL(data.media) : null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setProcessing(true);

        try {
            const formData = new FormData();
            formData.append('body', data.body);
            if (data.media) {
                formData.append('media', data.media);
            }

            const result = await createPost(formData);

            if (result.error) {
                setErrors({
                    ...(result.errors || {}),
                    ...(result.message ? { _message: result.message } : {}),
                });
            } else {
                router.visit(route('home'));
            }
        } catch (error) {
            console.error('Failed to create post:', error);
            setErrors({ _message: 'An unexpected error occurred. Please try again.' });
        } finally {
            setProcessing(false);
        }
    };

    return (
        <form className="flex gap-4 p-4" onSubmit={handleSubmit}>
            <Avatar>
                <AvatarImage src={avatarUrl} alt="Avatar" width={100} height={100} />
            </Avatar>
            <div className="flex flex-1 flex-col gap-4">
                <input
                    type="text"
                    name="body"
                    value={data.body}
                    onChange={(e) => setData('body', e.target.value)}
                    placeholder={data.media ? 'Add text (optional)...' : "What's happening?"}
                    className="bg-transparent text-xl text-textDarkMode outline-none placeholder:text-textCustom"
                    disabled={processing}
                />
                {previewURL && (
                    <div className="relative max-h-[600px] max-w-[600px] overflow-hidden rounded-xl">
                        <img src={previewURL} alt="Preview" width={600} height={600} className="object-contain" />
                        <button
                            type="button"
                            className="absolute top-2 right-2 cursor-pointer rounded-full bg-textDarkMode px-4 py-1 text-sm font-bold text-postInfo opacity-50"
                            onClick={() => setData('media', null)}
                        >
                            X
                        </button>
                    </div>
                )}
                {errors.media && (
                    <div className="mt-2 text-sm text-iconPink">
                        {errors.media}
                        {Array.isArray(errors.media) && errors.media.includes('mimes') && (
                            <div className="mt-1">Supported formats: images (JPEG, PNG, GIF)</div>
                        )}
                        {Array.isArray(errors.media) && errors.media.includes('max') && <div className="mt-1">Max file size: 50MB</div>}
                    </div>
                )}
                {errors._message && <div className="mt-2 text-sm text-iconPink">{errors._message}</div>}
                <div>
                    <div className="flex flex-wrap items-center justify-between gap-4">
                        <div className="flex flex-wrap gap-4">
                            <input type="file" name="media" onChange={handleMediaChange} className="hidden" id="file" />
                            <label htmlFor="file">
                                <div className="cursor-pointer">
                                    <img src="/icons/image.svg" alt="Image" width={20} height={20} />
                                </div>
                            </label>
                        </div>
                        <button
                            type="submit"
                            disabled={processing}
                            className={`cursor-pointer rounded-full bg-hoverCustom px-4 py-2 font-bold text-textDarkMode ${
                                processing ? 'cursor-not-allowed' : ''
                            }`}
                        >
                            {processing ? 'Posting...' : 'Post'}
                        </button>
                    </div>
                </div>
            </div>
        </form>
    );
}
