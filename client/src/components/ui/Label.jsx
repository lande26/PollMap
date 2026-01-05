import React, { forwardRef } from "react"
import { cn } from "../../lib/utils"

const Label = forwardRef(({ className, ...props }, ref) => (
    <label
        ref={ref}
        className={cn(
            "text-xs font-semibold uppercase tracking-wider text-gray-400 peer-disabled:cursor-not-allowed peer-disabled:opacity-70 mb-2 block",
            className
        )}
        {...props}
    />
))
Label.displayName = "Label"

export { Label }
