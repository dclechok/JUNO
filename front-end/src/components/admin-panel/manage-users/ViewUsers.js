import deletePng from "../../../images/delete.png";
import editPng from "../../../images/pencil-blue-icon.png";

//utils
import dateFormatter from "../../../utils/dateFormatter";

function ViewUsers({ setViewOrCreate, users, setUserID }) {

  const clickHandler = (e) => {
    const { id, value } = e.currentTarget;
    if(id === "editUser") {
      setViewOrCreate('edit');
      setUserID(value); //this is the userID we will use when editing      
    }
  };

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
              <b>Edit User</b>
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
                  <td>{u.access_level.toUpperCase()}</td>
                  <td>{dateFormatter(u.created_at)}</td>
                  <td className="delete-icon-td"><button className="image-button" id="editUser" value={u.user_id} onClick={clickHandler}><img src={editPng} alt="edit user" /></button></td>
                  <td className="delete-icon-td"><button className="image-button" id="deleteUser" value={u.user_id} onClick={clickHandler}><img src={deletePng} alt="delete user" /></button></td>
                </tr>
              );
            })}
        </tbody>
      </table>
    </>
  );
}

export default ViewUsers;
