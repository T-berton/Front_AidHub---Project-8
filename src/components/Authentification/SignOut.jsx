import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";



export default function SignOut(){
   const navigate = useNavigate();
   const {logOut} = useContext(AuthContext);

   logOut();
   navigate('/');
}