import Layout from "../../components/Layout";
import AdminRoute from "../../components/routes/AdminRoute";
import UsersTable from "../../components/UsersTable";

const Users = () => {
  return (
    <Layout>
      <AdminRoute>
        <UsersTable />
      </AdminRoute>
    </Layout>
  );
};

export default Users;
