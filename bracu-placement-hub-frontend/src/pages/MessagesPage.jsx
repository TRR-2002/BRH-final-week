import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import Navbar from "../components/Navbar";
import api from "../api/axiosConfig";

function MessagesPage() {
  const navigate = useNavigate();
  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [messageHistory, setMessageHistory] = useState([]);
  const [newMessageContent, setNewMessageContent] = useState("");

  const [loadingConversations, setLoadingConversations] = useState(true);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [showComposeModal, setShowComposeModal] = useState(false);
  const [error, setError] = useState("");

  const chatEndRef = useRef(null);
  const loggedInUser = JSON.parse(localStorage.getItem("user")); // Get user info stored on login

  // Function to fetch the main conversation list
  const fetchConversations = async () => {
    try {
      const response = await api.get("/messages/conversations");
      if (response.data.success) {
        setConversations(response.data.conversations || []);
      }
    } catch (err) {
      setError("Failed to load conversations.");
      console.error(err);
    } finally {
      setLoadingConversations(false);
    }
  };

  useEffect(() => {
    fetchConversations();
    const interval = setInterval(fetchConversations, 10000); // Poll every 10 seconds
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchHistory = async () => {
      if (!activeConversation) return;
      setLoadingHistory(true);
      setMessageHistory([]);
      try {
        const response = await api.get(
          `/messages/history/${activeConversation.withUser._id}`
        );
        if (response.data.success) {
          setMessageHistory(response.data.messages || []);
        }
      } catch (err) {
        setError("Failed to load message history.");
      } finally {
        setLoadingHistory(false);
      }
    };
    fetchHistory();
  }, [activeConversation]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messageHistory]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessageContent.trim() || !activeConversation) return;
    try {
      const response = await api.post("/messages/send", {
        recipientId: activeConversation.withUser._id,
        content: newMessageContent,
      });
      setMessageHistory((prev) => [...prev, response.data.messageData]);
      setNewMessageContent("");
      fetchConversations();
    } catch (err) {
      alert("Failed to send message.");
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-100 flex flex-col">
        <div className="flex-grow flex h-[calc(100vh-4rem)]">
          <div className="w-full md:w-1/3 border-r bg-white flex flex-col">
            <div className="p-4 border-b flex justify-between items-center">
              <h1 className="text-xl font-bold text-gray-800">Messages</h1>
              <button
                onClick={() => setShowComposeModal(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md font-semibold text-sm hover:bg-blue-700"
              >
                New Message
              </button>
            </div>

            <div className="flex-grow overflow-y-auto">
              {loadingConversations ? (
                <p className="p-4 text-gray-500">Loading...</p>
              ) : conversations.length === 0 ? (
                <p className="p-4 text-gray-500 text-center">
                  No messages yet.
                </p>
              ) : (
                conversations.map((convo) => (
                  <div
                    key={convo.withUser._id}
                    onClick={() => setActiveConversation(convo)}
                    className={`p-4 cursor-pointer border-l-4 ${
                      activeConversation?.withUser._id === convo.withUser._id
                        ? "bg-blue-50 border-blue-500"
                        : "hover:bg-gray-50 border-transparent"
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <p className="font-semibold">{convo.withUser.name}</p>
                      {convo.unreadCount > 0 && (
                        <span className="bg-blue-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                          {convo.unreadCount}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 truncate">
                      {convo.lastMessage.content}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {formatDistanceToNow(
                        new Date(convo.lastMessage.createdAt),
                        { addSuffix: true }
                      )}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="w-full md:w-2/3 flex flex-col">
            {activeConversation ? (
              <>
                <div className="p-4 border-b bg-white">
                  <h2 className="text-lg font-bold">
                    {activeConversation.withUser.name}
                  </h2>
                </div>
                <div className="flex-grow p-6 overflow-y-auto bg-gray-50">
                  {loadingHistory ? (
                    <p>Loading history...</p>
                  ) : (
                    messageHistory.map((msg) => (
                      <div
                        key={msg._id}
                        className={`flex ${
                          msg.sender === loggedInUser?.id
                            ? "justify-end"
                            : "justify-start"
                        } mb-4`}
                      >
                        <div
                          className={`max-w-md p-3 rounded-lg ${
                            msg.sender === loggedInUser?.id
                              ? "bg-blue-500 text-white"
                              : "bg-white shadow"
                          }`}
                        >
                          <p>{msg.content}</p>
                          <p
                            className={`text-xs mt-1 text-right ${
                              msg.sender === loggedInUser?.id
                                ? "text-blue-100"
                                : "text-gray-400"
                            }`}
                          >
                            {new Date(msg.createdAt).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                  <div ref={chatEndRef} />
                </div>
                <div className="p-4 bg-white border-t">
                  <form onSubmit={handleSendMessage} className="flex gap-2">
                    <input
                      type="text"
                      value={newMessageContent}
                      onChange={(e) => setNewMessageContent(e.target.value)}
                      placeholder="Type your message here..."
                      className="flex-grow p-3 border rounded-md"
                    />
                    <button
                      type="submit"
                      className="px-6 py-2 bg-blue-600 text-white rounded-md font-semibold"
                    >
                      Send
                    </button>
                  </form>
                </div>
              </>
            ) : (
              <div className="flex-grow flex items-center justify-center bg-gray-50 text-center text-gray-500">
                <div>
                  <p className="text-lg">
                    Select a conversation to start chatting
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
        {showComposeModal && (
          <ComposeModal
            onClose={() => setShowComposeModal(false)}
            onConversationStart={setActiveConversation}
          />
        )}
      </div>
    </>
  );
}

const ComposeModal = ({ onClose, onConversationStart }) => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleStartChat = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const response = await api.get(
        `/users/find-by-email?email=${email.trim()}`
      );
      if (response.data.success) {
        // To start a chat, we need to create a temporary conversation object
        // and then navigate to the main messages page which will handle loading the history.
        // A better UX might be to pass this user object in state.
        onClose();
        navigate(0); // Simple reload to refresh conversation list
      }
    } catch (err) {
      setError(err.response?.data?.error || "User not found.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">New Message</h2>
        <form onSubmit={handleStartChat}>
          <label className="block text-gray-700 font-semibold mb-2">
            To (User's Email):
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="user@example.com"
            className="w-full p-2 border rounded-md"
            required
          />
          {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
          <div className="flex justify-end gap-3 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 rounded-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-md"
            >
              {loading ? "Searching..." : "Start Chat"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MessagesPage;
