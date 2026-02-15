import * as React from "react"
import { useNavigate } from "react-router-dom"
import {
    LayoutDashboard,
    Users,
    Briefcase,
    Settings,
    PlusCircle,
    UserPlus,
    LogOut,
    Search,
    ArrowRight
} from "lucide-react"
import { useAuth } from "@/context/AuthContext"
import {
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
    CommandShortcut,
} from "@/components/ui/command"

export function GlobalSearch() {
    const { logout } = useAuth()
    const [open, setOpen] = React.useState(false)
    const navigate = useNavigate()

    React.useEffect(() => {
        const down = (e) => {
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault()
                setOpen((open) => !open)
            }
        }
        document.addEventListener("keydown", down)
        return () => document.removeEventListener("keydown", down)
    }, [])

    const runCommand = React.useCallback((command) => {
        setOpen(false)
        command()
    }, [])

    return (
        <>
            <button
                onClick={() => setOpen(true)}
                className="relative flex h-9 w-full min-w-[260px] items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-500 transition-colors hover:border-slate-300 hover:text-slate-600 focus:outline-none focus:ring-2 focus:ring-slate-950/10 dark:border-slate-800 dark:bg-slate-950/50 dark:text-slate-400 dark:hover:border-slate-700"
            >
                <Search className="h-4 w-4" />
                <span className="font-medium">Search...</span>
                <kbd className="pointer-events-none absolute right-2.5 hidden h-5 select-none items-center gap-1 rounded border border-slate-200 bg-slate-50 px-1.5 font-mono text-[10px] font-medium text-slate-500 sm:flex dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400">
                    <span className="text-xs">⌘</span>K
                </kbd>
            </button>

            <CommandDialog open={open} onOpenChange={setOpen}>
                <CommandInput placeholder="Type a command or search..." />
                <CommandList>
                    <CommandEmpty>No results found.</CommandEmpty>
                    <CommandGroup heading="Navigation">
                        <CommandItem onSelect={() => runCommand(() => navigate("/"))}>
                            <LayoutDashboard className="mr-2 h-4 w-4" />
                            <span>Dashboard</span>
                        </CommandItem>
                        <CommandItem onSelect={() => runCommand(() => navigate("/clients"))}>
                            <Users className="mr-2 h-4 w-4" />
                            <span>Clients</span>
                        </CommandItem>
                        <CommandItem onSelect={() => runCommand(() => navigate("/jobs"))}>
                            <Briefcase className="mr-2 h-4 w-4" />
                            <span>Jobs</span>
                        </CommandItem>
                    </CommandGroup>
                    <CommandSeparator />
                    <CommandGroup heading="Actions">
                        <CommandItem onSelect={() => runCommand(() => navigate("/jobs"))}>
                            <PlusCircle className="mr-2 h-4 w-4" />
                            <span>New Job</span>
                        </CommandItem>
                        <CommandItem onSelect={() => runCommand(() => navigate("/clients"))}>
                            <UserPlus className="mr-2 h-4 w-4" />
                            <span>Add Client</span>
                        </CommandItem>
                    </CommandGroup>
                    <CommandSeparator />
                    <CommandGroup heading="Settings">
                        <CommandItem onSelect={() => runCommand(() => navigate("/settings"))}>
                            <Settings className="mr-2 h-4 w-4" />
                            <span>Settings</span>
                            <CommandShortcut>⌘S</CommandShortcut>
                        </CommandItem>
                        <CommandItem onSelect={() => runCommand(() => logout())}>
                            <LogOut className="mr-2 h-4 w-4" />
                            <span>Logout</span>
                        </CommandItem>
                    </CommandGroup>
                </CommandList>
            </CommandDialog>
        </>
    )
}
