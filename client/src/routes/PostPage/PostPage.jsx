import "./PostPage.css";
import Image from "../../components/Image/Image";
import PostInteraction from "../../components/PostInteraction/PostInteraction";
import Comment from "../../components/Comment/Comment";
import { Link, useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import apiRequest from "../../utils/apiRequest";
function PostPage() {

  const {id} = useParams();
  const {isPending, error, data} = useQuery({
    queryKey: ["Pin", id],
    queryFn: () => apiRequest.get(`/pins/${id}`).then((res) => res.data)
  });

  if(isPending) return "Loading..."
  if(error) return "An error has occurred : " + error.message
  if(!data) return "Pin Not found!"

  return (
    <div className="postPage">
      <Link to="/">
        <div className="backButton">
          <svg
            height="20"
            viewBox="0 0 24 24"
            width="20"
            style={{ cursor: "pointer" }}
          >
            <path
              fill="#fff"
              d="M8.41 4.59a2 2 0 1 1 2.83 2.82L8.66 10H21a2 2 0 0 1 0 4H8.66l2.58 2.59a2 2 0 1 1-2.82 2.82L1 12z"
            ></path>
          </svg>
        </div>
      </Link>

      <div className="postContainer">
        <div className="postImage">
          <Image path={data.media} alt="" w={736} />
        </div>

        <div className="postDetails">
          <PostInteraction postId={id} />
          <Link to={`/${data.user.userName}`} className="postUser">
            <Image path={data.user.img || "general/noAvatar.png"} />
            <span>{data.user.displayName}</span>
          </Link>
          <Comment id={data._id} />
        </div>
      </div>
    </div>
  );
}

export default PostPage;
