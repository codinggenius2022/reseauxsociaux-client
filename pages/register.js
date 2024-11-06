import { useState, useContext } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Modal } from "antd";
import AuthForm from "../components/forms/AuthForm";
import Link from "next/link";
import { UserContext } from "../context";
import { useRouter } from "next/router";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [secret, setSecret] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [state, setState] = useContext(UserContext);
  const router = useRouter();

  const handleOnCancel = (e) => {
    setSuccess(false);
    router.push("/login");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axios.post(`/register`, {
        name,
        email,
        password,
        secret,
      });
      if (data.error) {
        toast.error(data.error);
        setLoading(false);
      } else {
        setName("");
        setEmail("");
        setPassword("");
        setSecret("");
        setSuccess(data.success);
        setLoading(false);
      }
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
          <h1 className="">Register</h1>
        </div>
      </div>
      {success && (
        <Modal
          title="Congratulations"
          open={success}
          footer={null}
          onCancel={handleOnCancel}
        >
          <p style={{ color: "green" }}>You have signed up successfully!</p>
          <Link href="/login" className="btn btn-primary btn-sm">
            Login
          </Link>
        </Modal>
      )}

      <div className="row ">
        <div className="col-md-6 offset-md-3">
          <AuthForm
            name={name}
            setName={setName}
            email={email}
            setEmail={setEmail}
            password={password}
            setPassword={setPassword}
            secret={secret}
            setSecret={setSecret}
            handleSubmit={handleSubmit}
            loading={loading}
          />
        </div>
      </div>
      <div className="row">
        <div className="col text-center" style={{ textDecoration: "none" }}>
          Already have an account? <Link href="/login">login</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
