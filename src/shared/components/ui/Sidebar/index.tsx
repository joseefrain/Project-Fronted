import { PanelRightOpen } from 'lucide-react';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './styles.scss';

interface SidebarProps {
  links: {
    name: string;
    path: string;
    icon?: React.ReactNode;
    module: string;
  }[];
  className?: string;
}

export const Sidebar = ({ links, className }: SidebarProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [currentPage, setCurrentPage] = useState('');

  const toggleSidebar = () => {
    setIsCollapsed((prev) => !prev);
  };

  return (
    <div
      className={`container-sidebar  ${isCollapsed ? 'w-16' : 'w-64'} ${className}`}
    >
      <button
        onClick={toggleSidebar}
        className={`flex w-full p-2 mb-4 transition-transform duration-200 transform bg-white rounded shadow-md hover:scale-105 dark:bg-gray-950 ${isCollapsed ? 'justify-center' : 'justify-end'}`}
      >
        <i className={`${isCollapsed ? 'rotate-180' : ''}`}>
          <PanelRightOpen />
        </i>
      </button>
      <ul
        className={`flex flex-col gap-4 p-4 ${isCollapsed ? 'hidden' : 'flex'}`}
      >
        {links.map((link) => (
          <Link
            key={link.name}
            className="flex items-center gap-2 text-lg font-medium text-black dark:text-white"
            to={link.path}
            onClick={() => setCurrentPage(link.name)}
          >
            <li
              className={`flex items-center w-full h-10 gap-2 p-2 transition-colors duration-200 border-b rounded-sm border-border hover:bg-gray-200 hover:text-blue-500 font-onest  ${currentPage === link.name ? 'bg-gray-200 text-blue-500' : ''}`}
            >
              {link.icon && link.icon}
              {link.name}
            </li>
          </Link>
        ))}
      </ul>
      {isCollapsed && (
        <ul className="flex flex-col gap-2 p-2">
          {links.map((link) => (
            <Link to={link.path} className="size-10">
              <li
                key={link.name}
                className={`flex items-center justify-center w-10 h-10 text-black dark:text-white hover:text-blue-500 ${currentPage === link.name ? 'text-blue-500 dark:text-blue-500' : ''}`}
                onClick={() => setCurrentPage(link.name)}
              >
                {link.icon}
              </li>
            </Link>
          ))}
        </ul>
      )}
    </div>
  );
};
