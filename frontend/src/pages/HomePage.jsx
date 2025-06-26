import React from "react";
import { useChatStore } from "../store/useChatStore";
import Sidebar from "../components/Sidebar";
import NoChatSelected from "../components/NoChatSelected";
import ChatContainer from "../components/ChatContainer";

const HomePage = () => {
  const { selectedUser } = useChatStore();
  return (
    <div className="h-full lg:h-screen bg-base-200">
      <div className="flex items-center justify-center pt-16 lg:pt-20 lg:px-4">
        <div className="bg-base-100 rounded-lg shadow-cl w-full max-w-6xl h-[calc(100vh-6rem)]">
          <div className="flex h-full rounded-lg overflow-hidden">
            {/* Mobile View: Show only Sidebar or ChatContainer */}
            <div className="flex w-full lg:hidden">
              {!selectedUser ? (
                <Sidebar isMobile />
              ) : (
                <ChatContainer isMobile />
              )}
            </div>

            {/* Desktop View */}
            <div className="hidden lg:flex w-full">
              <Sidebar />
              {!selectedUser ? <NoChatSelected /> : <ChatContainer />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
