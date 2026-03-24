import { useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../context/auth.context";
import { useEffect } from "react";
import { getProfile } from "../../apiCalls/productapi";
export default function Profile() {
  const {logout} = useAuth();
  const navigater = useNavigate();
  const [popup, setpopup] = useState(false);
  const [image, setimage] = useState(null);
  const [user, setUser] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });
  const {id} = useParams();
  useEffect(()=>{
    const fetchProfile = async (id) =>{
      const data = await getProfile(id);
      setUser(data);
    }
    fetchProfile(id);
  },[id]);
const handleSave = async (e) =>{
  e.preventDefault();
  const formdata = new FormData();
  Object.entries(user).forEach(([key,value])=>{
    formdata.append(key,value);
  })
  if(image){
    formdata.append("images",image);
  }
  try {
    const token = localStorage.getItem("token");
    console.log("Token:", token); // ✅ add this for debugging
const response = await axios.post(`${import.meta.env.VITE_MONGO_URI}/profileUpdate`,formdata,
   {
    headers: {
      Authorization: `Bearer ${token}`, // ✅ IMPORTANT
    },
  }
);
alert(response.data.message);
setpopup(false);
    // Make API call to save updated profile
  } catch (err) {
    if (err.response?.status === 401) {
    alert("Session expired. Please login again.");
    logout();
    navigater("/login");
    // redirect to login
    console.log("error updating profile❌❌:",err);
    }}
}
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {popup && (<div className="fixed inset-0 backdrop-blur-md bg-white/30 flex justify-center items-center z-50">

        <div className="bg-white p-6 rounded-xl w-[90%] max-w-md shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Edit Profile</h2>

          {/* Name */}
          <input
            type="text"
            placeholder="Name"
            value={user?.name || ""}
            onChange={(e) => setUser({ ...user, name: e.target.value })}
            className="w-full border p-2 mb-3 rounded"
          />

          {/* Email */}
          <input
            type="email"
            placeholder="Email"
            value={user?.email || ""}
            onChange={(e) => setUser({ ...user, email: e.target.value })}
            className="w-full border p-2 mb-3 rounded"
          />

          {/* Phone */}
          <input
            type="text"
            placeholder="Phone"
            value={user?.phone || ""}
            onChange={(e) => setUser({ ...user, phone: e.target.value })}
            className="w-full border p-2 mb-3 rounded"
          />

          {/* Address */}
          <textarea
            placeholder="Address"
            value={user?.address || ""}
            onChange={(e) => setUser({ ...user, address: e.target.value })}
            className="w-full border p-2 mb-3 rounded"
          />
          <input
          type="file"
          onChange={(e) => setimage(e.target.files[0])}
          className="block w-full text-sm text-gray-600
                         file:mr-4 file:py-2 file:px-4
                         file:rounded-lg file:border-0
                         file:bg-green-500 file:text-white
                         hover:file:bg-green-600 cursor-pointer"
          />
          {/* Buttons */}
          <div className="flex justify-end gap-2">
            <button
              onClick={() => setpopup(false)}
              className="px-4 py-2 bg-gray-300 rounded"
            >
              Cancel
            </button>

            <button
              onClick={handleSave}
              className="px-4 py-2 bg-emerald-600 text-white rounded"
            >
              Save
            </button>
          </div>
        </div>

      </div>
      )}
      <div className="max-w-5xl mx-auto">

        {/* PROFILE HEADER */}
        <div className="bg-white rounded-2xl shadow-md p-6 flex flex-col md:flex-row items-center gap-6">

          <div className="w-24 h-24 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 text-3xl font-bold overflow-hidden">
            {user?.images?.url ? (
              <img src={user.images.url} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              user?.name?.charAt(0) || "U"
            )}
          </div>

          <div className="text-center md:text-left">
            <h2 className="text-2xl font-semibold text-gray-800">
              {user.name}
            </h2>
            <p className="text-gray-500">{user.email}</p>
            <button className="mt-3 bg-emerald-600 text-white px-4 py-1 rounded-md hover:bg-emerald-700 transition" onClick={() => setpopup(true)}>
              Edit Profile
            </button>
          </div>

        </div>

        {/* PROFILE DETAILS */}
        <div className="grid md:grid-cols-2 gap-6 mt-8">

          {/* PERSONAL INFO */}
          <div className="bg-white rounded-2xl shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4">
              Personal Information
            </h3>

            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-500">Full Name</label>
                <input
                  type="text"
                  value={user?.name || ""}
                  className="w-full border rounded-md p-2 mt-1 focus:ring-2 focus:ring-emerald-500 outline-none bg-gray-50"
                  readOnly
                />
              </div>

              <div>
                <label className="text-sm text-gray-500">Email</label>
                <input
                  type="email"
                  value={user?.email || ""}
                  className="w-full border rounded-md p-2 mt-1 focus:ring-2 focus:ring-emerald-500 outline-none bg-gray-50"
                  readOnly
                />
              </div>

              <div>
                <label className="text-sm text-gray-500">Phone</label>
                <input
                  type="text"
                  value={user?.phone || ""}
                  className="w-full border rounded-md p-2 mt-1 focus:ring-2 focus:ring-emerald-500 outline-none bg-gray-50"
                  readOnly
                />
              </div>
            </div>
          </div>

          {/* ADDRESS SECTION */}
          <div className="bg-white rounded-2xl shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4">
              Delivery Address
            </h3>

            <textarea
              rows="5"
              value={user?.address || ""}
              className="w-full border rounded-md p-3 focus:ring-2 focus:ring-emerald-500 outline-none bg-gray-50"
              readOnly
            />

            <button className="mt-4 bg-emerald-600 text-white px-4 py-2 rounded-md hover:bg-emerald-700 transition">
              Change Address
            </button>
          </div>

        </div>

        {/* ORDER HISTORY */}
        <div className="bg-white rounded-2xl shadow-md p-6 mt-8">
          <h3 className="text-lg font-semibold mb-4">
            Recent Orders
          </h3>

          <div className="space-y-3">
            <div className="flex justify-between items-center border-b pb-3">
              <div>
                <p className="font-medium">Order #12345</p>
                <p className="text-sm text-gray-500">
                  2 items • ₹450
                </p>
              </div>
              <span className="text-emerald-600 font-medium">
                Delivered
              </span>
            </div>

            <div className="flex justify-between items-center border-b pb-3">
              <div>
                <p className="font-medium">Order #12344</p>
                <p className="text-sm text-gray-500">
                  1 item • ₹120
                </p>
              </div>
              <span className="text-yellow-500 font-medium">
                Pending
              </span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
