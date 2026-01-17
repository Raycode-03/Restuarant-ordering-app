"use client"
import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar"
import { useIsMobile } from "@/hooks/use-mobile"
import { Bell, LogOut, User } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { toast } from 'sonner';
import  Link from "next/link";
interface NavbarProps {
    user?: {
        id: string;
        email?: string | null;
        role?: string | 'user';
    }
    pageTitle?: string;
    
}

export default function NavbarDashboard({ user, pageTitle = "dashboard"}: NavbarProps) {
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);

    const isMobileDevice = useIsMobile()
    const [showSearchMobile, setShowSearchMobile] = useState(false)
    const [showUserMenu, setShowUserMenu] = useState(false);
    
    const { state, isMobile } = useSidebar()
    const sidebarWidth = state === "expanded" ? "16rem" : "3rem"
    
    const searchRef = useRef<HTMLDivElement>(null)
    const userMenuRef = useRef<HTMLDivElement>(null)
    // Close handlers
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
             const target = e.target as Node;
            
             // Close user menu when clicking outside
            if (showUserMenu && userMenuRef.current && !userMenuRef.current.contains(target)) {
                setShowUserMenu(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [showSearchMobile, showUserMenu, isMobileDevice]);


    const handleSignOut = async () => {
        try {
            const res = await fetch('/api/admin/logout', { method: 'POST' });

            if (!res.ok) {
                toast.error("Couldn't logout");
            } else {
                toast.success('Logout Successful!');
                window.location.href = "/admin/login";
            }
        } catch (error) {
            console.error('Logout failed:', error);
            toast.error("Logout failed");
        }
    };

   
    return (
        <>
            {/* Main Navbar */}
            <div  className="fixed top-0 z-30 h-20 flex items-center justify-between px-6
  bg-emerald-700/90 dark:bg-emerald-800/90  
  backdrop-blur-md text-white shadow-lg transition-all duration-300"

                style={{
                    left: isMobile ? "0" : sidebarWidth,
                    width: isMobile ? "100%" : `calc(100% - ${sidebarWidth})`,
                }}
            >
                {/* Left Section - Sidebar Trigger and Page Title */}
                <div className="flex items-center gap-4 flex-1">
                    <SidebarTrigger className="text-white hover:bg-gray-200 rounded-lg p-2 transition-colors flex-shrink-0" />
                    
                    {!showSearchMobile && (
                        <h1 className="text-xl font-bold capitalize text-white">
                            {pageTitle}
                        </h1>
                    )}
                </div>

                {/* Center/Right Section - Search, Icons, and User Menu */}
                <div className="flex items-center gap-4 flex-1 justify-end">

                    {/* Right Section - Icons & User Menu */}
                    <div className="flex items-center gap-3">
                        {/* Notifications */}
                        <Link href="/notification" className="relative cursor-pointer">
                            <button className="p-2 rounded-lg hover:bg-gray-200 transition-colors group relative">
                                <Bell className="w-5 h-5 text-white hover:text-gray-700" />
                                <div className="absolute top-1 right-2 w-2 h-2 bg-red-500 rounded-full"></div>
                            </button>
                        </Link>


                        {/* User Menu */}
                        <div className="relative" ref={userMenuRef}>
                            <button 
                                onClick={() => setShowUserMenu(!showUserMenu)}
                                className="p-0 transition-colors rounded-full hover:ring-2 hover:ring-blue-400"
                            >
                                 
                                    <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
                                        <User className="w-4 h-4 text-white" />
                                    </div>
                            </button>

                            {/* Dropdown Menu */}
                            {showUserMenu && (
                                <div className="absolute right-0 top-12 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50">
                                    <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-600">
                                        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                            {user?.email || "Guest"}
                                        </p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate mt-1">
                                            {user?.role === "admin" && " • Admin"}
                                        </p>
                                    </div>
                                    
                                    <button className="w-full text-left px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-3 text-sm transition-colors">
                                        <User className="w-4 h-4" />
                                        Profile
                                    </button>
                                    <button 
                                        onClick={handleSignOut}
                                        className="w-full text-left px-4 py-2 text-red-600 dark:text-red-400 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-3 text-sm transition-colors"
                                    >
                                        <LogOut className="w-4 h-4" />
                                        Sign Out
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

        </>
    );
}