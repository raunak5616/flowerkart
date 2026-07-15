import axios from "axios";

export const getProducts = async () => {
  const URL = import.meta.env.VITE_MONGO_URI + "/products";
  const requestStart = performance.now();

  try {
    const response = await axios.get(URL);
    const totalMs = performance.now() - requestStart;

    console.log("[PERF] getProducts network total:", {
      totalMs: totalMs.toFixed(2),
      backendTotalMs: response.headers["x-total-time-ms"],
      backendQueryMs: response.headers["x-query-time-ms"],
      backendSerializationMs: response.headers["x-serialization-time-ms"],
      payloadBytes: response.headers["x-payload-bytes"],
    });

    return response.data;
  } catch (error) {
    console.error("🔥 GET PRODUCTS ERROR 🔥", error);
    throw error;
  }
};
export const getProductById = async (id) => {
  const URL = `${import.meta.env.VITE_MONGO_URI}/productsById/${id}`;
  try {
    const response = await axios.get(URL);
    return response.data;
  } catch (error) {
    console.error("🔥 GET PRODUCT BY ID ERROR 🔥", error);
    throw error;
  } 
};

export const getProfile = async (id) => {
  const URL = `${import.meta.env.VITE_MONGO_URI}/profile/${id}`;
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(URL, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {   
    console.error("🔥 GET PROFILE ERROR 🔥", error);
    throw error;
  }
};

export const updateProfile = async (id, formData) => {
  const URL = `${import.meta.env.VITE_MONGO_URI}/profileUpdate`;
  try {
    const response = await axios.post(URL, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  } catch (error) {
    console.error("🔥 UPDATE PROFILE ERROR 🔥", error);
    throw error;
  }
};

export const submitReview = async (orderId, reviewData) => {
  const URL = `${import.meta.env.VITE_MONGO_URI}/review/${orderId}`;
  try {
    const token = localStorage.getItem("token");
    const response = await axios.post(URL, reviewData, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error("🔥 SUBMIT REVIEW ERROR 🔥", error);
    throw error;
  }
};
