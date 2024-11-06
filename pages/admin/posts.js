import Layout from "../../components/Layout";
import PostsTable from "../../components/PostsTable";
import AdminRoute from "../../components/routes/AdminRoute";

const Posts = () => {
  return (
    <Layout>
      <AdminRoute>
        <PostsTable />
      </AdminRoute>
    </Layout>
  );
};

export default Posts;
