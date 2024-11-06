const ParralaxBG = ({
  url = "/images/default.jpg",
  children = "ReseauxSociaux",
}) => {
  return (
    <div
      className="container-fluid"
      style={{
        backgroundImage: "url(" + url + ")",
        backgroundAttachment: "fixed",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundPosition: "center center",
        padding: "75px 0 75px 0",
      }}
    >
      <h1
        className="text-center display-1 py-5 text-light"
        style={{ fontWeight: "bold" }}
      >
        {children}
      </h1>
    </div>
  );
};

export default ParralaxBG;
