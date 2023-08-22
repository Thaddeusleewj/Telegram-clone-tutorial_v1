import React from "react";

const Message = ({ msg }) => {
  // Accessing the message property form firestore
  const message = msg?.data()?.message;
  const createdAt = msg?.data()?.createdAt;
  const newDate = new Date(createdAt?.seconds * 1000);
  console.log(createdAt);

  const time = newDate
    .toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    })
    .slice(0, 5);
  console.log(time);

  // Displaying the message as well as timing
  return (
    <div className="min-w-[100px] bg-[#ff910058] p-2 rounded-b-xl rounded-tr-xl">
      {message}
      <div className="w-full text-end">
        {time}{
            // differentiating between AM and PM
            time >= 12 ? "PM" : "AM"
        }
      </div>
    </div>
  );
};

export default Message;
