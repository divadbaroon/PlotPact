'use client';

import React, { useEffect, useState, useRef } from 'react';
// import { Message, Choice } from '@/types';
import MultipleChoiceBox from '@/components/MultipleChoiceBox';

import { startChatStory } from '@/app/actions/startChat';
import { sendAnswer } from '@/app/actions/sendAnswer';

type InteractionMode = 'idle' | 'multipleChoice' | 'freeform';

const ChatInterface: React.FC = () => {
  // const [messages, setMessages] = useState<Message[]>([]);

  const scrollAnchorRef = useRef<HTMLDivElement | null>(null);

  const [panelOpen, setPanelOpen] = useState<boolean>(true);
  const [chatId, setChatId] = useState<string | null>(null);
  const [question, setQuestion] = useState<string | null>(null);
  const [choices, setChoices] = useState<string[]>([]);
  const [selectedChoice, setSelectedChoice] = useState<string>('');
  const [eos, setEos] = useState<boolean>(false);
  const [isIncorrect, setIsIncorrect] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const [mode, setMode] = useState<InteractionMode>('idle');
  const [customInput, setCustomInput] = useState('');

  const [paras, setParas] = useState<string[]>([]);
  const [streamingPara, setStreamingPara] = useState<string>('');
  const [isStreaming, setIsStreaming] = useState(false);

  const streamText = (text: string) => {
    setStreamingPara('');
    setIsStreaming(true);
    let i = 0;
    const interval = setInterval(() => {
      setStreamingPara((prev) => prev + text[i]);
      i++;
      if (i >= text.length) {
        clearInterval(interval);
        setParas((prev) => [...prev, text]);
        setStreamingPara('');
        setIsStreaming(false);
      }
    }, 20); // typing speed (ms per char)
  };

  // Scroll the page to bottom every time content grows
  useEffect(() => {
    scrollAnchorRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [paras, streamingPara, question, choices]);

  useEffect(() => {
    const initChat = async () => {
      try {
        setLoading(true);

        const data = await startChatStory();
        setChatId(data.chatId);

        if (data.para) streamText(data.para);

        setQuestion(data.question);
        setChoices(data.choices);
        setEos(data.eos);
        setIsIncorrect(false);
        setLoading(false);
      } catch (error) {
        console.error('Error initializing chat:', error);
      }
    };

    initChat();
  }, []);

  const handleSubmit = async (input: string) => {
    if (!input || !chatId || eos) return;

    setLoading(true);

    try {
      const data = await sendAnswer(chatId, selectedChoice);

      if (data.para) {
        streamText(data.para);
        setIsIncorrect(false);
      } else {
        setIsIncorrect(true);
      }

      setQuestion(data.question);
      setChoices(data.choices);
      setEos(data.eos);
      setSelectedChoice('');
      setCustomInput('');

      if (!isIncorrect) {
        setMode('idle');
      }

      setLoading(false);
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
    <div>
      <div className='flex h-screen bg-white'>
        <div className='flex-1 flex flex-col border-r border-gray-200'>
          <header className='bg-white border-b border-gray-200 p-4 flex items-center justify-end'>
            {/* <h1 className='text-xl font-bold text-black'>Interactive Story</h1> */}
            <button onClick={togglePanel} className='text-gray-600'>
              ☰
            </button>
          </header>

          <div className='flex-1 overflow-y-auto p-4'>
            <h1 className='text-4xl font-bold text-center mb-5 text-gray-800'>
              The Last Shield: A Knight's Stand
            </h1>

            <div className='w-2/3 h-[35vh] overflow-hidden rounded-lg shadow mb-5 ml-auto mr-auto'>
              <img
                src='/story-images/knight.jpg'
                alt='Chat Banner'
                className='object-cover w-full h-full'
              />
            </div>

            <div className='prose max-w-none'>
              {paras.map((text, idx) => (
                <p key={idx} className='text-gray-800'>
                  {text}
                </p>
              ))}
              {streamingPara && (
                <p className='text-gray-800 italic animate-pulse'>
                  {streamingPara}
                </p>
              )}
            </div>

            {loading && (
              <div className='flex justify-center mb-2'>
                <svg
                  className='animate-spin h-12 w-12 text-blue-500'
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                >
                  <circle
                    className='opacity-25'
                    cx='12'
                    cy='12'
                    r='10'
                    stroke='currentColor'
                    strokeWidth='4'
                  />
                  <path
                    className='opacity-75'
                    fill='currentColor'
                    d='M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z'
                  />
                </svg>
              </div>
            )}

            {!eos && !isStreaming && !loading && paras[0] && (
              <div className='mt-5'>
                <div className='flex gap-4'>
                  <button
                    onClick={() => handleSubmit('continue the story')}
                    className='border border-gray-200 bg-gray-50 text-gray-800 px-4 py-2 rounded hover:bg-gray-200'
                  >
                    Continue
                  </button>
                  <button
                    onClick={() => setMode('multipleChoice')}
                    className='border border-gray-200 bg-gray-50 text-gray-800 px-4 py-2 rounded hover:bg-gray-200'
                  >
                    Show Options
                  </button>
                  <button
                    onClick={() => setMode('freeform')}
                    className='border border-gray-200 bg-gray-50 text-gray-800 px-4 py-2 rounded hover:bg-gray-200'
                  >
                    Type
                  </button>
                </div>
                {mode === 'multipleChoice' && (
                  <MultipleChoiceBox
                    description={'Story mode'}
                    storyMode={true}
                    choices={choices}
                    onSubmit={() => handleSubmit(selectedChoice)}
                    selectedChoice={selectedChoice}
                    setSelectedChoice={setSelectedChoice}
                    isIncorrect={isIncorrect}
                  />
                )}

                {mode === 'freeform' && (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleSubmit(customInput);
                    }}
                    className='flex gap-2 mt-5'
                  >
                    <input
                      type='text'
                      value={customInput}
                      onChange={(e) => setCustomInput(e.target.value)}
                      placeholder='Continue the story...'
                      className='flex-1 p-2 border border-gray-300 rounded text-black focus:outline-none focus:ring-1 focus:ring-gray-500'
                    />
                    <button
                      type='submit'
                      className='bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600'
                    >
                      Send
                    </button>
                  </form>
                )}
              </div>
            )}

            {eos && (
              <p className='text-gray-900'>
                {eos}
                <br /> ✅ Story completed.
              </p>
            )}

            <div ref={scrollAnchorRef} className='h-2' />
          </div>
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
                <h3 className='font-medium mb-2 text-black'>
                  Story Management
                </h3>
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
    </div>
  );
};

export default ChatInterface;
