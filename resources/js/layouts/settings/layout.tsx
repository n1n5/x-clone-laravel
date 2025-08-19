import { LeftBar } from '@/components/app/left-bar';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { type PropsWithChildren } from 'react';

const sidebarNavItems: NavItem[] = [
    {
        title: 'Profile',
        href: '/settings/profile',
        icon: null,
    },
    {
        title: 'Password',
        href: '/settings/password',
        icon: null,
    },
];

export default function SettingsLayout({ children }: PropsWithChildren) {
    // When server-side rendering, we only render the layout on the client...
    if (typeof window === 'undefined') {
        return null;
    }

    const currentPath = window.location.pathname;

    return (
        <div>
            <div className="mx-auto flex max-w-screen-md justify-between lg:max-w-screen-lg xl:max-w-screen-xl 2xl:max-w-screen-2xl">
                <div className="px-2 xs:px-4 2xl:px-8">
                    <LeftBar />
                </div>
                <div className="flex-1 border-x-[1px] border-borderCustom lg:min-w-[600px]">
                    <div className="flex justify-around px-4 pt-4 font-bold text-textCustom">{children}</div>
                </div>
                <aside className="w-full max-w-xl md:ml-8 lg:w-48">
                    <div className="flex-1 py-2">
                        <h2 className="font-bold text-textCustomDark">Settings</h2>
                        <span className="text-sm text-textCustom">Manage your profile and account settings</span>
                    </div>
                    <nav className="flex flex-wrap gap-x-4 text-sm text-textCustomDark">
                        {sidebarNavItems.map((item, index) => (
                            <Button
                                key={`${item.href}-${index}`}
                                size="sm"
                                variant="ghost"
                                asChild
                                className={cn('w-full justify-start', {
                                    'bg-muted': currentPath === item.href,
                                })}
                            >
                                <Link href={item.href} prefetch>
                                    {item.title}
                                </Link>
                            </Button>
                        ))}
                    </nav>
                </aside>
            </div>
        </div>
    );
}
