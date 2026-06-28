import { 
  Leaf, User, LayoutDashboard, Briefcase, FileText, 
  IndianRupee, Lightbulb, Bell, CheckCircle2, Star,
  CheckCircle, ArrowRight, Scissors, Palette, MapPin, Clock, AlertCircle
} from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-[#fbf9fa] text-[#2d3748]">
      {/* Sidebar */}
      <aside className="w-full md:w-[260px] bg-white border-r border-[#edf2f7] p-6 flex flex-col shrink-0">
        <div className="mb-8">
          <h2 className="text-xl font-bold text-[#851d29] flex items-center gap-2">
            Saheli Network <Leaf className="w-5 h-5" />
          </h2>
        </div>
        
        <div className="bg-[#fcf0f4] p-4 rounded-xl mb-8 text-center shadow-sm">
          <img 
            src="https://ui-avatars.com/api/?name=Saheli&background=random" 
            alt="Profile" 
            className="w-16 h-16 rounded-full mx-auto mb-3 border-2 border-white shadow-sm"
          />
          <div className="profile-info">
            <h3 className="text-base font-semibold text-[#851d29] mb-1">Welcome, Saheli</h3>
            <p className="text-[11px] text-[#718096]">Trusted Saheli &bull; Active Member</p>
          </div>
        </div>

        <nav className="flex-grow">
          <ul className="space-y-1">
            <NavItem icon={<User className="w-[18px] h-[18px]" />} label="My Profile" />
            <NavItem icon={<LayoutDashboard className="w-[18px] h-[18px]" />} label="Dashboard" active />
            <NavItem icon={<Briefcase className="w-[18px] h-[18px]" />} label="Opportunities" />
            <NavItem icon={<FileText className="w-[18px] h-[18px]" />} label="Orders" />
            <NavItem icon={<IndianRupee className="w-[18px] h-[18px]" />} label="Earnings" />
            <NavItem icon={<Lightbulb className="w-[18px] h-[18px]" />} label="Saheli ki Salah" />
          </ul>
        </nav>

        <div className="pb-6 mt-auto pt-6">
          <h4 className="text-xs text-[#718096] uppercase tracking-wide mb-3">Mere Orders</h4>
          <div className="flex justify-between text-[13px] mb-2">
            <span>Completed:</span>
            <span className="font-semibold">12</span>
          </div>
          <div className="flex justify-between text-[13px] mb-2">
            <span>Pending:</span>
            <span className="font-semibold">2</span>
          </div>
        </div>

        <div>
          <button className="w-full bg-[#b52222] hover:bg-[#9c1b1b] text-white py-3 px-4 rounded-lg font-semibold text-sm transition-colors">
            Recovery Support Active
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-grow p-6 md:p-10 flex flex-col min-w-0">
        <header className="flex justify-end mb-6">
           <button className="p-2 text-[#2d3748] hover:bg-black/5 rounded-full transition-colors">
             <Bell className="w-6 h-6" />
           </button>
        </header>
        
        <div className="flex flex-col gap-6 max-w-5xl">
          {/* Top Cards Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Welcome Card */}
            <div className="bg-white rounded-2xl p-6 shadow-sm relative overflow-hidden lg:col-span-2 flex flex-col justify-center min-h-[200px]">
              <div className="absolute -right-5 -top-5 text-[#f4f6f8] opacity-50 z-0">
                <Leaf className="w-48 h-48" />
              </div>
              <div className="inline-flex items-center gap-1.5 text-[11px] font-bold text-[#718096] uppercase mb-3 z-10">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#851d29]" /> VERIFIED PARTNER
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-1 z-10">Namaste, Shanti!</h1>
              <p className="text-sm text-[#718096] mb-6 z-10">You have 3 New Opportunities Today</p>
              <div className="flex flex-wrap gap-3 z-10">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[13px] font-semibold bg-[#fcacc8] text-[#501d2d]">
                  <Star fill="currentColor" className="w-3.5 h-3.5" /> 4.8/5 <span className="font-medium opacity-80 ml-0.5">Community Love</span>
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[13px] font-semibold bg-[#b9dfc6] text-[#1d4029]">
                  <CheckCircle fill="currentColor" className="w-3.5 h-3.5" /> 128 Jobs Completed
                </span>
              </div>
            </div>
            
            {/* Earnings Card */}
            <div className="bg-[#c1e3ce] rounded-2xl p-6 flex flex-col">
              <h3 className="text-sm font-medium text-[#851d29] mb-2">Today's Earnings</h3>
              <h2 className="text-4xl font-bold text-[#851d29] mb-6">₹1,240</h2>
              <div className="w-full h-1 bg-[#851d29]/20 rounded-full mb-3 mt-auto">
                 <div className="w-[60%] h-full bg-[#851d29] rounded-full"></div>
              </div>
              <div className="flex justify-between items-center text-xs text-[#851d29]">
                 <span>This Week</span>
                 <span className="font-bold">₹8,450</span>
              </div>
            </div>
          </div>

          {/* Two columns section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="flex flex-col">
              <div className="bg-[#d0adfa] rounded-2xl p-6 h-full flex flex-col justify-between min-h-[220px]">
                <div>
                  <div className="flex items-center gap-2 text-[13px] font-semibold text-[#3b2063] mb-6">
                    <Lightbulb className="w-4 h-4" /> <span>Saheli ki Salah</span>
                  </div>
                  <p className="text-base font-medium text-[#3b2063] leading-relaxed">
                    Wedding season aa raha hai. Mehndi ki demand badhne wali hai.
                  </p>
                </div>
                <a href="#" className="inline-flex items-center gap-2 text-[#3b2063] font-semibold text-sm mt-8 hover:underline">
                  Get Ready <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Right Column */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Aaj ke Kaam</h2>
                <a href="#" className="text-[13px] font-semibold text-[#851d29] hover:underline">View All</a>
              </div>
              
              <div className="flex flex-col gap-3">
                <TaskCard 
                  icon={<Scissors className="w-6 h-6" />}
                  iconBg="bg-[#fde4ec]"
                  iconColor="text-[#d81b60]"
                  title="Stitching Order"
                  details="2km away • ₹500"
                />
                <TaskCard 
                  icon={<Palette className="w-6 h-6" />}
                  iconBg="bg-[#f3e5f5]"
                  iconColor="text-[#8e24aa]"
                  title="Mehndi Booking"
                  details="0.5km away • ₹1800"
                />
                <div className="bg-[#e1bfff] rounded-xl p-4 flex items-center gap-4 shadow-sm">
                  <div className="w-12 h-12 rounded-lg flex items-center justify-center shrink-0 bg-[#ffebee] text-[#c62828]">
                    <AlertCircle className="w-6 h-6" />
                  </div>
                  <div className="flex-grow min-w-0">
                    <h4 className="text-sm font-semibold text-gray-900 mb-1 truncate">Immediate Income Opportunity</h4>
                    <p className="text-xs text-[#718096] flex items-center gap-1">
                      <Clock className="w-3 h-3" /> 15 mins left &bull; ₹2,000
                    </p>
                  </div>
                  <button className="bg-[#b52222] text-white border-none py-2 px-4 rounded-full text-xs font-semibold whitespace-nowrap hover:bg-[#9c1b1b] transition-colors shrink-0">
                    Recovery Support
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function NavItem({ icon, label, active = false }: { icon: React.ReactNode, label: string, active?: boolean }) {
  return (
    <li>
      <a 
        href="#" 
        className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
          active 
            ? "bg-[#fbdde6] text-[#2d3748]" 
            : "text-[#2d3748] hover:bg-[#fcf0f4]"
        }`}
      >
        <span className={active ? "text-[#2d3748]" : "text-[#718096]"}>{icon}</span>
        {label}
      </a>
    </li>
  );
}

function TaskCard({ 
  icon, iconBg, iconColor, title, details 
}: { 
  icon: React.ReactNode, iconBg: string, iconColor: string, title: string, details: string 
}) {
  return (
    <div className="bg-white rounded-xl p-4 flex items-center gap-4 shadow-sm">
      <div className={`w-12 h-12 rounded-lg flex items-center justify-center shrink-0 ${iconBg} ${iconColor}`}>
        {icon}
      </div>
      <div className="min-w-0">
        <h4 className="text-sm font-semibold text-gray-900 mb-1 truncate">{title}</h4>
        <p className="text-xs text-[#718096] flex items-center gap-1">
          <MapPin className="w-3 h-3" /> {details}
        </p>
      </div>
    </div>
  );
}
