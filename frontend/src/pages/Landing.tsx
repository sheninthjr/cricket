import { useRecoilValue } from "recoil";
import { userEmail } from "../store/atoms/user";
import Players from "./Player";
import Login from "./Login";

export const Landing = () => {
  const user = useRecoilValue(userEmail);
  return <>{user ? <Players /> : <Login />}</>;
};
