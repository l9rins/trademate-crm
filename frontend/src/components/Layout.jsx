import React from 'react';
import { Outlet } from 'react-router-dom';
import { Toaster } from "@/components/ui/sonner"
import { GlobalSearch } from "./GlobalSearch"
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "./AppSidebar"
import { Search, Bell, HelpCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Layout() {
    return (
        <SidebarProvider>
            <div className="flex min-h-screen w-full bg-slate-50/50">
                <AppSidebar />
                <SidebarInset className="flex flex-col">
                    <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center justify-between border-b bg-white/80 px-6 backdrop-blur-md">
                        <div className="flex items-center gap-4">
                            <SidebarTrigger className="h-9 w-9 text-slate-500 hover:bg-slate-100 transition-colors" />
                            <div className="h-6 w-[1px] bg-slate-200 hidden md:block" />
                            <div className="relative group hidden md:block">
                                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" />
                                <button className="h-9 w-64 rounded-full border bg-slate-50 pl-10 pr-4 text-left text-sm text-slate-500 hover:bg-slate-100/80 transition-all focus:outline-none focus:ring-2 focus:ring-primary/20">
                                    Search anything...
                                    <span className="ml-auto float-right text-[10px] bg-white border px-1.5 py-0.5 rounded shadow-sm flex items-center gap-1 font-mono uppercase text-slate-400">
                                        ⌘ K
                                    </span>
                                </button>
                                <div className="absolute inset-0 opacity-0 cursor-pointer">
                                    <GlobalSearch />
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <Button variant="ghost" size="icon" className="text-slate-500 rounded-full hover:bg-slate-100">
                                <Bell className="h-5 w-5" />
                            </Button>
                            <Button variant="ghost" size="icon" className="text-slate-500 rounded-full hover:bg-slate-100">
                                <HelpCircle className="h-5 w-5" />
                            </Button>
                        </div>
                    </header>
                    <main className="flex-1 overflow-y-auto p-6 md:p-8">
                        <div className="mx-auto max-w-6xl">
                            <Outlet />
                        </div>
                    </main>
                </SidebarInset>
                <Toaster richColors position="top-right" />
            </div>
        </SidebarProvider>
    );
}
