const PostImage = ({ post }) => {
  return (
    <>
      {post && post.image && (
        <div
          style={{
            backgroundImage: `url(${post.image.url})`,
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center center",
            backgroundSize: "cover",
            height: "300px",
            marginBottom: "1rem",
            borderRadius: "5px 5px 5px 5px",
          }}
        ></div>
      )}
    </>
  );
};

export default PostImage;
