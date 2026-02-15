import * as React from "react"
import {
    LayoutDashboard,
    Users,
    Briefcase,
    Settings,
    LogOut,
    PlusCircle,
} from "lucide-react"

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarGroup,
    SidebarGroupLabel,
    SidebarGroupContent,
} from "@/components/ui/sidebar"
import { useAuth } from "@/context/AuthContext"
import { Link, useLocation } from "react-router-dom"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

export function AppSidebar() {
    const { user, logout } = useAuth()
    const location = useLocation()

    const navigation = [
        { title: "Dashboard", url: "/", icon: LayoutDashboard },
        { title: "Clients", url: "/clients", icon: Users },
        { title: "Jobs", url: "/jobs", icon: Briefcase },
    ]

    return (
        <Sidebar collapsible="icon" className="border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
            <SidebarHeader className="p-4">
                <div className="flex items-center gap-3 px-2">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-lg">
                        T
                    </div>
                    <div className="flex flex-col gap-0 leading-none transition-opacity group-data-[collapsible=icon]:opacity-0">
                        <span className="font-bold text-base tracking-tight text-slate-900 dark:text-white">TradeMate</span>
                        <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">Business CRM</span>
                    </div>
                </div>
            </SidebarHeader>

            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel className="text-slate-400 dark:text-slate-500 font-medium px-4 py-2 uppercase tracking-wider text-[10px]">Menu</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {navigation.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton
                                        asChild
                                        isActive={location.pathname === item.url}
                                        tooltip={item.title}
                                        className="hover:bg-slate-50 dark:hover:bg-slate-900 active:bg-slate-100 transition-colors rounded-lg px-4 py-5 data-[state=active]:bg-slate-100 dark:data-[state=active]:bg-slate-900 data-[state=active]:text-slate-900 dark:data-[state=active]:text-white data-[state=active]:font-semibold"
                                    >
                                        <Link to={item.url} className="flex items-center gap-3">
                                            <item.icon className="h-4.5 w-4.5 stroke-[1.5px]" />
                                            <span className="font-medium">{item.title}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>

                <SidebarGroup className="mt-4">
                    <SidebarGroupLabel className="text-slate-400 dark:text-slate-500 font-medium px-4 py-2 uppercase tracking-wider text-[10px]">Actions</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            <SidebarMenuItem className="px-2 pb-2">
                                <SidebarMenuButton
                                    asChild
                                    tooltip="New Job"
                                    className="bg-slate-900 dark:bg-white hover:bg-slate-800 dark:hover:bg-slate-100 text-white dark:text-slate-900 font-semibold rounded-lg shadow-sm h-10 transition-colors border-0"
                                >
                                    <Link to="/jobs">
                                        <PlusCircle className="h-4 w-4" />
                                        <span>New Job</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>

            <SidebarFooter className="p-4 mt-auto">
                <div className="flex items-center gap-3 px-3 py-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 transition-all group-data-[collapsible=icon]:p-0 group-data-[collapsible=icon]:bg-transparent group-data-[collapsible=icon]:border-none">
                    <Avatar className="h-8 w-8 shrink-0">
                        <AvatarFallback className="bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold">
                            {user?.username?.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col min-w-0 transition-opacity group-data-[collapsible=icon]:opacity-0">
                        <span className="text-sm font-medium truncate text-slate-900 dark:text-white">{user?.username}</span>
                        <span className="text-[11px] text-slate-400 dark:text-slate-500 truncate">{user?.email || 'Pro Plan'}</span>
                    </div>
                    <SidebarMenuButton
                        onClick={logout}
                        tooltip="Logout"
                        className="ml-auto w-8 h-8 p-0 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 group-data-[collapsible=icon]:hidden rounded-md"
                    >
                        <LogOut className="h-4 w-4" />
                    </SidebarMenuButton>
                </div>
            </SidebarFooter>
        </Sidebar>
    )
}
