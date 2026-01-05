import React, { forwardRef } from "react"
import { cn } from "../../lib/utils"

const Input = forwardRef(({ className, type, icon, error, success, ...props }, ref) => {
    return (
        <div className="relative group">
            {icon && (
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-blue-500 transition-colors pointer-events-none">
                    {icon}
                </div>
            )}
            <input
                type={type}
                className={cn(
                    "flex h-11 w-full rounded-md border border-gray-700/50 bg-[#1a1f2e] px-3 py-2 text-sm text-white shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50",
                    icon && "pl-10",
                    error && "border-red-500 focus-visible:ring-red-500",
                    success && "border-green-500 focus-visible:ring-green-500",
                    className
                )}
                ref={ref}
                {...props}
            />
        </div>
    )
})
Input.displayName = "Input"

export { Input }
