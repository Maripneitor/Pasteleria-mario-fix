import React from 'react';
import { Settings, BarChart2, LogOut } from 'lucide-react';

const ActionCard = () => {
  return (
    <div className="w-[260px] bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-4 shadow-sm transition-colors duration-300">
      <div className="pb-2 mb-2 border-b border-gray-100 dark:border-slate-700">
        <span className="font-semibold text-gray-900 dark:text-white text-sm">Configuración</span>
      </div>
      <ul className="space-y-1">
        <li className="flex justify-between items-center p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 cursor-pointer group transition-colors">
          <span className="text-sm text-gray-600 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white">Editar Perfil</span>
          <Settings size={18} className="text-gray-400 group-hover:text-gray-600 dark:text-slate-500 dark:group-hover:text-slate-300" />
        </li>
        <li className="flex justify-between items-center p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 cursor-pointer group transition-colors">
          <span className="text-sm text-gray-600 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white">Historial</span>
          <BarChart2 size={18} className="text-gray-400 group-hover:text-gray-600 dark:text-slate-500 dark:group-hover:text-slate-300" />
        </li>
      </ul>
      <div className="h-px bg-gray-100 dark:bg-slate-700 my-2" />
      <ul className="space-y-1">
        <li className="group relative overflow-hidden flex justify-between items-center p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 cursor-pointer transition-all">
          <span className="text-sm text-red-500 font-medium group-hover:translate-x-0 transition-transform duration-300">Cerrar Sesión</span>
          <LogOut size={18} className="text-red-400 group-hover:text-red-600" />
        </li>
      </ul>
    </div>
  );
}

export default ActionCard;
