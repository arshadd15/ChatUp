import React, { useEffect } from "react";
import { useChatStore } from "../store/useChatStore";
import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessageSkeleton from "./skeletons/MessageSkeleton";
import { useAuthStore } from "../store/useAuthStore";
import { formatMessageTime } from "../lib/utils";
import { useRef } from "react";

const ChatContainer = () => {
  const {
    messages,
    getMessages,
    isMessagesLoading,
    selectedUser,
    subscribeToMessages,
    unSubscribeFromMessages,
  } = useChatStore();
  const { authUser } = useAuthStore();
  const messageEndRef = useRef(null);

  useEffect(() => {
    if (!selectedUser._id) return;

    getMessages(selectedUser._id);
    subscribeToMessages();

    return () => unSubscribeFromMessages();
  }, [selectedUser, getMessages, unSubscribeFromMessages, subscribeToMessages]);

  useEffect(() => {
    if (messageEndRef.current && messages) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  if (isMessagesLoading)
    return (
      <div className="flex-1 flex flex-col overflow-auto">
        <ChatHeader />
        <MessageSkeleton />
        <MessageInput />
      </div>
    );

  return (
    <div className="flex-1 flex flex-col overflow-auto">
      <ChatHeader />
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, keyId) => (
          <div
            key={message._id}
            className={`chat ${
              message.senderId === authUser._id ? "chat-end" : "chat-start"
            }`}
          >
            <div className="chat-image avatar">
              <div className="size-10 rounded-full border">
                <img
                  src={
                    message.senderId === authUser._id
                      ? authUser.profilePic || "/avatar.png"
                      : selectedUser.profilePic || "/avatar.png"
                  }
                  alt=" Profile Picture"
                />
              </div>
            </div>

            <div className="chat-header mb-1">
              <time className="text-xs opacity-35">
                {formatMessageTime(message.createdAt)}
              </time>
            </div>

            <div
              className={`chat-bubble flex flex-col  ${
                message.senderId === authUser._id
                  ? "chat-bubble-primary"
                  : "chat-bubble"
              }`}
            >
              {message.image && (
                <img
                  src={message.image}
                  alt="attachment"
                  className="sm:max-w-[200px] rounded-md mb-2"
                  onLoad={() => {
                    if (messageEndRef.current) {
                      messageEndRef.current.scrollIntoView({
                        behavior: "smooth",
                      });
                    }
                  }}
                />
              )}
              {message.text && <p>{message.text}</p>}
            </div>
          </div>
        ))}
        <div className="h-0 w-0 overflow-hidden" ref={messageEndRef} />
      </div>
      <MessageInput />
    </div>
  );
};

export default ChatContainer;
