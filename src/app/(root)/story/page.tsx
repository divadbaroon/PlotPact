'use client';

import React, { useEffect, useState, useRef } from 'react';
import MultipleChoiceBox from '@/components/MultipleChoiceBox';
import { startChatStory } from '@/app/actions/startChatGPT';
import { sendAnswer } from '@/app/actions/sendAnswerGPT';
import {
  generateConstraints,
  verifyContent,
} from '@/app/actions/constraintManager';

import {
  StoryResponse,
  Constraint,
  InteractionMode,
  Violation,
  ViolationState,
} from '@/types';

const ChatInterface: React.FC = () => {
  const scrollAnchorRef = useRef<HTMLDivElement | null>(null);

  const [panelOpen, setPanelOpen] = useState<boolean>(false);
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

  const [constraints, setConstraints] = useState<Constraint[]>([]);
  const [newConstraints, setNewConstraints] = useState<Constraint[]>([]);

  const [violationsList, setViolationsList] = useState<ViolationState[]>([]);

  const [violations, setViolations] = useState<
    { constraintType: string; explanation: string }[]
  >([]);

  const [showNewConstraints, setShowNewConstraints] = useState(false);
  const [showAllConstraints, setShowAllConstraints] = useState(false);

  const [showViolations, setShowViolations] = useState(false);

  // Used monitor constraints changes
  useEffect(() => {
    console.log('Constraints updated:', constraints);
  }, [constraints]);

  const streamText = (text: string) => {
    setStreamingPara('');
    setIsStreaming(true);

    const words = text.split(/\s+/);
    let currentWordIndex = -1;

    setTimeout(() => {
      const interval = setInterval(() => {
        const prefix = currentWordIndex > -1 ? ' ' : '';
        setStreamingPara((prev) => prev + prefix + words[currentWordIndex]);

        currentWordIndex++;

        if (currentWordIndex >= words.length) {
          clearInterval(interval);
          setParas((prev) => [...prev, text]);
          setStreamingPara('');
          setIsStreaming(false);
        }
      }, 100);
    }, 300);
  };

  useEffect(() => {
    scrollAnchorRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [paras, streamingPara, question, choices, violations]);

  // Initialize chat
  useEffect(() => {
    const initChat = async () => {
      try {
        setLoading(true);

        const data = (await startChatStory()) as StoryResponse;
        setChatId(data.chatId);

        if (data.para) {
          streamText(data.para);
          console.log('About to generate constraints for:', [data.para]);
          const newConstraints = await generateConstraints(
            [data.para],
            constraints
          );
          console.log('Received New constraints:', newConstraints);
          console.log('Old Constraints:', constraints);
          setNewConstraints(newConstraints);
          // setConstraints([...constraints, ...newConstraints]);

          setConstraints((prev) => [...prev, ...newConstraints]);
        }

        setQuestion(data.question || null);
        setChoices(data.choices || []);
        setEos(!!data.eos);
        setIsIncorrect(false);
        setLoading(false);
      } catch (error) {
        console.error('Error initializing chat:', error);
        setLoading(false);
      }
    };

    initChat();
  }, []);

  // Handle user input
  const handleSubmit = async (input: string) => {
    if (!input || !chatId || eos) return;

    try {
      console.log('Verifying content against constraints:', constraints);
      // First verify against constraints
      const verificationResult = await verifyContent(input, paras, constraints);
      console.log('Verification result:', verificationResult);

      if (!verificationResult.isValid) {
        setViolations(verificationResult.violations);

        setViolationsList((prev) => [
          ...prev,
          {
            violations: [...verificationResult.violations],
            sentContent: input,
          },
        ]);

        return;
      }

      setLoading(true);
      setViolations([]);

      const data = await sendAnswer(chatId, input);

      if (data.para) {
        streamText(data.para);
        // Generate new constraints based on the new content
        console.log('About to generate constraints for new paragraph...');
        const newConstraints = await generateConstraints(
          [...paras, data.para],
          constraints
        );

        console.log('Received new constraints:', newConstraints);
        console.log('Old Constraints:', constraints);

        setNewConstraints(newConstraints);

        setConstraints((prev) => [...prev, ...newConstraints]);

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
      setLoading(false);
    }
  };

  const togglePanel = (): void => {
    setPanelOpen(!panelOpen);
  };

  // Show user why their input was not accepted
  const ViolationsDisplay = () =>
    violations.length > 0 && (
      <div className='bg-red-50 p-4 rounded-lg mb-4 animate-fadeIn mt-5'>
        <h3 className='text-lg font-semibold mb-2 text-red-700'>
          Story Inconsistencies Found:
        </h3>
        {violations.map((violation: Violation, index: number) => (
          <div key={index} className='mb-2 border-l-4 border-red-500 pl-3'>
            <p className='text-red-600 font-medium'>
              {violation.constraintType}
            </p>
            <p className='text-gray-700'>{violation.explanation}</p>
          </div>
        ))}
        <p className='text-sm text-gray-600 mt-3'>
          Please revise your input to maintain story consistency.
        </p>
      </div>
    );

  // Shows all constraints
  const ConstraintPanel = () => (
    <div className='bg-gray-50 p-4 rounded-lg mb-4'>
      <h3 className='text-lg font-semibold mb-2 text-gray-900'>
        Story Constraints
      </h3>
      {constraints.length === 0 ? (
        <p className='text-gray-600'>No story constraints established yet.</p>
      ) : (
        constraints.map((constraint, index) => (
          <div key={index} className='mb-3 p-2 bg-white rounded shadow'>
            <p className='font-medium text-gray-900'>
              {constraint.description}
            </p>
            <p className='text-sm text-gray-600 mt-1'>{constraint.reason}</p>
          </div>
        ))
      )}
    </div>
  );

  //show new constraints
  const NewConstraintPanel = () => (
    <div className='bg-gray-50 p-4 rounded-lg mb-4'>
      <h3 className='text-lg font-semibold mb-2 text-gray-900'>
        Story Constraints
      </h3>
      {newConstraints.length === 0 ? (
        <p className='text-gray-600'>No story constraints established yet.</p>
      ) : (
        newConstraints.map((constraint, index) => (
          <div key={index} className='mb-3 p-2 bg-white rounded shadow'>
            <p className='font-medium text-gray-900'>
              {constraint.description}
            </p>
            <p className='text-sm text-gray-600 mt-1'>{constraint.reason}</p>
          </div>
        ))
      )}
    </div>
  );

  return (
    <div>
      <div className='flex h-screen bg-white'>
        <div className='flex-1 flex flex-col border-r border-gray-200'>
          <header className='bg-white border-b border-gray-200 p-4 flex items-center justify-between'>
            <button
              onClick={() => setShowNewConstraints(!showNewConstraints)}
              className='text-blue-600 hover:text-blue-800'
            >
              {showNewConstraints
                ? 'Hide New Constraints'
                : 'Show New Constraints'}
            </button>
            <button
              onClick={() => setShowAllConstraints(!showAllConstraints)}
              className='text-blue-600 hover:text-blue-800'
            >
              {showAllConstraints
                ? 'Hide All Constraints'
                : 'Show All Constraints'}
            </button>
            <button onClick={togglePanel} className='text-gray-600'>
              ☰
            </button>
          </header>

          <div className='flex-1 overflow-y-auto p-4'>
            {showNewConstraints && <NewConstraintPanel />}
            {showAllConstraints && <ConstraintPanel />}

            <h1 className='text-4xl font-bold text-center mb-5 text-gray-800'>
              {/* The Last Shield: A Knight&apos;s Stand */}
              The Box with the Brass Dial
            </h1>

            <div className='w-2/3 h-[35vh] overflow-hidden rounded-lg shadow mb-5 ml-auto mr-auto'>
              <img
                src='/story-images/lila.png'
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
                    <textarea
                      value={customInput}
                      onChange={(e) => setCustomInput(e.target.value)}
                      placeholder='Continue the story...'
                      // className='w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none'
                      className='flex-1 p-2 border border-gray-300 rounded text-black focus:outline-none focus:ring-1 focus:ring-gray-500'
                      rows={3}
                    ></textarea>
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

            {!loading && <ViolationsDisplay />}

            {eos && (
              <p className='text-gray-900'>
                {eos}
                <br /> ✅ Story completed.
              </p>
            )}

            <div ref={scrollAnchorRef} className='h-2' />
          </div>
        </div>

        <div
          className={`${
            panelOpen ? 'w-500' : 'w-0'
          } bg-white border-l border-gray-200 transition-all duration-300 overflow-hidden`}
        >
          <div className='space-y-4'>
            {/* Constraint Toggle */}
            {/* <div>
              <button
                className='w-full text-left bg-blue-100 px-4 py-2 rounded-md shadow hover:bg-blue-200'
                onClick={() => setShowConstraints((prev) => !prev)}
              >
                {showConstraints ? '▼' : '▶'} Constraints
              </button>
              {showConstraints && (
                <div className='mt-2 space-y-3 p-4 bg-white rounded-md border border-blue-200'>
                  {constraints.map((c, i) => (
                    <div key={i} className='text-sm'>
                      <p>
                        <strong>Type:</strong> {c.type}
                      </p>
                      <p>
                        <strong>Description:</strong> {c.description}
                      </p>
                      <p>
                        <strong>Reason:</strong> {c.reason}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div> */}

            {/* Violations Toggle */}
            <div>
              <button
                className='w-full text-left bg-red-100 px-4 py-2 rounded-md shadow hover:bg-red-200'
                onClick={() => setShowViolations((prev) => !prev)}
              >
                {showViolations ? '▼' : '▶'} Violations
              </button>
              {showViolations && (
                <div className='mt-2 space-y-3 p-4 bg-white rounded-md border border-red-200'>
                  {violationsList.map((v, i) => (
                    <div key={i} className='text-sm'>
                      <p className='text-gray-700 mb-1'>
                        <strong>Input:</strong> {v.sentContent}
                      </p>
                      {v.violations.map((violation, j) => (
                        <div
                          key={j}
                          className='pl-3 mb-2 border-l-2 border-red-400'
                        >
                          <p>
                            <strong>Constraint:</strong>{' '}
                            {violation.constraintType}
                          </p>
                          <p>
                            <strong>Explanation:</strong>{' '}
                            {violation.explanation}
                          </p>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          {/* <div className='p-4'>
            <h2 className='text-xl font-bold mb-4 text-black'>Configuration</h2>

            <div className='space-y-6'>
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
                </div>
              </div>
            </div>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
