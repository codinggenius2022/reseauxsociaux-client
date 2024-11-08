import axios from "axios";
import ParralaxBG from "../components/ParralaxBG";
import Post from "../components/cards/Post";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import io from "socket.io-client";

const socket = io(process.env.NEXT_PUBLIC_SOCKETIO, {
  path: "/socket.io",
  reconnection: true,
});
const Home = ({ serverSidePosts, error }) => {
  const [posts, setPosts] = useState([]);
  const [comment, setComment] = useState("");
  const [visible, setVisible] = useState(false);
  const [currentPost, setCurrentPost] = useState({});

  const router = useRouter();

  useEffect(() => {
    socket.on("new-post-data", (newPost) => {
      posts && newPost && setPosts([newPost, ...posts]);
    });
  }, []);

  const newsfeedHome = async () => {
    try {
      const { data } = await axios.get("/posts");
      console.log("data in newsfeedhome", data);
      if (data.error) {
        toast.error(data.error);
      }
      setPosts([data, ...posts]);
    } catch (err) {
      console.log(err);
    }
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
        newsfeedHome();
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
      newsfeedHome();
    } catch (err) {
      console.log(err);
    }
  };

  const handleUnlike = async (_id) => {
    try {
      const { data } = await axios.put("/unlike-post", { _id });
      newsfeedHome();
    } catch (err) {
      console.log(err);
    }
  };

  const handleComment = (post) => {
    setVisible(true);
    setCurrentPost(post);
  };

  const collection = posts.length > 0 ? posts : serverSidePosts;

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <>
      <ParralaxBG url="/images/default.jpg" />
      <div className="row mt-5 mx-2">
        {collection &&
          collection.map((post) => (
            <div key={post._id} className="col-md-4">
              <Link
                href={`/post/view/${post._id}`}
                style={{ textDecoration: "none" }}
              >
                <Post
                  post={post}
                  loadImageUrl={loadImageUrl}
                  handleComment={handleComment}
                  handleLike={handleLike}
                  handleUnlike={handleUnlike}
                  handleDelete={handleDelete}
                  page="/home"
                  comment={comment}
                  setComment={setComment}
                  visible={visible}
                  setVisible={setVisible}
                />
              </Link>
            </div>
          ))}
      </div>
    </>
  );
};

export async function getServerSideProps() {
  try {
    const response = await axios.get(
      "https://reseauxsociaux-server.onrender.com/api/posts"
    );

    // Log entire response for debugging
    console.log("API Response:", response);

    return {
      props: {
        serverSidePosts: response.data || [], // Ensure data fallback in case response.data is missing
      },
    };
  } catch (err) {
    // Detailed error logging
    console.error("Error fetching data:", err.message);
    console.error("Full error:", err);

    return {
      props: {
        serverSidePosts: [], // Fallback to empty array
        error: err.response ? err.response.data : "An unknown error occurred.", // Provide a fallback error message
      },
    };
  }
}

export default Home;
