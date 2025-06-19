import { Avatar, AvatarImage } from '@/components/ui/avatar';
import logo from '../../image/logo.png';
export default function AppLogo() {

    const appName = import.meta.env.VITE_APP_NAME || 'Laravel';
    return (
        <>
            <div className="bg-sidebar-primary   flex aspect-square size-8 items-center justify-center rounded-md">
                <Avatar className="h-10 w-10  ">
                    <AvatarImage src={logo} alt='Logo' />
                </Avatar>
            </div>
            <div className="ml-1 grid flex-1 text-left text-sm">
                <span className="mb-0.5 truncate leading-none font-semibold">{appName}</span>
            </div>
        </>
    );
}
