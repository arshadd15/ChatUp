import React, { useEffect, useRef, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessageSkeleton from "./skeletons/MessageSkeleton";
import { useAuthStore } from "../store/useAuthStore";
import { formatMessageTime } from "../lib/utils";
import { X } from "lucide-react";

const ChatContainer = ({ isMobile = false }) => {
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
  const [selectedImage, setSelectedImage] = useState(null);

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
      <div className="flex-1 flex flex-col">
        <ChatHeader />
        <MessageSkeleton />
        <MessageInput />
      </div>
    );

  return (
    <div className="flex-1 flex flex-col">
      {isMobile ? (
        <div className="fixed top-16 z-10 left-0 right-0 bg-base-100">
          <ChatHeader />
        </div>
      ) : (
        <ChatHeader />
      )}
      <div className="flex-1 overflow-y-auto mt-8 lg:mt-0 p-4 space-y-4">
        {messages.map((message) => (
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
                  className="sm:max-w-[200px] rounded-md mb-2 cursor-pointer"
                  loading="lazy"
                  onLoad={() => {
                    if (messageEndRef.current) {
                      messageEndRef.current.scrollIntoView({
                        behavior: "smooth",
                      });
                    }
                  }}
                  onClick={() => setSelectedImage(message.image)}
                />
              )}
              {message.text && <p>{message.text}</p>}
            </div>
          </div>
        ))}
        <div className="h-0 w-0 overflow-hidden" ref={messageEndRef} />
        {selectedImage && (
          <div
            className="fixed inset-0  bg-black/30 backdrop-blur-2xl flex items-center justify-center z-50"
            onClick={() => setSelectedImage(null)}
          >
            <img
              src={selectedImage}
              alt="Full size Image"
              className="max-h-[80%] max-w-[80%] rounded-lg"
              onClick={(e) => e.stopPropagation()}
            />
            <button
              className="absolute top-4 right-4 text-primary-300 text-2xl p-2 bg-primary/30 rounded-full hover:bg-primary/20"
              onClick={() => setSelectedImage(null)}
            >
              <X />
            </button>
          </div>
        )}
      </div>
      <MessageInput />
    </div>
  );
};

export default ChatContainer;
