

"use client";

import { Bot, CreditCard, LayoutDashboard, Presentation } from 'lucide-react';
import { usePathname } from 'next/navigation';
import Link from 'next/link'; 
import React from 'react';
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
} from '~/components/ui/sidebar';
import { cn } from '~/lib/utils';

// Sidebar menu items
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

  return (
    <Sidebar collapsible="icon" variant="floating"  >

      <SidebarHeader className=' text-2xl font-extrabold text font-grotesk text-center text-white bg-neutral-900 border border-black'>Github-AI</SidebarHeader>


      <SidebarContent className=''>
        <SidebarGroup>
          <SidebarGroupLabel className='text-md font-grotesk text-gray-600'>Application</SidebarGroupLabel>
          <SidebarGroupContent className='p-3'>
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
      </SidebarContent>
    </Sidebar>
  );
};

export default AppSidebar;
