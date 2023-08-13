import React, { useState } from "react";
import {
  auth,
  createUserWithEmailAndPassword,
  updateProfile,
  signInWithEmailAndPassword,
} from "../../firebase";
import { useDispatch } from "react-redux";
import { login } from "../../features/userSlice";
import "./Login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [profilePic, setProfilePic] = useState("");
  const dispatch = useDispatch();
  const [errorList, setErrorList] = useState({});
  const loginToApp = (e) => {
    e.preventDefault();
    let check = validate();
    console.log("check", check);
    if (Object.keys(check).length > 0) {
      setErrorList(check);
      return;
    } else {
      setErrorList({});
      signInWithEmailAndPassword(auth, email, password)
        .then((userAuth) => {
          dispatch(
            login({
              email: userAuth.user.email,
              uid: userAuth.user.uid,
              displayName: userAuth.user.displayName,
            })
          );
        })
        .catch((err) => {
          alert(err);
        });
    }
  };

  const validate = () => {
    let errors = {};
    if (!email) {
      errors.emailIsEmpty = "You need to enter your e-mail address";
    }
    if (email && !/\S+@\S+\.\S+/.test(email)) {
      errors.emailFormatInvalid = "Your e-mail format doesn't seem right";
    }

    if (!password) {
      errors.passIsEmpty = "You need a password";
    }

    if (password && password.length <= 4)
      errors.passIsStrong = "You need a stronger password";

    return errors;
  };

  const register = () => {
    if (!name) {
      return alert("Please enter a full name");
    }

    console.log("register the user");

    createUserWithEmailAndPassword(auth, email, password)
      .then((userAuth) => {
        updateProfile(userAuth.user, {
          displayName: name,
          photoURL: profilePic,
        })
          .then(
            dispatch(
              login({
                email: userAuth.user.email,
                uid: userAuth.user.uid,
                displayName: name,
                photoUrl: profilePic,
              })
            )
          )
          .catch((error) => {
            console.log("user not updated");
          });
      })
      .catch((err) => {
        alert(err);
      });
  };

  return (
    <div className="login">
      <img src="Linkedin_Logo_text.svg" alt="" />
      <form>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Full name (required if registering)"
          type="text"
        />

        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          type="email"
        />
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          type="password"
        />
        {errorList.emailIsEmpty && (
          <small className="error">{errorList.emailIsEmpty}</small>
        )}
        {errorList.emailFormatInvalid && (
          <small className="error">{errorList.emailFormatInvalid}</small>
        )}
        {errorList.passIsStrong && (
          <small className="error">{errorList.passIsStrong}</small>
        )}
        {errorList.passIsEmpty && (
          <small className="error">{errorList.passIsEmpty}</small>
        )}
        <button type="submit" onClick={loginToApp}>
          Sign In
        </button>
      </form>

      <p>
        Not a member?{" "}
        <span className="login__register" onClick={register}>
          Register Now
        </span>
      </p>
    </div>
  );
}

export default Login;
