import { Avatar, List } from "antd";
import { useState, useContext } from "react";
import { UserContext } from "../../context";
import Link from "next/link";

const Users = ({ users, loadImageUrl, handleFollow, handleUnFollow }) => {
  const [state] = useContext(UserContext);
  return (
    <List
      dataSource={users}
      renderItem={(user) => (
        <List.Item key={user.email}>
          <List.Item.Meta
            avatar={<Avatar src={loadImageUrl(user)} size={40} />}
            // title={<a href="https://ant.design">{item.name.last}</a>}
            title={
              <Link
                style={{ textDecoration: "none" }}
                href={`/user/${user.username}`}
              >
                {user.name}
              </Link>
            }
            description={user.about}
          />
          {state &&
          state.user &&
          state.user.following &&
          state.user.following.includes(user._id) ? (
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
  );
};

export default Users;
