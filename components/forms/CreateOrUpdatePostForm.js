import "react-quill/dist/quill.snow.css";
import dynamic from "next/dynamic";
const ReactQuill = dynamic(() => import("react-quill"), {
  ssr: false,
});

import { CameraOutlined } from "@ant-design/icons";
import { Avatar } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

const CreateOrUpdatePostForm = ({
  content,
  setContent,
  image,
  uploading,
  createPost,
  updatePost,
  handleImageUpload,
  page,
}) => {
  return (
    <div className="card my-3">
      <div className="card-body">
        <form className="form-group">
          <ReactQuill
            theme="snow"
            value={Object.keys(content).length > 0 ? content : ""}
            onChange={(e) => setContent(e)}
            className="form-control"
            placeholder="Write something..."
          />
        </form>
      </div>
      <div className="card-footer d-flex justify-content-between">
        <button
          disabled={Object.keys(content).length <= 0}
          onClick={page === "update" ? updatePost : createPost}
          className="btn btn-primary btn-sm"
          style={{ cursor: "pointer" }}
        >
          Post
        </button>
        <label className="">
          {Object.keys(image).length > 0 && image.url ? (
            <Avatar src={image.url} size={30} />
          ) : uploading ? (
            <LoadingOutlined spin />
          ) : (
            <CameraOutlined style={{ cursor: "pointer" }} />
          )}
          <input
            onChange={handleImageUpload}
            type="file"
            accept="images/*"
            hidden
          />
        </label>
      </div>
    </div>
  );
};

export default CreateOrUpdatePostForm;
