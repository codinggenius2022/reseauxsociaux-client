import { useState, useContext } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import AuthForm from "../components/forms/AuthForm";
import Link from "next/link";
import { useRouter } from "next/router";
import { UserContext } from "../context";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [state, setState] = useContext(UserContext);

  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axios.post(`/login`, {
        email,
        password,
      });
      if (data.error) {
        toast.error(data.error);
        setLoading(false);
      } else {
        //update context with user information on login successful
        setState({
          user: data.filteredUser,
          token: data.token,
        });
        //put context state in local storage
        window.localStorage.setItem(
          "auth",
          JSON.stringify({ user: data.filteredUser, token: data.token })
        );
        router.push("/user/dashboard");
      }
    } catch (error) {
      error.response && toast.error(error.response.message);
      setLoading(false);
    }
  };

  if (state && state.token) router.push("/user/dashboard");

  return (
    <div className="container-fluid">
      <div className="row bg-default-image">
        <div className="col py-5 mb-2 text-light text-center">
          <h1 className="">Login</h1>
        </div>
      </div>
      <div className="row ">
        <div className="col-md-6 offset-md-3">
          <AuthForm
            email={email}
            setEmail={setEmail}
            password={password}
            setPassword={setPassword}
            handleSubmit={handleSubmit}
            loading={loading}
            page="login"
          />
        </div>
      </div>
      <div className="row">
        <div className="col">
          <p className="text-center">
            <Link
              className="text-danger"
              href="/forgot-password"
              style={{ textDecoration: "none" }}
            >
              Forgot Password
            </Link>
          </p>
        </div>
      </div>
      <div className="row">
        <div className="col text-center" style={{ textDecoration: "none" }}>
          Don't have and account? <Link href="/register">register</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
