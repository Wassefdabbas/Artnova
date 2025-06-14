import "./MainLayout.css";
import { Outlet } from 'react-router'
import LeftBar from '../../components/LeftBar/LeftBar'
import TopBar from "../../components/TopBar/TopBar";

function MainLayout() {
  return (
    <div className="app">
      <LeftBar />
      <div className="content">
        <TopBar />

        {/* will  change automatically || parent route components TO RENDER the child routes components.*/}
        <Outlet />
      </div>
    </div>
  );
}

export default MainLayout;
