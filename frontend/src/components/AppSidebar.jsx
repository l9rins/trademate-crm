import * as React from "react"
import {
    LayoutDashboard,
    Users,
    Briefcase,
    Settings,
    LogOut,
    PlusCircle,
    Search,
    Command
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function AppSidebar() {
    const { user, logout } = useAuth()
    const location = useLocation()

    const navigation = [
        { title: "Dashboard", url: "/", icon: LayoutDashboard },
        { title: "Clients", url: "/clients", icon: Users },
        { title: "Jobs", url: "/jobs", icon: Briefcase },
    ]

    return (
        <Sidebar collapsible="icon" className="bg-sidebar text-sidebar-foreground border-r-sidebar-border">
            <SidebarHeader className="p-4">
                <div className="flex items-center gap-3 px-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                        <span className="text-xl font-bold italic">T</span>
                    </div>
                    <div className="flex flex-col gap-0.5 leading-none transition-opacity group-data-[collapsible=icon]:opacity-0">
                        <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">TradeMate</span>
                        <span className="text-[10px] text-slate-400 uppercase tracking-widest font-medium">Enterprise CRM</span>
                    </div>
                </div>
            </SidebarHeader>

            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel className="text-slate-500 font-semibold px-4 py-2 uppercase tracking-wider text-[10px]">Main Menu</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {navigation.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton
                                        asChild
                                        isActive={location.pathname === item.url}
                                        tooltip={item.title}
                                        className="hover:bg-slate-900 active:bg-slate-800 transition-colors"
                                    >
                                        <Link to={item.url} className="flex items-center gap-3">
                                            <item.icon className="h-4 w-4" />
                                            <span className="font-medium">{item.title}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>

                <SidebarGroup className="mt-4">
                    <SidebarGroupLabel className="text-slate-500 font-semibold px-4 py-2 uppercase tracking-wider text-[10px]">Actions</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            <SidebarMenuItem className="px-2 pb-2">
                                <SidebarMenuButton
                                    asChild
                                    tooltip="New Job"
                                    className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-lg shadow-lg shadow-primary/20 h-10 transition-all"
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
                <div className="flex items-center gap-3 px-2 py-3 rounded-xl bg-slate-900/50 border border-slate-800/50 transition-colors group-data-[collapsible=icon]:p-0 group-data-[collapsible=icon]:bg-transparent group-data-[collapsible=icon]:border-none">
                    <Avatar className="h-8 w-8 border border-white/10 shrink-0">
                        <AvatarFallback className="bg-indigo-600/20 text-indigo-400 text-xs font-bold">
                            {user?.username?.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col min-w-0 transition-opacity group-data-[collapsible=icon]:opacity-0">
                        <span className="text-sm font-semibold truncate text-slate-200">{user?.username}</span>
                        <span className="text-[11px] text-slate-500 truncate">{user?.email || 'Premium Plan'}</span>
                    </div>
                    <SidebarMenuButton
                        onClick={logout}
                        tooltip="Logout"
                        className="ml-auto w-8 h-8 p-0 opacity-50 hover:opacity-100 hover:bg-slate-800 group-data-[collapsible=icon]:hidden"
                    >
                        <LogOut className="h-4 w-4 text-slate-400" />
                    </SidebarMenuButton>
                </div>
            </SidebarFooter>
        </Sidebar>
    )
}
