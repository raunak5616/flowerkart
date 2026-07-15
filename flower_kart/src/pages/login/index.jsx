import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "../../components/ui/ToastProvider.jsx";
import { useAuth } from "../../context/auth.context/index.jsx";

const Login = () => {
  const { notify } = useToast();
  const { login } = useAuth();
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const onLoginChange = (event) => {
    setLoginData({
      ...loginData,
      [event.target.name]: event.target.value,
    });
  };

  const onSubmitPress = async (event) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      const response = await axios.post(`${import.meta.env.VITE_MONGO_URI}/login`, loginData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      const token = response.data.token;
      const userData = response.data.user;
      login(userData, token);
      notify({
        title: "Welcome back",
        message: response.data.message,
        type: "success",
      });
      navigate("/");
    } catch (error) {
      console.log(error);
      notify({
        title: "Login failed",
        message: error.response?.data?.message || "Please check your credentials and try again.",
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-shell px-4 py-10 md:py-16">
      <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="surface-card hidden rounded-[40px] bg-premium-gradient p-10 text-white lg:block">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-rose-100/80">Welcome back</p>
          <h1 className="mt-4 text-5xl font-semibold tracking-[-0.05em]">
            Sign in to continue gifting, saving, and reordering with ease.
          </h1>
          <p className="mt-5 max-w-lg text-sm leading-7 text-rose-50/85">
            The auth experience should reassure users before they buy, not just collect credentials. This layout gives the page more structure and confidence.
          </p>
        </div>

        <div className="surface-card w-full rounded-[40px] bg-white p-8 md:p-10">
          <h1 className="mb-2 text-center text-3xl font-semibold text-gray-900">flowerKart</h1>
          <p className="mb-6 text-center text-sm text-gray-500">
            Welcome back! Please login to your account
          </p>

          <form className="flex flex-col gap-4" onSubmit={onSubmitPress}>
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">Email</label>
              <input
                name="email"
                type="email"
                value={loginData.email}
                onChange={onLoginChange}
                placeholder="you@example.com"
                className="rounded-2xl border border-gray-300 px-4 py-3 text-sm focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">Password</label>
              <input
                name="password"
                value={loginData.password}
                type="password"
                placeholder="Enter your password"
                onChange={onLoginChange}
                className="rounded-2xl border border-gray-300 px-4 py-3 text-sm focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20"
              />
            </div>

            <div className="flex justify-end">
              <span className="cursor-pointer text-sm text-gray-600 hover:text-red-600 hover:underline">
                Forgot password?
              </span>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`mt-2 rounded-2xl bg-red-gradient py-3 font-medium text-white transition-all duration-200 ${
                isLoading ? "cursor-not-allowed opacity-70" : "hover:scale-[1.01] hover:opacity-90 active:scale-[0.99]"
              }`}
            >
              {isLoading ? "Logging in..." : "Login"}
            </button>

            <p className="text-center text-sm text-gray-500">
              Don’t have an account?{" "}
              <span
                className="cursor-pointer font-medium text-red-600 hover:underline"
                onClick={() => navigate("/signup")}
              >
                Sign up
              </span>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
