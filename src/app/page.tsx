"use client"

import React, { useState } from 'react';

import { Message } from "@/types"
 
/**
 * Provides an interactive story interface where users
 * can contribute text that gets added to a continuous narrative.
 * As well as a configuration panel on the right hand side.
 */
const ChatInterface: React.FC = () => {
  // Stores all message contributions to the story
  const [messages, setMessages] = useState<Message[]>([]);

  // Manages the current input value in the text field
  const [inputValue, setInputValue] = useState<string>('');

  // Controlles the visibility of the right configuration panel
  const [panelOpen, setPanelOpen] = useState<boolean>(true);

  /**
   * Handles form submission when user adds text to the story
   */
  const handleSubmit = (e: React.FormEvent): void => {
    e.preventDefault();
    
    if (inputValue.trim()) {
      // Add user message to the story
      setMessages([...messages, { 
        id: Date.now(),
        content: inputValue,
        sender: 'user'
      }]);
      
      // Clear input field
      setInputValue('');
    }
  };

  /**
   * Updates the input state as the user types
   */
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setInputValue(e.target.value);
  };

  /**
   * Toggles the visibility of the configuration panel
   */
  const togglePanel = (): void => {
    setPanelOpen(!panelOpen);
  };

  /**
   * Clears all story messages and resets to an empty story
   */
  const clearHistory = (): void => {
    setMessages([]);
  };

  // Combine all messages into a continuous story
  const storyText = messages.map(msg => msg.content).join(' ');

  return (
    <div className="flex h-screen bg-white">
      {/* Main Story Area */}
      <div className="flex-1 flex flex-col border-r border-gray-200">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 p-4 flex items-center justify-between">
          <h1 className="text-xl font-bold text-black">Interactive Story</h1>
          <button 
            onClick={togglePanel}
            className="text-gray-600"
          >
            ☰
          </button>
        </header>

        {/* Story Text */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="prose max-w-none">
            {storyText ? (
              <p className="text-black">{storyText}</p>
            ) : (
              <p className="text-gray-600">Your story will appear here. Start typing to begin...</p>
            )}
          </div>
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
          </div>
        </form>
      </div>

      {/* Right Panel */}
      <div className={`${panelOpen ? 'w-64' : 'w-0'} bg-white border-l border-gray-200 transition-all duration-300 overflow-hidden`}>
        <div className="p-4">
          <h2 className="text-xl font-bold mb-4 text-black">Configuration</h2>
          
          <div className="space-y-6">
            {/* AI Settings (for future use) */}
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