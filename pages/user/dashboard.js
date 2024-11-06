import axios from "axios";
import { toast } from "react-toastify";
import UserRoute from "../../components/routes/UserRoute";
import CreateOrUpdatePostForm from "../../components/forms/CreateOrUpdatePostForm";
import { useContext, useState, useEffect } from "react";
import { UserContext } from "../../context";
import PostList from "../../components/cards/PostList";
import { Pagination } from "antd";
import Link from "next/link";
import Users from "../../components/cards/Users";
import io from "socket.io-client";

const socket = io(process.env.NEXT_PUBLIC_SOCKETIO, {
  path: "/socket.io",
  reconnection: true,
});

const Dashboard = () => {
  const [state, setState] = useContext(UserContext);
  const [content, setContent] = useState({});
  const [image, setImage] = useState({});
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [postsCount, setPostsCount] = useState(0);
  const [search, setSearch] = useState("");
  const [searchedUsers, setSearchedUsers] = useState([]);

  useEffect(() => {
    state && state.token && newsfeed();
    state && state.token && findUsers();
  }, [state && state.token, state && state.user, page]);

  // useEffect(() => {
  //   search && searchUsers();
  // }, [search]);

  const newsfeed = async () => {
    try {
      const { data } = await axios.get(`/newsfeed?page=${page}`);
      if (data.error) {
        toast.error(data.error);
      }
      setPostsCount(data.postsCount);
      setPageSize(data.pageSize);
      setPosts(data.posts);
    } catch (err) {
      console.log(err);
    }
  };

  const findUsers = async () => {
    try {
      const { data } = await axios.get("/find-users");
      setUsers(data);
    } catch (err) {
      console.log(err);
    }
  };

  const loadImageUrl = (user) => {
    return user.image && user.image.url
      ? user.image.url
      : "/images/default.jpg";
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

  const createPost = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post("/create-post", {
        content,
        image,
      });
      if (data.error) {
        toast.error(data.error);
      } else {
        newsfeed();
        toast.success("Post created successfully");
        setContent("");
        setImage({});
        socket.emit("new-post", data);
      }
    } catch (error) {
      toast.error("Post could not be created");
    }
  };

  const handleFollow = async (user) => {
    try {
      const { data } = await axios.put("/follow-user", { _id: user._id });
      if (data.error) {
        toast.error(data.error);
        return;
      }
      //update localhost: user->data, token -> unchanged
      const auth = window && JSON.parse(window.localStorage.getItem("auth"));
      auth.user = data;
      window && window.localStorage.setItem("auth", JSON.stringify(auth));

      //update context
      setState({ ...state, user: data });

      //update the followerble user's on the sidebar
      const filtered = users.filter((p) => p._id !== user._id);
      setUsers(filtered);
      setSearchedUsers([]);
      setSearch("");
      newsfeed();
      toast.success(`You're following ${user.username}`);
    } catch (err) {
      console.log(err);
    }
  };

  const handleUnFollow = async (user) => {
    try {
      const { data } = await axios.put("/unfollow-user", { _id: user._id });

      //update localhost: user->data, token -> unchanged
      const auth = JSON.parse(window.localStorage.getItem("auth"));
      auth.user = data;
      window.localStorage.setItem("auth", JSON.stringify(auth));

      //update context
      setState({ ...state, user: data });

      //update the followerble user's on the sidebar
      const filtered = users.filter((p) => p._id !== user._id);
      setUsers(filtered);
      setSearchedUsers([]);
      toast.success(`You have unfollowed ${user.username}`);
    } catch (err) {
      console.log(err);
    }
  };

  const searchUsers = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.get(`/search-users?q=${search}`);
      if (!data) {
        toast.error("No User matching the search input provided");
        return;
      }
      setSearchedUsers(data);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <UserRoute>
      <div className="container-fluid">
        <div className="row bg-default-image">
          <div className="col py-5 mb-2 text-light text-center">
            <h1 className="">Newsfeed</h1>
          </div>
        </div>
        <div className="row">
          <div className="col-md-8">
            <CreateOrUpdatePostForm
              content={content}
              setContent={setContent}
              loading={loading}
              setLoading={setLoading}
              uploading={uploading}
              setUploading={setUploading}
              image={image}
              createPost={createPost}
              handleImageUpload={handleImageUpload}
            />
            <PostList posts={posts} newsfeed={newsfeed} />
            <Pagination
              current={page}
              total={postsCount}
              pageSize={pageSize}
              onChange={(value) => setPage(value)}
              className="mb-2"
            />
          </div>
          <div className="col-md-4 mt-3">
            <div className="row">
              <form
                className="d-flex align-items-center col-12"
                onSubmit={searchUsers}
              >
                <input
                  type="search"
                  placeholder="Type here to search..."
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setSearchedUsers([]);
                  }}
                  className="w-100 h-100"
                  style={{
                    padding: "0 1rem 0 1rem",
                    fontSize: "1rem",
                    borderRadius: "25px",
                  }}
                />
                <button
                  style={{ marginLeft: "0.5rem" }}
                  type="submit"
                  className="btn btn-primary "
                >
                  Search
                </button>
              </form>
            </div>
            {searchedUsers && searchedUsers.length > 0 && (
              <Users
                users={searchedUsers}
                handleFollow={handleFollow}
                loadImageUrl={loadImageUrl}
                handleUnFollow={handleUnFollow}
              />
            )}
            <div
              className="d-flex justify-content-around align-items-center mt-5 py-3"
              style={{ border: "1px solid black", borderStyle: "dashed" }}
            >
              <div
                className="text-secondary"
                style={{
                  fontWeight: "bold",
                  fontSize: "1rem",
                  marginRight: "0.2rem",
                }}
              >
                You have:
              </div>
              <Link href="/user/following" style={{ textDecoration: "none" }}>
                <div
                  className="text-primary"
                  style={{
                    fontWeight: "bold",
                    fontSize: "1rem",
                    marginRight: "0.2rem",
                  }}
                >
                  {state &&
                    state.user &&
                    state.user.following &&
                    state.user.following.length}{" "}
                  following
                </div>
              </Link>
              <Link href="/user/followers" style={{ textDecoration: "none" }}>
                <div
                  className="text-primary"
                  style={{ fontWeight: "bold", fontSize: "1rem" }}
                >
                  {state &&
                    state.user &&
                    state.user.followers &&
                    state.user.followers.length}{" "}
                  followers
                </div>
              </Link>
            </div>
            <div
              className="mt-3 text-secondary"
              style={{ fontWeight: "bold", fontSize: "1.2rem" }}
            >
              People you may know
            </div>
            <Users
              users={users}
              handleFollow={handleFollow}
              loadImageUrl={loadImageUrl}
            />
          </div>
        </div>
      </div>
    </UserRoute>
  );
};

export default Dashboard;
