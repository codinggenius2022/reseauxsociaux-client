import { useEffect, useMemo, useState } from "react";
import Layout from "./Layout";
import AdminRoute from "./routes/AdminRoute";
import Modal from "react-modal";
import { useTable, useSortBy, useFilters, usePagination } from "react-table";
import { Avatar } from "antd";
import { SyncOutlined } from "@ant-design/icons";
import axios from "axios";
import { toast } from "react-toastify";

const UsersTable = () => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [editedUser, setEditedUser] = useState({});
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data } = await axios.get("/admin/users");
        if (data.error) {
          toast(data?.error);
        }
        setUsers(data);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []); // Empty dependency array to prevent infinite loop

  const filteredUsers = useMemo(() => {
    if (!users) return []; // Return empty array if users is undefined
    return search
      ? users.filter((user) =>
          [user.name, user.username].some((value) =>
            value.toLowerCase().includes(search.toLowerCase())
          )
        )
      : users;
  }, [users, search]);

  const columns = useMemo(
    () => [
      {
        Header: "Photo",
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
        Header: "Name",
        accessor: "name",
      },
      {
        Header: "Email",
        accessor: "email",
      },
      {
        Header: "Username",
        accessor: "username",
      },
      {
        Header: "Role",
        accessor: "role",
      },
      {
        Header: "Actions",
        accessor: "actions",
        Cell: ({ row }) => (
          <div>
            <button
              style={{
                padding: "3px 10px 3px 10px",
                marginRight: "10px",
                marginBottom: "5px",
              }}
              onClick={() => handleEdit(row?.original)}
            >
              Edit
            </button>
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
        data: Array.isArray(filteredUsers) ? filteredUsers : users,
      },
      useFilters,
      useSortBy,
      usePagination
    );

  const handleDelete = async (_id) => {
    try {
      const { data } = await axios.delete(`/admin/user/delete/${_id}`);
      if (!data.success) {
        return;
      }
      const response = await axios.get("/admin/users");
      setUsers(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleEdit = (user) => {
    setEditedUser(user);
    setModalIsOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.put(
        `/admin/user/update/${editedUser._id}`,
        editedUser
      );
      setUsers(
        users.map((user) => (user._id === data?.user?._id ? data.user : user))
      );
      setModalIsOpen(false);
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
            Users ({`${users.length}`})
          </h3>
          <div>
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search users..."
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
          <Modal
            isOpen={modalIsOpen}
            onRequestClose={() => setModalIsOpen(false)}
            portal={true}
          >
            <form onSubmit={handleSave}>
              {editedUser && editedUser.image && editedUser.image.url && (
                <div className="form-group mb-3">
                  <Avatar src={`${editedUser.image.url}`} size={60} />
                </div>
              )}
              <div className="form-group mb-3">
                <label>Name:</label>
                <input
                  className="form-control"
                  type="text"
                  value={editedUser.name}
                  disabled={true}
                />
              </div>
              <div className="form-group mb-3">
                <label>Email:</label>
                <input
                  className="form-control"
                  type="text"
                  value={editedUser.email}
                  disabled={true}
                />
              </div>
              <div className="form-group mb-3">
                <label>Username:</label>
                <input
                  className="form-control"
                  type="text"
                  value={editedUser.username}
                  disabled={true}
                />
              </div>
              <div className="form-group mb-3">
                <label>Role:</label>
                <select
                  className="form-control"
                  value={editedUser.role}
                  onChange={(e) =>
                    setEditedUser({ ...editedUser, role: e.target.value })
                  }
                >
                  <option value="Subscriber">Subscriber</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>
              <button className="btn btn-primary" type="submit">
                Save
              </button>
            </form>
          </Modal>
        </>
      )}
    </>
  );
};

export default UsersTable;
