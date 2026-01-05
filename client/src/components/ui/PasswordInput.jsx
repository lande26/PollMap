import React, { forwardRef, useState } from "react"
import { Eye, EyeOff, Lock } from "lucide-react"
import { cn } from "../../lib/utils"

const PasswordInput = forwardRef(({ className, error, success, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false)

    return (
        <div className="relative group">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-blue-500 transition-colors pointer-events-none">
                <Lock size={18} />
            </div>
            <input
                type={showPassword ? "text" : "password"}
                className={cn(
                    "flex h-11 w-full rounded-md border border-gray-700/50 bg-[#1a1f2e] px-10 py-2 text-sm text-white shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50",
                    error && "border-red-500 focus-visible:ring-red-500",
                    success && "border-green-500 focus-visible:ring-green-500",
                    className
                )}
                ref={ref}
                {...props}
            />
            <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors p-1 rounded-md hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                aria-label={showPassword ? "Hide password" : "Show password"}
            >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
        </div>
    )
})
PasswordInput.displayName = "PasswordInput"

export { PasswordInput }
