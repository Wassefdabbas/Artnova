import { useState } from "react";
import "./UserButton.css";
import Image from "../Image/Image";
import apiRequest from "../../utils/apiRequest";
import { Link, useNavigate } from "react-router";
import useAuthStore from "../../utils/authStore";

function UserButton() {
  // const currentUser = true;

  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

    const { currentUser, removeCurrentUser } = useAuthStore();
  // console.log(currentUser);
    const handleLogout = async () => {
      try{
        await apiRequest.post("users/auth/logout", {})
        removeCurrentUser()
        navigate('/auth')
      } catch(err) {
        console.log(err)
      }
    }


  return currentUser ? (
    <div className="userButton">
      <Image path={currentUser.img || "/general/noAvatar.png"} alt="" />

      <div onClick={() => setOpen((prev) => !prev)}>
        <Image className="imgIcon" path="/general/arrow.svg" alt="" />
      </div>

      {open && (
        <div className="userOption">
          <Link to={`/${currentUser.userName}`} >Profile</Link>
          <div>Setting</div>
          <div onClick={handleLogout}>LogOut</div>
        </div>
      )}
    </div>
  ) : (
    <Link to="/auth" className="LoginLink">
      {" "}
      LogIn / Sign Up
    </Link>
  );
}

export default UserButton;
