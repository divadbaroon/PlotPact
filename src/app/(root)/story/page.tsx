"use client"

import type React from "react"
import { useEffect, useState, useRef } from "react"
import { 
  Menu, 
  ChevronDown, 
  ChevronUp, 
  ChevronLeft, 
  ChevronRight, 
  Loader2, 
  AlertCircle, 
  CheckCircle2, 
  BookOpen 
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import MultipleChoiceBox from "@/components/MultipleChoiceBox"
import { startChatStory } from "@/app/actions/startChatGPT"
import { sendAnswer } from "@/app/actions/sendAnswerGPT"
import { generateConstraints, verifyContent } from "@/app/actions/constraintManager"

import type { StoryResponse, Constraint, InteractionMode, Violation, ViolationState } from "@/types"

const ChatInterface: React.FC = () => {
  const scrollAnchorRef = useRef<HTMLDivElement | null>(null)

  const [panelOpen, setPanelOpen] = useState<boolean>(false)
  const [chatId, setChatId] = useState<string | null>(null)
  const [question, setQuestion] = useState<string | null>(null)
  const [choices, setChoices] = useState<string[]>([])
  const [selectedChoice, setSelectedChoice] = useState<string>("")
  const [eos, setEos] = useState<boolean>(false)
  const [isIncorrect, setIsIncorrect] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)

  const [mode, setMode] = useState<InteractionMode>("idle")
  const [customInput, setCustomInput] = useState("")

  const [paras, setParas] = useState<string[]>([])
  const [streamingPara, setStreamingPara] = useState<string>("")
  const [isStreaming, setIsStreaming] = useState(false)

  const [constraints, setConstraints] = useState<Constraint[]>([])
  const [newConstraints, setNewConstraints] = useState<Constraint[]>([])

  const [violationsList, setViolationsList] = useState<ViolationState[]>([])
  const [violations, setViolations] = useState<Violation[]>([])

  const [showNewConstraints, setShowNewConstraints] = useState(false)
  const [showAllConstraints, setShowAllConstraints] = useState(false)
  const [showViolations, setShowViolations] = useState(false)
  const [activeTab, setActiveTab] = useState<'all' | 'new' | 'violations'>('all')

  // Used to monitor constraints changes
  useEffect(() => {
    console.log("Constraints updated:", constraints)
  }, [constraints])

  const streamText = (text: string) => {
    setStreamingPara("")
    setIsStreaming(true)

    const words = text.split(/\s+/)
    let currentWordIndex = 0

    const interval = setInterval(() => {
      if (currentWordIndex < words.length) {
        const prefix = currentWordIndex > 0 ? " " : ""
        setStreamingPara((prev) => prev + prefix + words[currentWordIndex])
        currentWordIndex++
      } else {
        clearInterval(interval)
        setParas((prev) => [...prev, text])
        setStreamingPara("")
        setIsStreaming(false)
      }
    }, 50)
  }

  useEffect(() => {
    scrollAnchorRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [paras, streamingPara, question, choices, violations])

  // Initialize chat
  useEffect(() => {
    const initChat = async () => {
      try {
        setLoading(true)

        const data = (await startChatStory()) as StoryResponse
        setChatId(data.chatId)

        if (data.para) {
          streamText(data.para)
          console.log("About to generate constraints for:", [data.para])
          const newConstraints = await generateConstraints([data.para], constraints)
          console.log("Received New constraints:", newConstraints)
          setNewConstraints(newConstraints)
          setConstraints((prev) => [...prev, ...newConstraints])
        }

        setQuestion(data.question || null)
        setChoices(data.choices || [])
        setEos(!!data.eos)
        setIsIncorrect(false)
        setLoading(false)
      } catch (error) {
        console.error("Error initializing chat:", error)
        setLoading(false)
      }
    }

    initChat()
  }, [])

  // Handle user input
  const handleSubmit = async (input: string) => {
    if (!input || !chatId || eos) return

    try {
      console.log("Verifying content against constraints:", constraints)
      // First verify against constraints
      const verificationResult = await verifyContent(input, paras, constraints)
      console.log("Verification result:", verificationResult)

      if (!verificationResult.isValid) {
        setViolations(verificationResult.violations)

        setViolationsList((prev) => [
          ...prev,
          {
            violations: [...verificationResult.violations],
            sentContent: input,
          },
        ])
        
        // Automatically open the panel and set to violations tab when violations occur
        setPanelOpen(true)
        setActiveTab('violations')

        return
      }

      setLoading(true)
      setViolations([])

      const data = await sendAnswer(chatId, input)

      if (data.para) {
        streamText(data.para)
        // Generate new constraints based on the new content
        console.log("About to generate constraints for new paragraph...")
        const newConstraints = await generateConstraints([...paras, data.para], constraints)

        console.log("Received new constraints:", newConstraints)
        setNewConstraints(newConstraints)
        setConstraints((prev) => [...prev, ...newConstraints])
        setIsIncorrect(false)
        
        // If there are new constraints, show them in the panel
        if (newConstraints.length > 0) {
          setPanelOpen(true)
          setActiveTab('new')
        }
      } else {
        setIsIncorrect(true)
      }

      setQuestion(data.question)
      setChoices(data.choices)
      setEos(data.eos)
      setSelectedChoice("")
      setCustomInput("")

      if (!isIncorrect) {
        setMode("idle")
      }

      setLoading(false)
    } catch (error) {
      console.error("Error sending answer:", error)
      setLoading(false)
    }
  }

  const togglePanel = (): void => {
    setPanelOpen(!panelOpen)
  }

  // Show user why their input was not accepted
  const ViolationsDisplay = () =>
    violations.length > 0 && (
      <Card className="bg-red-100 border-2 border-red-300 mb-6 animate-in fade-in duration-300 shadow-md hover:shadow-lg hover:border-red-400 transition-all cursor-help">
        <CardContent className="pt-6">
          <div className="flex items-center gap-2 mb-4 text-red-800">
            <AlertCircle className="h-6 w-6 text-red-600" />
            <h3 className="text-lg font-bold">Story Inconsistencies Found</h3>
          </div>
          <div className="space-y-3">
            {violations.map((violation: Violation, index: number) => (
              <div 
                key={index} 
                className="border-l-4 border-red-500 pl-4 py-2 bg-white rounded-md shadow-sm hover:shadow-md hover:bg-red-50 transition-all duration-200"
              >
                <p className="text-red-700 font-semibold text-sm mb-1">{violation.constraintType}</p>
                <p className="text-gray-800 text-sm">{violation.explanation}</p>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-2 mt-5 p-3 bg-red-50 border border-red-200 rounded-md">
            <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
            <p className="text-sm text-gray-700">Please revise your input to maintain story consistency.</p>
          </div>
        </CardContent>
      </Card>
    )

  // Enhanced Constraints Panel Component
  const EnhancedConstraintsPanel = () => {
    return (
      <div className="bg-white border rounded-lg shadow-md overflow-hidden">
        {/* Tab Navigation */}
        <div className="flex border-b">
          <button
            className={`flex-1 px-4 py-2 text-sm font-medium ${
              activeTab === 'all' ? 'bg-gray-50 border-b-2 border-indigo-500' : 'text-gray-600 hover:bg-gray-50'
            }`}
            onClick={() => setActiveTab('all')}
          >
            <div className="flex items-center justify-center gap-2">
              <BookOpen className="h-4 w-4" />
              <span>All Constraints</span>
              <Badge variant="outline" className="ml-1 bg-gray-100">
                {constraints.length}
              </Badge>
            </div>
          </button>
          
          <button
            className={`flex-1 px-4 py-2 text-sm font-medium ${
              activeTab === 'new' ? 'bg-gray-50 border-b-2 border-green-500' : 'text-gray-600 hover:bg-gray-50'
            }`}
            onClick={() => setActiveTab('new')}
          >
            <div className="flex items-center justify-center gap-2">
              <CheckCircle2 className="h-4 w-4" />
              <span>New Constraints</span>
              {newConstraints.length > 0 && (
                <Badge variant="outline" className="ml-1 bg-green-50 text-green-700">
                  {newConstraints.length}
                </Badge>
              )}
            </div>
          </button>
          
          <button
            className={`flex-1 px-4 py-2 text-sm font-medium ${
              activeTab === 'violations' ? 'bg-gray-50 border-b-2 border-red-500' : 'text-gray-600 hover:bg-gray-50'
            }`}
            onClick={() => setActiveTab('violations')}
          >
            <div className="flex items-center justify-center gap-2">
              <AlertCircle className="h-4 w-4" />
              <span>Violations</span>
              {violationsList.length > 0 && (
                <Badge variant="outline" className="ml-1 bg-red-50 text-red-700">
                  {violationsList.length}
                </Badge>
              )}
            </div>
          </button>
        </div>
        
        {/* Content Area */}
        <div className="max-h-[60vh] overflow-y-auto p-6">
          {activeTab === 'all' && (
            <div className="space-y-3">
              {constraints.length === 0 ? (
                <div className="text-center py-6">
                  <BookOpen className="h-12 w-12 text-gray-300 mx-auto mb-2" />
                  <p className="text-gray-500">No story constraints established yet.</p>
                </div>
              ) : (
                constraints.map((constraint, index) => (
                  <div key={index} className="p-3 bg-white rounded-md shadow-sm border border-gray-100 hover:border-gray-300 transition-colors">
                    <div className="flex items-start">
                      <div className="p-1 bg-indigo-50 rounded-full mr-3 mt-1">
                        <BookOpen className="h-4 w-4 text-indigo-500" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 text-sm">{constraint.description}</p>
                        <p className="text-xs text-gray-600 mt-1">{constraint.reason}</p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
          
          {activeTab === 'new' && (
            <div className="space-y-3">
              {newConstraints.length === 0 ? (
                <div className="text-center py-6">
                  <CheckCircle2 className="h-12 w-12 text-gray-300 mx-auto mb-2" />
                  <p className="text-gray-500">No new constraints in this section.</p>
                </div>
              ) : (
                newConstraints.map((constraint, index) => (
                  <div key={index} className="p-3 bg-green-50 rounded-md shadow-sm border border-green-100 hover:bg-green-100 transition-colors">
                    <div className="flex items-start">
                      <div className="p-1 bg-green-100 rounded-full mr-3 mt-1">
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 text-sm">{constraint.description}</p>
                        <p className="text-xs text-gray-600 mt-1">{constraint.reason}</p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
          
          {activeTab === 'violations' && (
            <div className="space-y-4">
              {violationsList.length === 0 ? (
                <div className="text-center py-12 px-8">
                  <div className="bg-gray-50 rounded-lg p-8 border border-gray-200 shadow-sm">
                    <AlertCircle className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-700 mb-3">No Violations Recorded</h3>
                    <p className="text-gray-500 max-w-xl mx-auto">
                      Your story is progressing smoothly without any consistency issues. 
                      When violations occur, they will appear here with detailed explanations.
                    </p>
                  </div>
                </div>
              ) : (
                violationsList.map((v, i) => (
                  <div key={i} className="border border-red-100 rounded-md bg-red-50 overflow-hidden">
                    <div className="p-3 bg-red-100">
                      <p className="font-medium text-sm text-gray-900">Rejected Input:</p>
                      <p className="text-gray-700 text-sm mt-1 bg-white p-2 rounded border border-red-200">
                        {v.sentContent}
                      </p>
                    </div>
                    <div className="p-3">
                      <p className="font-medium text-sm text-gray-900 mb-2">Violations:</p>
                      {v.violations.map((violation, j) => (
                        <div key={j} className="mb-2 bg-white p-2 rounded border border-red-200">
                          <p className="text-xs font-semibold text-red-700">{violation.constraintType}</p>
                          <p className="text-xs text-gray-700 mt-1">{violation.explanation}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <div className="flex-1 flex flex-col border-r border-gray-200 bg-white">
        <header className="bg-white border-b border-gray-200 p-4 flex items-center justify-between sticky top-0 z-10 shadow-sm">
          <div className="flex items-center gap-2">
            {/* PlotPact icon/logo on the left */}
            <div className="flex items-center">
              <BookOpen className="h-5 w-5" />
              <span className="ml-2 font-bold">PlotPact</span>
            </div>
          </div>

          {/* Right side controls */}
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="text-sm flex items-center gap-1"
              onClick={togglePanel}
            >
              <div className="flex items-center">
                <span className="mr-1">Story Guide</span>
                {panelOpen ? (
                  <ChevronRight className="h-4 w-4" />
                ) : (
                  <ChevronLeft className="h-4 w-4" />
                )}
              </div>
            </Button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-3xl md:text-4xl font-bold text-center mb-6 text-gray-800">
              The Box with the Brass Dial
            </h1>

            <div className="aspect-video overflow-hidden rounded-lg shadow-md mb-8 mx-auto">
              <img src="/story-images/lila.png" alt="Story Banner" className="object-cover w-full h-full" />
            </div>

            <div className="prose max-w-none">
              {paras.map((text, idx) => (
                <p key={idx} className="text-gray-800 leading-relaxed mb-4">
                  {text}
                </p>
              ))}
              {streamingPara && (
                <p className="text-gray-800 leading-relaxed mb-4">
                  {streamingPara}
                  <span className="inline-block w-1 h-4 bg-gray-800 ml-1 animate-pulse"></span>
                </p>
              )}
            </div>

            {loading && (
              <div className="flex justify-center my-6">
                <Loader2 className="h-10 w-10 text-gray-500 animate-spin" />
              </div>
            )}

            {!eos && !isStreaming && !loading && paras[0] && (
              <div className="mt-8 bg-gray-50 p-4 rounded-lg border border-gray-200">
                <div className="flex flex-wrap gap-3 mb-4">
                  <Button onClick={() => handleSubmit("continue the story")} variant="secondary">
                    Continue
                  </Button>
                  <Button
                    onClick={() => setMode("multipleChoice")}
                    variant={mode === "multipleChoice" ? "default" : "secondary"}
                  >
                    Show Options
                  </Button>
                  <Button onClick={() => setMode("freeform")} variant={mode === "freeform" ? "default" : "secondary"}>
                    Type Response
                  </Button>
                </div>

                {mode === "multipleChoice" && (
                  <div className="bg-white p-4 rounded-md border border-gray-200">
                    <MultipleChoiceBox
                      description={"Story mode"}
                      storyMode={true}
                      choices={choices}
                      onSubmit={() => handleSubmit(selectedChoice)}
                      selectedChoice={selectedChoice}
                      setSelectedChoice={setSelectedChoice}
                      isIncorrect={isIncorrect}
                    />
                  </div>
                )}

                {mode === "freeform" && (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault()
                      handleSubmit(customInput)
                    }}
                    className="bg-white p-4 rounded-md border border-gray-200"
                  >
                    <Textarea
                      value={customInput}
                      onChange={(e) => setCustomInput(e.target.value)}
                      placeholder="Continue the story..."
                      className="min-h-[100px] mb-3 resize-none"
                    />
                    <div className="flex justify-end">
                      <Button type="submit">Send</Button>
                    </div>
                  </form>
                )}
              </div>
            )}

            {!loading && <ViolationsDisplay />}

            {eos && (
              <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
                <CheckCircle2 className="h-6 w-6 text-green-600" />
                <p className="text-gray-900 font-medium">Story completed successfully!</p>
              </div>
            )}

            <div ref={scrollAnchorRef} className="h-2" />
          </div>
        </div>
      </div>

      {/* Enhanced side panel with the improved constraints UI - MADE WIDER */}
      <div
        className={`${
          panelOpen ? "w-96 md:w-[500px] lg:w-[600px]" : "w-0"
        } bg-white border-l border-gray-200 transition-all duration-300 overflow-hidden`}
      >
        <div className="p-4 h-full flex flex-col">
          <div className="flex-1 overflow-hidden">
            <EnhancedConstraintsPanel />
          </div>
          
          {/* Additional story guidance */}
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="text-sm text-gray-600">
              <h4 className="font-medium text-gray-800 mb-1">Story Consistency Tips:</h4>
              <ul className="list-disc pl-4 space-y-1">
                <li>Keep character traits and motivations consistent</li>
                <li>Respect established story elements and settings</li>
                <li>Follow narrative logic and causality</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ChatInterface