import { useAuth0 } from "@auth0/auth0-react";
import { useHistory } from "react-router-dom";

const useLoginAuth0 = () => {
  const { loginWithPopup, loginWithRedirect } = useAuth0();
  const history = useHistory();

  const login = isPwa()
    ? async (args = {}) => {
        loginWithPopup(args);
        history.push("/notes");
      }
    : (args = {}) => loginWithRedirect(args);

  return login;
};

function isPwa() {
  return ["fullscreen", "standalone", "minimal-ui"].some(
    (displayMode) =>
      window.matchMedia("(display-mode: " + displayMode + ")").matches
  );
}

export default useLoginAuth0;
