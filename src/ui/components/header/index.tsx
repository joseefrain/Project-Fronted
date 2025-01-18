import { ShieldCheck } from 'lucide-react';
import { ProfileUser } from '../../../shared/components/ui/Profile';
import './styles.scss';

export const Header = () => {
  return (
    <div className="container-header">
      <h1 className="container-header__title">
        <ShieldCheck className="fill-blue-500 size-6" />
        NICHOS
      </h1>
      <div className="container-header__profile">
        <ProfileUser />
      </div>
    </div>
  );
};
