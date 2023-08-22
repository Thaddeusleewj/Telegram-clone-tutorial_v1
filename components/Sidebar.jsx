import React from "react";
import Image from "next/image";
import DefaultImage from "../public/images/default.png";

import Card from "./Card";
import ChatCard from "./ChatCard";
import CardLoader from "./CardLoader";

import { FiMenu } from "react-icons/fi";
import { AiOutlineSearch } from "react-icons/ai";
import { IoMdClose } from "react-icons/io";

import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../firebase";
import {
  collection,
  setDoc,
  doc,
  query,
  where,
  serverTimestamp,
} from "firebase/firestore";
import { useCollection } from "react-firebase-hooks/firestore";
import { signOut } from "firebase/auth";

const Sidebar = () => {
  // useState Logic
  const [search, setSearch] = React.useState("");
  const [user, loading] = useAuthState(auth);

  // Logout functionality
  const logout = async () => {
    if (user) {
    // using the server timestamp function in firebase to find out the time when the user logged out
      await setDoc(
        doc(db, "users", user?.uid),
        {
          name: user?.displayName,
          email: user?.email,
          imageURL: user?.photoURL,
          online: false,
          lastSeen: serverTimestamp(),
        },
        { merge: true }
      );
    }

    await signOut(auth);
  };

  // Passing firestore collection
  const usersRef = collection(db, "users");
  // Getting and logging the snapshot of the collection
  const [userSnapshot, loading2] = useCollection(usersRef);
  // console.log(userSnapshot?.docs[0]?.data());

  const chatsRef = collection(db, "chats");
  const q = query(chatsRef, where("users", "array-contains", user?.email));
  // Getting and logging the snapshot of the collection
  const [chatSnapshot, loading3] = useCollection(q);

  return (
    <div className="w-[600px] h-screen p-5 bg-[#272727]">
      <div className="flex items-center w-full space-x-4">
        <div>
          <button className="text-2xl group">
            <FiMenu />
            {/* need to add priority to avoid console warnings */}
            <div className="w-[300px] rounded-b-xl rounded-tr-xl absolute bg-[#4f4f4f92] flex flex-col justify-center items-center p-5 top-16 left-12 backdrop-blur-sm -z-[1] opacity-0 group-focus:z-[1] group-focus:opacity-100">
              <div className="w-[100px] h-[100px] overflow-hidden border rounded-full">
                <Image
                  src={user?.photoURL}
                  width={100}
                  height={100}
                  priority={true}
                  quality={100}
                  alt=""
                />
              </div>
              <div className="w-full">
                <h1 className="text-xl my-2">{user?.displayName}</h1>
                <div
                  className="text-xl bg-[#fff] w-full text-black py-1 rounded-md hover:bg-[#92929275] transition-colors hover:text-white cursor-pointer"
                  onClick={logout}
                >
                  Logout
                </div>
              </div>
            </div>
          </button>
        </div>
        <div className="relative w-full flex items-center">
          <div className="text-xl absolute left-3">
            <AiOutlineSearch />
          </div>
          <input
            type="text"
            className="border bg-transparent w-full px-10 py-2 rounded-full border-[#494949] outline-none focus:border-[#cd71ff]"
            placeholder="Search Here"
            onChange={(e) => setSearch(e.target.value)}
            value={search}
          ></input>
          {search.length > 0 && (
            <button
              className="absolute right-4 text-2xl"
              onClick={() => {
                setSearch();
              }}
            >
              <IoMdClose />
            </button>
          )}
        </div>
      </div>
      <div
        className={
          search.length > 0
            ? "w-full h-scree overflow-y-auto mt-5 transition-all"
            : "w-full h-0 overflow-y-auto mt-5 transition-all"
        }
      >
        {/* mapping through the userSnapshot and displaying the cards */}
        {/* removing your own user profile and displaying the rest of the users */}
        {!loading2 ? (
          userSnapshot?.docs?.map((items) => {
            if (
              items.data().name.toLowerCase().includes(search.toLowerCase()) &&
              items.data().name !== user?.displayName
            ) {
              return (
                <Card
                  key={items.id}
                  name={items.data().name}
                  imageURL={items.data().imageURL}
                  email={items.data().email}
                  id={items.id}
                  setSearch={setSearch}
                />
              );
            }
          })
        ) : (
          <div>
            <CardLoader />
            <CardLoader />
            <CardLoader />
          </div>
        )}
      </div>
      <div className="w-full h-screen overflow-y-auto mt-5 transition-all">
        {!loading3 ? (
          // Mapping through to get all chats
          chatSnapshot?.docs?.map((chat) => {
            // passing the id of the chat to the ChatCard component
            return <ChatCard key={chat.id} chatData={chat} />;
          })
        ) : (
          <div>
            <CardLoader />
            <CardLoader />
            <CardLoader />
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
