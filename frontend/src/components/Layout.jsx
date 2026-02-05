import React from 'react';
import { Outlet } from 'react-router-dom';
import { Toaster } from "@/components/ui/sonner"
import { GlobalSearch } from "./GlobalSearch"
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "./AppSidebar"
import { Search, Bell, HelpCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "./ModeToggle"

export default function Layout() {
    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset className="flex flex-col">
                <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center justify-between border-b bg-background/80 px-6 backdrop-blur-md">
                    <div className="flex items-center gap-4">
                        <SidebarTrigger className="h-9 w-9 text-slate-500 hover:bg-muted transition-colors" />
                        <div className="h-6 w-[1px] bg-border hidden md:block" />
                        <GlobalSearch />
                    </div>

                    <div className="flex items-center gap-2">
                        <ModeToggle />
                        <Button variant="ghost" size="icon" className="text-slate-500 rounded-xl h-9 w-9 bg-slate-100/50 hover:bg-slate-200/50 transition-all">
                            <Bell className="h-5 w-5" />
                        </Button>
                        <Button variant="ghost" size="icon" className="text-slate-500 rounded-xl h-9 w-9 bg-slate-100/50 hover:bg-slate-200/50 transition-all">
                            <HelpCircle className="h-5 w-5" />
                        </Button>
                    </div>
                </header>
                <main className="flex-1 p-6 md:p-8">
                    <div className="mx-auto max-w-6xl">
                        <Outlet />
                    </div>
                </main>
            </SidebarInset>
            <Toaster richColors position="top-right" />
        </SidebarProvider>
    );
}
