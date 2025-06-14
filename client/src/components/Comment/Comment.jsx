import "./Comment.css";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import apiRequest from "../../utils/apiRequest";
import { SingleComment } from "./SingleComment";
import CommentForm from "./CommentForm";

function Comment({ id }) {

  const { isPending, error, data } = useQuery({
    queryKey: ["comments", id],
    queryFn: () => apiRequest.get(`/comments/${id}`).then((res) => res.data),
  });

  if (isPending) return "Loading...";
  if (error) return "An error has occurred : " + error.message;
  if (!data) return "Pin Not found!";

  return (
    <div className="comment">
      <div className="commentList">
        <span className="commentCount">{data.length === 0 ? "NO Comments" : data.length+" Comments"}</span>

        {data.map((comment) => (
          <SingleComment key={comment._id} comment={comment}/>
        ))}
      </div>

     <CommentForm id={id}/>
    </div>
  );
}

export default Comment;
