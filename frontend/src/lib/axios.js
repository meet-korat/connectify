import axios from "axios"

export const axiosInstance=axios.create({
    baseURL:"http://localhost:5001/api",
    withCredentials:true,
    headers: {
        'Content-Type': 'application/json'
    }
})

axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        // Handle unauthorized error - maybe redirect to login
        window.location.href = '/login';  // or however you handle redirects
      }
      return Promise.reject(error);
    }
  );
