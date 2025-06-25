// src/lib/theme.ts
import { useEffect } from "react"

export function useSystemTheme() {
    useEffect(() => {
        const match = window.matchMedia("(prefers-color-scheme: dark)")
        const applyTheme = () => {
            document.documentElement.classList.toggle("dark", match.matches)
        }
        applyTheme()
        match.addEventListener("change", applyTheme)
        return () => match.removeEventListener("change", applyTheme)
    }, [])
}
