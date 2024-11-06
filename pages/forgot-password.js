import { useState, useContext } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Modal } from "antd";
import ForgotPasswordForm from "../components/forms/ForgotPasswordForm";
import Link from "next/link";
import { UserContext } from "../context";
import { useRouter } from "next/router";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [secret, setSecret] = useState("");
  const [loading, setLoading] = useState(false);
  const [ok, setOk] = useState(false);
  const [state, setState] = useContext(UserContext);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axios.post(`/forgot-password`, {
        email,
        newPassword,
        secret,
      });
      setEmail("");
      setNewPassword("");
      setSecret("");
      setOk(data.ok);
      setLoading(false);
    } catch (error) {
      error.response && toast.error(error.response.data);
      setLoading(false);
    }
  };

  state && state.token && router.push("/");

  return (
    <div className="container-fluid">
      <div className="row bg-default-image">
        <div className="col py-5 mb-2 text-light text-center">
          <h1 className="">Forgot Password</h1>
        </div>
      </div>
      {ok && (
        <Modal
          title="Congratulations"
          open={ok}
          footer={null}
          onCancel={() => setOk(false)}
        >
          <p style={{ color: "green" }}>Password reset successful.</p>
          <Link href="/login" className="btn btn-primary btn-sm">
            Login
          </Link>
        </Modal>
      )}

      <div className="row ">
        <div className="col-md-6 offset-md-3">
          <ForgotPasswordForm
            email={email}
            setEmail={setEmail}
            newPassword={newPassword}
            setNewPassword={setNewPassword}
            secret={secret}
            setSecret={setSecret}
            handleSubmit={handleSubmit}
            loading={loading}
          />
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
