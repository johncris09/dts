
export default function AllRightsReserved() {
    const date = new Date();
    return (
        <div className="text-center mt-8 text-sm text-slate-500 animate-fade-in" style={{ animationDelay: "2s" }}>
            <p>&copy; {date.getFullYear()} Document Tracking System. All rights reserved.</p>
        </div>
    )
}