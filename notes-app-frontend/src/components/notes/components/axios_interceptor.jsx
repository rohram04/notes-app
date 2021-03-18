import { useAuth0 } from "@auth0/auth0-react";
import { useEffect, useState } from "react";
// import Axios from "axios";
const axios = require("axios");
axios.defaults.baseURL = process.env.REACT_APP_AXIOS_BASE_URL;
// const axios = Axios.create({
//   timeout: 10000,
//   params: {}, // do not remove this, its added to add params later in the config
// });

function useAxiosIntercepted() {
  const {
    getAccessTokenSilently,
    user: authenticatedUser,
    isAuthenticated,
    isLoading,
  } = useAuth0();
  const [interceptors, setInterceptors] = useState([]);
  const [status, setStatus] = useState(false);
  const [user, setUser] = useState({});

  const demo = !isAuthenticated && !isLoading;

  const logout = () => axios.delete("/api/demoID");

  const getAccessToken = async () => {
    alert(process.env.REACT_APP_AXIOS_BASE_URL);
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
    const responseInterceptor = axios.interceptors.response.use(
      function (response) {
        return response;
      },
      function (error) {
        console.log("hello");
        console.log(error);
        if (!error.response.status === 401) return;
        logout({ returnTo: window.location.origin });
      }
    );
    setInterceptors([responseInterceptor, requestInterceptor]);
    setStatus(true);
    setUser(authenticatedUser);
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
    setInterceptors([requestInterceptor]);
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
  }, [isAuthenticated]);

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
