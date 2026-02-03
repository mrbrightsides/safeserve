import React from 'react';
import { UserRole } from '../types';
import { LayoutDashboard, Truck, School, ShieldAlert, Settings, Info, Leaf } from 'lucide-react';

interface SidebarProps {
  activeRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  onSettingsClick?: () => void;
  onInfoClick?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeRole, onRoleChange, onSettingsClick, onInfoClick }) => {
  const roles = [
    { id: UserRole.REGULATOR, label: 'Regulator', icon: LayoutDashboard },
    { id: UserRole.VENDOR, label: 'Vendor Portal', icon: Truck },
    { id: UserRole.SCHOOL, label: 'School Portal', icon: School },
    { id: UserRole.SUSTAINABILITY, label: 'Sustainability & Waste', icon: Leaf },
  ];

  return (
    <div className="w-64 bg-slate-900 text-white flex flex-col hidden lg:flex shrink-0">
      <div className="p-6">
        <h2 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-6">User Simulation</h2>
        <nav className="space-y-2">
          {roles.map((role) => (
            <button
              key={role.id}
              onClick={() => onRoleChange(role.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                activeRole === role.id 
                  ? role.id === UserRole.SUSTAINABILITY ? 'bg-emerald-600 text-white shadow-lg' : 'bg-red-600 text-white shadow-lg'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <role.icon className="w-5 h-5" />
              <span className="font-medium">{role.label}</span>
            </button>
          ))}
        </nav>
      </div>

      <div className="mt-auto p-6 space-y-4">
        <div className="p-4 bg-slate-800 rounded-xl border border-slate-700">
          <div className="flex items-center gap-2 mb-2">
            <ShieldAlert className="w-4 h-4 text-orange-400" />
            <span className="text-xs font-bold text-orange-400 uppercase">System Alert</span>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            MBG Monitoring is active. Sustainability module tracking 14.2k saved meals.
          </p>
        </div>
        
        <div className="flex items-center justify-between text-slate-500">
          <Settings 
            onClick={onSettingsClick}
            className="w-5 h-5 cursor-pointer hover:text-white transition-colors" 
          />
          <Info 
            onClick={onInfoClick}
            className="w-5 h-5 cursor-pointer hover:text-white transition-colors" 
          />
          <span className="text-[10px] font-mono">v1.3.0-WASTE</span>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;