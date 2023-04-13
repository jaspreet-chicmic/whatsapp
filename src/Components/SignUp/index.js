import { createUserWithEmailAndPassword } from "firebase/auth";
import {
  addDoc,
  collection,
  doc,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { messageContext } from "../../App";
import { auth, db } from "../../firebase";
import { NAME_ERROR_STRING } from "../ConstantStrings";
import { errorDisplay } from "../Utillities/errorDisplay";
import { IMAGES } from "../Utillities/Images";

function SignUp() {
  const [name, setName] = useState("");
  const navigate = useNavigate();
  const {
    errorMessage,
    setErrorMessage,
    email,
    setEmail,
    password,
    setPassword,
  } = useContext(messageContext);

  useEffect(() => {
    setName("");
    setEmail("");
    setPassword("");
    setErrorMessage("");
  }, []);

  // useEffect(()=>{
  //     if(name == "") {
  //         setErrorMessage("Invalid Name")
  //         // throw new Error("Invalid Name");        }
  // },[name])

  const signUpEmailPassword = async () => {
    const signupEmail = email;
    const signupPassword = password;
    try {
      console.log("name<><><>", name);
      if (name == "") throw new Error(NAME_ERROR_STRING);

      console.log(" Sign up in  ", email, password);
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        signupEmail,
        signupPassword
      );
      console.log("userCredential signup", userCredential);
      const { uid } = auth.currentUser;
      await setDoc(doc(db, "users", uid), {
        uid,
        name,
        email,
        avatar: IMAGES.default, //random array dp generator
        createdAt: serverTimestamp(),
        lastMessage:"",
        lastMessageDate:""
        // details: {uid,email,name,avatar,}
      });
      console.log("name ", name, errorMessage);
      navigate(`/LiveChat/${auth.currentUser.uid}`);
    } catch (error) {
      console.log("error ", error);
      errorDisplay(error, email, setErrorMessage);
      // showLoginError(error);
    }
  };
  return (
    <div>
      <h3>Please Register...</h3>
      <input
        className="textInput"
        id="userName"
        value={name}
        onChange={(e) => {
          setName(e.target.value);
        }}
        type="text"
        placeholder="Enter Name..."
        required
        // onKeyDown={handleEnter}
      />
      <input
        className="textInput"
        id="userEmail"
        value={email}
        onChange={(e) => {
          setEmail(e.target.value);
        }}
        type="text"
        placeholder="Enter email..."
        // onKeyDown={handleEnter}
      />
      <input
        className="textInput"
        id="userPassword"
        value={password}
        onChange={(e) => {
          setPassword(e.target.value);
        }}
        type="password"
        placeholder="Enter Password..."
        // onKeyDown={handleEnter}
      />
      <br />
      <br />
      <button onClick={signUpEmailPassword}>Sign Up</button>
      <button onClick={() => navigate("/SignIn")}>Existing User, SignIn</button>
      <p style={{ color: "red" }}>{errorMessage}</p>
    </div>
  );
}

export default SignUp;
