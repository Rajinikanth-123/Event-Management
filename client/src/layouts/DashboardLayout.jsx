import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

const DashboardLayout = () => {
  return (
    <div className="dashboard-shell">
      <Sidebar />
      <section className="dashboard-main">
        <Outlet />
      </section>
    </div>
  );
};

export default DashboardLayout;