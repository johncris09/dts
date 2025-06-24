import { Shield } from "lucide-react";

export default function SecureNotice() {
    return (
        <div
            className="mt-6 bg-white/80 backdrop-blur-sm border border-slate-200 rounded-lg p-4 animate-fade-in-up"
            style={{ animationDelay: "1.8s" }}
        >
            <div className="flex items-start space-x-3">
                <Shield className="h-5 w-5 text-slate-500 mt-0.5 flex-shrink-0 animate-pulse-gentle" />
                <div className="text-sm text-slate-600">
                    <p className="font-medium mb-1">Security Notice</p>
                    <p>Your session is encrypted and secure. All document access is logged and monitored for compliance.</p>
                </div>
            </div>
        </div>
    )
}