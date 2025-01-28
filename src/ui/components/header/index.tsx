import { ProfileUser } from '../../../shared/components/ui/Profile';
import './styles.scss';
import { SvgComponent } from '@/assets';

export const Header = () => {
  return (
    <div className="container-header">
      <h1 className="container-header__title">
        <SvgComponent />
      </h1>
      <div className="container-header__profile">
        <ProfileUser />
      </div>
    </div>
  );
};
