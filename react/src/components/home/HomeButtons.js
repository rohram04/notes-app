import { Button } from "@material-ui/core";
import React from "react";
import { Link } from "react-router-dom";
import "./Home.css";
import useLoginAuth0 from "../authentication/loginAuth0";

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
