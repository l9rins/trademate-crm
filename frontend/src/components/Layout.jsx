import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Toaster } from "@/components/ui/sonner"
import { GlobalSearch } from "./GlobalSearch"
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "./AppSidebar"
import { Bell, HelpCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "./ModeToggle"
import { motion, AnimatePresence } from "framer-motion";

const pageVariants = {
    initial: { opacity: 0, y: 8 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -4 },
};

export default function Layout() {
    const location = useLocation();

    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset className="flex flex-col bg-slate-50 dark:bg-slate-950">
                <header className="sticky top-0 z-30 flex h-14 shrink-0 items-center justify-between border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 backdrop-blur-sm px-6">
                    <div className="flex items-center gap-4">
                        <SidebarTrigger className="h-8 w-8 text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-900 rounded-md transition-colors" />
                        <div className="h-5 w-[1px] bg-slate-200 dark:bg-slate-800 hidden md:block" />
                        <GlobalSearch />
                    </div>

                    <div className="flex items-center gap-1">
                        <ModeToggle />
                        <Button variant="ghost" size="icon" className="text-slate-500 hover:text-slate-900 dark:hover:text-white rounded-md h-8 w-8 hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors">
                            <Bell className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="text-slate-500 hover:text-slate-900 dark:hover:text-white rounded-md h-8 w-8 hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors">
                            <HelpCircle className="h-4 w-4" />
                        </Button>
                    </div>
                </header>
                <main className="flex-1 p-6 md:p-8">
                    <div className="mx-auto max-w-6xl">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={location.pathname}
                                variants={pageVariants}
                                initial="initial"
                                animate="animate"
                                exit="exit"
                                transition={{ duration: 0.2, ease: "easeOut" }}
                            >
                                <Outlet />
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </main>
            </SidebarInset>
            <Toaster richColors position="top-right" />
        </SidebarProvider>
    );
}
