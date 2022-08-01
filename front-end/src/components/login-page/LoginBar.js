import { useNavigate } from 'react-router-dom';
import './LoginBar.css';

function LoginBar({ accountLogged, setAccountLogged }){

    const navigate = useNavigate();

    const handleLogout = (e) => {
        const { id } = e.currentTarget;
        if(id === "logout"){ //clear local storage, redirect to entrypoint
          if(window.confirm('Do you wish to logout?')){
            localStorage.clear();
            setAccountLogged(null);
            navigate('/');
          }
        }
      };

      const handleClick = (e) => {
        const { id } = e.currentTarget;
        if(id === "user-panel"){
          navigate('/user-panel');
        }
      };

    return (
        <div className='logged-in-container'>
        <p className="logged-in">[<button className="button-link" id="user-panel" onClick={handleClick}>{accountLogged.account[0].username}</button> | <button className="button-link" id="logout" onClick={handleLogout}>logout</button>]</p>
      </div>
    );
}

export default LoginBar;