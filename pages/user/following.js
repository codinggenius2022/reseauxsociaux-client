import axios from "axios";
import { useEffect, useState, useContext } from "react";
import { UserContext } from "../../context";
import { Avatar, List } from "antd";
import { toast } from "react-toastify";
import { RollbackOutlined } from "@ant-design/icons";
import Link from "next/link";

const Following = () => {
  const [following, setFollowing] = useState([]);
  const [state, setState] = useContext(UserContext);

  useEffect(() => {
    state && state.token && fetchFollowing();
  }, [state && state.token]);

  const fetchFollowing = async () => {
    try {
      const { data } = await axios.get("/following");
      setFollowing(data);
    } catch (err) {
      console.log(err);
    }
  };

  const loadImageUrl = (user) => {
    return user.image && user.image.url
      ? user.image.url
      : "/images/default.jpg";
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
      const filtered = following.filter((p) => p._id !== user._id);
      setFollowing(filtered);
      toast.success(`You have unfollowed ${user.username}`);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="row">
      <div className="col-md-8 offset-md-2">
        <div className="text-primary text-center h4 mt-3">
          <Link href="/user/dashboard" style={{ marginRight: "3rem" }}>
            <RollbackOutlined />
          </Link>
          You follow the below{" "}
          {state &&
            state.user &&
            state.user.following &&
            state.user.following.length}{" "}
          user(s)
        </div>
        <List
          dataSource={following}
          renderItem={(user) => (
            <List.Item key={user.email}>
              <List.Item.Meta
                avatar={<Avatar src={loadImageUrl(user)} size={50} />}
                // title={<a href="https://ant.design">{item.name.last}</a>}
                title={user.username}
                description={user.about}
              />
              <div
                onClick={() => handleUnFollow(user)}
                className="text-primary"
                style={{ cursor: "pointer" }}
              >
                Unfollow
              </div>
            </List.Item>
          )}
        />
      </div>
    </div>
  );
};

export default Following;
