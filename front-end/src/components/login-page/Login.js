import './Login.css';

function Login(){
    return (
        <main>
            <div className='login-container'>
          <h1>
            JUN<span style={{ color: "rgb(255, 239, 138)" }}>O</span>
          </h1>
          <h3>Asset Management System</h3>
          <h3>Powered by Mawson Infrastructure Group</h3>
          <div className='login-form-container'>
          <h2>Sign In</h2>
          <form>
                <label htmlFor='user'>Username</label>
                <br /><br />
                <input id="user" type="text" />
                <br /><br />
                <label htmlFor='pass'>Password</label>
                <br /><br />
                <input id="pass" type="password" />

            </form>
            <div className="signin-button">
            <button>Login</button>
            </div>

            </div>
          </div>
        </main>
    )
}

export default Login;