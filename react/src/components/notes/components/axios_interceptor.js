import { useAuth0 } from "@auth0/auth0-react";
import { useEffect, useState } from "react";
import useLogout from "../../authentication/logout";
// import Axios from "axios";
const axios = require("axios");
axios.defaults.baseURL = process.env.REACT_APP_AXIOS_BASE_URL;

function useAxiosIntercepted() {
  const [interceptors, setInterceptors] = useState([]);
  const [status, setStatus] = useState(false);
  const [user, setUser] = useState({});

  const logout = useLogout();
  const {
    getAccessTokenSilently,
    user: authenticatedUser,
    isAuthenticated,
    isLoading,
  } = useAuth0();

  const demo = !isAuthenticated && !isLoading;

  const handleError = () => {
    alert("An error occurred. Please try again later.");
    logout(demo);
  };

  const responseInterceptor = axios.interceptors.response.use(
    (response) => response,
    (error) => handleError
  );

  const getAccessToken = async () => {
    const token = await getAccessTokenSilently();
    const response = await axios.get("/api/userid", {
      params: { email: authenticatedUser.email },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const requestInterceptor = axios.interceptors.request.use((config) => {
      config.params = config.params || {};
      config.params.userid = response.data;
      config.headers.Authorization = `Bearer ${token}`;
      return config;
    });
    setInterceptors([responseInterceptor, requestInterceptor]);
    setStatus(true);
    setUser(authenticatedUser);
    return requestInterceptor;
  };

  const setupDemo = async () => {
    const response = await axios.get("/api/demoID");
    const requestInterceptor = axios.interceptors.request.use((config) => {
      config.params = config.params || {};
      config.params.userid = response.data;
      config.params.demo = true;
      return config;
    });
    window.addEventListener("beforeunload", logout);
    setInterceptors([responseInterceptor, requestInterceptor]);
    setStatus(true);
    setUser({ name: "DEMO" });
  };

  useEffect(() => {
    if (demo) setupDemo();
    else if (!isAuthenticated) return;
    else getAccessToken();

    return () => {
      if (demo) {
        window.removeEventListener("beforeunload", logout);
      }
    };
  }, [isAuthenticated, demo]);

  useEffect(() => {
    return () => {
      for (let interceptor in interceptors) {
        axios.interceptors.request.eject(interceptors[interceptor]);
      }
    };
  }, [interceptors]);

  return { status, user, demo };
}

export default useAxiosIntercepted;
