import Image from "../Image/Image";
import { format } from "timeago.js";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import apiRequest from "../../utils/apiRequest";
// import { useAuth } from "../../context/AuthContext"; // Assuming you have a user context

export const SingleComment = ({ comment }) => {
  const queryClient = useQueryClient();
  // const { currentUser } = useAuth(); // adjust this according to your context

  const deleteMutation = useMutation({
    mutationFn: () => apiRequest.delete(`/comments/${comment._id}`),
    onSuccess: () => {
      queryClient.invalidateQueries(["comments", comment.pin]); // refetch comments
    },
    onError: (err) => {
      alert("Failed to delete comment: " + err.response?.data?.message || err.message);
    }
  });

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this comment?")) {
      deleteMutation.mutate();
    }
  };

  return (
    <div className="commentItem">
      <Image path={comment.user.img || "/general/noAvatar.png"} alt="" />
      <div className="commentContent">
        <span className="commentUserName">{comment.user.displayName}</span>
        <p className="commentText">{comment.description}</p>
        <span className="CommentTime">{format(comment.createdAt)}</span>

        {(
          <button className="deleteCommentBtn" onClick={handleDelete}>
            Delete
          </button>
        )}
      </div>
    </div>
  );
};
