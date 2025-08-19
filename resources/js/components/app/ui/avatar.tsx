import * as AvatarPrimitive from '@radix-ui/react-avatar';
import * as React from 'react';

import { cn } from '@/lib/utils';

function Avatar({ className, ...props }: React.ComponentProps<typeof AvatarPrimitive.Root>) {
    return <AvatarPrimitive.Root data-slot="avatar" className={cn('h-10 w-10 overflow-hidden rounded-full', className)} {...props} />;
}

function AvatarImage({ className, ...props }: React.ComponentProps<typeof AvatarPrimitive.Image>) {
    return <AvatarPrimitive.Image data-slot="avatar-image" className={cn('size-full object-cover', className)} {...props} />;
}

export { Avatar, AvatarImage };
