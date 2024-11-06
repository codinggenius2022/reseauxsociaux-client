import Layout from "../../components/Layout";
import AdminRoute from "../../components/routes/AdminRoute";

const Dashboard = () => {
  return (
    <Layout>
      <AdminRoute>
        <div>
          Welcome to the Admin section. Here, you will be able to edit the users
          and posts
        </div>
      </AdminRoute>
    </Layout>
  );
};

export default Dashboard;
