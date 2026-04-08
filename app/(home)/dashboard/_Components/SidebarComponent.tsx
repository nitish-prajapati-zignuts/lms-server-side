"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { CreateCourseModal } from "./CreateCourseModal"

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
    useSidebar,
} from "@/components/ui/sidebar"

import {
    Home,
    Users,
    Settings,
    LogOut,
    LucideIcon,
    Plus,
    Library,
    Check,
    Loader2,
} from "lucide-react"

import { useActionState } from "react"
import { logout } from "../_ServerActions/action"
import { toast } from "sonner"

type NavItem = {
    title: string
    href: string
    icon: LucideIcon
    isModalAction?: boolean
}

const data: NavItem[] = [
    { title: "Dashboard", href: "/dashboard", icon: Home },
    { title: "Users", href: "/users", icon: Users },
    { title: "Settings", href: "/settings", icon: Settings },
    { title: "Create a Course", href: "#", icon: Plus, isModalAction: true },
    { title: "Manage Permissions", href: "/permissions", icon: Check },
]

export function SidebarComponent() {
    const pathname = usePathname()
    const router = useRouter()
    const { state, isMobile } = useSidebar()
    const isCollapsed = state === "collapsed"

    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)

    const [logoutState, formAction, pending] = useActionState(logout, {
        success: null,
        status: null,
    })

    // Handle logout state changes
    useEffect(() => {
        if (logoutState?.success === false) {
            toast.error(logoutState.message || "Failed to logout")
        }
    }, [logoutState])


    return (
        <>
            <Sidebar collapsible="icon" variant="floating">
                {/* Header */}
                <SidebarHeader>
                    <div className="flex items-center gap-2">
                        <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                            <Library className="size-5" />
                        </div>

                        {(!isCollapsed || isMobile) && (
                            <div className="grid text-sm leading-tight">
                                <span className="font-semibold text-stone-900">
                                    LMS Dashboard
                                </span>
                                <span className="text-xs text-stone-500">
                                    Manage platform
                                </span>
                            </div>
                        )}
                    </div>
                </SidebarHeader>

                {/* Content */}
                <SidebarContent>
                    <SidebarMenu>
                        {data.map((item) => {
                            const Icon = item.icon
                            const isActive =
                                pathname === item.href && !item.isModalAction

                            return (
                                <SidebarMenuItem key={item.href}>
                                    {item.isModalAction ? (
                                        <SidebarMenuButton
                                            isActive={isActive}
                                            onClick={() =>
                                                setIsCreateModalOpen(true)
                                            }
                                        >
                                            <Icon className="mr-2 h-4 w-4" />
                                            {item.title}
                                        </SidebarMenuButton>
                                    ) : (
                                        <SidebarMenuButton asChild isActive={isActive}>
                                            <Link href={item.href}>
                                                <Icon className="mr-2 h-4 w-4" />
                                                {item.title}
                                            </Link>
                                        </SidebarMenuButton>
                                    )}
                                </SidebarMenuItem>
                            )
                        })}
                    </SidebarMenu>
                </SidebarContent>

                {/* Footer */}
                <SidebarFooter>
                    {!isCollapsed && (
                        <div className="px-2 py-2 text-sm">
                            <p className="text-xs font-bold uppercase text-muted-foreground">
                                Logged in as
                            </p>
                            <p className="truncate font-medium">
                                nitish@example.com
                            </p>
                        </div>
                    )}

                    <SidebarMenu>
                        <SidebarMenuItem>
                            <form action={formAction}>
                                <SidebarMenuButton
                                    type="submit"
                                    className="w-full text-destructive"
                                >
                                    {pending ? (
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                    ) : (
                                        <LogOut className="h-4 w-4" />
                                    )}
                                    {!isCollapsed && <span>Logout</span>}
                                </SidebarMenuButton>
                            </form>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarFooter>
            </Sidebar>

            {/* Modal */}
            <CreateCourseModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
            />
        </>
    )
}