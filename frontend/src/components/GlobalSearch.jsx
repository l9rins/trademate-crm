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
    Search
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
                className="flex h-9 w-64 items-center gap-2 rounded-full border bg-slate-50 px-3 text-sm text-slate-500 hover:bg-slate-100/80 transition-all focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
                <Search className="h-4 w-4 text-slate-400" />
                <span>Search anything...</span>
                <kbd className="pointer-events-none ml-auto inline-flex h-5 select-none items-center gap-1 rounded border bg-white px-1.5 font-mono text-[10px] font-medium text-slate-400">
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
                            <span>New Job Request</span>
                        </CommandItem>
                        <CommandItem onSelect={() => runCommand(() => navigate("/clients"))}>
                            <UserPlus className="mr-2 h-4 w-4" />
                            <span>Onboard New Client</span>
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
