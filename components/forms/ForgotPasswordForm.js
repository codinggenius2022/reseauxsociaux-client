import { LoadingOutlined } from "@ant-design/icons";
const ForgotPasswordForm = ({
  email,
  setEmail,
  newPassword,
  setNewPassword,
  secret,
  setSecret,
  handleSubmit,
  loading,
}) => {
  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group p-2">
        <small>
          <label className="text-muted">Email</label>
        </small>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          className="form-control"
          placeholder="Enter email"
        />
      </div>
      <div className="form-group p-2">
        <small>
          <label className="text-muted">New Password</label>
        </small>
        <input
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          type="password"
          className="form-control"
          placeholder="Enter new password"
        />
      </div>
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
            The question should be same as what you selected when registering
            the account
          </label>
        </small>
      </div>
      <div className="form-group p-2">
        <input
          value={secret}
          onChange={(e) => setSecret(e.target.value)}
          type="text"
          className="form-control"
          placeholder="Enter your answer"
        />
      </div>
      <div className="form-group p-2">
        <button
          disabled={!email || !newPassword || !secret || loading}
          className="btn btn-primary col-12"
        >
          {loading ? <LoadingOutlined className="py-1" /> : "Submit"}
        </button>
      </div>
    </form>
  );
};

export default ForgotPasswordForm;
