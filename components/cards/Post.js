import moment from "moment";
import parse from "html-react-parser";
import { useContext } from "react";
import { UserContext } from "../../context";

import {
  CommentOutlined,
  DeleteOutlined,
  EditOutlined,
  HeartFilled,
  HeartOutlined,
} from "@ant-design/icons";
import PostImage from "../images/PostImage";
import { Avatar, Modal } from "antd";
import { useRouter } from "next/router";

const Post = ({
  post,
  loadImageUrl,
  addComment,
  handleComment,
  handleLike,
  handleUnlike,
  handleDelete,
  page,
  comment,
  setComment,
  visible,
  setVisible,
}) => {
  const [state, setState] = useContext(UserContext);
  const router = useRouter();
  return (
    <div key={post._id} className="card mb-5">
      <div className="card-header d-flex justify-content-between align-items-center">
        <div className="d-flex align-items-center">
          <Avatar src={loadImageUrl(post)} size={40} />
          <span style={{ marginLeft: "0.5rem" }}>
            {"  "} {post?.postedBy?.name}
          </span>
        </div>
        <span style={{ marginLeft: "1rem" }}>
          {moment(post?.createdAt).fromNow()}
        </span>
      </div>
      <div></div>
      <div className="card-body">
        <PostImage post={post} />
        {parse(post?.content)}
      </div>
      <div className="card-footer">
        <div className="d-flex justify-content-between">
          <div className="d-flex">
            <div style={{ marginRight: "2rem" }}>
              {post &&
              post.likes &&
              state &&
              state.user &&
              post.likes.includes(state?.user?._id) ? (
                <HeartFilled
                  onClick={() => handleUnlike(post._id)}
                  className="h5 text-danger"
                  style={{ marginRight: "5px", cursor: "pointer" }}
                />
              ) : (
                <HeartOutlined
                  onClick={() => handleLike(post._id)}
                  className="h5 text-danger"
                  style={{ marginRight: "5px", cursor: "pointer" }}
                />
              )}
              {post.likes && post.likes.length} likes
            </div>
            <div>
              {page !== "/home" && (
                <CommentOutlined
                  onClick={() => handleComment(post)}
                  className="h5 text-danger"
                  style={{ marginRight: "5px", cursor: "pointer" }}
                />
              )}{" "}
              <span
                onClick={() => router.push(`/post/${post._id}`)}
                style={{ cursor: "pointer" }}
              >
                {post && post.comments && post.comments.length} comments
              </span>
            </div>
          </div>
          {state && state.user && state.user._id === post?.postedBy?._id && (
            <div>
              {page !== "/home" && (
                <EditOutlined
                  onClick={() => router.push(`/user/post/${post._id}`)}
                  className="text-danger"
                  style={{ marginRight: "2rem", cursor: "pointer" }}
                />
              )}
              {page !== "/home" && (
                <DeleteOutlined
                  onClick={() => handleDelete(post)}
                  className="text-danger"
                  style={{ cursor: "pointer" }}
                />
              )}
            </div>
          )}
        </div>
      </div>
      {page !== "/home" && (
        <Modal
          open={visible}
          onCancel={() => setVisible(false)}
          footer={null}
          title={"Comment"}
        >
          <form>
            <textarea
              className="form-control"
              placeholder="Write comment here..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            ></textarea>
            <button
              onClick={addComment}
              className="btn btn-primary btn-sm btn-block mt-2"
              disabled={!comment}
            >
              Submit
            </button>
          </form>
        </Modal>
      )}
      {post && post.comments && post.comments.length > 0 && (
        <div>
          <h6 className="p-2">Comments</h6>
          <ul
            className="list-group"
            style={{
              overflow: "scroll",
              scrollbarWidth: "none",
              "&::webkitScrollbarThumb": {
                backgroundColor: "transparent",
                border: "none",
              },
              "&::webkitScrollbarTrack": {
                background: "none",
                border: "none",
              },
              "&::webkitScrollbar": {
                width: 0,
                height: 0,
              },
              width: "100%",
            }}
          >
            {post.comments.slice(0, 2).map((c, index) => (
              <li
                key={index}
                className="list-group-item d-flex justify-content-between align-items-start"
                style={{ width: "100%" }}
              >
                <div className="w-100">
                  <div className="d-flex justify-content-between mb-3">
                    <div className="d-flex">
                      <div
                        style={{
                          marginRight: "1rem",
                          width: "2rem",
                          height: "2rem",
                        }}
                      >
                        <Avatar size={40} src={c?.postedBy?.image?.url} />
                      </div>
                      <div style={{ fontWeight: "bold", fontSize: "0.8rem" }}>
                        {c?.postedBy?.username}
                      </div>
                    </div>
                    <div className="badge badge-primary badge-pill text-muted">
                      {moment(c.created).fromNow()}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: "0.8rem" }}>{c.text}</div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Post;
