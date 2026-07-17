import React from 'react'
import { NavLink } from 'react-router-dom'
import {
  User, LayoutDashboard, Briefcase,
  ClipboardList, Coins, MessageCircleHeart,
  ShieldCheck, Bell
} from 'lucide-react'
import LotusLogo from './LotusLogo'

const navItems = [
  { to: '/profile',      icon: User,                 label: 'My Profile' },
  { to: '/',             icon: LayoutDashboard,      label: 'Dashboard' },
  { to: '/opportunities',icon: Briefcase,            label: 'Opportunities' },
  { to: '/orders',       icon: ClipboardList,        label: 'Orders' },
  { to: '/earnings',     icon: Coins,                label: 'Earnings' },
  { to: '/salah',        icon: MessageCircleHeart,   label: 'Saheli ki Salah' },
]

export default function Sidebar() {
  return (
    <aside className="w-52 min-w-[208px] flex flex-col bg-white border-r border-gray-100 min-h-screen">

      {/* Brand */}
      <div className="flex items-center justify-between px-4 pt-4 pb-3 border-b border-gray-100">
        <div className="flex items-center gap-1.5">
          <LotusLogo size={18} />
          <span className="font-semibold text-[15px] text-rose-500 tracking-tight">
            Saheli Network
          </span>
        </div>
        <Bell size={16} className="text-gray-400" />
      </div>

      {/* Profile */}
      <div className="flex flex-col items-start px-4 pt-4 pb-4 border-b border-gray-100">
        {/* Avatar — placeholder circle with initials */}
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-rose-300 to-pink-500 flex items-center justify-center text-white font-semibold text-lg mb-2 shadow-sm">
          S
        </div>
        <p className="text-[13px] font-semibold text-gray-800 leading-tight">Welcome, Saheli</p>
        <p className="text-[11px] text-gray-400 mt-0.5">Trusted Saheli · Active Member</p>
      </div>

      {/* Nav */}
      <nav className="flex flex-col gap-0.5 px-2 pt-2 flex-1">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] transition-colors duration-150 ${
                isActive
                  ? 'bg-rose-50 text-rose-600 font-medium'
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
              }`
            }
          >
            <Icon size={15} />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Order stats */}
      <div className="px-4 py-3 border-t border-gray-100">
        <p className="text-[11px] font-medium text-gray-500 mb-1.5">Mere Orders</p>
        <div className="flex justify-between text-[12px] text-gray-500">
          <span>Completed</span><span className="font-medium text-gray-700">12</span>
        </div>
        <div className="flex justify-between text-[12px] text-gray-500 mt-0.5">
          <span>Pending</span><span className="font-medium text-gray-700">2</span>
        </div>
      </div>

      {/* Recovery CTA */}
      <div className="px-3 pb-4">
        <button className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white text-[12px] font-medium py-2.5 rounded-xl transition-colors">
          <ShieldCheck size={14} />
          Recovery Support Active
        </button>
      </div>
    </aside>
  )
}
