import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { getProfile } from "../../apiCalls/productapi";
import { useToast } from "../../components/ui/ToastProvider.jsx";
import { useAuth } from "../../context/auth.context";

export default function Profile() {
  const { notify } = useToast();
  const { logout, user: authUser } = useAuth();
  const navigate = useNavigate();
  const [popup, setPopup] = useState(false);
  const [image, setImage] = useState(null);
  const [user, setUser] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    const userId = authUser?._id;
    if (!userId) {
      return;
    }

    const fetchProfile = async (id) => {
      const data = await getProfile(id);
      setUser(data || { name: "", email: "", phone: "", address: "" });
    };

    const fetchOrders = async (id) => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/orders/${id}`);
        setOrders(response.data);
      } catch (err) {
        console.error("Error fetching orders:", err);
      }
    };

    fetchProfile(userId);
    fetchOrders(userId);
  }, [authUser]);

  const handleSave = async (event) => {
    event.preventDefault();
    const formdata = new FormData();
    formdata.append("name", user.name);
    formdata.append("email", user.email);
    formdata.append("phone", user.phone);
    formdata.append("address", user.address);

    if (image) {
      formdata.append("images", image);
    }

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(`${import.meta.env.VITE_MONGO_URI}/profileUpdate`, formdata, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      notify({
        title: "Profile updated",
        message: response.data.message,
        type: "success",
      });
      setPopup(false);
    } catch (err) {
      if (err.response?.status === 401) {
        notify({
          title: "Session expired",
          message: "Please login again to continue.",
          type: "error",
        });
        logout();
        navigate("/login");
      }
    }
  };

  return (
    <div className="bg-shell pb-20 pt-8">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <section className="surface-card rounded-[40px] p-6 md:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-5">
              <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full bg-rose-100 text-3xl font-semibold text-rose-600">
                {user?.images?.url ? (
                  <img src={user.images.url} alt="Profile" className="h-full w-full object-cover" />
                ) : (
                  user?.name?.charAt(0) || "U"
                )}
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-rose-500">My account</p>
                <h1 className="mt-2 text-4xl font-semibold tracking-[-0.04em] text-slate-950">{user.name || "Your profile"}</h1>
                <p className="mt-2 text-sm leading-7 text-slate-600">{user.email}</p>
              </div>
            </div>
            <button type="button" onClick={() => setPopup(true)} className="cta-button px-6 py-3 text-sm">
              Edit profile
            </button>
          </div>
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="space-y-6">
            <div className="surface-card rounded-[32px] p-6">
              <h2 className="text-2xl font-semibold tracking-[-0.03em] text-slate-950">Personal information</h2>
              <div className="mt-5 space-y-4 text-sm">
                <div className="rounded-[22px] border border-slate-200 bg-slate-50/70 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Full name</p>
                  <p className="mt-2 font-medium text-slate-800">{user?.name || "Not provided"}</p>
                </div>
                <div className="rounded-[22px] border border-slate-200 bg-slate-50/70 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Email</p>
                  <p className="mt-2 font-medium text-slate-800">{user?.email || "Not provided"}</p>
                </div>
                <div className="rounded-[22px] border border-slate-200 bg-slate-50/70 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Phone</p>
                  <p className="mt-2 font-medium text-slate-800">{user?.phone || "Not provided"}</p>
                </div>
              </div>
            </div>

            <div className="surface-card rounded-[32px] p-6">
              <h2 className="text-2xl font-semibold tracking-[-0.03em] text-slate-950">Delivery address</h2>
              <p className="mt-4 rounded-[22px] border border-slate-200 bg-slate-50/70 p-4 text-sm leading-7 text-slate-600">
                {user?.address || "No saved delivery address yet."}
              </p>
            </div>
          </div>

          <div className="surface-card rounded-[32px] p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-rose-500">Recent orders</p>
                <h2 className="mt-2 text-3xl font-semibold tracking-[-0.03em] text-slate-950">Order history</h2>
              </div>
              <span className="rounded-full bg-slate-950 px-4 py-2 text-xs font-semibold text-white">
                {orders.length} total
              </span>
            </div>

            <div className="mt-6 space-y-4">
              {orders.length > 0 ? (
                orders.map((order) => (
                  <div key={order._id} className="rounded-[24px] border border-slate-200 bg-slate-50/70 p-5">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                          Order reference
                        </p>
                        <p className="mt-2 text-lg font-semibold text-slate-900">
                          #{order.razorpay_order_id?.slice(-6).toUpperCase() || "N/A"}
                        </p>
                        <p className="mt-1 text-sm text-slate-600">
                          {new Date(order.createdAt).toLocaleDateString()} • ₹{order.amount}
                        </p>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className={`rounded-full px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] ${
                          order.status === "Success"
                            ? "bg-emerald-50 text-emerald-700"
                            : order.status === "Pending"
                            ? "bg-amber-50 text-amber-700"
                            : "bg-rose-50 text-rose-700"
                        }`}>
                          {order.status}
                        </span>
                        <button
                          type="button"
                          onClick={() => setSelectedOrder(order)}
                          className="secondary-button px-4 py-2 text-sm"
                        >
                          View details
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="rounded-[24px] border border-dashed border-slate-200 bg-white px-6 py-10 text-center text-sm text-slate-500">
                  No orders found yet. Your upcoming purchases will appear here with clearer tracking and status detail.
                </div>
              )}
            </div>
          </div>
        </section>
      </div>

      {popup ? (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 px-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-[32px] bg-white p-6 shadow-[0_20px_60px_rgba(15,23,42,0.22)]">
            <h2 className="text-2xl font-semibold tracking-[-0.03em] text-slate-950">Edit profile</h2>
            <div className="mt-5 space-y-3">
              <input
                type="text"
                placeholder="Name"
                value={user?.name || ""}
                onChange={(event) => setUser({ ...user, name: event.target.value })}
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-rose-300"
              />
              <input
                type="email"
                placeholder="Email"
                value={user?.email || ""}
                onChange={(event) => setUser({ ...user, email: event.target.value })}
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-rose-300"
              />
              <input
                type="text"
                placeholder="Phone"
                value={user?.phone || ""}
                onChange={(event) => setUser({ ...user, phone: event.target.value })}
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-rose-300"
              />
              <textarea
                placeholder="Address"
                value={user?.address || ""}
                onChange={(event) => setUser({ ...user, address: event.target.value })}
                className="w-full rounded-3xl border border-slate-200 px-4 py-4 text-sm outline-none transition focus:border-rose-300"
              />
              <input
                type="file"
                onChange={(event) => setImage(event.target.files[0])}
                className="block w-full text-sm text-slate-600 file:mr-4 file:rounded-full file:border-0 file:bg-rose-50 file:px-4 file:py-2 file:text-rose-600"
              />
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button type="button" onClick={() => setPopup(false)} className="secondary-button px-5 py-3 text-sm">
                Cancel
              </button>
              <button type="button" onClick={handleSave} className="cta-button px-5 py-3 text-sm">
                Save changes
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {selectedOrder ? (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/50 px-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-[32px] bg-white shadow-[0_20px_60px_rgba(15,23,42,0.22)]">
            <div className="rounded-t-[32px] bg-premium-gradient px-6 py-5 text-white">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-semibold tracking-[-0.03em]">Order summary</h3>
                <button type="button" onClick={() => setSelectedOrder(null)} className="rounded-full bg-white/10 p-2">
                  <span className="material-symbols-outlined text-base">close</span>
                </button>
              </div>
            </div>

            <div className="max-h-[70vh] space-y-4 overflow-y-auto p-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-[22px] border border-slate-200 bg-slate-50/70 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Order ID</p>
                  <p className="mt-2 text-sm font-medium text-slate-800">{selectedOrder.razorpay_order_id}</p>
                </div>
                <div className="rounded-[22px] border border-slate-200 bg-slate-50/70 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Status</p>
                  <p className="mt-2 text-sm font-medium text-slate-800">{selectedOrder.status}</p>
                </div>
              </div>

              <div className="space-y-3">
                {selectedOrder.items?.map((item, index) => (
                  <div key={index} className="flex items-center justify-between gap-4 rounded-[20px] border border-slate-200 bg-white p-4">
                    <div>
                      <p className="font-medium text-slate-800">{item.name || item.title}</p>
                      <p className="mt-1 text-xs uppercase tracking-[0.16em] text-slate-400">Qty {item.quantity || item.qty || 1}</p>
                    </div>
                    <p className="font-semibold text-slate-900">₹{item.price}</p>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between border-t border-slate-100 pt-4">
                <p className="text-lg font-semibold text-slate-950">Total</p>
                <p className="text-2xl font-semibold text-rose-600">₹{selectedOrder.amount}</p>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
