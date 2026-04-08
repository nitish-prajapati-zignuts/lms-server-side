"use client"

import Link from "next/link"
import { redirect, usePathname } from "next/navigation"

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

import { Home, Users, Settings, LogOut, LucideIcon, Plus, Library, Check, Loader2 } from "lucide-react"
import { useActionState, useEffect } from "react"
import { logout } from "../_ServerActions/action"
import { successResponse } from "@/Utils/types"
import { toast } from "sonner"

type NavItem = {
    title: string
    href: string
    icon: LucideIcon
}

const data: NavItem[] = [
    { title: "Dashboard", href: "/dashboard", icon: Home },
    { title: "Users", href: "/users", icon: Users },
    { title: "Settings", href: "/settings", icon: Settings },
    { title: "Create a Course", href: "/create-course", icon: Plus },
    { title: "Manage Permissions", href: "/permissions", icon: Check }
]

export function SidebarComponent() {
    const pathname = usePathname()
    const { state, isMobile } = useSidebar()
    const isCollapsed = state === "collapsed"

    const [logutState, formAction, pending] = useActionState(logout, {
        success: null,
        status: null,
    })

    useEffect(() => {
        if (logutState?.success === false) {
            toast.success("Successfully logout")
            redirect("/login")
        }
    }, [logutState?.success])

    useEffect(() => {
        if (logutState?.status && logutState.status !== 200) {
            toast.error(logutState.message)
        }
    }, [logutState?.status])



    return (
        <Sidebar collapsible="icon" variant="floating">
            <SidebarHeader>
                <div className="flex items-center gap-2">
                    <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                        <Library className="size-5 " />
                    </div>
                    {(!isCollapsed || isMobile) && (
                        <div className="grid flex-1 text-left text-sm leading-tight">
                            <span className="truncate font-semibold text-stone-900	">LMS Dashboard</span>
                            <span className="truncate text-xs text-stone-500 font-medium">Manage platform</span>
                        </div>
                    )}
                </div>
            </SidebarHeader>

            {/* Content */}
            <SidebarContent>
                <SidebarMenu>
                    {data.map((item) => {
                        const Icon = item.icon
                        const isActive = pathname === item.href

                        return (
                            <SidebarMenuItem key={item.href}>
                                <SidebarMenuButton
                                    asChild
                                    isActive={isActive}
                                >
                                    <Link href={item.href}>
                                        <Icon className="mr-2 h-4 w-4" />
                                        {item.title}
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        )
                    })}
                </SidebarMenu>
            </SidebarContent>

            {/* Footer */}
            <SidebarFooter>
                {!isCollapsed && (
                    <div className="px-2 py-2 text-sm">
                        <p className="text-muted-foreground text-xs uppercase font-bold tracking-wider">Logged in as</p>
                        <p className="font-medium truncate">nitish@example.com</p>
                    </div>
                )}

                <SidebarMenu>
                    <SidebarMenuItem>
                        <form action={formAction}>
                            <SidebarMenuButton
                                type="submit"
                                className="text-destructive hover:text-destructive active:text-destructive w-full"
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
    )
}