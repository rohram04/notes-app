import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios";
import { useHistory } from "react-router-dom";

const useLogout = (demo) => {
  const { logout: authenticatedLogout } = useAuth0();
  const history = useHistory();

  const logout = () => {
    if (!demo) return authenticatedLogout({ returnTo: window.location.origin });
    axios.delete("/api/demoID");
    history.push("/");
  };

  return logout;
};

export default useLogout;
