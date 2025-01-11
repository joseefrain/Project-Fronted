import { ShieldCheck } from 'lucide-react';
import { useState } from 'react';
import { ProfileUser } from '../../../shared/components/ui/Profile';

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="flex items-center justify-between py-5 pl-4 pr-24 bg-white dark:bg-gray-950">
      <h1 className="flex items-center gap-2 text-2xl font-bold font-onest dark:text-white">
        <ShieldCheck className="fill-blue-500 size-6" />
        NICHOS
      </h1>
      <div className="flex items-center gap-2">
        <ProfileUser />
        <button onClick={toggleMenu} className="md:hidden">
          ☰
        </button>
      </div>
      {isMenuOpen && (
        <div className="absolute bg-white rounded-md shadow-lg top-16 right-4 md:hidden">
          <button className="block px-4 py-2">Iniciar sesión</button>
        </div>
      )}
    </div>
  );
};
