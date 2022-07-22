
//utils
import dateFormatter from "../../../utils/dateFormatter";

function ViewUsers({ users }) {

  return (
    <>
      <p>Total Users: {users.length}</p>
      <table className="shrink-font">
        <tbody>
          <tr>
            <th>
              <b>User ID</b>
            </th>
            <th>
              <b>Name</b>
            </th>
            <th>
              <b>Username</b>
            </th>
            <th>
              <b>Access Level</b>
            </th>
            <th>
              <b>Date Created</b>
            </th>
            <th>
              <b>Delete User</b>
            </th>
          </tr>
          {users &&
            users.length !== 0 &&
            users.map((u, key) => {
              return (
                <tr key={key}>
                  <td>{u.user_id}</td>
                  <td>{u.name}</td>
                  <td>{u.username}</td>
                  <td>{u.access_level}</td>
                  <td>{dateFormatter(u.created_at)}</td>
                  <td>Delete</td>
                </tr>
              );
            })}
        </tbody>
      </table>
    </>
  );
}

export default ViewUsers;
