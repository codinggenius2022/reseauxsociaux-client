import { Avatar, Modal } from "antd";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useContext, useState } from "react";
import { toast } from "react-toastify";
import PostImage from "../../components/images/PostImage";
import moment from "moment";
import {
  CommentOutlined,
  DeleteOutlined,
  EditOutlined,
  FullscreenOutlined,
  HeartFilled,
  HeartOutlined,
  RollbackOutlined,
} from "@ant-design/icons";
import { UserContext } from "../../context";
import Link from "next/link";
import parse from "html-react-parser";

const PostComment = () => {
  const [state, setState] = useContext(UserContext);
  const [post, setPost] = useState({});
  const [visible, setVisible] = useState(false);
  const [comment, setComment] = useState("");
  const router = useRouter();
  const _id = router.query._id;

  useEffect(() => {
    _id && fetchPost();
  }, [_id]);

  const fetchPost = async () => {
    try {
      const { data } = await axios.get(`/post/${_id}`);
      if (!data) {
        toast.error("Error fetching post");
      }
      setPost(data);
    } catch (err) {
      console.log(err);
    }
  };

  const loadImageUrl = (post) => {
    return post && post.image && post.image.url
      ? post.image.url
      : "/images/default.jpg";
  };

  const loadPostedByImage = (post) => {
    return post &&
      post.postedBy &&
      post.postedBy.image &&
      post.postedBy.image.url
      ? post.postedBy.image.url
      : "images/logo-no-background-1.png";
  };

  const loadCommentImageUrl = (c) => {
    return c && c.postedBy && c.postedBy.image && c.postedBy.image.url
      ? post.comments.postedBy.image.url
      : "/images/default.jpg";
  };

  const handleDelete = async (post) => {
    const answer = window.confirm("Are you sure you want to delete post?");
    if (!answer) {
      return;
    }
    try {
      const { data } = await axios.delete(`/delete-post/${post._id}`);
      if (data.error) {
        toast.error(data.error);
      } else {
        fetchPost();
        toast.success(data.success);
      }
    } catch (err) {
      console.log(err);
      toast.error("Post deletion unsuccessful");
    }
  };

  const handleLike = async (_id) => {
    try {
      const { data } = await axios.put("/like-post", { _id });
      fetchPost();
    } catch (err) {
      console.log(err);
    }
  };

  const handleUnlike = async (_id) => {
    try {
      const { data } = await axios.put("/unlike-post", { _id });
      fetchPost();
    } catch (err) {
      console.log(err);
    }
  };

  const handleComment = (post) => {
    setVisible(true);
  };

  const addComment = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.put("/add-comment", {
        postId: _id,
        comment,
      });
      console.log("result from addcomment ==>", data);
      if (!data) {
        toast.error("Comment could not be added");
      }
      setComment("");
      setVisible(false);
      fetchPost();
      toast.success("Comment added successfully");
    } catch (err) {
      console.log(err);
    }
  };

  const removeComment = async (commentId) => {
    try {
      const { data } = await axios.put(`/post/remove-comment/${commentId}`, {
        postId: _id,
      });
      if (!data) {
        toast.error("Comment deletion unsuccessful");
      }
      fetchPost();
      toast.success("Comment successfully deleted");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="container-fluid">
      <div className="row mt-3">
        <div className="col-md-8 offset-md-2">
          <div className="card mb-6">
            <Link
              href="/user/dashboard"
              style={{
                margin: "1rem 1rem 1rem 1rem",
                textDecoration: "none",
                fontSize: "1.5rem",
              }}
            >
              <RollbackOutlined /> Dashboard
            </Link>
            <div className="card-header">
              <Avatar src={loadPostedByImage(post)} size={60} />
              <span style={{ marginLeft: "1rem" }}>
                {"  "} {post && post.postedBy && post.postedBy.username}
              </span>
              <span style={{ marginLeft: "1rem" }}>
                {moment(post.createdAt).fromNow()}
              </span>
            </div>
            <div className="card-body">
              <PostImage post={post} />
              {post && post.content && parse(post.content)}
            </div>
            <div className="card-footer">
              <div className="d-flex justify-content-between">
                <div className="d-flex">
                  <div style={{ marginRight: "2rem" }}>
                    {post &&
                    post.likes &&
                    state &&
                    state.user &&
                    post.likes.includes(state.user._id) ? (
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
                    <CommentOutlined
                      onClick={() => handleComment(post)}
                      className="h5 text-danger"
                      style={{ marginRight: "5px", cursor: "pointer" }}
                    />{" "}
                    {post && post.comments && post.comments.length} comments
                  </div>
                </div>
                {state &&
                  state.user &&
                  post &&
                  post.postedBy &&
                  state.user._id === post.postedBy._id && (
                    <div>
                      <EditOutlined
                        onClick={() => router.push(`/user/post/${post._id}`)}
                        className="text-danger"
                        style={{ marginRight: "2rem", cursor: "pointer" }}
                      />
                      <DeleteOutlined
                        onClick={() => handleDelete(post)}
                        className="text-danger"
                        style={{ cursor: "pointer" }}
                      />
                    </div>
                  )}
              </div>
            </div>
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
            {post && post.comments && post.comments.length > 0 && (
              <div>
                <ul className="list-group">
                  {post.comments.map((c) => (
                    <li
                      key={c._id}
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
                            <div
                              style={{ fontWeight: "bold", fontSize: "0.8rem" }}
                            >
                              {c?.postedBy?.username}
                            </div>
                          </div>
                          <div className="badge badge-primary badge-pill text-muted">
                            {moment(c.created).fromNow()}
                          </div>
                        </div>
                        <div className="d-flex justify-content-between">
                          <div style={{ fontSize: "0.8rem" }}>{c.text}</div>
                          {state &&
                            state.user &&
                            state.user._id &&
                            state.user._id === c.postedBy._id && (
                              <DeleteOutlined
                                className="text-danger"
                                onClick={() => removeComment(c._id)}
                              />
                            )}
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostComment;
