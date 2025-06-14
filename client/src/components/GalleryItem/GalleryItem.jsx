import "./GalleryItem.css";
import { Link } from "react-router";
import Image from "../Image/Image";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import apiRequest from "../../utils/apiRequest";

function GalleryItem({ item }) {
  const queryClient = useQueryClient();

  // Check if item is already saved
  const { data, isPending, error } = useQuery({
    queryKey: ["interactionCheck", item._id],
    queryFn: () =>
      apiRequest.get(`/pins/interaction-check/${item._id}`).then((res) => res.data),
  });

  const saveMutation = useMutation({
    mutationFn: () => apiRequest.post(`/pins/interact/${item._id}`, { type: "save" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["interactionCheck", item._id] });
      queryClient.invalidateQueries(["profile"]); // Optional, if profile needs refresh
    },
    onError: (err) => {
      alert("Error saving pin: " + err.response?.data?.message || err.message);
    }
  });

  const optimalHeight = (400 * item.height) / item.width;

  return (
    <div className="galleryItem">
      <Image path={item.media} alt="" w={400} h={optimalHeight} />

      <Link to={`/pin/${item._id}`} className="overLay" />

      <button
        className="saveButton"
        onClick={(e) => {
          e.preventDefault();
          saveMutation.mutate();
        }}
        disabled={saveMutation.isLoading}
      >
        {saveMutation.isLoading
          ? "Saving..."
          : data?.isSaved
          ? "Saved"
          : "Save"}
      </button>

      <div className="overLayIcons">
        <button>
          <Image path="/general/share.svg" alt="" />
        </button>
        <button>
          <Image path="/general/more.svg" alt="" />
        </button>
      </div>
    </div>
  );
}

export default GalleryItem;
