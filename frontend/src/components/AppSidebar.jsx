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
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-cryshield-gradient text-white shadow-lg shadow-primary/20">
                        <span className="text-2xl font-black italic">T</span>
                    </div>
                    <div className="flex flex-col gap-0 leading-none transition-opacity group-data-[collapsible=icon]:opacity-0">
                        <span className="font-black text-xl tracking-tight text-cryshield-gradient uppercase">TradeMate</span>
                        <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Cryshield Core</span>
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
                                        className="hover:bg-primary/10 active:bg-primary/20 transition-all duration-300 rounded-xl px-4 py-6 data-[state=active]:bg-primary/15 data-[state=active]:text-primary"
                                    >
                                        <Link to={item.url} className="flex items-center gap-3">
                                            <item.icon className="h-5 w-5" />
                                            <span className="font-bold">{item.title}</span>
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
                                    className="bg-cryshield-gradient hover:opacity-90 text-white font-black rounded-xl shadow-xl shadow-primary/30 h-12 transition-all border-0 uppercase tracking-tight"
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
                <div className="flex items-center gap-3 px-3 py-4 rounded-2xl bg-muted/30 border border-white/5 backdrop-blur-sm transition-all group-data-[collapsible=icon]:p-0 group-data-[collapsible=icon]:bg-transparent group-data-[collapsible=icon]:border-none">
                    <Avatar className="h-10 w-10 border-2 border-primary/30 shadow-lg shadow-primary/10 shrink-0">
                        <AvatarFallback className="bg-cryshield-gradient text-white text-xs font-black">
                            {user?.username?.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col min-w-0 transition-opacity group-data-[collapsible=icon]:opacity-0">
                        <span className="text-sm font-bold truncate text-foreground">{user?.username}</span>
                        <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">{user?.email || 'Premium User'}</span>
                    </div>
                    <SidebarMenuButton
                        onClick={logout}
                        tooltip="Logout"
                        className="ml-auto w-10 h-10 p-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10 group-data-[collapsible=icon]:hidden rounded-xl"
                    >
                        <LogOut className="h-5 w-5" />
                    </SidebarMenuButton>
                </div>
            </SidebarFooter>
        </Sidebar>
    )
}
