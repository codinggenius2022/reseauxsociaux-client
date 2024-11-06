import { useState, useContext, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Avatar, Modal } from "antd";
import AuthForm from "../../../components/forms/AuthForm";
import { UserContext } from "../../../context";
import { useRouter } from "next/router";
import { CameraOutlined, LoadingOutlined } from "@ant-design/icons";

const ProfileUpdate = () => {
  const [username, setUsername] = useState("");
  const [about, setAbout] = useState("");
  const [image, setImage] = useState({});
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [secret, setSecret] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [state, setState] = useContext(UserContext);
  const router = useRouter();

  useEffect(() => {
    setUsername(state && state.user.username);
    setAbout(state && state.user.about);
    setName(state && state.user.name);
    setEmail(state && state.user.email);
    setImage(state && state.user.image);
  }, [state && state.token]);

  const handleOnCancel = (e) => {
    setSuccess(false);
    router.push("/user/profile/update");
  };

  const uploadImage = async (e) => {
    const file = e.target.files[0];
    if (!file) {
      return;
    }
    const formData = new FormData();
    formData.append("image", file);
    setUploading(true);
    try {
      const { data } = await axios.post("/image-upload", formData);
      if (data.error) {
        toast.error("Image could not be uploaded");
      }
      setUploading(false);
      setImage(data);
    } catch (err) {
      setUploading(false);
      console.log(err);
      toast.error("Image upload failed");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axios.put(`/profile-update`, {
        username,
        about,
        name,
        email,
        password,
        secret,
        image,
      });
      if (data.error) {
        toast.error(data.error);
        setLoading(false);
      } else {
        const auth = JSON.parse(window.localStorage.getItem("auth"));
        auth.user = data.updatedUser;
        window.localStorage.setItem("auth", JSON.stringify(auth));
        setState({ ...state, user: data.updatedUser });
        setSuccess(data.success);
        setLoading(false);
      }
    } catch (error) {
      error.response && toast.error(error.response.data);
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid">
      <div className="row bg-default-image">
        <div className="col py-5 mb-2 text-light text-center">
          <h1 className="">Profile</h1>
        </div>
      </div>
      {success && (
        <Modal
          title="Congratulations"
          open={success}
          footer={null}
          onCancel={handleOnCancel}
        >
          <p style={{ color: "green" }}>
            You have updated your profile successfully!
          </p>
        </Modal>
      )}

      <div className="row form-group">
        <div className="col-md-6 offset-md-3">
          <label className="mt-2">
            {image && image.url ? (
              <Avatar src={image.url} size={50} style={{ cursor: "pointer" }} />
            ) : uploading ? (
              <LoadingOutlined spin style={{ cursor: "pointer" }} />
            ) : (
              <Avatar size={50} style={{ cursor: "pointer" }}>
                <CameraOutlined className="text-primary" />
              </Avatar>
            )}
            <input
              onChange={uploadImage}
              type="file"
              accept="images/*"
              hidden
            />
          </label>
        </div>
      </div>

      <div className="row ">
        <div className="col-md-6 offset-md-3">
          <AuthForm
            username={username}
            setUsername={setUsername}
            about={about}
            setAbout={setAbout}
            name={name}
            setName={setName}
            email={email}
            setEmail={setEmail}
            password={password}
            setPassword={setPassword}
            secret={secret}
            setSecret={setSecret}
            handleSubmit={handleSubmit}
            loading={loading}
            profileUpdate={true}
          />
        </div>
      </div>
    </div>
  );
};

export default ProfileUpdate;
