import { X } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";
import { useState } from "react";

const ChatHeader = () => {
  const { selectedUser, setSelectedUser } = useChatStore();
  const { onlineUsers } = useAuthStore();
  const [isImageOpen, setIsImageOpen] = useState(false);

  return (
    <div className="p-2.5 border-b border-base-300">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className="avatar">
            <div className="size-10 rounded-full relative">
              <img
                className="cursor-pointer"
                src={selectedUser.profilePic || "/avatar.png"}
                alt={selectedUser.fullName}
                onClick={() => setIsImageOpen(true)}
              />
            </div>
          </div>

          {/* User info */}
          <div>
            <h3 className="font-medium">{selectedUser.fullName}</h3>
            <p className="text-sm text-base-content/70">
              {onlineUsers.includes(selectedUser._id) ? "Online" : "Offline"}
            </p>
          </div>
        </div>

        {/* Close button */}
        <button onClick={() => setSelectedUser(null)}>
          <X />
        </button>
      </div>

      {isImageOpen && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-2xl flex items-center justify-center z-50"
          onClick={() => setIsImageOpen(false)}
        >
          <img
            src={selectedUser.profilePic || "/avatar.png"}
            alt="Full size Image"
            className="max-h-[90%] max-w-[90%] rounded-lg"
            onClick={(e) => e.stopPropagation()}
          />
          <button
            className="absolute top-4 right-4 text-primary-300 text-2xl p-2 bg-primary/30 rounded-full hover:bg-primary/20"
            onClick={() => setIsImageOpen(false)}
          >
            <X />
          </button>
        </div>
      )}
    </div>
  );
};
export default ChatHeader;
