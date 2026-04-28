import React, { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ModeToggle() {
    const [theme, setTheme] = useState(() => {
        if (typeof window !== "undefined") {
            return localStorage.getItem("theme") || "light";
        }
        return "light";
    });

    useEffect(() => {
        const root = window.document.documentElement;
        if (theme === "dark") {
            root.classList.add("dark");
        } else {
            root.classList.remove("dark");
        }
        localStorage.setItem("theme", theme);
    }, [theme]);

    return (
        <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            className="rounded-xl h-9 w-9 bg-slate-100/50 hover:bg-slate-200/50 transition-all border-none"
        >
            {theme === "light" ? (
                <Sun className="h-[1.2rem] w-[1.2rem] text-slate-500 transition-all rotate-0 scale-100 dark:-rotate-90 dark:scale-0" />
            ) : (
                <Moon className="h-[1.2rem] w-[1.2rem] text-slate-500 transition-all rotate-90 scale-0 dark:rotate-0 dark:scale-100" />
            )}
            <span className="sr-only">Toggle theme</span>
        </Button>
    );
}
