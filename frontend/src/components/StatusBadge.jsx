import React from "react"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

const StatusBadge = ({ status }) => {
    const styles = {
        const styles = {
            PENDING: "bg-amber-500/10 text-amber-400 border-amber-500/20 shadow-lg shadow-amber-500/5",
            IN_PROGRESS: "bg-primary/10 text-primary border-primary/20 shadow-lg shadow-primary/5",
            COMPLETED: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-lg shadow-emerald-500/5",
            CANCELLED: "bg-rose-500/10 text-rose-400 border-rose-500/20 shadow-lg shadow-rose-500/5",
        };

        const currentStatus = status?.toUpperCase().replace(' ', '_') || 'PENDING';
        const styleClass = styles[currentStatus] || styles.PENDING;

        return(
        <Badge
            variant = "outline"
            className = {
                cn(
                "font-black border shadow-none px-3 py-1 rounded-lg text-[9px] uppercase tracking-[0.15em] transition-all",
                    styleClass
                )
            }
                >
                { status?.replace('_', ' ') }
        </Badge >
    );
};

export { StatusBadge }
