import { useMutation, useQueryClient } from "@tanstack/react-query";
import apiRequest from "../../utils/apiRequest";

const followUser = async (userName) => {
  const res = await apiRequest.post(`/users/follow/${userName}`);
  return res.data;
};

const FollowButton = ({ isFollowing, userName }) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: followUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile", userName] });
    },
  });

  return (
    <button
      onClick={() => mutation.mutate(userName)}
      disabled={mutation.isPending}
    >
      {isFollowing ? "Unfollow" : "Follow"}
    </button>
  );
};

export default FollowButton;