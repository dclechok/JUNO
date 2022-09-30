import { useNavigate } from 'react-router-dom';
import './LoginBar.css';

//Active Directory
import { useMsal } from "@azure/msal-react";

function LoginBar({ currentAcct, setCurrentAcct }){

    const navigate = useNavigate();
    const { instance } = useMsal();
    const handleLogout = (e) => {
        const { id } = e.currentTarget;
        if(id === "logout"){ //clear local storage, redirect to entrypoint
          instance.logoutRedirect({
            account: instance.getActiveAccount(),
            postLogoutRedirectUri: "/"
          });
          if(!instance.getActiveAccount()) setCurrentAcct(null);
        }
      };
  
      const handleClick = (e) => {
        const { id } = e.currentTarget;
        if(id === "user-panel"){
          navigate('/user-panel');
        }
      };

    return (
    <div className='logged-in'>
      <p>{currentAcct.name}</p><br />
        <button className="button-link" id="logout" onClick={handleLogout}>Logout</button>
        </div>
    );
}

export default LoginBar;