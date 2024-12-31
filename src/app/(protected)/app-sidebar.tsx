

"use client";

import { Bot, CreditCard, LayoutDashboard, Plus, Presentation, RibbonIcon } from 'lucide-react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import React, { use } from 'react';
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from '~/components/ui/sidebar';
import { cn } from '~/lib/utils';
import { Button } from '~/components/ui/button';
import UseProject from '~/hooks/use-project';



const items = [
    {
        name: 'Dashboard',
        icon: LayoutDashboard,
        href: '/dashboard',
    },
    {
        name: 'Q&A',
        icon: Bot,
        href: '/qa',
    },
    {
        name: 'Meetings',
        icon: Presentation,
        href: '/meetings',
    },
    {
        name: 'Billing',
        icon: CreditCard,
        href: '/billing',
    },
];



const AppSidebar = () => {
    const pathname = usePathname();
    const { open } = useSidebar();
    const { projects, projectId, setProjectId } = UseProject()

    return (
        <Sidebar collapsible="icon" variant="floating"  >

            <SidebarHeader>
                <div className='flex items-center gap-2 p-2 justify-center text-center bg-neutral-900 text-white'>
                    <RibbonIcon size={30} />
                    {open && (

                        <h1 className='text-2xl font-grotesk'>GithubAI</h1>
                    )}

                </div>
            </SidebarHeader>


            <SidebarContent className=''>
                <SidebarGroup>
                    <SidebarGroupLabel className='text-md font-grotesk text-gray-600'>Application</SidebarGroupLabel>
                    <SidebarGroupContent >
                        <SidebarMenu className='font-sora'>
                            {items.map((item) => (
                                <SidebarMenuItem key={item.name} >
                                    <SidebarMenuButton asChild className='rounded-md'>
                                        <Link
                                            href={item.href}
                                            className={cn(
                                                'flex items-center gap-2 p-2 rounded-md font-sora',
                                                {
                                                    '!bg-primary !text-white rounded-md': pathname === item.href,
                                                }
                                            )}
                                        >
                                            {React.createElement(item.icon, { className: 'h-5 w-5' })}
                                            <span>{item.name}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
                <SidebarGroup>
                    <SidebarGroupLabel className='text-md font-grotesk text-gray-600'>Your Projects</SidebarGroupLabel>
                    <SidebarGroupContent >
                        <SidebarMenu >
                            {projects?.map((item) => (
                                <SidebarMenuItem key={item.name} >
                                    <SidebarMenuButton asChild >
                                        <div onClick={() => setProjectId(item.id)} className='flex cursor-pointer items-center gap-2 p-2 rounded-md font-sora'>
                                            <div

                                                className={cn(
                                                    ' rounded-sm border size-6  flex items-center gap-2 p-2 r font-sora',
                                                    {
                                                        'bg-primary text-white': projectId === item.id,
                                                    }

                                                )}
                                            >
                                                {item.name[0]}

                                            </div>
                                            <div className='text-sm font-sora'>{item.name}</div>
                                        </div>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                            <div className="h-2 mt-3">
                                <SidebarMenuItem>
                                    <Link href='/create'>
                                        {open ? (<Button variant={'outline'} className='font-sora w-fit' >
                                            <Plus />
                                            Create Project
                                        </Button>) : (<div className=' border font-sora w-fit p-1 shadow' >
                                            <Plus />
                                        </div>)}

                                    </Link>
                                </SidebarMenuItem>

                            </div>
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>

            </SidebarContent>
        </Sidebar>
    );
};

export default AppSidebar;
