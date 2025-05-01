'use client';

import type React from 'react';
import { useEffect, useState, useRef } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import {
  ChevronLeft,
  ChevronRight,
  Loader2,
  AlertCircle,
  CheckCircle2,
  BookOpen,
  ScrollText,
  ArrowDownCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { startChatStory } from '@/lib/actions/startChatGPT';
import { sendAnswer } from '@/lib/actions/sendAnswerGPT';
import { verifyContent } from '@/lib/actions/constraintManager';

import type {
  StoryResponse,
  Constraint,
  Violation,
  ViolationState,
} from '@/types';

import knight from '../../../../../public/story-images/knight.jpg';
import lila from '../../../../../public/story-images/lila.png';

import ConstraintsPanel from '@/components/chat/ConstaintPanel';
import ConstraintCreator from '@/components/chat/ConstraintCreator';

const ChatInterface: React.FC = () => {
  const params = useParams();
  const storyId = params.storyId as string;

  const scrollAnchorRef = useRef<HTMLDivElement | null>(null);
  const editableRef = useRef<HTMLDivElement | null>(null);

  const [panelOpen, setPanelOpen] = useState<boolean>(false);
  const [createConstraintPanelOpen, setCreateConstraintPanelOpen] = useState<boolean>(false);
  const [chatId, setChatId] = useState<string | null>(null);
  const [plot, setPlot] = useState<string>('');
  const [eos, setEos] = useState<boolean>(false);
  const [isIncorrect, setIsIncorrect] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const [paras, setParas] = useState<string[]>([]);
  const [streamingPara, setStreamingPara] = useState<string>('');
  const [isStreaming, setIsStreaming] = useState(false);

  const [constraints, setConstraints] = useState<Constraint[]>([]);
  const [newConstraints, setNewConstraints] = useState<Constraint[]>([]);

  const [violationsList, setViolationsList] = useState<ViolationState[]>([]);
  const [violations, setViolations] = useState<Violation[]>([]);

  const [activeTab, setActiveTab] = useState<'all' | 'new' | 'violations'>('all');
  
  const [constraintFilter, setConstraintFilter] = useState<string>('all');

  let storyDetails = {
    storyImg: knight,
    storyTitle: `A Knight's Stand`,
  };

  if (storyId == '1') {
    storyDetails = {
      storyImg: lila,
      storyTitle: 'The Box with the Brass Dial',
    };
  } else
    storyDetails = {
      storyImg: knight,
      storyTitle: `A Knight's Stand`,
    };

  // Used to monitor constraints changes
  useEffect(() => {
    console.log('Constraints updated:', constraints);
  }, [constraints]);

  const streamText = (text: string) => {
    setStreamingPara('');
    setIsStreaming(true);

    const words = text.split(/\s+/);

    //Fix for first word not being streamed
    let currentWordIndex = -1;

    const interval = setInterval(() => {
      if (currentWordIndex < words.length) {
        const prefix = currentWordIndex > -1 ? ' ' : '';
        setStreamingPara((prev) => prev + prefix + words[currentWordIndex]);
        currentWordIndex++;
      } else {
        clearInterval(interval);
        setParas((prev) => [...prev, text]);
        setStreamingPara('');
        setIsStreaming(false);
      }
    }, 50);
  };

  useEffect(() => {
    scrollAnchorRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [paras, streamingPara, violations]);

  // Initialize chat
  useEffect(() => {
    const initChat = async () => {
      try {
        setLoading(true);
    
        const data = (await startChatStory(storyId)) as StoryResponse;
        setChatId(data.chatId);
    
        if (data.para) {
          streamText(data.para);
          setLoading(false);
        } else {
          setLoading(false);
        }
    
        if (data.plot) {
          setPlot(data.plot);
        }
        
        // Set initial constraints if any
        if (data.constraints) {
          setConstraints(data.constraints);
        }
        
        setEos(!!data.eos);
        setIsIncorrect(false);
      } catch (error) {
        console.error('Error initializing chat:', error);
        setLoading(false);
      }
    };

    initChat();
  }, [storyId]);

  // Handle "continue" button with original functionality
  const handleContinue = async () => {
    if (!chatId || eos) return;
  
    try {
      setLoading(true);
      
      // Use "continue the story" as the input for the sendAnswer function
      const data = await sendAnswer(chatId, 'continue the story');
  
      if (data.para) {
        streamText(data.para);
        
        // Reset loading once streaming starts
        setLoading(false);
        setIsIncorrect(false);
      } else {
        setIsIncorrect(true);
        setLoading(false);
      }
      
      setEos(!!data.eos);
    } catch (error) {
      console.error('Error continuing story:', error);
      setLoading(false);
    }
  };

  // Handle user input
  const handleSubmit = async () => {
    if (!chatId || eos || !editableRef.current) return;
    
    const userContent = editableRef.current.innerText.trim();
    if (!userContent) return;
  
    try {
      console.log('Verifying content against constraints:', constraints);
      // Verify the content against existing constraints
      const verificationResult = await verifyContent(
        userContent,
        paras,
        constraints
      );
      console.log('Verification result:', verificationResult);
  
      if (!verificationResult.isValid) {
        setViolations(verificationResult.violations);
  
        setViolationsList((prev) => [
          ...prev,
          {
            violations: [...verificationResult.violations],
            sentContent: userContent,
          },
        ]);
  
        return;
      }
  
      setLoading(true);
      setViolations([]);
  
      // Add the content directly to the story
      streamText(userContent);
      setLoading(false);
      
      // Clear the editable div
      if (editableRef.current) {
        editableRef.current.innerText = '';
      }
    } catch (error) {
      console.error('Error processing input:', error);
      setLoading(false);
    }
  };

  const togglePanel = (): void => {
    setCreateConstraintPanelOpen(false);
    setPanelOpen(!panelOpen);
  };

  const toggleAddConstraint = (): void => {
    setPanelOpen(false);
    setCreateConstraintPanelOpen(!createConstraintPanelOpen);
  };
  
  const handleAddConstraint = (newConstraint: Constraint): void => {
    setConstraints((prev) => [...prev, newConstraint]);
    setNewConstraints([newConstraint]);
    setActiveTab('new');
    setCreateConstraintPanelOpen(false);
    setPanelOpen(true);
  };

  // Show user why their input was not accepted
  const ViolationsDisplay = () =>
    violations.length > 0 && (
      <Card className='bg-red-100 border-2 border-red-300 mb-6 animate-in fade-in duration-300 shadow-md hover:shadow-lg hover:border-red-400 transition-all cursor-help'>
        <CardContent className='pt-6'>
          <div className='flex items-center gap-2 mb-4 text-red-800'>
            <AlertCircle className='h-6 w-6 text-red-600' />
            <h3 className='text-lg font-bold'>Story Inconsistencies Found</h3>
          </div>
          <div className='space-y-3'>
            {violations.map((violation: Violation, index: number) => (
              <div
                key={index}
                className='border-l-4 border-red-500 pl-4 py-2 bg-white rounded-md shadow-sm hover:shadow-md hover:bg-red-50 transition-all duration-200'
              >
                <p className='text-red-700 font-semibold text-sm mb-1'>
                  {violation.constraintType}
                </p>
                <p className='text-gray-800 text-sm'>{violation.explanation}</p>
              </div>
            ))}
          </div>
          <div className='flex items-center gap-2 mt-5 p-3 bg-red-50 border border-red-200 rounded-md'>
            <AlertCircle className='h-5 w-5 text-red-500 flex-shrink-0' />
            <p className='text-sm text-gray-700'>
              Please revise your input to maintain story consistency.
            </p>
          </div>
        </CardContent>
      </Card>
    );

  // Story Plot Display Component
  const StoryPlotDisplay = () => {
    if (!plot) return null;
    
    return (
      <Card className="mb-6 bg-gray-50 border border-gray-200 hover:shadow-md transition-all duration-200">
        <CardContent className="pt-6">
          <div className="flex items-center gap-2 mb-3">
            <ScrollText className="h-5 w-5 text-indigo-600" />
            <h2 className="text-lg font-semibold text-gray-800">Story Plot</h2>
          </div>
          <p className="text-gray-700 bg-white p-4 rounded-md border border-gray-200 italic">
            {plot}
          </p>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className='flex h-screen bg-gray-50'>
      <div className='flex-1 flex flex-col border-r border-gray-200 bg-white'>
        <header className='bg-white border-b border-gray-200 p-4 flex items-center justify-between sticky top-0 z-10 shadow-sm'>
          <div className='flex items-center gap-2'>
            <Link href='/' className='group'>
              <div className='flex items-center'>
                <BookOpen className='ml-2 h-5 w-5' />
                <span className='ml-2 font-bold'>PlotPact</span>
              </div>
            </Link>
          </div>

          {/* Right side controls with hover effect */}
          <div className='flex items-center gap-2'>
            <Button
              onClick={toggleAddConstraint}
            >
              Add Constraint
            </Button>
            <Button
              variant={violationsList.length > 0 ? 'destructive' : 'outline'}
              size='sm'
              className={`text-sm flex items-center gap-1 cursor-pointer ${
                violationsList.length > 0 && !panelOpen ? 'animate-pulse' : ''
              } hover:shadow-md transition-all duration-200 transform hover:-translate-y-0.5 ${'hover:bg-gray-100'}`}
              onClick={togglePanel}
            >
              <div className='flex items-center'>
                {violationsList.length > 0 && !panelOpen && (
                  <Badge variant='destructive' className='mr-2 text-white'>
                    {violationsList.length}
                  </Badge>
                )}
                <span className='mr-1'>View Constraints</span>
                {panelOpen ? (
                  <ChevronRight className='h-4 w-4' />
                ) : (
                  <ChevronLeft className='h-4 w-4' />
                )}
              </div>
            </Button>
          </div>
        </header>

        <div className='flex-1 overflow-y-auto p-4 md:p-6 lg:p-8'>
          <div className='max-w-3xl mx-auto'>
            <h1 className='text-3xl md:text-4xl font-bold text-center mb-6 text-gray-800'>
              {storyDetails.storyTitle}
            </h1>

            <div className='aspect-video overflow-hidden rounded-lg shadow-md mb-8 mx-auto hover:shadow-lg transition-all duration-300 relative h-64 w-full'>
              <Image
                src={storyDetails.storyImg}
                alt='Story Image'
                fill
                className='object-cover w-full h-full'
              />
            </div>

            {/* Display the story plot if available */}
            <StoryPlotDisplay />

            <div className='prose max-w-none'>
              {paras.map((text, idx) => (
                <p key={idx} className='text-gray-800 leading-relaxed mb-4'>
                  {text}
                </p>
              ))}
              {streamingPara && (
                <p className='text-gray-800 leading-relaxed mb-4'>
                  {streamingPara}
                  <span className='inline-block w-1 h-4 bg-gray-800 ml-1 animate-pulse'></span>
                </p>
              )}
            </div>

            {loading && !isStreaming && (
              <div className='flex justify-center my-6'>
                <Loader2 className='h-10 w-10 text-gray-500 animate-spin' />
              </div>
            )}

            {!eos && !isStreaming && !loading && paras[0] && (
              <div className='mt-8 space-y-6'>
                {/* Editable div for direct typing */}
                <div
                  ref={editableRef}
                  contentEditable
                  className='min-h-[150px] p-4 border border-gray-300 rounded-md focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-colors bg-white w-full outline-none'
                  style={{ outline: 'none' }}
                ></div>
                
                <div className='flex gap-3 justify-end'>
                  <Button
                    onClick={handleSubmit}
                    className='bg-black hover:bg-gray-800 text-white transition-colors duration-200 hover:shadow-md transform hover:-translate-y-0.5 cursor-pointer'
                  >
                    Submit
                  </Button>
                  
                  <Button
                    onClick={handleContinue}
                    variant="secondary"
                    className='hover:bg-gray-200 transition-colors duration-200 hover:shadow-md transform hover:-translate-y-0.5 cursor-pointer'
                  >
                    Continue
                  </Button>
                </div>
              </div>
            )}

            {!loading && <ViolationsDisplay />}

            {eos && (
              <div className='mt-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3 hover:shadow-md transition-all duration-200 hover:border-green-300'>
                <CheckCircle2 className='h-6 w-6 text-green-600' />
                <p className='text-gray-900 font-medium'>
                  Story completed successfully!
                </p>
              </div>
            )}

            <div ref={scrollAnchorRef} className='h-2' />
          </div>
        </div>
      </div>

      {/* side panel */}
      <div
        className={`${
          panelOpen ? 'w-96 md:w-[500px] lg:w-[600px]' : 'w-0'
        } bg-white border-l border-gray-200 transition-all duration-300 overflow-hidden`}
      >
        <div className='p-4 h-full flex flex-col'>
          <div className='flex-1 overflow-hidden'>
            <ConstraintsPanel
              constraints={constraints}
              newConstraints={newConstraints}
              violationsList={violationsList}
              constraintFilter={constraintFilter}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              setConstraintFilter={setConstraintFilter}
            />
          </div>

          {/* Additional story guidance */}
          <div className='mt-4 pt-4 border-t border-gray-200'>
            <div className='text-sm text-gray-600'>
              <h4 className='font-medium text-gray-800 mb-1'>
                Story Consistency Tips:
              </h4>
              <ul className='list-disc pl-4 space-y-1'>
                <li className='hover:text-gray-800 transition-colors duration-200'>
                  Keep character traits and motivations consistent
                </li>
                <li className='hover:text-gray-800 transition-colors duration-200'>
                  Respect established story elements and settings
                </li>
                <li className='hover:text-gray-800 transition-colors duration-200'>
                  Follow narrative logic and causality
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* constraint creator side panel */}
      <div
        className={`${
          createConstraintPanelOpen ? 'w-96 md:w-[500px] lg:w-[600px]' : 'w-0'
        } bg-white border-l border-gray-200 transition-all duration-300 overflow-hidden`}
      >
        <div className='p-4 h-full flex flex-col'>
          <div className='flex-1 overflow-hidden'>
            <ConstraintCreator 
              onAddConstraint={handleAddConstraint}
              onClose={() => setCreateConstraintPanelOpen(false)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;