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
    initial: { opacity: 0, y: 12 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -8 },
};

export default function Layout() {
    const location = useLocation();

    return (
        <SidebarProvider>
            {/* Midnight Ambient Glow Mesh (Dark Mode Only) */}
            <div className="fixed inset-0 z-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-teal-900/15 via-slate-950 to-slate-950 opacity-0 dark:opacity-100 transition-opacity duration-1000 pointer-events-none" />

            <AppSidebar />
            <SidebarInset className="flex flex-col relative z-10">
                <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center justify-between border-b border-white/5 glass px-6">
                    <div className="flex items-center gap-4">
                        <SidebarTrigger className="h-9 w-9 text-muted-foreground hover:bg-muted transition-colors" />
                        <div className="h-6 w-[1px] bg-border hidden md:block" />
                        <GlobalSearch />
                    </div>

                    <div className="flex items-center gap-2">
                        <ModeToggle />
                        <Button variant="ghost" size="icon" className="text-muted-foreground rounded-xl h-9 w-9 hover:bg-muted transition-all">
                            <Bell className="h-5 w-5" />
                        </Button>
                        <Button variant="ghost" size="icon" className="text-muted-foreground rounded-xl h-9 w-9 hover:bg-muted transition-all">
                            <HelpCircle className="h-5 w-5" />
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
                                transition={{ type: "spring", stiffness: 300, damping: 30 }}
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
