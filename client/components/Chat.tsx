import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { getDatabase, ref, onValue, push, update } from "firebase/database";
import { useAuth } from "../contexts/AuthContext";

import Avatar from "react-avatar";
import "../styles/Chat.scss";
import { IChatMessage } from "../types/main";

const Chat = () => {
  const navigate = useNavigate();
  const { ID } = useParams();
  const db = getDatabase();
  const messagesRef = ref(db, "teams/" + ID + "/messages");
  //   const { currentUser } = useAuth();
  const currentUser = useAuth()?.currentUser;

  interface DependData {
    [key: string]: string;
  }
  const dummy = useRef<HTMLDivElement>(null);
  //   const h1Ref = useRef<HTMLHeadingElement>(null);
  const [messages, setMessages] = useState<IChatMessage[]>();
  const [input, setInput] = useState("");

  // Messages tracker
  useEffect(() => {
    const detach = onValue(ref(db, "teams/" + ID + "/messages"), (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const newData: Array<IChatMessage> = [];
        for (let msg in data) newData.push({ ...data[msg], id: msg });

        const sortedArray = newData.sort((a, b) => {
          if (a.timestamp < b.timestamp) return -1;
          if (a.timestamp > b.timestamp) return 1;
          return 0;
        });

        setMessages(sortedArray);
        // console.log('New message')
      }
    });

    return () => detach();
  }, [db, ID]);

  // Kick tracker
  useEffect(() => {
    const detach = onValue(ref(db, "teams/" + ID + "/members/"), (snapshot) => {
      if (!snapshot.exists()) return navigate("/t/add", { replace: true });
      if (!snapshot.val()[currentUser!.displayName])
        navigate("/t/add", { replace: true });
    });
    return () => detach();
  });

  const sendMessage = (e: any) => {
    e.preventDefault();
    if (!input) return false;
    const newMsgID = push(messagesRef).key;
    // update(ref(db, 'teams/' + ID + '/messages/' + newMsgID), {text: input, user: currentUser.displayName, date: new Date()})
    const updates: any = {};
    updates["lastMessage"] = { text: input, user: currentUser?.displayName };
    updates["/messages/" + newMsgID] = {
      text: input,
      user: currentUser?.displayName,
      timestamp: new Date(),
    };
    update(ref(db, "teams/" + ID), updates);
    setInput("");
  };

  useEffect(() => {
    if (dummy.current !== null)
      dummy.current.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div id="chat-container">
      <div id="chat-box" className="d-flex flex-column">
        {messages?.map((message) =>
          message?.type === "prompt" ? (
            <div key={message.id} className="prompt">
              {message.text}
            </div>
          ) : (
            <div
              className={`chat-message d-flex gap-3 mt-3 m-0 ${
                currentUser?.displayName === message.user
                  ? "justify-content-end"
                  : ""
              } `}
              key={message.id}
            >
              <Avatar
                className={`p-0 ${
                  currentUser?.displayName === message.user ? "order-2" : ""
                }`}
                name={message.user}
                round={true}
                size="40"
                textSizeRatio={2}
              />
              <div className="chat-message-text px-4 d-flex align-items-center">
                {message.text}
              </div>
            </div>
          )
        )}
        <div ref={dummy}></div>
      </div>

      <form id="chat-form" onSubmit={(e) => sendMessage(e)}>
        <input
          id="chat-form-input"
          type="text"
          className="form-control"
          placeholder="Type something"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button className="btn btn-outline-primary rounded-pill" type="submit">
          Send
        </button>
      </form>
    </div>
  );
};

export default Chat;
