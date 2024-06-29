import { useHistory } from "react-router-dom";
import { useEffect } from "react";
import { useToasts } from "react-toast-notifications";

const Logout = () => {
  const { addToast } = useToasts();
  const history = useHistory();
  useEffect(() => {
    const logOut = () => {
      console.log("Log out click");
      addToast("Logout success", { appearance: "success", autoDismiss: true });
      // Clear the token from localStorage
      localStorage.removeItem("token");
      history.push("/login");
    };
    logOut();
  }, []);
  return "";
};
export default Logout;
