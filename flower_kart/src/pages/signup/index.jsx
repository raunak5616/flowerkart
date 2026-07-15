import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useToast } from "../../components/ui/ToastProvider.jsx";

const Signup = () => {
  const { notify } = useToast();
  const navigate = useNavigate();
  const [showTnC, setShowTnC] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });

  const onHandleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (password !== confirmPassword) {
      notify({
        title: "Passwords do not match",
        message: "Please re-enter the same password in both fields.",
        type: "error",
      });
      return;
    }

    try {
      const response = await axios.post(`${import.meta.env.VITE_MONGO_URI}/signup`, formData, {
        headers: {
          "content-type": "application/json",
        },
      });

      notify({
        title: "Account created",
        message: response.data.message,
        type: "success",
      });
      navigate("/login");
    } catch (err) {
      console.log(err);
      notify({
        title: "Signup failed",
        message: err.response?.data?.message || "Please try again in a moment.",
        type: "error",
      });
    }
  };

  return (
    <div className="bg-shell px-4 py-10 md:py-16">
      <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[1fr_0.95fr]">
        <div className="surface-card hidden rounded-[40px] bg-white p-10 lg:block">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-rose-500">Create your account</p>
          <h1 className="mt-4 text-5xl font-semibold tracking-[-0.05em] text-slate-950">
            Join a storefront designed for gifting moments, not checkout friction.
          </h1>
          <p className="mt-5 max-w-xl text-sm leading-7 text-slate-600">
            Registration becomes more trustworthy when the page has room to explain value and the form feels calmer to complete.
          </p>
        </div>

        <div className="surface-card relative w-full rounded-[40px] bg-white p-8 shadow-lg">
          <h1 className="mb-2 text-center text-3xl font-semibold text-gray-900">Create Account</h1>
          <p className="mb-6 text-center text-sm text-gray-500">
            Join flowerKart and start shopping smarter
          </p>

          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">Full Name</label>
              <input
                type="text"
                name="name"
                placeholder="John Doe"
                onChange={onHandleChange}
                className="rounded-2xl border border-gray-300 px-4 py-3 text-sm focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                name="email"
                placeholder="you@example.com"
                onChange={onHandleChange}
                className="rounded-2xl border border-gray-300 px-4 py-3 text-sm focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">Phone</label>
              <input
                type="tel"
                name="phone"
                placeholder="+123 456 7890"
                onChange={onHandleChange}
                className="rounded-2xl border border-gray-300 px-4 py-3 text-sm focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">Password</label>
              <input
                type="password"
                name="password"
                placeholder="Create a strong password"
                onChange={(event) => {
                  setPassword(event.target.value);
                  setFormData({
                    ...formData,
                    password: event.target.value,
                  });
                }}
                className="rounded-2xl border border-gray-300 px-4 py-3 text-sm focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">Confirm Password</label>
              <input
                type="password"
                placeholder="Re-enter password"
                onChange={(event) => setConfirmPassword(event.target.value)}
                className="rounded-2xl border border-gray-300 px-4 py-3 text-sm focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20"
              />
            </div>

            <div className="flex items-start gap-2 text-sm text-gray-600">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(event) => setAgreed(event.target.checked)}
                className="mt-1 accent-red-600"
              />
              <p>
                I agree to the{" "}
                <span
                  onClick={() => setShowTnC(true)}
                  className="cursor-pointer font-medium text-red-600 hover:underline"
                >
                  Terms & Conditions
                </span>
              </p>
            </div>

            <button
              type="submit"
              disabled={!agreed}
              className={`mt-2 rounded-2xl py-3 text-white font-medium transition-all duration-200 ${
                agreed
                  ? "bg-red-gradient hover:scale-[1.01] hover:opacity-90 active:scale-[0.99]"
                  : "cursor-not-allowed bg-gray-400"
              }`}
            >
              Create Account
            </button>

            <p className="text-center text-sm text-gray-500">
              Already have an account?{" "}
              <span
                className="cursor-pointer font-medium text-red-600 hover:underline"
                onClick={() => navigate("/login")}
              >
                Login
              </span>
            </p>
          </form>

          {showTnC ? (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
              <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
                <h2 className="mb-4 text-xl font-semibold text-gray-900">Terms & Conditions</h2>
                <div className="max-h-64 space-y-3 overflow-y-auto text-sm text-gray-600">
                  <p>By creating an account on flowerKart, you agree to the following:</p>
                  <p>
                    • You are responsible for maintaining account security.
                    <br />
                    • Orders once placed cannot be cancelled after shipping.
                    <br />
                    • Any misuse may result in account suspension.
                  </p>
                  <p>These terms may be updated at any time without notice.</p>
                </div>
                <div className="mt-6 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowTnC(false)}
                    className="rounded-lg px-4 py-2 text-sm text-gray-600 hover:bg-gray-100"
                  >
                    Close
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setAgreed(true);
                      setShowTnC(false);
                    }}
                    className="rounded-lg bg-red-gradient px-4 py-2 text-sm text-white hover:opacity-90"
                  >
                    I Agree
                  </button>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default Signup;
