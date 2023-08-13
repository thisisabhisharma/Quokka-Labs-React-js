import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./App.css";
import { login, logout, selectUser } from "./features/userSlice";
import { auth, onAuthStateChanged } from "./firebase";
import Login from "./components/Login/Login";
import Header from "./components/Header/Header";
import { slide as Menu } from "react-burger-menu";
function App() {
  const user = useSelector(selectUser);
  const dispatch = useDispatch();
  console.log("user", user);
  useEffect(() => {
    onAuthStateChanged(auth, (userAuth) => {
      if (userAuth) {
        dispatch(
          login({
            email: userAuth.email,
            uid: userAuth.uid,
            displayName: userAuth.displayName,
            photoUrl: userAuth.photoURL,
          })
        );
      } else {
        dispatch(logout());
      }
    });
    console.log("page loaded");
  }, []);

  return (
    <div className="app">
      <Menu>
      <h1 style={{ color: "white" }}>Dashboard</h1>
        <Header />
      <p style={{position: 'absolute', bottom: 0}}>Version 1.0.0</p>
      </Menu>
      {!user ? (
        <Login />
      ) : (
        <div className="app__body">
          <div>
            <h1>Hello {user.displayName}!</h1>
            <p>{user.email}</p>
            <img src={user.photoUrl} alt="" />
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
