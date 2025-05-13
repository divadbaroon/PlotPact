"use client"

import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  ArrowRight,
  BookOpen,
  Brain,
  Lightbulb,
  Users,
  Edit,
  FilePlus2,
  RefreshCcw,
  ChevronDown,
  ArrowUp,
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useEffect, useState, useRef } from "react"

export default function Home() {
  const router = useRouter()
  const [activeSection, setActiveSection] = useState(0)
  const [showScrollTop, setShowScrollTop] = useState(false)
  const sectionsRef = useRef<(HTMLElement | null)[]>([])

  const sections = ["hero", "story-type", "featured-stories", "problem", "constraints", "workflow"]

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY
      const windowHeight = window.innerHeight

      // Show/hide scroll to top button
      if (scrollPosition > windowHeight) {
        setShowScrollTop(true)
      } else {
        setShowScrollTop(false)
      }

      // Determine active section
      sectionsRef.current.forEach((section, index) => {
        if (!section) return

        const sectionTop = section.offsetTop
        const sectionHeight = section.offsetHeight

        if (
          scrollPosition >= sectionTop - windowHeight / 3 &&
          scrollPosition < sectionTop + sectionHeight - windowHeight / 3
        ) {
          setActiveSection(index)
        }
      })
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollToSection = (index: number) => {
    sectionsRef.current[index]?.scrollIntoView({ behavior: "smooth" })
  }

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handleStartEmptyCanvas = () => {
    router.push(`/story/customStory`)
  }

  const handleTemplateStory = (storyId: string) => {
    router.push(`/story/${storyId}`)
  }

  return (
    <div className="flex flex-col">
      {/* Navigation Dots */}
      <div className="fixed right-6 top-1/2 transform -translate-y-1/2 z-50 hidden md:block">
        <div className="flex flex-col gap-3">
          {sections.map((section, index) => (
            <button
              key={section}
              onClick={() => scrollToSection(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                activeSection === index ? "bg-primary scale-125" : "bg-primary/30 hover:bg-primary/50"
              }`}
              aria-label={`Scroll to ${section} section`}
            />
          ))}
        </div>
      </div>

      {/* Scroll to Top Button */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            onClick={scrollToTop}
            className="fixed bottom-6 right-6 z-50 bg-primary text-white p-3 rounded-full shadow-lg hover:bg-primary/90 transition-all duration-300"
            aria-label="Scroll to top"
          >
            <ArrowUp className="h-5 w-5" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <section
        ref={(el) => {
          sectionsRef.current[0] = el
          return undefined
        }}
        id="hero"
        className="relative h-screen flex items-center bg-gradient-to-b from-primary/10 to-background px-4 sm:px-6 lg:px-8"
      >
        <div className="absolute inset-0 -z-10">
          <Image
            src="/bg-collab.png"
            alt="Human and AI storytelling collaboration"
            fill
            className="object-cover opacity-30"
            priority
          />
        </div>

        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col items-center text-center space-y-6"
          >
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="text-4xl md:text-6xl font-bold tracking-tight"
            >
              <span className="text-primary">Plot</span>Pact
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="text-xl md:text-2xl text-muted-foreground max-w-3xl"
            >
              Where your imagination meets the unexpected. Partner with AI to explore story paths shaped by creative
              constraints.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="flex flex-col sm:flex-row gap-4 mt-8"
            >
              <Button size="lg" className="gap-2" onClick={() => scrollToSection(1)}>
                Start Writing <ArrowRight className="h-4 w-4" />
              </Button>

              <Button size="lg" variant="outline" className="gap-2" onClick={() => scrollToSection(3)}>
                Learn More <BookOpen className="h-4 w-4" />
              </Button>
            </motion.div>
          </motion.div>
        </div>

        <motion.div
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2 cursor-pointer"
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2 }}
          onClick={() => scrollToSection(1)}
        >
          <ChevronDown className="w-8 h-8 text-primary/70" />
        </motion.div>
      </section>

      {/* Choose Story Type */}
      <section
        ref={(el) => {
          sectionsRef.current[1] = el
          return undefined
        }}
        id="story-type"
        className="h-screen flex items-center px-4 sm:px-6 lg:px-8 bg-background"
      >
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-4">Choose Your Creative Path</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Begin from a blank canvas or pick a curated template — your storytelling journey starts here.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 py-4">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <Card
                className="cursor-pointer hover:border-primary transition-all duration-300 overflow-hidden group h-full"
                onClick={handleStartEmptyCanvas}
              >
                <CardContent className="p-8 flex flex-col items-center text-center h-full">
                  <div className="mb-6 bg-primary/10 p-4 rounded-full w-16 h-16 flex items-center justify-center group-hover:bg-primary/20 transition-all duration-300">
                    <Edit className="h-8 w-8 text-primary group-hover:scale-110 transition-all duration-300" />
                  </div>
                  <h3 className="text-xl font-medium mb-4 group-hover:text-primary transition-colors">
                    Start Empty Canvas
                  </h3>
                  <p className="text-muted-foreground">
                    Create your own story plot and write from scratch. Begin with a blank page and let your imagination
                    flow freely.
                  </p>
                  <div className="mt-auto pt-6">
                    <div className="inline-flex items-center text-primary font-medium opacity-0 group-hover:opacity-100 transition-all duration-300">
                      Get started <ArrowRight className="ml-2 h-4 w-4" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <Card
                className="cursor-pointer hover:border-primary transition-all duration-300 overflow-hidden group h-full"
                onClick={() => scrollToSection(2)}
              >
                <CardContent className="p-8 flex flex-col items-center text-center h-full">
                  <div className="mb-6 bg-primary/10 p-4 rounded-full w-16 h-16 flex items-center justify-center group-hover:bg-primary/20 transition-all duration-300">
                    <FilePlus2 className="h-8 w-8 text-primary group-hover:scale-110 transition-all duration-300" />
                  </div>
                  <h3 className="text-xl font-medium mb-4 group-hover:text-primary transition-colors">Use Template</h3>
                  <p className="text-muted-foreground">
                    Continue a story from our featured templates. Jump into an existing narrative and make it your own.
                  </p>
                  <div className="mt-auto pt-6">
                    <div className="inline-flex items-center text-primary font-medium opacity-0 group-hover:opacity-100 transition-all duration-300">
                      See templates <ArrowRight className="ml-2 h-4 w-4" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>

        <motion.div
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2 cursor-pointer"
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2 }}
          onClick={() => scrollToSection(2)}
        >
          <ChevronDown className="w-8 h-8 text-primary/70" />
        </motion.div>
      </section>

      {/* Featured Stories Section */}
      <section
        ref={(el) => {
          sectionsRef.current[2] = el
          return undefined
        }}
        id="featured-stories"
        className="min-h-screen flex items-center px-4 sm:px-6 lg:px-8 bg-background py-16"
      >
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-4">Featured Stories</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Explore these collaborative human-AI stories created with PlotPact
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Lila Story */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="group cursor-pointer"
              onClick={() => handleTemplateStory("1")}
            >
              <div className="bg-card rounded-lg overflow-hidden shadow-md transition-all duration-300 hover:shadow-xl h-full flex flex-col transform group-hover:translate-y-[-8px]">
                <div className="relative h-64 w-full overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
                  <Image
                    src="/story-images/lila.png"
                    alt="Lila holding a box"
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="p-6 flex-grow">
                  <h3 className="text-2xl font-bold mb-2 group-hover:text-primary transition-colors">
                    The Box with the Brass Dial
                  </h3>
                  <p className="text-muted-foreground">
                    Lila discovers a mysterious wooden box on her doorstep, adorned with a brass dial and an ominous
                    note: "Turn the dial to the right number to save him." With no clue who "him" refers to—her brother,
                    her father, or someone else—panic grips her. As she turns the box over, faint numbers etched along
                    its edges hint at a hidden code. Racing against an unknown clock, she must decipher the message
                    before it's too late.
                  </p>
                </div>
                <div className="px-6 pb-6 pt-2">
                  <div className="inline-flex items-center text-primary font-medium group-hover:translate-x-2 transition-all duration-300">
                    Continue story <ArrowRight className="ml-2 h-4 w-4" />
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Knight story */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="group cursor-pointer"
              onClick={() => handleTemplateStory("2")}
            >
              <div className="bg-card rounded-lg overflow-hidden shadow-md transition-all duration-300 hover:shadow-xl h-full flex flex-col transform group-hover:translate-y-[-8px]">
                <div className="relative h-64 w-full overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
                  <Image
                    src="/story-images/knight.jpg"
                    alt="Knight facing a dragon"
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="p-6 flex-grow">
                  <h3 className="text-2xl font-bold mb-2 group-hover:text-primary transition-colors">
                    A Knight's Stand
                  </h3>
                  <p className="text-muted-foreground">
                    When the ancient dragon Malgrath descends upon the peaceful village of Oakendale, retired knight Sir
                    Brannen takes up his rusted armor for one final battle to protect his home. Experience the journey
                    of a broken hero who must rediscover his courage as he confronts impossible odds, devising a
                    desperate plan that will determine the fate of everyone he holds dear.
                  </p>
                </div>
                <div className="px-6 pb-6 pt-2">
                  <div className="inline-flex items-center text-primary font-medium group-hover:translate-x-2 transition-all duration-300">
                    Continue story <ArrowRight className="ml-2 h-4 w-4" />
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        <motion.div
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2 cursor-pointer"
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2 }}
          onClick={() => scrollToSection(3)}
        >
          <ChevronDown className="w-8 h-8 text-primary/70" />
        </motion.div>
      </section>

      {/* Problem Section */}
      <section
        ref={(el) => {
          sectionsRef.current[3] = el
          return undefined
        }}
        id="problem"
        className="h-screen flex items-center px-4 sm:px-6 lg:px-8 bg-primary/5"
      >
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-4">The Problem We're Solving</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              The rise of large language models has made it easy to generate content — but at a cost. People are
              thinking less, creating less, and collaborating less.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <Card className="overflow-hidden group hover:border-primary/50 transition-all duration-300 h-full">
                <CardContent className="p-6">
                  <div className="mb-4 bg-primary/10 p-3 rounded-full w-12 h-12 flex items-center justify-center group-hover:bg-primary/20 transition-all duration-300">
                    <Brain className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                    Diminished Creativity
                  </h3>
                  <p className="text-muted-foreground">
                    Overreliance on AI can impede creative brainstorming and original thinking.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Card className="overflow-hidden group hover:border-primary/50 transition-all duration-300 h-full">
                <CardContent className="p-6">
                  <div className="mb-4 bg-primary/10 p-3 rounded-full w-12 h-12 flex items-center justify-center group-hover:bg-primary/20 transition-all duration-300">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                    Disconnected Narratives
                  </h3>
                  <p className="text-muted-foreground">
                    Current AI-assisted storytelling systems often lack meaningful collaborative interaction.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Card className="overflow-hidden group hover:border-primary/50 transition-all duration-300 h-full">
                <CardContent className="p-6">
                  <div className="mb-4 bg-primary/10 p-3 rounded-full w-12 h-12 flex items-center justify-center group-hover:bg-primary/20 transition-all duration-300">
                    <Lightbulb className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                    Passive Consumption
                  </h3>
                  <p className="text-muted-foreground">
                    Users often passively consume AI-generated content rather than actively participating in creation.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>

        <motion.div
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2 cursor-pointer"
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2 }}
          onClick={() => scrollToSection(4)}
        >
          <ChevronDown className="w-8 h-8 text-primary/70" />
        </motion.div>
      </section>

      {/* How Constraints Enhance Creativity */}
      <section
        ref={(el) => {
          sectionsRef.current[4] = el
          return undefined
        }}
        id="constraints"
        className="min-h-screen flex items-center px-4 sm:px-6 lg:px-8 bg-primary/5 py-20"
      >
        <div className="container mx-auto max-w-5xl">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold mb-4">Why Constraints Spark Creativity</h2>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
              Constraints don't limit imagination — they ignite it. In PlotPact, you co-create with AI by selecting
              meaningful constraints that shape, guide, and challenge your storytelling.
            </p>
          </motion.div>

          <div className="space-y-12">
            {/* Step 1: Function */}
            <motion.div
              className="flex flex-col md:flex-row gap-6 items-start"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="bg-primary/10 p-4 rounded-full">
                <Lightbulb className="w-8 h-8 text-primary" />
              </div>
              <div>
                <h3 className="text-2xl font-semibold mb-2">1. Constraint Function</h3>
                <p className="text-muted-foreground text-base md:text-lg">
                  Constraints in PlotPact serve one of two cognitive roles:{" "}
                  <strong className="text-foreground">focusing</strong> or{" "}
                  <strong className="text-foreground">exclusionary</strong>. A focusing constraint directs the story
                  toward specific ideas or elements ("Include a haunting tune"), while an exclusionary constraint
                  removes overused patterns ("Avoid any character who is a chosen one"), forcing you into fresh
                  narrative territory.
                </p>
              </div>
            </motion.div>

            {/* Step 2: Type */}
            <motion.div
              className="flex flex-col md:flex-row gap-6 items-start"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="bg-primary/10 p-4 rounded-full">
                <BookOpen className="w-8 h-8 text-primary" />
              </div>
              <div>
                <h3 className="text-2xl font-semibold mb-2">2. Constraint Type</h3>
                <p className="text-muted-foreground text-base md:text-lg">
                  Each constraint is either an <strong className="text-foreground">anchor</strong> or a{" "}
                  <strong className="text-foreground">channel</strong>. Anchors are specific prompts— a phrase, object,
                  or character idea that sparks a story thread (e.g., "A shattered compass"). Channels are broader
                  themes or categories (e.g., "Loss and memory") that set a tone or direct the scope of exploration.
                </p>
              </div>
            </motion.div>

            {/* Step 3: Flexibility */}
            <motion.div
              className="flex flex-col md:flex-row gap-6 items-start"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="bg-primary/10 p-4 rounded-full">
                <RefreshCcw className="w-8 h-8 text-primary" />
              </div>
              <div>
                <h3 className="text-2xl font-semibold mb-2">3. Constraint Flexibility</h3>
                <p className="text-muted-foreground text-base md:text-lg">
                  Not all constraints are created equal. <strong className="text-foreground">Fixed constraints</strong>{" "}
                  are rules that must be followed, creating high-stakes boundaries.{" "}
                  <strong className="text-foreground">Flexible constraints</strong> offer softer guidance and can be
                  interpreted creatively or re-negotiated if they don't serve your story's evolution. You control how
                  strict or open-ended your inspiration is.
                </p>
              </div>
            </motion.div>
          </div>

          <motion.div
            className="mt-16 text-center text-muted-foreground text-lg max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Every time you write in PlotPact, you select a unique blend of these three elements. The AI interprets them
            to propose creative constraints that challenge assumptions, push boundaries, and make your stories truly
            your own.
          </motion.div>
        </div>

        <motion.div
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2 cursor-pointer"
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2 }}
          onClick={() => scrollToSection(5)}
        >
          <ChevronDown className="w-8 h-8 text-primary/70" />
        </motion.div>
      </section>

      {/* PlotPact Workflow Section */}
      <section
        ref={(el) => {
          sectionsRef.current[5] = el
          return undefined
        }}
        id="workflow"
        className="min-h-screen flex items-center px-4 sm:px-6 lg:px-8 bg-background py-16"
      >
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-4">How PlotPact Works</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              PlotPact blends human creativity with AI guidance by using constraints to co-shape stories. Here's how the
              collaborative process unfolds.
            </p>
          </motion.div>

          <motion.div
            className="bg-card rounded-lg shadow-lg overflow-hidden"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="p-6 md:p-8">
              <h3 className="text-2xl font-bold mb-4">Workflow</h3>

              <div className="space-y-6">
                {/* Step 1 */}
                <motion.div
                  className="flex flex-col md:flex-row gap-4 p-4 border rounded-lg bg-background"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="flex-shrink-0 w-full md:w-24 font-semibold text-primary">Step 1</div>
                  <div className="flex-grow">
                    <p className="font-medium">Start your story</p>
                    <p className="text-muted-foreground mt-1">
                      Create a plot from scratch or choose from PlotPact's curated templates to begin.
                    </p>
                  </div>
                </motion.div>

                {/* Step 2 */}
                <motion.div
                  className="flex flex-col md:flex-row gap-4 p-4 border rounded-lg bg-background"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                >
                  <div className="flex-shrink-0 w-full md:w-24 font-semibold text-primary">Step 2</div>
                  <div className="flex-grow">
                    <p className="font-medium">Initial constraints are generated</p>
                    <p className="text-muted-foreground mt-1">
                      Based on your plot, AI creates a starting set of constraints to guide the direction of your
                      narrative.
                    </p>
                  </div>
                </motion.div>

                {/* Step 3 */}
                <motion.div
                  className="flex flex-col md:flex-row gap-4 p-4 border rounded-lg bg-background"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <div className="flex-shrink-0 w-full md:w-24 font-semibold text-primary">Step 3</div>
                  <div className="flex-grow">
                    <p className="font-medium">Continue the story under constraints</p>
                    <p className="text-muted-foreground mt-1">
                      Write your story freely, but adhere to the active constraints — they're here to challenge and
                      inspire.
                    </p>
                  </div>
                </motion.div>

                {/* Step 4 */}
                <motion.div
                  className="flex flex-col md:flex-row gap-4 p-4 border rounded-lg bg-background"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  <div className="flex-shrink-0 w-full md:w-24 font-semibold text-primary">Step 4</div>
                  <div className="flex-grow">
                    <p className="font-medium">Constraint violations are flagged</p>
                    <p className="text-muted-foreground mt-1">
                      If your text violates a constraint, you'll receive gentle feedback so you can revise or rethink
                      creatively.
                    </p>
                    <div className="mt-2 text-sm text-red-600">Violation detected: constraint not followed</div>
                  </div>
                </motion.div>

                {/* Step 5 */}
                <motion.div
                  className="flex flex-col md:flex-row gap-4 p-4 border rounded-lg bg-background"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  <div className="flex-shrink-0 w-full md:w-24 font-semibold text-primary">Step 5</div>
                  <div className="flex-grow">
                    <p className="font-medium">Generate new constraints with AI</p>
                    <p className="text-muted-foreground mt-1">
                      Need inspiration or tension? Choose the function, type, and flexibility — the AI will generate a
                      new constraint tailored to your creative goals.
                    </p>
                    <div className="mt-2 text-sm text-green-600">New constraint added successfully</div>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 sm:px-6 lg:px-8 bg-muted/50 border-t">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h3 className="text-xl font-bold">
                <span className="text-primary">Plot</span>Pact
              </h3>
              <p className="text-muted-foreground">Interactive Storytelling with Human-AI Constraint Negotiation</p>
            </div>
            <div className="flex gap-4">
              <Link href="#" className="text-muted-foreground hover:text-foreground">
                About
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-foreground">
                Features
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-foreground">
                Contact
              </Link>
            </div>
          </div>
          <div className="mt-8 text-center text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} PlotPact. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}
