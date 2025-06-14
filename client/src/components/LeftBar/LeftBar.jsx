import "./LeftBar.css";
import Image from "../Image/Image";
import { Link } from "react-router";
function LeftBar() {
  return (
    <div className="leftBar">
      <div className="menu">
        <Link to="/">
          <Image
            path="/general/logo.png"
            alt="ARTNOVA"
          />
        </Link>

        <Link to="/">
          <Image
            className="left-icon"
            path="/general/home.svg"
            alt="home"
          />
        </Link>

        <Link to="/create">
          <Image
            className="left-icon"
            path="/general/create.svg"
            alt="create"
          />
        </Link>

        <a href="">
          <Image
            className="left-icon"
            path="/general/updates.svg"
            alt="updates"
          />
        </a>
      </div>
      <a href="">
        <Image
          className="left-icon"
          path="/general/settings.svg"
          alt="settings"
        />
      </a>
    </div>
  );
}

export default LeftBar;
