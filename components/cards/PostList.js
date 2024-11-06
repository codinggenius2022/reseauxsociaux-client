import { useContext, useState } from "react";
import { UserContext } from "../../context";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import axios from "axios";
import Post from "./Post";

const PostList = ({ posts, newsfeed }) => {
  const [state, setState] = useContext(UserContext);
  const [comment, setComment] = useState("");
  const [visible, setVisible] = useState(false);
  const [currentPost, setCurrentPost] = useState({});

  const router = useRouter();

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
        newsfeed();
        toast.success(data.success);
      }
    } catch (err) {
      console.log(err);
      toast.error("Post deletion unsuccessful");
    }
  };

  const loadImageUrl = (post) => {
    if (
      post &&
      post.postedBy &&
      post.postedBy.image &&
      post.postedBy.image.url
    ) {
      return post.postedBy.image.url;
    } else {
      return "/images/default.jpg";
    }
  };

  const handleLike = async (_id) => {
    try {
      const { data } = await axios.put("/like-post", { _id });
      newsfeed();
    } catch (err) {
      console.log(err);
    }
  };

  const handleUnlike = async (_id) => {
    try {
      const { data } = await axios.put("/unlike-post", { _id });
      newsfeed();
    } catch (err) {
      console.log(err);
    }
  };

  const handleComment = (post) => {
    setVisible(true);
    setCurrentPost(post);
  };

  const addComment = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.put("/add-comment", {
        postId: currentPost._id,
        comment,
      });
      if (!data) {
        toast.error("Comment could not be added");
      }
      setComment("");
      setVisible(false);
      newsfeed();
      toast.success("Comment added successfully");
    } catch (err) {
      console.log(err);
    }
  };

  const removeComment = async () => {
    try {
      const { data } = await axios.put("/remove-comment", {
        postId: currentPost._id,
      });
      if (!data) {
        toast.error("Comment deletion unsuccessful");
      }
      newsfeed();
      toast.success("Comment successfully deleted");
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <>
      {posts &&
        posts.map((post) => (
          <Post
            key={post._id}
            post={post}
            loadImageUrl={loadImageUrl}
            handleComment={handleComment}
            addComment={addComment}
            handleLike={handleLike}
            handleUnlike={handleUnlike}
            handleDelete={handleDelete}
            comment={comment}
            setComment={setComment}
            visible={visible}
            setVisible={setVisible}
          />
        ))}
    </>
  );
};

export default PostList;
