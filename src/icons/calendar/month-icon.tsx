import { cn } from "@/lib/utils";

export function MonthIcon({ className }: { className?: string }) {
	return (
		<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={cn("dark:invert", className)}>
			<path d="M9 9.375C9 9.67337 8.88147 9.95952 8.6705 10.1705C8.45952 10.3815 8.17337 10.5 7.875 10.5C7.57663 10.5 7.29048 10.3815 7.0795 10.1705C6.86853 9.95952 6.75 9.67337 6.75 9.375C6.75 9.07663 6.86853 8.79048 7.0795 8.5795C7.29048 8.36853 7.57663 8.25 7.875 8.25C8.17337 8.25 8.45952 8.36853 8.6705 8.5795C8.88147 8.79048 9 9.07663 9 9.375ZM7.875 15C8.17337 15 8.45952 14.8815 8.6705 14.6705C8.88147 14.4595 9 14.1734 9 13.875C9 13.5766 8.88147 13.2905 8.6705 13.0795C8.45952 12.8685 8.17337 12.75 7.875 12.75C7.57663 12.75 7.29048 12.8685 7.0795 13.0795C6.86853 13.2905 6.75 13.5766 6.75 13.875C6.75 14.1734 6.86853 14.4595 7.0795 14.6705C7.29048 14.8815 7.57663 15 7.875 15ZM12 15C12.2984 15 12.5845 14.8815 12.7955 14.6705C13.0065 14.4595 13.125 14.1734 13.125 13.875C13.125 13.5766 13.0065 13.2905 12.7955 13.0795C12.5845 12.8685 12.2984 12.75 12 12.75C11.7016 12.75 11.4155 12.8685 11.2045 13.0795C10.9935 13.2905 10.875 13.5766 10.875 13.875C10.875 14.1734 10.9935 14.4595 11.2045 14.6705C11.4155 14.8815 11.7016 15 12 15ZM12 10.5C12.1477 10.5 12.294 10.4709 12.4305 10.4144C12.567 10.3578 12.691 10.275 12.7955 10.1705C12.9 10.066 12.9828 9.94201 13.0394 9.80552C13.0959 9.66903 13.125 9.52274 13.125 9.375C13.125 9.22726 13.0959 9.08097 13.0394 8.94448C12.9828 8.80799 12.9 8.68397 12.7955 8.5795C12.691 8.47504 12.567 8.39217 12.4305 8.33564C12.294 8.2791 12.1477 8.25 12 8.25C11.7016 8.25 11.4155 8.36853 11.2045 8.5795C10.9935 8.79048 10.875 9.07663 10.875 9.375C10.875 9.67337 10.9935 9.95952 11.2045 10.1705C11.4155 10.3815 11.7016 10.5 12 10.5ZM16.125 10.5C16.2727 10.5 16.419 10.4709 16.5555 10.4144C16.692 10.3578 16.816 10.275 16.9205 10.1705C17.025 10.066 17.1078 9.94201 17.1644 9.80552C17.2209 9.66903 17.25 9.52274 17.25 9.375C17.25 9.22726 17.2209 9.08097 17.1644 8.94448C17.1078 8.80799 17.025 8.68397 16.9205 8.5795C16.816 8.47504 16.692 8.39217 16.5555 8.33564C16.419 8.2791 16.2727 8.25 16.125 8.25C15.8266 8.25 15.5405 8.36853 15.3295 8.5795C15.1185 8.79048 15 9.07663 15 9.375C15 9.67337 15.1185 9.95952 15.3295 10.1705C15.5405 10.3815 15.8266 10.5 16.125 10.5ZM5.625 2.25C4.72989 2.25 3.87145 2.60558 3.23851 3.23851C2.60558 3.87145 2.25 4.72989 2.25 5.625V18.375C2.25 19.2701 2.60558 20.1286 3.23851 20.7615C3.87145 21.3944 4.72989 21.75 5.625 21.75H18.375C19.2701 21.75 20.1286 21.3944 20.7615 20.7615C21.3944 20.1286 21.75 19.2701 21.75 18.375V5.625C21.75 4.72989 21.3944 3.87145 20.7615 3.23851C20.1286 2.60558 19.2701 2.25 18.375 2.25H5.625ZM3.75 5.625C3.75 5.12772 3.94754 4.65081 4.29917 4.29917C4.65081 3.94754 5.12772 3.75 5.625 3.75H18.375C18.8723 3.75 19.3492 3.94754 19.7008 4.29917C20.0525 4.65081 20.25 5.12772 20.25 5.625V18.375C20.25 18.8723 20.0525 19.3492 19.7008 19.7008C19.3492 20.0525 18.8723 20.25 18.375 20.25H5.625C5.12772 20.25 4.65081 20.0525 4.29917 19.7008C3.94754 19.3492 3.75 18.8723 3.75 18.375V5.625Z" fill="black" />
		</svg>
	)
}
