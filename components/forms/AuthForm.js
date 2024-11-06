import { LoadingOutlined } from "@ant-design/icons";
import ProfileUpdate from "../../pages/user/profile/update";
// import dynamic from "next/dynamic";
// const { LoadingOutlined } = dynamic(() => import("@ant-design/icons"), {
//   ssr: false,
// });
const AuthForm = ({
  username,
  setUsername,
  about,
  setAbout,
  name,
  setName,
  email,
  setEmail,
  password,
  setPassword,
  secret,
  setSecret,
  handleSubmit,
  loading,
  page,
  profileUpdate,
}) => {
  return (
    <form onSubmit={handleSubmit}>
      {profileUpdate && (
        <div className="form-group p-2">
          <small>
            <label className="text-muted">Username</label>
          </small>
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            type="text"
            className="form-control"
            placeholder="Enter Username"
          />
        </div>
      )}
      {profileUpdate && (
        <div className="form-group p-2">
          <small>
            <label className="text-muted">About</label>
          </small>
          <textarea
            value={about}
            onChange={(e) => setAbout(e.target.value)}
            className="form-control"
            placeholder="Write something interesting about yourself..."
          ></textarea>
        </div>
      )}
      {page !== "login" && (
        <div className="form-group p-2">
          <small>
            <label className="text-muted">Name</label>
          </small>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            type="text"
            className="form-control"
            placeholder="Enter name"
          />
        </div>
      )}
      <div className="form-group p-2">
        <small>
          <label className="text-muted">Email</label>
        </small>
        <input
          disabled={profileUpdate}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          className="form-control"
          placeholder="Enter email"
        />
      </div>
      <div className="form-group p-2">
        <small>
          <label className="text-muted">Password</label>
        </small>
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          className="form-control"
          placeholder="Enter password"
        />
      </div>
      {page !== "login" && (
        <div className="form-group p-2">
          <small>
            <label className="text-muted">Pick a question</label>
          </small>
          <select className="form-control">
            <option>Which city were you born?</option>
            <option>What is the name of your first girl friend?</option>
            <option>What is your mother's maiden name?</option>
          </select>
          <small>
            <label className="text-muted">
              This will help you retrieve your account if you forget your
              credentials
            </label>
          </small>
        </div>
      )}
      {page !== "login" && (
        <div className="form-group p-2">
          <input
            value={secret}
            onChange={(e) => setSecret(e.target.value)}
            type="text"
            className="form-control"
            placeholder="Enter your answer"
          />
        </div>
      )}
      <div className="form-group p-2">
        <button
          disabled={
            profileUpdate
              ? !username || !name
              : page === "login"
              ? !email || !password
              : !name || !email || !password || !secret
          }
          className="btn btn-primary col-12"
        >
          {loading ? <LoadingOutlined className="py-1" /> : "Submit"}
        </button>
      </div>
    </form>
  );
};

export default AuthForm;
