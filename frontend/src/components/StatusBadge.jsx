import React from "react"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

const StatusBadge = ({ status }) => {
    const styles = {
        PENDING: "bg-amber-100/50 text-amber-700 hover:bg-amber-100/80 border-amber-200/50",
        IN_PROGRESS: "bg-blue-100/50 text-blue-700 hover:bg-blue-100/80 border-blue-200/50",
        COMPLETED: "bg-emerald-100/50 text-emerald-700 hover:bg-emerald-100/80 border-emerald-200/50",
        CANCELLED: "bg-rose-100/50 text-rose-700 hover:bg-rose-100/80 border-rose-200/50",
    };

    const currentStatus = status?.toUpperCase().replace(' ', '_') || 'PENDING';
    const styleClass = styles[currentStatus] || styles.PENDING;

    return (
        <Badge
            variant="outline"
            className={cn(
                "font-semibold border shadow-none px-2.5 py-0.5 rounded-full text-[10px] uppercase tracking-wider",
                styleClass
            )}
        >
            {status?.replace('_', ' ')}
        </Badge>
    );
};

export { StatusBadge }
