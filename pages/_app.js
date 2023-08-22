import "@/styles/globals.css";
import Sidebar from "../components/Sidebar";
import Login from "../components/Login";

import {useEffect} from "react";

import { useAuthState} from "react-firebase-hooks/auth";
import { auth, db } from "../firebase";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";

import Loading from "../components/Loading";

export default function App({ Component, pageProps }) {
  // Gets the auth state of the user from firebase
  const [user, loading] = useAuthState(auth);

  // useEffect method with firestore
  useEffect(() => {
    window.addEventListener("beforeunload", function (e) {
      let confirmationMessage = "Do you want to leave this site?";
      (e || window.event).returnValue = confirmationMessage;

      if (user) {
        setDoc(doc(db, "users", user?.uid), {
          name: user?.displayName,
          email: user?.email,
          imageURL: user?.photoURL,
          online: false,
        }, {merge: true});
      } 
    });

    if (user) {
      setDoc(doc(db, "users", user?.uid), {
        name: user?.displayName,
        email: user?.email,
        imageURL: user?.photoURL,
        online: true,
        lastSeen: serverTimestamp(),
      }, {merge: true}); // getting online status of user
    }
  });

  if (loading) return <Loading />;
  if (!user) return <Login />;
  console.log(user);

  return (
    <div className="flex">
      <Sidebar />
      <Component {...pageProps} />
    </div>
  );
}
