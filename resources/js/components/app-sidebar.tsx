import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { ArrowLeft, ArrowRight, Box, Building, CircleCheckBig, FilesIcon, GroupIcon, KeyRound, LayoutGrid, Network, ShieldAlert, UserIcon } from 'lucide-react';
import AppLogo from './app-logo';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
        icon: LayoutGrid,
        permission: ['view dashboard']
    },
    {
        title: 'Documents',
        href: '/documents',
        icon: FilesIcon,
        permission: ['view documents']
    },
    {
        title: 'Offices',
        href: '/offices',
        icon: Building,
        permission: ['view offices']
    },
    {
        title: 'Divisions',
        href: '/divisions',
        icon: Network,
        permission: ['view divisions']
    },
    {
        title: 'Received',
        href: '/received',
        icon: Box,
        permission: ['view received']
    },
    {
        title: 'Outgoing',
        href: '/outgoing',
        icon: ArrowRight,
        permission: ['view outgoing']
    },
    {
        title: 'Complete',
        href: '/complete',
        icon: CircleCheckBig,
        permission: ['view complete']
    },
    {
        title: 'Return',
        href: '/return',
        icon: ArrowLeft,
        permission: ['view return']
    },
    {
        title: 'Users',
        href: '/users',
        icon: UserIcon,
        permission: ['view users']
    },
    {
        title: 'Roles',
        href: '/roles',
        icon: ShieldAlert,
        permission: ['view roles']
    },
    {
        title: 'Permissions',
        href: '/permissions',
        icon: KeyRound,
        permission: ['view permissions']
    },
];


export function AppSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/dashboard" prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
