import "./UserProfilePage.css";
import Image from "../../components/Image/Image";
import { useState } from "react";
import Boards from "../../components/Boards/Boards";
import Gallery from "../../components/Gallery/Gallery";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router";
import apiRequest from "../../utils/apiRequest";
import FollowButton from "./FollowButton";

function UserProfilePage() {
  const [type, setType] = useState("saved");

  const { userName } = useParams();

  const { isPending, error, data } = useQuery({
    queryKey: ["profile", userName],
    queryFn: () => apiRequest.get(`/users/${userName}`).then((res) => res.data),
  });

  if (isPending) return "Loading...";
  if (error) return "An error has occurred : " + error.message;
  if (!data) return "User Not found!";

  return (
    <div className="profilePage">
      <Image
        className="profileImage"
        path={data.img || "general/noAvatar.png"}
      />
      <h1 className="profileName">{data.displayName}</h1>
      <span className="profileUserName">@{data.userName}</span>
      <div className="followCounts">{data.followerCount} followers . {data.followingCount} following </div>

      <div className="profileInteraction">
        <Image className="iconWhite " path="general/share.svg" />
        <div className="profileButtons">
          <button>Message</button>
          <FollowButton
            isFollowing={data.isFollowing}
            userName={data.userName}
          />
        </div>
        <Image className="iconWhite " path="general/more.svg" />
      </div>

      <div className="profileOptions">
        <span
          onClick={() => setType("created")}
          className={type === "created" ? "active" : ""}
        >
          Created
        </span>
        <span
          onClick={() => setType("saved")}
          className={type === "saved" ? "active" : ""}
        >
          Saved
        </span>
      </div>

      {type === "created" ? <Gallery userId={data._id} /> : <Gallery userId={data._id} saved={true} />}
    </div>
  );
}

export default UserProfilePage;
