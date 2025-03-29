import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowRight, BookOpen, Brain, Lightbulb, Users } from "lucide-react"

import apollo13 from "../../public/story-images/apollo13.jpg"
import knight from "../../public/story-images/knight.jpg"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-primary/10 to-background py-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col items-center text-center space-y-6 mt-4">
         
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
              <span className="text-primary">Plot</span>Pact
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl">
              Interactive Storytelling with Human-AI Constraint Negotiation
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mt-8">
              <Button size="lg" className="gap-2">
                Try Demo <ArrowRight className="h-4 w-4" />
              </Button>
              <Button size="lg" variant="outline" className="gap-2">
                Learn More <BookOpen className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Stories Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-background">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Featured Stories</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Explore these collaborative human-AI stories created with PlotPact
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* The Knight Story */}
            <Link href="/story" className="group">
              <div className="bg-card rounded-lg overflow-hidden shadow-md transition-all duration-300 hover:shadow-xl h-full flex flex-col">
                <div className="relative h-64 w-full">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
                  <Image
                    src={knight}
                    alt="Knight facing a dragon"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-6 flex-grow">
                  <h3 className="text-2xl font-bold mb-2 group-hover:text-primary transition-colors">
                    The Last Shield: A Knight&apos;s Stand
                  </h3>
                  <p className="text-muted-foreground">
                    When the ancient dragon Malgrath descends upon the peaceful village of Oakendale, retired knight Sir
                    Brannen takes up his rusted armor for one final battle to protect his home. Experience the journey
                    of a broken hero who must rediscover his courage as he confronts impossible odds, devising a
                    desperate plan that will determine the fate of everyone he holds dear.
                  </p>
                </div>
                <div className="px-6 pb-6 pt-2">
                  <div className="inline-flex items-center text-primary font-medium">
                    Read story <ArrowRight className="ml-2 h-4 w-4" />
                  </div>
                </div>
              </div>
            </Link>

            {/* The Apollo 13 Story */}
            <Link href="/learn" className="group">
              <div className="bg-card rounded-lg overflow-hidden shadow-md transition-all duration-300 hover:shadow-xl h-full flex flex-col">
                <div className="relative h-64 w-full">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
                  <Image
                    src={apollo13}
                    alt="Apollo 13 spacecraft"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-6 flex-grow">
                  <h3 className="text-2xl font-bold mb-2 group-hover:text-primary transition-colors">
                    The Apollo 13 Mission
                  </h3>
                  <p className="text-muted-foreground">
                    Apollo 13 was NASA&apos;s seventh crewed mission in the Apollo space program, launched on April 11, 1970.
                    The spacecraft carried a crew of three astronauts: James Lovell, Jack Swigert, and Fred Haise. It
                    was intended to be the third mission to land humans on the Moon. Fate had different plans.
                  </p>
                </div>
                <div className="px-6 pb-6 pt-2">
                  <div className="inline-flex items-center text-primary font-medium">
                    Read story <ArrowRight className="ml-2 h-4 w-4" />
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-primary/5">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">The Problem We&apos;re Solving</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              The advent of LLMs has caused many people to stop thinking about their answers and has affected their
              creativity.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card>
              <CardContent className="pt-6">
                <div className="mb-4 bg-primary/10 p-3 rounded-full w-12 h-12 flex items-center justify-center">
                  <Brain className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Diminished Creativity</h3>
                <p className="text-muted-foreground">
                  Overreliance on AI can impede creative brainstorming and original thinking.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="mb-4 bg-primary/10 p-3 rounded-full w-12 h-12 flex items-center justify-center">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Disconnected Narratives</h3>
                <p className="text-muted-foreground">
                  Current AI-assisted storytelling systems often lack meaningful collaborative interaction.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="mb-4 bg-primary/10 p-3 rounded-full w-12 h-12 flex items-center justify-center">
                  <Lightbulb className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Passive Consumption</h3>
                <p className="text-muted-foreground">
                  Users often passively consume AI-generated content rather than actively participating in creation.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Our Approach Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-background">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Our Approach</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              PlotPact creates a unique collaborative environment where humans and AI co-author stories by enforcing
              constraints on each other.
            </p>
          </div>

          <div className="bg-card rounded-lg shadow-lg overflow-hidden">
            <div className="p-6 md:p-8">
              <h3 className="text-2xl font-bold mb-4">How It Works</h3>

              <div className="space-y-6">
                <div className="flex flex-col md:flex-row gap-4 p-4 border rounded-lg bg-background">
                  <div className="flex-shrink-0 w-full md:w-24 font-semibold text-primary">Step 1</div>
                  <div className="flex-grow">
                    <p className="font-medium">Human writes a sentence</p>
                    <p className="text-muted-foreground mt-1">&quot;John really wants to go scuba diving.&quot;</p>
                    <div className="mt-2 text-sm text-green-600">Accepted</div>
                  </div>
                </div>

                <div className="flex flex-col md:flex-row gap-4 p-4 border rounded-lg bg-background">
                  <div className="flex-shrink-0 w-full md:w-24 font-semibold text-primary">Step 2</div>
                  <div className="flex-grow">
                    <p className="font-medium">AI writes the next sentence with a constraint</p>
                    <p className="text-muted-foreground mt-1">&quot;But he is afraid of deep water.&quot;</p>
                    <div className="mt-2 text-sm text-green-600">Accepted with constraint enforced</div>
                  </div>
                </div>

                <div className="flex flex-col md:flex-row gap-4 p-4 border rounded-lg bg-background">
                  <div className="flex-shrink-0 w-full md:w-24 font-semibold text-primary">Step 3</div>
                  <div className="flex-grow">
                    <p className="font-medium">Human attempts to continue the story</p>
                    <p className="text-muted-foreground mt-1">&quot;One day he was swimming in Lake Ontario.&quot;</p>
                    <div className="mt-2 text-sm text-red-600">Rejected as John is afraid of deep water</div>
                  </div>
                </div>

                <div className="flex flex-col md:flex-row gap-4 p-4 border rounded-lg bg-background">
                  <div className="flex-shrink-0 w-full md:w-24 font-semibold text-primary">Step 4</div>
                  <div className="flex-grow">
                    <p className="font-medium">Human revises with constraint in mind</p>
                    <p className="text-muted-foreground mt-1">
                    &quot;To overcome his fear of deep water, he first made himself comfortable in shallow water.&quot;
                    </p>
                    <div className="mt-2 text-sm text-green-600">Accepted</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-primary/5">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Key Features</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              PlotPact offers a range of features to enhance the collaborative storytelling experience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex gap-4">
              <div className="flex-shrink-0 bg-primary/10 p-3 rounded-full h-12 w-12 flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-primary"
                >
                  <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"></path>
                  <path d="m9 12 2 2 4-4"></path>
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Constraint Negotiation</h3>
                <p className="text-muted-foreground">
                  Both human and AI can enforce narrative constraints, creating a dynamic storytelling environment.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 bg-primary/10 p-3 rounded-full h-12 w-12 flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-primary"
                >
                  <path d="M12 3c.132 0 .263 0 .393 0a7.5 7.5 0 0 0 7.92 12.446a9 9 0 1 1 -8.313 -12.454z"></path>
                  <path d="m17 4 3 3"></path>
                  <path d="m14 7 3 3"></path>
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Author Style Selection</h3>
                <p className="text-muted-foreground">
                  Choose from various author styles like Mark Twain, Stephen King, or J.K. Rowling for your AI
                  co-author.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 bg-primary/10 p-3 rounded-full h-12 w-12 flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-primary"
                >
                  <path d="M12 2H2v10h10V2z"></path>
                  <path d="M22 12h-4v4h4v-4z"></path>
                  <path d="M14 2h8v6h-8V2z"></path>
                  <path d="M2 16h6v6H2v-6z"></path>
                  <path d="M12 12h4v10h-4V12z"></path>
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Customizable Themes</h3>
                <p className="text-muted-foreground">
                  Set the theme for your story - professional writing, thriller, comedy, and more.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 bg-primary/10 p-3 rounded-full h-12 w-12 flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-primary"
                >
                  <path d="M12 16v-4"></path>
                  <path d="M12 8h.01"></path>
                  <circle cx="12" cy="12" r="10"></circle>
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Verifier Agent</h3>
                <p className="text-muted-foreground">
                  An intelligent agent checks both user and AI inputs to ensure all content follows established
                  constraints.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-primary text-primary-foreground">
        <div className="container mx-auto max-w-6xl text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Enhance Your Creativity?</h2>
          <p className="text-xl max-w-3xl mx-auto mb-8 text-primary-foreground/90">
            Join PlotPact today and experience a new way of collaborative storytelling that challenges your creativity
            and enhances your writing skills.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" className="gap-2">
              Start Writing <ArrowRight className="h-4 w-4" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10 gap-2"
            >
              Learn More <BookOpen className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-background">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Meet the Team</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">The brilliant minds behind PlotPact</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {["David Barron", "Muhammad Danish", "Shuvam Shiwakoti"].map((name, index) => (
              <div key={index} className="flex flex-col items-center text-center">
                <div className="w-32 h-32 rounded-full bg-primary/10 mb-4 flex items-center justify-center">
                  <span className="text-3xl font-bold text-primary">{name.charAt(0)}</span>
                </div>
                <h3 className="text-xl font-semibold">{name}</h3>
              </div>
            ))}
          </div>
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

