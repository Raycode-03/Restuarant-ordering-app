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
    <nav className="sticky top-0 z-30 h-16 bg-[#16A34A] border-b shadow-sm">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="flex items-center justify-between h-16">
      
      {/* Left: Logo */}
      <div className="flex-shrink-0">
        <Image
          src="/logos/savory_icon.png"
          alt="Restaurant Logo"
          width={80}
          height={80}
          priority
          className="rounded-lg"
        />
      </div>

      {/* Right: Navigation */}
      <div className="flex items-center gap-1 sm:gap-4">
        <Link
          href={`/menu/${tableNumber}`}
          className="flex items-center gap-1 px-2 py-2 rounded-md text-white/90 hover:text-white hover:bg-white/10 transition"
        >
          <Menu className="h-5 w-5 shrink-0" />
          <span className="hidden sm:inline text-sm">Menu</span>
        </Link>

        <Link
          href={`/orders/${tableNumber}`}
          className="relative flex items-center gap-1 px-2 py-2 rounded-md text-white/90 hover:text-white hover:bg-white/10 transition"
        >
          <ClipboardList className="h-5 w-5 shrink-0" />
          <span className="hidden sm:inline text-sm">Orders</span>
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
            2
          </span>
        </Link>

        <Link
          href={`/cart/${tableNumber}`}
          className="flex items-center gap-1 px-2 py-2 rounded-md text-white/90 hover:text-white hover:bg-white/10 transition"
        >
          <ShoppingCart className="h-5 w-5 shrink-0" />
          <span className="hidden sm:inline text-sm">Cart</span>
        </Link>

        {/* Table info */}
        <div className="ml-2 pl-3 border-l border-white/30">
          <p className="text-[10px] uppercase tracking-wide text-white/80">Ordering at</p>
          <p className="text-sm font-semibold text-white">Table {tableNumber}</p>
        </div>
      </div>

    </div>
  </div>
</nav>
  )
}