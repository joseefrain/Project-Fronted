import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { PanelRightOpen, Menu } from 'lucide-react';
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
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState('');

  const toggleSidebar = () => setIsCollapsed((prev) => !prev);
  const toggleMenu = () => setIsMenuOpen((prev) => !prev);

  return (
    <>
      <button
        className="fixed top-4 left-4 z-50 p-2 bg-white rounded shadow-md lg:hidden dark:bg-gray-950"
        onClick={toggleMenu}
      >
        <Menu className="text-black dark:text-white" />
      </button>

      <div
        className={`fixed top-0 left-0 z-40 h-full bg-white dark:bg-gray-950 transition-transform duration-300 ${
          isMenuOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 lg:static lg:flex lg:w-auto container-sidebar ${
          isCollapsed ? 'w-16' : 'w-64'
        } ${className}`}
      >
        <button
          onClick={toggleSidebar}
          className={`buttonPanel ${
            isCollapsed ? 'justify-center' : 'justify-end'
          }`}
        >
          <i className={`${isCollapsed ? 'rotate-180' : ''}`}>
            <PanelRightOpen />
          </i>
        </button>
        <ul
          className={`flex flex-col gap-4 p-4 mt-16 lg:mt-0 max-h-[85%] h-[80%] overflow-auto ${isCollapsed ? 'hidden' : 'flex'}`}
        >
          {links.map((link) => (
            <Link
              key={link.name}
              className="flex items-center gap-2 text-lg font-medium text-black dark:text-white"
              to={link.path}
              onClick={() => {
                setCurrentPage(link.name);
                setIsMenuOpen(false);
              }}
            >
              <li
                className={`flex items-center w-full h-10 gap-2 p-2 transition-colors duration-200 border-b rounded-sm border-border hover:bg-gray-200 hover:text-blue-500 font-onest ${
                  currentPage === link.name ? 'bg-gray-200 text-blue-500' : ''
                }`}
              >
                {link.icon && link.icon}
                {link.name}
              </li>
            </Link>
          ))}
        </ul>
        {isCollapsed && (
          <ul className="flex flex-col gap-2 p-2">
            {links.map((link, index) => (
              <Link
                to={link.path}
                key={index}
                className="size-10"
                onClick={() => {
                  setCurrentPage(link.name);
                  setIsMenuOpen(false);
                }}
              >
                <li
                  key={link.name}
                  className={`flex items-center justify-center w-10 h-10 text-black dark:text-white hover:text-blue-500 ${
                    currentPage === link.name
                      ? 'text-blue-500 dark:text-blue-500'
                      : ''
                  }`}
                >
                  {link.icon}
                </li>
              </Link>
            ))}
          </ul>
        )}
      </div>

      {/* Fondo oscuro para cerrar el menú al hacer clic afuera */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 z-30 bg-black opacity-50 lg:hidden"
          onClick={toggleMenu}
        />
      )}
    </>
  );
};
