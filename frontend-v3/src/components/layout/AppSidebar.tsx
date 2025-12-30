import { Link, useLocation } from "react-router-dom"
import {
    LayoutDashboard,
    TrendingUp,
    FileText,
    LogOut,
    ChevronLeft,
    Menu,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useAuth } from "@/contexts/AuthContext"

interface AppSidebarProps {
    isOpen: boolean
    onToggle: () => void
    isMobile?: boolean
}

const navigation = [
    {
        name: "Dashboard",
        href: "/dashboard",
        icon: LayoutDashboard,
    },
    {
        name: "Investment Data",
        href: "/dashboard/invest",
        icon: TrendingUp,
    },
    {
        name: "Data Kontrak",
        href: "/dashboard/kontrak",
        icon: FileText,
    },
]

export function AppSidebar({ isOpen, onToggle, isMobile = false }: AppSidebarProps) {
    const location = useLocation()
    const { user, logout } = useAuth()

    return (
        <>
            {/* Mobile overlay */}
            {isMobile && isOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/50 lg:hidden"
                    onClick={onToggle}
                />
            )}

            {/* Sidebar */}
            <aside
                className={cn(
                    "fixed left-0 top-0 z-50 flex h-full flex-col border-r bg-sidebar transition-all duration-300",
                    isOpen ? "w-64" : "w-0 lg:w-16",
                    isMobile && !isOpen && "-translate-x-full",
                    isMobile && isOpen && "translate-x-0"
                )}
            >
                {/* Header */}
                <div className="flex h-16 items-center justify-between border-b px-4">
                    {isOpen && (
                        <div className="flex items-center gap-2">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                                <TrendingUp className="h-4 w-4 text-primary-foreground" />
                            </div>
                            <span className="font-semibold text-sidebar-foreground">
                                Invest Dashboard
                            </span>
                        </div>
                    )}
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={onToggle}
                        className="text-sidebar-foreground hover:bg-sidebar-accent"
                    >
                        {isOpen ? <ChevronLeft className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
                    </Button>
                </div>

                {/* Navigation */}
                <ScrollArea className="flex-1 px-2 py-4">
                    <nav className="space-y-1">
                        {navigation.map((item) => {
                            const isActive = location.pathname === item.href
                            return (
                                <Link
                                    key={item.name}
                                    to={item.href}
                                    onClick={isMobile ? onToggle : undefined}
                                    className={cn(
                                        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                                        isActive
                                            ? "bg-sidebar-primary text-sidebar-primary-foreground"
                                            : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                                        !isOpen && "justify-center"
                                    )}
                                >
                                    <item.icon className="h-4 w-4 shrink-0" />
                                    {isOpen && <span>{item.name}</span>}
                                </Link>
                            )
                        })}
                    </nav>
                </ScrollArea>

                {/* Footer */}
                <div className="border-t p-2">
                    <Separator className="my-2" />
                    {isOpen ? (
                        <div className="flex items-center gap-3 rounded-lg px-3 py-2">
                            <Avatar className="h-8 w-8">
                                <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                                    {user?.username?.slice(0, 2).toUpperCase() || "SA"}
                                </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                                <p className="truncate text-sm font-medium text-sidebar-foreground">
                                    {user?.username || "Super Admin"}
                                </p>
                                <p className="truncate text-xs text-sidebar-foreground/60">
                                    Administrator
                                </p>
                            </div>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={logout}
                                className="text-sidebar-foreground hover:bg-destructive hover:text-destructive-foreground"
                            >
                                <LogOut className="h-4 w-4" />
                            </Button>
                        </div>
                    ) : (
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={logout}
                            className="w-full text-sidebar-foreground hover:bg-destructive hover:text-destructive-foreground"
                        >
                            <LogOut className="h-4 w-4" />
                        </Button>
                    )}
                </div>
            </aside>
        </>
    )
}
