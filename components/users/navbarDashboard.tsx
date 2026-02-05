"use client"
import Link from "next/link"
import { ShoppingCart, ClipboardList, Menu } from "lucide-react"
import Image from "next/image"

interface NavbarProps {
  tableNumber: number
  pageTitle?: string
}

export default function NavbarDashboard({
  tableNumber,
}: NavbarProps) {
  return (
    <nav className="sticky top-0 z-30 h-20 bg-emerald-700 dark:bg-emerald-800   border-b shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Left: Logo  */}
          <div className="flex items-center space-x-4">
            <div className="flex-shrink-0">
              <Image
                src="/logos/svg.png"
                alt="Restaurant Logo"
                width={120}
                height={120}
                priority
                className="rounded-lg w-full h-full"
              />
            </div>
          </div>

          {/* Right: Navigation */}
          <div className="flex items-center space-x-4">
            <Link
            href={`/menu/${tableNumber}`}  
            className="flex items-center space-x-2 px-3 py-2 rounded-md       text-white/90 hover:text-white hover:bg-white/10 transition"
            >
            <Menu className="h-5 w-5" />
            <span className="hidden sm:inline">Menu</span>
            </Link>

            <Link
            href={`/orders/${tableNumber}`}
            className="relative flex items-center space-x-2 px-3 py-2 rounded-md 
                        text-white/90 hover:text-white hover:bg-white/10 transition"
            >
            <ClipboardList className="h-5 w-5" />
            <span className="hidden sm:inline">Orders</span>

            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs 
                            rounded-full h-5 w-5 flex items-center justify-center">
                2
            </span>
            </Link>

            <Link
            href={`/cart/${tableNumber}`}
            className="flex items-center space-x-2 px-3 py-2 rounded-md 
                        text-white/90 hover:text-white hover:bg-white/10 transition"
            >
            <ShoppingCart className="h-5 w-5" />
            <span className="hidden sm:inline">Cart</span>
            </Link>


            {/* User Info */}
            <div className="ml-4 pl-4 border-l border-white/30">
            <div className="text-sm text-white/80">
                <p className="text-xs uppercase tracking-wide">Ordering at</p>
                <p className="font-semibold text-white">Table {tableNumber}</p>
            </div>
            </div>

          </div>
        </div>
      </div>
    </nav>
  )
}