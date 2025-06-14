import "./CreatePage.css";
import Image from "../../components/Image/Image";
import useAuthStore from "../../utils/authStore";
import { useNavigate } from "react-router";
import { useEffect, useRef, useState } from "react";
import apiRequest from "../../utils/apiRequest.js";

function CreatePage() {
  const { currentUser } = useAuthStore();
  const [file, setFile] = useState(null);
  const [isPublishing, setIsPublishing] = useState(false); // NEW

  const navigate = useNavigate();
  const fromRef = useRef();

  useEffect(() => {
    if (!currentUser) {
      navigate("/auth");
    }
  }, [navigate, currentUser]);

  const previewImgURL = file ? URL.createObjectURL(file) : null;

  const handleRemoveImage = () => {
    if (previewImgURL) {
      URL.revokeObjectURL(previewImgURL);
    }
    setFile(null);
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      // Revoke previous URL if exists
      if (previewImgURL) {
        URL.revokeObjectURL(previewImgURL);
      }
      setFile(selectedFile);
    }
  };

  // Clean up object URLs when component unmounts
  useEffect(() => {
    return () => {
      if (previewImgURL) {
        URL.revokeObjectURL(previewImgURL);
      }
    };
  }, [previewImgURL]);

  const handleSubmit = async () => {
    if (isPublishing) return; // prevent double clicks
    setIsPublishing(true);

    const fromData = new FormData(fromRef.current);
    fromData.append("media", file);

    try {
      const res = await apiRequest.post("/pins", fromData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      navigate(`/pin/${res.data._id}`);
      console.log(res);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="createPage">
      <div className="createTop">
        <h1>Create Pin</h1>
        <button onClick={handleSubmit} disabled={isPublishing}>
          {isPublishing ? "Publishing..." : "Publish"}
        </button>
      </div>

      <div className="createBottom">
        {previewImgURL ? (
          <div className="preview">
            <img src={previewImgURL} alt="Preview" />
            <button className="removeImageBtn" onClick={handleRemoveImage}>
              <p className="removeIcon"> X </p>
            </button>
          </div>
        ) : (
          <>
            <label htmlFor="file" className="upload">
              <div className="uploadTitle">
                <Image className="imageIcon" path="/general/upload.svg" />
              </div>
              <div className="uploadInfo">
                we recommend using high quality .jpg files less than 200MB.
              </div>
            </label>
            <input
              type="file"
              id="file"
              hidden
              onChange={handleFileChange}
              accept="image/*"
            />
          </>
        )}

        <form className="createForm" ref={fromRef}>
          <div className="createFormItem">
            <label htmlFor="title">Title</label>
            <input
              type="text"
              placeholder="Add a Title"
              name="title"
              id="title"
            />
          </div>

          <div className="createFormItem">
            <label htmlFor="description">Description</label>
            <textarea
              rows={5}
              type="text"
              placeholder="Add a detailed description"
              name="description"
              id="description"
            />
          </div>

          <div className="createFormItem">
            <label htmlFor="link">Link</label>
            <input type="text" placeholder="Add a Link" name="link" id="link" />
          </div>

          <div className="createFormItem">
            <label htmlFor="description">Tags</label>
            <input type="text" placeholder="Add Tags" name="tags" id="tags" />
            <small>Don&apos;t Worry, people won&apos;t see your tags</small>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreatePage;
