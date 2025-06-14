import "./AuthPage.css";
import Image from "../../components/Image/Image";
import { useState } from "react";
import apiRequest from "../../utils/apiRequest";
import { useNavigate } from "react-router";
import useAuthStore from "../../utils/authStore";

function AuthPage() {
  const [isRegister, setIsRegister] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const { setCurrentUser } = useAuthStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    const data = Object.fromEntries(formData);

    try {
      const res = await apiRequest.post(
        `users/auth/${isRegister ? "register" : "login"}`,
        data
      );
      setCurrentUser(res.data)
      navigate("/");
    } catch (err) {
      setError(err.response.data.message);
    }
  };

  return (
    <div className="authPage">
      <div className="authContainer">
        <Image path="/general/logoBig.png" />
        <h1>{isRegister ? "Create an Account" : "Login to Your Account"}</h1>

        {isRegister ? (
          <form key="register" onSubmit={handleSubmit}>
            <div className="formGroup">
              <label htmlFor="userName">User Name</label>
              <input
                type="text"
                placeholder="User Name"
                required
                name="userName"
                id="userName"
              />
            </div>

            <div className="formGroup">
              <label htmlFor="displayName">Display Name</label>
              <input
                type="text"
                placeholder="Display Name"
                required
                name="displayName"
                id="displayName"
              />
            </div>

            <div className="formGroup">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                placeholder="Email"
                required
                name="email"
                id="email"
              />
            </div>

            <div className="formGroup">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                placeholder="Password"
                required
                name="password"
                id="password"
              />
            </div>

            <button type="submit">Register</button>

            <p onClick={() => setIsRegister(false)} className="toggleLink">
              Already have an account? <b>Login</b>
            </p>

            {error && <p className="error">{error}</p>}
          </form>
        ) : (
          <form key="login" onSubmit={handleSubmit}>
            <div className="formGroup">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                placeholder="Email"
                required
                name="email"
                id="email"
              />
            </div>

            <div className="formGroup">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                placeholder="Password"
                required
                name="password"
                id="password"
              />
            </div>

            <button type="submit">Login</button>

            <p onClick={() => setIsRegister(true)} className="toggleLink">
              Don&apos;t have an account? <b>Register</b>
            </p>

            {error && <p className="error">{error}</p>}
          </form>
        )}
      </div>
    </div>
  );
}

export default AuthPage;
