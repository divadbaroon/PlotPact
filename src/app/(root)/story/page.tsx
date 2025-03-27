'use client';

import React, { useEffect, useState } from 'react';
// import { Message, Choice } from '@/types';
import MultipleChoiceBox from '@/components/MultipleChoiceBox';

import { startChat } from '@/app/actions/startChat';
import { sendAnswer } from '@/app/actions/sendAnswer';

const ChatInterface: React.FC = () => {
  // const [messages, setMessages] = useState<Message[]>([]);

  const [panelOpen, setPanelOpen] = useState<boolean>(true);

  const [chatId, setChatId] = useState<string | null>(null);
  const [accumulatedText, setAccumulatedText] = useState<string>('');
  const [question, setQuestion] = useState<string | null>(null);
  const [choices, setChoices] = useState<string[]>([]);
  const [selectedChoice, setSelectedChoice] = useState<string>('');
  const [eos, setEos] = useState<boolean>(false);
  const [isIncorrect, setIsIncorrect] = useState<boolean>(false);

  useEffect(() => {
    const initChat = async () => {
      try {
        // const res = await fetch('http://localhost:4000/api/start', {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        // });

        // const data = await res.json();

        const data = await startChat();

        setChatId(data.chatId);
        if (data.para) {
          setAccumulatedText((prev) => prev + data.para);
        }
        setQuestion(data.question);
        setChoices(data.choices);
        setEos(data.eos);
        setIsIncorrect(false);
      } catch (error) {
        console.error('Error initializing chat:', error);
      }
    };

    initChat();
  }, []);

  const handleSubmit = async () => {
    if (!selectedChoice || !chatId || eos) return;

    try {
      // const res = await fetch('http://localhost:4000/api/chat', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ chatId, answer: selectedChoice }),
      // });
      // const data = await res.json();

      const data = await sendAnswer(chatId, selectedChoice);

      if (data.para) {
        setAccumulatedText((prev) => prev + data.para);
        setIsIncorrect(false);
      } else {
        setIsIncorrect(true);
      }

      setQuestion(data.question);
      setChoices(data.choices);
      setEos(data.eos);
      setSelectedChoice('');
    } catch (error) {
      console.error('Error sending answer:', error);
    }
  };

  // Toggle configuration panel
  const togglePanel = (): void => {
    setPanelOpen(!panelOpen);
  };

  // // Clear story history
  // const clearHistory = (): void => {
  //   setMessages([]);
  // };

  return (
    <div className='flex h-screen bg-white'>
      <div className='flex-1 flex flex-col border-r border-gray-200'>
        <header className='bg-white border-b border-gray-200 p-4 flex items-center justify-between'>
          <h1 className='text-xl font-bold text-black'>Interactive Story</h1>
          <button onClick={togglePanel} className='text-gray-600'>
            ☰
          </button>
        </header>

        <div className='flex-1 overflow-y-auto p-4'>
          <div className='prose max-w-none'>
            <p className='text-gray-900'>
              {accumulatedText || 'Waiting for content...'}
              <br />
            </p>
          </div>

          {!eos && question && (
            <MultipleChoiceBox
              description={question}
              choices={choices}
              onSubmit={handleSubmit}
              selectedChoice={selectedChoice}
              setSelectedChoice={setSelectedChoice}
              isIncorrect={isIncorrect}
            />
          )}

          {eos && (
            <p className='text-gray-900'>
              {eos}
              <br /> ✅ Story completed.
            </p>
          )}
        </div>

        {/* <form
          onSubmit={handleSubmit}
          className='p-4 bg-white border-t border-gray-200'
        >
          <div className='flex items-center'>
            <input
              type='text'
              value={inputValue}
              onChange={handleInputChange}
              placeholder='Continue the story...'
              className='flex-1 p-2 border border-gray-300 rounded-l focus:outline-none focus:ring-1 focus:ring-gray-500 text-black'
            />
            <button
              type='submit'
              className='p-2 bg-blue-500 text-white rounded-r hover:bg-blue-600'
            >
              Send
            </button>
          </div>
        </form> */}
      </div>

      {/* Right Configuration Panel */}
      <div
        className={`${
          panelOpen ? 'w-64' : 'w-0'
        } bg-white border-l border-gray-200 transition-all duration-300 overflow-hidden`}
      >
        <div className='p-4'>
          <h2 className='text-xl font-bold mb-4 text-black'>Configuration</h2>

          <div className='space-y-6'>
            {/* AI Settings */}
            <div>
              <h3 className='font-medium mb-2 text-black'>AI Settings</h3>
              <div className='space-y-3'>
                <div className='flex items-center'>
                  <input type='checkbox' id='enableAI' className='mr-2' />
                  <label htmlFor='enableAI' className='text-sm text-black'>
                    Enable AI Contributions
                  </label>
                </div>

                <div>
                  <label className='block text-sm mb-1 text-black'>
                    AI Creativity
                  </label>
                  <input
                    type='range'
                    min='0'
                    max='10'
                    step='1'
                    defaultValue='7'
                    className='w-full'
                    disabled
                  />
                </div>
              </div>
            </div>

            {/* Story Management */}
            <div>
              <h3 className='font-medium mb-2 text-black'>Story Management</h3>
              <div className='space-y-3'>
                <button className='w-full p-2 border border-gray-300 rounded hover:bg-gray-100 text-gray-900'>
                  Save Story
                </button>
                <button className='w-full p-2 border border-gray-300 rounded hover:bg-gray-100 text-gray-900 mt-auto'>
                  Generate Report
                </button>

                {/* <button
                  // onClick={clearHistory}
                  className='w-full p-2 border border-gray-300 rounded hover:bg-gray-100 text-gray-900'
                >
                  Clear Story
                </button> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
