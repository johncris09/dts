
import {
    FileText, Folder,
    Search,
    BarChart3,
    Clock,
    Database,
    FileCheck,
    Archive,
    TrendingUp,
    FileSearch,
    FolderOpen
} from "lucide-react";

export const BackgroundIcons = () => {
    const icons = [
        {
            Icon: FileText,
            className: "top-20 left-20 animate-float-slow",
            size: "h-8 w-8",
            delay: "0s",
            color: "text-blue-300/40",
        },
        {
            Icon: Folder,
            className: "top-32 right-32 animate-float-medium",
            size: "h-10 w-10",
            delay: "1s",
            color: "text-indigo-300/50",
        },
        {
            Icon: Search,
            className: "top-60 left-16 animate-pulse-slow",
            size: "h-6 w-6",
            delay: "2s",
            color: "text-slate-400/60",
        },
        {
            Icon: BarChart3,
            className: "bottom-40 right-20 animate-float-slow",
            size: "h-12 w-12",
            delay: "0.5s",
            color: "text-blue-400/45",
        },
        {
            Icon: Clock,
            className: "top-40 right-16 animate-bounce-slow",
            size: "h-7 w-7",
            delay: "1.5s",
            color: "text-purple-300/40",
        },
        {
            Icon: Database,
            className: "bottom-60 left-24 animate-float-medium",
            size: "h-9 w-9",
            delay: "2.5s",
            color: "text-indigo-400/50",
        },
        {
            Icon: FileCheck,
            className: "top-80 left-40 animate-pulse-slow",
            size: "h-8 w-8",
            delay: "3s",
            color: "text-green-300/45",
        },
        {
            Icon: Archive,
            className: "bottom-32 right-40 animate-float-slow",
            size: "h-10 w-10",
            delay: "0.8s",
            color: "text-slate-300/50",
        },
        {
            Icon: TrendingUp,
            className: "top-96 right-60 animate-float-medium",
            size: "h-7 w-7",
            delay: "1.8s",
            color: "text-emerald-300/40",
        },
        {
            Icon: FileSearch,
            className: "bottom-80 left-60 animate-bounce-slow",
            size: "h-9 w-9",
            delay: "2.2s",
            color: "text-blue-300/45",
        },
        {
            Icon: FolderOpen,
            className: "top-52 left-80 animate-pulse-slow",
            size: "h-11 w-11",
            delay: "3.5s",
            color: "text-indigo-300/40",
        },
        {
            Icon: FileText,
            className: "bottom-20 right-80 animate-float-slow",
            size: "h-6 w-6",
            delay: "4s",
            color: "text-slate-400/50",
        },
    ]

    return (
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
            {icons.map((item, index) => (
                <div
                    key={index}
                    className={`absolute ${item.className} ${item.color} drop-shadow-sm`}
                    style={{ animationDelay: item.delay }}
                >
                    <div className="relative">
                        <item.Icon className={`${item.size} filter drop-shadow-lg`} />
                        <div className={`absolute inset-0 ${item.color} blur-sm -z-10`}>
                            <item.Icon className={item.size} />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}