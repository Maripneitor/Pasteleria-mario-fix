import React from 'react';
import { Check, ArrowLeft, ArrowRight } from 'lucide-react';

const ProductionStepper = ({ currentStep = 2, steps = [
  { title: "Pedido Recibido", time: "10:24 AM", status: "Completado" },
  { title: "En Producción", time: "02:15 PM", status: "En Proceso" },
  { title: "Terminado", time: "Estimado: 4:00 PM", status: "Pendiente" }
] }) => {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl p-8 w-full max-w-[400px] shadow-sm border border-gray-100 dark:border-slate-700 transition-colors duration-300">
      {steps.map((step, index) => {
        const stepNum = index + 1;
        let status = "pending";
        if (stepNum < currentStep) status = "completed";
        if (stepNum === currentStep) status = "active";

        return (
          <div key={index} className="flex mb-8 relative last:mb-0">
            {/* Connecting Line */}
            {index < steps.length - 1 && (
              <div className="absolute left-[19px] top-10 bottom-[-32px] w-0.5 bg-gray-200 dark:bg-slate-700 z-0"></div>
            )}

            {/* Circle */}
            <div className={`
                            w-10 h-10 rounded-full flex items-center justify-center mr-4 z-10 transition-colors duration-300
                            ${status === 'completed'
                ? 'bg-slate-900 text-white dark:bg-blue-600'
                : status === 'active'
                  ? 'border-2 border-slate-900 text-slate-900 dark:border-blue-500 dark:text-blue-500'
                  : 'border-2 border-gray-200 text-gray-400 dark:border-slate-600 dark:text-gray-500'
              }
                        `}>
              {status === 'completed' ? <Check size={16} /> : stepNum}
            </div>

            {/* Content */}
            <div className="flex-1">
              <div className={`font-semibold mb-1 ${status === 'active' || status === 'completed' ? 'text-slate-900 dark:text-gray-100' : 'text-gray-400 dark:text-gray-500'}`}>
                {step.title}
              </div>
              <span className={`
                                text-xs inline-block px-2 py-0.5 rounded-full mb-1
                                ${status === 'completed'
                  ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                  : status === 'active'
                    ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
                    : 'bg-gray-100 text-gray-500 dark:bg-slate-700 dark:text-gray-400'
                }
                            `}>
                {step.status}
              </span>
              <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                {step.time}
              </div>
            </div>
          </div>
        );
      })}

      <div className="flex justify-between mt-8 pt-6 border-t border-gray-100 dark:border-slate-700">
        <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-600 transition-colors text-sm">
          <ArrowLeft size={16} />
          Anterior
        </button>
        <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-900 dark:bg-blue-600 text-white hover:bg-slate-800 dark:hover:bg-blue-700 transition-colors text-sm">
          Siguiente
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}

export default ProductionStepper;
