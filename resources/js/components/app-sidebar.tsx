import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { ArrowLeft, ArrowLeftCircleIcon, ArrowRight, Box, Building, CircleCheckBig, FilePlus2, FilePlus2Icon, FilesIcon, FileType, FileType2, FolderCheck, GroupIcon, KeyRound, LayoutGrid, LucideFilePlus2, Network, ShieldAlert, UserIcon } from 'lucide-react';
import AppLogo from './app-logo';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
        icon: LayoutGrid,
        permission: ['view dashboard']
    },
    {
        title: 'Create Documents',
        href: '/documents/create',
        icon: FilePlus2,
        permission: ['view documents']
    },

    {
        title: 'Incoming',
        href: '/incoming',
        icon: ArrowLeftCircleIcon,
        permission: ['view incoming']
    },
    {
        title: 'Received',
        href: '/received',
        icon: FolderCheck,
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
        title: 'Document Types',
        href: '/document_types',
        icon: FileType,
        permission: ['view document types']
    },
    {
        title: 'Users',
        href: '/users',
        icon: UserIcon,
        permission: ['view users']
    },


    {
        title: 'Organizational Units',
        href: '/organizational_units',
        icon: Network,
        permission: ['view organizational units']
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
