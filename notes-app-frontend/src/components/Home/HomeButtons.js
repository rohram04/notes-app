import { useAuth0 } from "@auth0/auth0-react";
import { Button } from "@material-ui/core";
import React from "react";
import { Link, useHistory } from "react-router-dom";
import "./Home.css";

function isPwa() {
  return ["fullscreen", "standalone", "minimal-ui"].some(
    (displayMode) =>
      window.matchMedia("(display-mode: " + displayMode + ")").matches
  );
}

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

export const LoginButton = () => {
  const login = useLoginAuth0();
  return (
    <Button
      className="homebutton"
      size="large"
      variant="outlined"
      onClick={login}
    >
      login
    </Button>
  );
};

export const SignupButton = () => {
  const login = useLoginAuth0();
  return (
    <Button
      className="homebutton"
      size="large"
      variant="outlined"
      onClick={() => login({ screen_hint: "signup" })}
    >
      signup
    </Button>
  );
};

export const DemoButton = () => {
  return (
    <Button
      className="homebutton"
      size="large"
      variant="outlined"
      component={Link}
      to="/notes"
    >
      demo
    </Button>
  );
};

//Function used to immediately redirect user to auth0 login if they are using a pwa
// const useRedirectToLoginPwa = () => {
//   const [pwa, setPwa] = useState(null);

//   const { loginWithPopup } = useAuth0();
//   const history = useHistory();

//   useLayoutEffect(() => {
//     const login = async () => {
//       if (pwa !== null) return;
//       await loginWithPopup();
//       history.push("/notes");
//       setPwa(true);
//     };

//     if (isPwa() && pwa === null) login();
//     if (!isPwa() && pwa === null) setPwa(false);
//   });

//   return pwa;
// };
