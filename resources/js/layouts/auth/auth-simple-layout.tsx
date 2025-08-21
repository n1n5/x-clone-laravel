import { type PropsWithChildren } from 'react';

interface AuthLayoutProps {
    title?: string;
    description?: string;
}

export default function AuthSimpleLayout({ children, title, description }: PropsWithChildren<AuthLayoutProps>) {
    return (
        <div className="flex h-screen items-center justify-between p-8">
            <div className="hidden w-1/2 items-center justify-center lg:flex">
                <img src="/icons/logo.svg" alt="Logo" />
            </div>
            <div className="flex w-full flex-col gap-4 lg:w-1/2">
                <h1 className="text-2xl font-bold text-textDarkMode xs:text-4xl md:text-6xl">{title}</h1>
                <h1 className="text-2xl text-textDarkMode">{description}</h1>
                {children}
            </div>
        </div>
    );
}
