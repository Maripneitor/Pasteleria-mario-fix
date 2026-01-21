import React from 'react';

const NotificationCard = ({ message = "New message!", text = "You have a new AI notification." }) => {
  return (
    <div className="w-full max-w-xs p-4 bg-white dark:bg-slate-800 border border-blue-100 dark:border-slate-700 rounded-2xl shadow-sm transition-colors duration-300">
      <div className="flex items-center gap-4">
        <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-blue-400 text-white">
          <svg fill="currentColor" viewBox="0 0 20 20" className="w-4 h-4" xmlns="http://www.w3.org/2000/svg">
            <path clipRule="evenodd" d="M18 3a1 1 0 00-1.447-.894L8.763 6H5a3 3 0 000 6h.28l1.771 5.316A1 1 0 008 18h1a1 1 0 001-1v-4.382l6.553 3.276A1 1 0 0018 15V3z" fillRule="evenodd" />
          </svg>
        </div>
        <p className="font-semibold text-gray-700 dark:text-gray-200">{message}</p>
      </div>
      <p className="mt-4 text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
        {text}
      </p>
      <div className="mt-6 flex flex-col gap-2">
        <button className="w-full py-2.5 px-4 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg text-sm transition-colors shadow-sm shadow-blue-200 dark:shadow-none">
          Take a Look
        </button>
        <button className="w-full py-2.5 px-4 bg-gray-50 hover:bg-gray-100 dark:bg-slate-700 dark:hover:bg-slate-600 text-gray-500 dark:text-gray-300 font-medium rounded-lg text-sm transition-colors">
          Mark as Read
        </button>
      </div>
    </div>
  );
}

export default NotificationCard;
