import axios from "axios";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import UserRoute from "../../../components/routes/UserRoute";
import CreateOrUpdatePostForm from "../../../components/forms/CreateOrUpdatePostForm";
import { useContext, useState, useEffect } from "react";
import { UserContext } from "../../../context";

const UpdatePost = () => {
  const [content, setContent] = useState({});
  const [image, setImage] = useState({});
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [post, setPost] = useState({});

  const router = useRouter();
  const _id = router.query._id;

  useEffect(() => {
    _id && fetchPost();
  }, [_id]);

  const fetchPost = async () => {
    try {
      const { data } = await axios.get(`/user-post/${_id}`);
      if (data.error) {
        toast.error(data.error);
      }
      setPost(data);
      setContent(data.content);
      data.image && setImage(data.image);
    } catch (err) {
      console.log(err);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("image", file);
    setUploading(true);
    try {
      const { data } = await axios.post("/image-upload", formData);
      if (data.error) {
        console.log(data.error);
      }
      setUploading(false);
      setImage(data);
    } catch (error) {
      setUploading(false);
      console.log("there was an error loading file to cloudinary");
      console.log(error);
    }
  };

  const updatePost = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.put(`/update-post/${_id}`, {
        content,
        image,
      });
      if (data.error) {
        toast.error(data.error);
      } else {
        toast.success("Post updated successfully");
        setContent("");
        setImage({});
        router.push("/user/dashboard");
      }
    } catch (error) {
      toast.error("Post could not be updated");
    }
  };
  return (
    <UserRoute>
      <div className="container-fluid">
        <div className="row bg-default-image">
          <div className="col py-5 mb-2 text-light text-center">
            <h1 className="">Update Post</h1>
          </div>
        </div>
        <div className="row">
          <div className="col-md-8 offset-md-2">
            <CreateOrUpdatePostForm
              content={content}
              setContent={setContent}
              loading={loading}
              setLoading={setLoading}
              uploading={uploading}
              setUploading={setUploading}
              image={image}
              updatePost={updatePost}
              handleImageUpload={handleImageUpload}
              page="update"
            />
          </div>
        </div>
      </div>
    </UserRoute>
  );
};

export default UpdatePost;
