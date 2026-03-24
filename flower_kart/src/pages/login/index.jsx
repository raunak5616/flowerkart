import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/auth.context/index.jsx";

const Login = () => {
  const { login } = useAuth();
  const [loginData, setLoginData] = useState({
    email: "",
    password: ""
  });
  const onLoginChnage = (e) => {
    setLoginData({
      ...loginData,
      [e.target.name]: e.target.value

    })
  }
  const navigate = useNavigate();
  const onsubmitPress = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${import.meta.env.VITE_MONGO_URI}/login`,
        loginData,
        {
          headers: {
            "Content-Type": "application/json"
          }
        });
      alert(response.data.message);
      const token = response.data.token;
      const userData = response.data.user; // ✅ assuming the user data is returned in the response
      login(userData,token);
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  }
  const signup = () => {
    navigate('/signup');
  }
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 px-4">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-lg">

        {/* TITLE */}
        <h1 className="mb-2 text-center text-3xl font-semibold text-gray-900">
          देशीCart
        </h1>
        <p className="mb-6 text-center text-sm text-gray-500">
          Welcome back! Please login to your account
        </p>

        {/* FORM */}
        <div className="flex flex-col gap-4">

          {/* EMAIL */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              name="email"
              type="email"
              value={loginData.email}
              onChange={onLoginChnage}
              placeholder="you@example.com"
              className="rounded-2xl border border-gray-300 px-4 py-3 text-sm
                         focus:border-black focus:outline-none focus:ring-2 focus:ring-black/20"
            />
          </div>

          {/* PASSWORD */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              name="password"
              value={loginData.password}
              type="password"
              placeholder="••••••••"
              onChange={onLoginChnage}
              className="rounded-2xl border border-gray-300 px-4 py-3 text-sm
                         focus:border-black focus:outline-none focus:ring-2 focus:ring-black/20"
            />
          </div>

          {/* FORGOT PASSWORD */}
          <div className="flex justify-end">
            <span className="cursor-pointer text-sm text-gray-600 hover:text-black hover:underline">
              Forgot password?
            </span>
          </div>

          {/* LOGIN BUTTON */}
          <button
            className="mt-2 rounded-2xl bg-black py-3 text-white font-medium
                       transition-all duration-200
                       hover:scale-105 hover:bg-gray-900
                       active:scale-95"
            onClick={onsubmitPress}
          >
            Login
          </button>

          {/* SIGN UP */}
          <p className="text-center text-sm text-gray-500">
            Don’t have an account?{" "}
            <span className="cursor-pointer font-medium text-black hover:underline" onClick={signup}>
              Sign up
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
