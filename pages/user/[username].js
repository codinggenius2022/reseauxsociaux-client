import { Avatar } from "antd";
import axios from "axios";
import moment from "moment";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const UserProfile = () => {
  const [user, setUser] = useState({});
  const router = useRouter();
  const username = router.query.username;
  const defaultImage = "/images/default.jpg";

  useEffect(() => {
    username && fetchUser();
  }, [username]);
  const fetchUser = async () => {
    try {
      const { data } = await axios.get(`/user-profile/${username}`);
      if (data.error) {
        toast.error("User could not be found");
      }
      setUser(data);
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <>
      {user && (
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-6 offset-md-3">
              <div className="card mt-5">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-center">
                    <div className="d-flex align-items-center">
                      <Avatar
                        src={(user.image && user.image.url) || defaultImage}
                        size={50}
                      />
                      <h5 className="card-title text-info mx-2">
                        {user && user.username}
                      </h5>
                    </div>
                    <h6>joined {moment(user.createdAt).fromNow()}</h6>
                  </div>
                  <p className="card-text">{user.about}</p>
                  <div className="d-flex justify-content-around">
                    <Link
                      className="btn btn-primary"
                      href={`/user/following/${user.username}`}
                    >
                      {user.following && user.following.length} following
                    </Link>
                    <Link
                      className="btn btn-primary"
                      href={`/user/followers/${user.username}`}
                    >
                      {user.followers && user.followers.length} followers
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default UserProfile;
