"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
    SidebarProvider,
    SidebarTrigger,
} from "@/components/ui/sidebar"

import { Home, Users, Settings, LogOut, LucideIcon, Plus } from "lucide-react"

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
]

export function SidebarComponent() {
    const pathname = usePathname()

    return (
        <SidebarProvider>
            <div className="p-2">
                <SidebarTrigger />
            </div>

            <Sidebar>
                {/* Header */}
                <SidebarHeader>
                    <div className="px-2 py-1">
                        <h2 className="text-lg font-semibold">LMS Dashboard</h2>
                        <p className="text-sm text-muted-foreground">
                            Manage your platform
                        </p>
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
                    <div className="px-2 py-2 text-sm">
                        <p className="text-muted-foreground">Logged in as</p>
                        <p className="font-medium">nitish@example.com</p>
                    </div>

                    <SidebarMenu>
                        <SidebarMenuItem>
                            <SidebarMenuButton className="text-red-500">
                                <LogOut className="mr-2 h-4 w-4" />
                                Logout
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarFooter>
            </Sidebar>
        </SidebarProvider>
    )
}