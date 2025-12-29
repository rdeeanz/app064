import { useNavigate, Outlet } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
    LayoutDashboard,
    LogOut,
    Menu,
    PieChart
} from "lucide-react";

export default function DashboardLayout() {
    const { logout, user } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    const SidebarContent = () => (
        <div className="flex flex-col h-full bg-slate-900 text-white">
            <div className="p-6">
                <h1 className="text-2xl font-bold">InvestMon</h1>
                <p className="text-xs text-slate-400 mt-1">Investment Monitoring</p>
            </div>
            <nav className="flex-1 px-4 space-y-2">
                <Button variant="ghost" className="w-full justify-start text-white hover:bg-slate-800 hover:text-white" onClick={() => navigate("/dashboard")}>
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    Dashboard
                </Button>
                <Button variant="ghost" className="w-full justify-start text-white hover:bg-slate-800 hover:text-white" onClick={() => navigate("/dashboard/invest")}>
                    <PieChart className="mr-2 h-4 w-4" />
                    Monitor Investasi
                </Button>
            </nav>
            <div className="p-4 border-t border-slate-800">
                <div className="mb-4 px-4">
                    <p className="text-sm font-medium">{user?.username}</p>
                    <p className="text-xs text-slate-400">Super Admin</p>
                </div>
                <Button variant="destructive" className="w-full justify-start" onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                </Button>
            </div>
        </div>
    );

    return (
        <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
            {/* Desktop Sidebar */}
            <div className="hidden md:flex w-64 flex-col fixed inset-y-0 z-50">
                <SidebarContent />
            </div>

            {/* Mobile Sidebar */}
            <div className="md:hidden">
                <Sheet>
                    <SheetTrigger asChild>
                        <Button variant="outline" size="icon" className="fixed top-4 left-4 z-50">
                            <Menu className="h-4 w-4" />
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="p-0 w-64">
                        <SidebarContent />
                    </SheetContent>
                </Sheet>
            </div>

            {/* Main Content */}
            <main className="flex-1 md:ml-64 p-8 overflow-y-auto w-full">
                <Outlet />
            </main>
        </div>
    );
}
