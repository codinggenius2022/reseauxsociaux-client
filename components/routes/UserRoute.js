import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../context";
import { useRouter } from "next/router";
import { SyncOutlined } from "@ant-design/icons";

const UserRoute = ({ children }) => {
  const [state] = useContext(UserContext);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  useEffect(() => {
    state && state.token && getCurrentUser();
  }, [state && state.token]);

  const getCurrentUser = async () => {
    if (!state || !state.token) {
      router.push("/login");
    }
    try {
      const { data } = await axios.get(`/current-user`);
      data.success && setSuccess(data.success);
    } catch (error) {
      console.log(error);
      router.push("/login");
    }
  };

  // typeof window !== "undefined" &&
  //   state === null &&
  //   setTimeout(() => {
  //     getCurrentUser();
  //   }, 1000);

  if (typeof window !== "undefined") {
    (state === null || !state.token) && router.push("/login");
  }
  return !success ? (
    <div className="d-flex justify-content-center py-5">
      <SyncOutlined spin className="text-primary display-1 " style={{}} />
    </div>
  ) : (
    <>{children}</>
  );
};

export default UserRoute;
