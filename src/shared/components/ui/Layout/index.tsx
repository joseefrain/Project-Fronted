import { ReactNode, useEffect } from 'react';
import { Header } from '../../../../ui/components/header';
import { Sidebar } from '../Sidebar/index';
import { Toaster } from '@/components/ui/toaster';
import { useAppSelector } from '../../../../app/hooks';
import { getSidebarLinksByRoles } from '../../../helpers/roleHelper';
import './styles.scss';
import { formatDate } from '../../../helpers/Branchs';
import { store } from '../../../../app/store';
import { getRecordedHoursPatch } from '../../../../app/slices/workHours';
import { ROLE } from '../../../../interfaces/roleInterfaces';

interface LayoutProps {
  children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  const user = useAppSelector((state) => state.auth.signIn.user);
  const roles = user?.roles ?? [];
  const sidebarLinks = getSidebarLinksByRoles(roles);
  const dataWorkHours = useAppSelector(
    (state) => state.workHours.recordedHours
  );

  const _hoursInitDay = dataWorkHours?.map((employee) => employee?.hourEntry);
  const _hoursEndDay = dataWorkHours?.map((employee) => employee?.hourExit);

  const today = new Date();
  const returnStartDate = new Date(today);

  returnStartDate.setDate(returnStartDate.getDate());

  const dataSend = {
    startDate: formatDate(returnStartDate),
    endDate: formatDate(returnStartDate),
    sucursalId: user?.sucursalId?._id ?? '',
  };

  useEffect(() => {
    store.dispatch(getRecordedHoursPatch(dataSend)).unwrap();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.sucursalId?._id ?? '']);
  const isHoursInitDayFilled = _hoursInitDay && _hoursInitDay.length > 0;
  const isHoursEndDayEmpty = !_hoursEndDay || _hoursEndDay.length === 0;
  const areBothEmpty =
    (!_hoursInitDay || _hoursInitDay.length === 0) &&
    (!_hoursEndDay || _hoursEndDay.length === 0);

  const hideSidebar =
    (isHoursInitDayFilled && isHoursEndDayEmpty) || areBothEmpty;

  const shouldShowSidebar =
    user?.role === ROLE.ROOT ||
    (!hideSidebar &&
      (user?.role === ROLE.ADMIN || user?.role === ROLE.EMPLEADO));

  const sidebarClass = hideSidebar ? 'sidebar-disabled' : '';

  return (
    <div className="flex flex-col h-screen">
      <Header />
      <div className="flex flex-1">
        {shouldShowSidebar && (
          <Sidebar
            className={`capitalize ${user?.role !== ROLE.ROOT ? sidebarClass : ''}`}
            links={sidebarLinks}
          />
        )}
        <div className="container-Layout">{children}</div>
        <Toaster />
      </div>
    </div>
  );
};
