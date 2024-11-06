import { useEffect, useMemo, useState } from "react";
import { useTable, useSortBy, useFilters, usePagination } from "react-table";
import { Avatar } from "antd";
import { SyncOutlined } from "@ant-design/icons";
import axios from "axios";
import { toast } from "react-toastify";
import parse from "html-react-parser";

const PostsTable = () => {
  const [posts, setPosts] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const { data } = await axios.get("/admin/posts");
        if (data.error) {
          toast(data?.error);
        }
        setPosts(data);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []); // Empty dependency array to prevent infinite loop

  const filteredPosts = useMemo(() => {
    if (!posts || posts.length < 0) return []; // Return empty array if Posts is undefined
    return search
      ? posts.filter((post) =>
          [post?.postedBy?.name, post?.content].some((value) =>
            value.toLowerCase().includes(search.toLowerCase())
          )
        )
      : posts;
  }, [posts, search]);

  const columns = useMemo(
    () => [
      {
        Header: "Post_image",
        accessor: "image.url",
        Cell: ({ row }) => (
          <div>
            <Avatar
              src={row?.original?.image?.url}
              size={50}
              alt={row?.original?.name}
            />
          </div>
        ),
      },
      {
        Header: "PostedBy",
        accessor: "postedBy.name",
        Cell: ({ row }) => row?.original?.postedBy?.name,
      },
      {
        Header: "Content",
        accessor: "content",
        Cell: ({ row }) => {
          const content = row.original.content;
          const displayedContent =
            content.length > 100
              ? parse(content).props.children.slice(0, 20) + "..."
              : parse(content);

          return <div>{displayedContent}</div>;
        },
      },
      {
        Header: "Actions",
        accessor: "actions",
        Cell: ({ row }) => (
          <div>
            <button
              style={{ padding: "3px 10px 3px 10px" }}
              onClick={() => handleDelete(row?.original._id)}
            >
              Delete
            </button>
          </div>
        ),
      },
    ],
    []
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable(
      {
        columns,
        data: Array.isArray(filteredPosts) ? filteredPosts : posts,
      },
      useFilters,
      useSortBy,
      usePagination
    );

  const handleDelete = async (_id) => {
    try {
      const { data } = await axios.delete(`/admin/post/delete/${_id}`);
      if (!data.success) {
        return;
      }
      const response = await axios.get("/admin/posts");
      setPosts(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      {loading ? (
        <SyncOutlined
          spin
          className="d-flex justify-content-center display-1 text-primary mt-5"
        />
      ) : (
        <>
          <h3 className="text-center text-primary">
            Posts ({`${posts.length}`})
          </h3>
          <div>
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search posts..."
              style={{
                marginBottom: "1rem",
                height: "2.2rem",
                padding: "5px 1rem 5px 1rem",
                outline: "none",
              }}
            />
            <table {...getTableProps()} style={{ border: "solid 1px gray" }}>
              <thead>
                {headerGroups.map((headerGroup, index) => (
                  <tr key={index} {...headerGroup.getHeaderGroupProps()}>
                    {headerGroup.headers.map((column, index) => (
                      <th
                        key={index}
                        {...column.getHeaderProps()}
                        style={{
                          border: "solid 1px gray",
                          padding: "0.2rem 1rem 0.2rem 1rem",
                        }}
                      >
                        {column.render("Header")}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody {...getTableBodyProps()}>
                {rows.map((row, index) => {
                  prepareRow(row);
                  return (
                    <tr key={index} {...row.getRowProps()}>
                      {row.cells.map((cell) => (
                        <td
                          style={{
                            border: "solid 1px gray",
                            padding: "0.2rem 1rem 0.2rem 1rem",
                          }}
                          {...cell.getCellProps()}
                        >
                          {cell.render("Cell")}
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}
    </>
  );
};

export default PostsTable;
