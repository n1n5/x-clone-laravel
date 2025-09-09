import { LucideIcon } from 'lucide-react';
import type { Config } from 'ziggy-js';

export interface Auth {
    user: User;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    href: string;
    icon?: LucideIcon | null;
    isActive?: boolean;
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    ziggy: Config & { location: string };
    sidebarOpen: boolean;
    [key: string]: unknown;
}

export interface User {
    id: number;
    name: string;
    username: string;
    avatar_path: string;
    email: string;
    about: string | null;
    email_verified_at: string | null;
}

export interface Post {
    id: number;
    body?: string;
    created_at: string;
    user: User;
    attachments?: PostAttachment[];
    like_count: number;
    is_liked: boolean;
    comment_count: number;
    repost_count: number;
    is_repost: boolean;
    is_reposted: boolean;
    original_post?: Post;
}

export interface PostAttachment {
    path: string;
    mime: string;
}

export interface PostComment {
    id: number;
    comment: string;
    created_at: string;
    user: User;
}
