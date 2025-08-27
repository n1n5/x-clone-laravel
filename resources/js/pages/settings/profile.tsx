import { type SharedData } from '@/types';
import { Transition } from '@headlessui/react';
import { Head, useForm, usePage } from '@inertiajs/react';
import { FormEventHandler } from 'react';

import { DeleteUser } from '@/components/app/modals/delete-user';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import SettingsLayout from '@/layouts/settings/layout';

type ProfileForm = {
    name: string;
    username: string;
    email: string;
    about: string;
};

export default function Profile() {
    const { auth } = usePage<SharedData>().props;

    const { data, setData, patch, errors, processing, recentlySuccessful } = useForm<Required<ProfileForm>>({
        name: auth.user.name,
        username: auth.user.username,
        email: auth.user.email,
        about: auth.user.about || '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        patch(route('profile.update'), { preserveScroll: true });
    };

    return (
        <div>
            <Head title="Profile settings" />

            <SettingsLayout>
                <div className="space-y-6">
                    <div>
                        <h3 className="font-bold text-textCustomDark">Profile information</h3>
                        <span className="text-sm text-textCustom">Update your name, username, email address and bio.</span>
                    </div>

                    <form onSubmit={submit} className="space-y-6">
                        <div className="grid gap-2 text-textCustom">
                            <Label htmlFor="name">Name</Label>
                            <Input
                                id="name"
                                className="mt-1 block w-full"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                required
                                autoComplete="name"
                                placeholder="Full name"
                            />
                            <InputError className="mt-2" message={errors.name} />
                        </div>

                        <div className="grid gap-2 text-textCustom">
                            <Label htmlFor="username">Username</Label>
                            <Input
                                id="username"
                                className="mt-1 block w-full"
                                value={data.username}
                                onChange={(e) => setData('username', e.target.value)}
                                required
                                autoComplete="username"
                                placeholder="Username"
                            />
                            <InputError className="mt-2" message={errors.username} />
                        </div>

                        <div className="grid gap-2 text-textCustom">
                            <Label htmlFor="email">Email address</Label>
                            <Input
                                id="email"
                                type="email"
                                className="mt-1 block w-full"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                required
                                autoComplete="email"
                                placeholder="Email address"
                            />
                            <InputError className="mt-2" message={errors.email} />
                        </div>

                        <div className="grid gap-2 text-textCustom">
                            <Label htmlFor="about">Bio</Label>
                            <Input
                                id="about"
                                className="mt-1 block w-full"
                                value={data.about}
                                onChange={(e) => setData('about', e.target.value)}
                                placeholder="Bio"
                            />
                        </div>

                        <div className="flex items-center gap-4 text-textCustomDark">
                            <Button disabled={processing} className="cursor-pointer border-[1px] border-textCustom">
                                Save
                            </Button>

                            <Transition
                                show={recentlySuccessful}
                                enter="transition ease-in-out"
                                enterFrom="opacity-0"
                                leave="transition ease-in-out"
                                leaveTo="opacity-0"
                            >
                                <p className="text-sm text-textCustom">Saved</p>
                            </Transition>
                        </div>
                    </form>
                </div>
                <DeleteUser />
            </SettingsLayout>
        </div>
    );
}