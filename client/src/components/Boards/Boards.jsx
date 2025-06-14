import "./Boards.css";
import Image from "../Image/Image";
import { useQuery } from "@tanstack/react-query";
import apiRequest from "../../utils/apiRequest";
import { Link } from "react-router";
import { format } from "timeago.js";
function Boards({ userId }) {
  const { isPending, error, data } = useQuery({
    queryKey: ["collection", userId],
    queryFn: () => apiRequest.get(`/boards/${userId}`).then((res) => res.data),
  });

  if (isPending) return "Loading...";
  if (error) return "An error has occurred : " + error.message;
  if (!data) return "User Not found!";

  return (
    <div className="collections">
      {data?.map((board) => (
        <Link to={`/search?boardId=${board._id}`} key={board._id} className="collection">
          <Image src={board.firstPin?.media || "default/path.png"} />
          <div className="collectionInfo">
            <h1>{board.title}</h1>
            <span>
              {board.pinCount} Pins ·{" "}
              {format(board.createdAt)}
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
}

export default Boards;
