import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../context";
import { useRouter } from "next/router";
import { SyncOutlined } from "@ant-design/icons";

const AdminRoute = ({ children }) => {
  const [state] = useContext(UserContext);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  useEffect(() => {
    state && state.token && getCurrentAdmin();
  }, [state && state.token]);

  const getCurrentAdmin = async () => {
    if (!state || !state.token) {
      router.push("/login");
    }
    try {
      const { data } = await axios.get(`/current-admin`);
      data.success && setSuccess(data.success);
    } catch (error) {
      console.log(error);
      router.push("/");
    }
  };

  //   typeof window !== "undefined" &&
  //     state === null &&
  //     setTimeout(() => {
  //       getCurrentAdmin();
  //     }, 1000);

  if (typeof window !== "undefined") {
    (state === null || !state.token) && router.push("/login");
  }
  return !success ? (
    <div className="d-flex justify-content-center py-5">
      <SyncOutlined
        spin
        className="text-primary display-1 text-center"
        style={{ paddingLeft: "auto" }}
      />
    </div>
  ) : (
    <>{children}</>
  );
};

export default AdminRoute;
