"use client";

import React, { useState } from "react";
import { Message, Choice } from "@/types";
import MultipleChoiceBox from "@/components/MultipleChoiceBox";

/**
 * Provides an interactive story interface where users
 * can contribute text that gets added to a continuous narrative.
 * Includes a configuration panel on the right-hand side.
 */
const ChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState<string>("");
  const [panelOpen, setPanelOpen] = useState<boolean>(true);
  const [choiceData, setChoiceData] = useState<Choice | null>(null);

  // Handle form submission
  const handleSubmit = (e: React.FormEvent): void => {
    e.preventDefault();
    if (inputValue.trim()) {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          content: inputValue,
          sender: "user",
        },
      ]);
      setInputValue("");
    }

    // Add choices
    setChoiceData({
      description: "Choose how the story continues:",
      options: [
        "Option 1: The hero fights bravely",
        "Option 2: The hero runs away",
        "Option 3: The hero finds an ally",
      ],
    });
  };

  // Handle choice selection
  const handleChoiceSubmit = (selectedChoice: string) => {
    const aiMessage: Message = {
      id: Date.now(),
      content: `You chose: ${selectedChoice}`,
      sender: "ai",
    };
    setMessages((prev) => [...prev, aiMessage]);
    setChoiceData(null); // Clear choice box after submission
  };

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setInputValue(e.target.value);
  };

  // Toggle configuration panel
  const togglePanel = (): void => {
    setPanelOpen(!panelOpen);
  };

  // Clear story history
  const clearHistory = (): void => {
    setMessages([]);
  };

  return (
    <div className="flex h-screen bg-white">
      {/* Main Story Area */}
      <div className="flex-1 flex flex-col border-r border-gray-200">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 p-4 flex items-center justify-between">
          <h1 className="text-xl font-bold text-black">Interactive Story</h1>
          <button onClick={togglePanel} className="text-gray-600">
            ☰
          </button>
        </header>

        {/* Story Display */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="prose max-w-none">
            {messages.length > 0 ? (
              messages.map((msg) => (
                <p
                  key={msg.id}
                  className={`text-${msg.sender === "user" ? "black" : "blue-600"}`}
                >
                  {msg.content}
                </p>
              ))
            ) : (
              <p className="text-gray-600">
                Your story will appear here. Start typing to begin...
              </p>
            )}
          </div>

          {/* Choice Box */}
          {choiceData && (
            <MultipleChoiceBox
              description={choiceData.description}
              choices={choiceData.options}
              onSubmit={handleChoiceSubmit}
            />
          )}
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="p-4 bg-white border-t border-gray-200">
          <div className="flex items-center">
            <input
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              placeholder="Continue the story..."
              className="flex-1 p-2 border border-gray-300 rounded-l focus:outline-none focus:ring-1 focus:ring-gray-500 text-black"
            />
            <button type="submit" className="p-2 bg-blue-500 text-white rounded-r hover:bg-blue-600">
              Send
            </button>
          </div>
        </form>
      </div>

      {/* Right Configuration Panel */}
      <div className={`${panelOpen ? "w-64" : "w-0"} bg-white border-l border-gray-200 transition-all duration-300 overflow-hidden`}>
        <div className="p-4">
          <h2 className="text-xl font-bold mb-4 text-black">Configuration</h2>

          <div className="space-y-6">
            {/* AI Settings */}
            <div>
              <h3 className="font-medium mb-2 text-black">AI Settings</h3>
              <div className="space-y-3">
                <div className="flex items-center">
                  <input type="checkbox" id="enableAI" className="mr-2" />
                  <label htmlFor="enableAI" className="text-sm text-black">Enable AI Contributions</label>
                </div>

                <div>
                  <label className="block text-sm mb-1 text-black">AI Creativity</label>
                  <input
                    type="range"
                    min="0"
                    max="10"
                    step="1"
                    defaultValue="7"
                    className="w-full"
                    disabled
                  />
                </div>
              </div>
            </div>

            {/* Story Management */}
            <div>
              <h3 className="font-medium mb-2 text-black">Story Management</h3>
              <div className="space-y-2">
                <button className="w-full p-2 border border-gray-300 rounded hover:bg-gray-100">
                  Save Story
                </button>
                <button className="w-full p-2 border border-gray-300 rounded hover:bg-gray-100">
                  Load Story
                </button>
                <button
                  onClick={clearHistory}
                  className="w-full p-2 border border-gray-300 rounded hover:bg-gray-100 text-gray-900"
                >
                  Clear Story
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
