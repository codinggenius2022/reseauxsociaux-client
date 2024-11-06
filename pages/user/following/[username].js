import axios from "axios";
import { useEffect, useState, useContext } from "react";
import { UserContext } from "../../../context";
import { Avatar, List } from "antd";
import { toast } from "react-toastify";
import { RollbackOutlined } from "@ant-design/icons";
import Link from "next/link";
import { useRouter } from "next/router";

const UserFollowing = () => {
  const [following, setFollowing] = useState([]);
  const [state, setState] = useContext(UserContext);

  const router = useRouter();

  const username = router.query.username;

  useEffect(() => {
    username && fetchFollowing();
  }, [username]);

  const fetchFollowing = async () => {
    try {
      const { data } = await axios.get(`/following/${username}`);
      setFollowing(data);
    } catch (err) {}
  };

  const loadImageUrl = (user) => {
    return user.image && user.image.url
      ? user.image.url
      : "/images/default.jpg";
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

      toast.success(`You have unfollowed ${user.username}`);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="row">
      <div className="col-md-8 offset-md-2">
        <div className="text-primary text-center h4 mt-3">
          <Link
            href="/user/dashboard"
            style={{ marginRight: "3rem", textDecoration: "none" }}
          >
            <RollbackOutlined /> Dashboard
          </Link>
          People {username && username} follows
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
              {state.user && state.user.following.includes(user._id) ? (
                <div
                  onClick={() => handleUnFollow(user)}
                  className="text-primary"
                  style={{ cursor: "pointer" }}
                >
                  Unfollow
                </div>
              ) : (
                <div
                  onClick={() => handleFollow(user)}
                  className="text-primary"
                  style={{ cursor: "pointer" }}
                >
                  Follow
                </div>
              )}
            </List.Item>
          )}
        />
      </div>
    </div>
  );
};

export default UserFollowing;
