import React, { useState, useEffect } from "react";

import Image from "next/image";
import DefaultImage from "../../public/images/default.png";

import Message from "../../components/Message";
import { auth, db } from "../../firebase";
import {
  collection,
  addDoc,
  serverTimestamp,
  query,
  orderBy,
  where,
} from "firebase/firestore";
import { doc, getDoc } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollection } from "react-firebase-hooks/firestore";

import { MdSend } from "react-icons/md";

export async function getServerSideProps(context) {
  const id = context.query.id;
  const docRef = doc(db, "chats", id);

  const docSnap = await getDoc(docRef);
  console.log(docSnap?.data());

  const chatData = JSON.stringify(docSnap?.data());
  return {
    props: {
      id,
      chatData,
    },
  };
}

const Id = ({ id, chatData }) => {
  // useState Logic
  const [message, setMessage] = React.useState("");
  const [user, loading] = useAuthState(auth);

  // Getting all messages / message history
  // order the chat messages by the time they were created
  const messagesRef = collection(db, "messages");
  const q = query(messagesRef, orderBy("createdAt", "asc"));
  const [messagesSnapshot, loading2] = useCollection(q);

  // Creating and pushing all new messages to the messages table
  const createMessage = async (e) => {
    e.preventDefault(e);
    const docRef = await addDoc(collection(db, "messages"), {
      message: message,
      user: user?.email,
      chatId: id,
      createdAt: serverTimestamp(),
    });

    // Once message has been sent, clear the input field
    setMessage("");
  };
  const data = JSON.parse(chatData);
  const recieverEmail = data?.users?.filter(
    (item) => item !== user?.email
  )?.[0];

  console.log(recieverEmail);

  const usersRef = collection(db, "users");
  const q2 = query(usersRef, where("email", "==", recieverEmail));
  const [userSnapshot, loading3] = useCollection(q2);

  const name = userSnapshot?.docs[0]?.data()?.name;
  const imageURL = userSnapshot?.docs[0]?.data()?.imageURL;
  // check if the user is online
  const online = userSnapshot?.docs[0]?.data()?.online;
  // Pulling last seen timing from firestore
  const lastSeen = userSnapshot?.docs[0]?.data()?.lastSeen;

  const newDate = new Date(lastSeen?.seconds * 1000);

  const time = newDate.toLocaleString("en-US", {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  });

  const date = newDate.toLocaleDateString();

  return (
    <div className="gradient w-full h-screen overflow-hidden">
      <div className="w-full p-5 bg-[#00000044] backdrop-blur-sm flex items-center space-x-5">
        <div>
          <Image
            src={imageURL || DefaultImage}
            width={70}
            height={70}
            priority={true}
            quality={100}
            alt=""
            className="rounded-full"
          />
        </div>
        <div>
          <div>{name}</div>
          <div>
            Last Seen at {time || ""} on {date || ""}
          </div>
        </div>
      </div>
      <div className="w-full h-[77vh] overflow-y-auto overflow-x-hidden p-5">
        {messagesSnapshot?.docs?.map((msg) => {
          if (msg?.data()?.chatId === id) {
            console.log(msg.id);
            return (
              <div
                key={msg.id}
                className={
                  msg.data().user == user?.email
                    ? "w-full flex justify-end mb-5"
                    : "w-full flex mb-5"
                }
              >
                <Message msg={msg} />
              </div>
            );
          }
        })}
      </div>
      <form
        onSubmit={createMessage}
        className="w-full p-5 bg-[#00000044] backdrop-blur-sm h-full"
      >
        <div className="flex items-center relative">
          <input
            type="text"
            className="w-full border pr-10 pl-5 py-4 bg-transparent rounded-full outline-none focus:border-[#cd71ff]"
            onChange={(e) => setMessage(e.target.value)}
            value={message}
            placeholder="Type Here..."
            required
          />
          <button className="text-3xl absolute right-4">
            <MdSend />
          </button>
        </div>
      </form>
    </div>
  );
};

export default Id;
