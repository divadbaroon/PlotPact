'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  ArrowRight,
  BookOpen,
  Brain,
  Lightbulb,
  Users,
  Edit,
  FilePlus2,
  RefreshCcw,
} from 'lucide-react';

import knight from '../../public/story-images/knight.jpg';
import lila from '../../public/story-images/lila.png';

export default function Home() {
  const router = useRouter();

  const handleStartEmptyCanvas = () => {
    router.push(`/story/customStory`);
  };

  const handleTemplateStory = (storyId: string) => {
    // Redirect to the selected template story
    router.push(`/story/${storyId}`);
  };

  return (
    <div className='flex flex-col min-h-screen'>
      {/* Hero Section */}
      <section className='relative bg-gradient-to-b from-primary/10 to-background py-30 px-4 sm:px-6 lg:px-8'>
        <div className='absolute inset-0 -z-10'>
          <Image
            src='/bg-collab.png' // update this if you use a different name
            alt='Human and AI storytelling collaboration'
            fill
            className='object-cover opacity-30'
            priority
          />
        </div>

        <div className='container mx-auto max-w-6xl'>
          <div className='flex flex-col items-center text-center space-y-6 mt-4'>
            <h1 className='text-4xl md:text-6xl font-bold tracking-tight'>
              <span className='text-primary'>Plot</span>Pact
            </h1>
            <p className='text-xl md:text-2xl text-muted-foreground max-w-3xl'>
              Where your imagination meets the unexpected. Partner with AI to
              explore story paths shaped by creative constraints.
            </p>
            <div className='flex flex-col sm:flex-row gap-4 mt-8'>
              <Button
                size='lg'
                className='gap-2'
                onClick={() => {
                  document.querySelector('#story-type')?.scrollIntoView({
                    behavior: 'smooth',
                  });
                }}
              >
                Start Writing <ArrowRight className='h-4 w-4' />
              </Button>

              <Link href='/#problem' className='group'>
                <Button size='lg' variant='outline' className='gap-2'>
                  Learn More <BookOpen className='h-4 w-4' />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Choose Story Type */}
      <section
        id='story-type'
        className='py-16 px-4 sm:px-6 lg:px-8 bg-background'
      >
      <div className='container mx-auto max-w-6xl'>
        <div className='text-center mb-12'>
          <h2 className='text-3xl font-bold mb-4'>Choose Your Creative Path</h2>
          <p className='text-xl text-muted-foreground max-w-3xl mx-auto'>
            Begin from a blank canvas or pick a curated template — your
            storytelling journey starts here.
          </p>
        </div>

        <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 py-4'>
          <Card
            className='cursor-pointer hover:border-primary transition-colors'
            onClick={handleStartEmptyCanvas}
          >
            <CardContent className='p-6 flex flex-col items-center text-center'>
              <Edit className='h-12 w-12 text-primary mb-4' />
              <h3 className='text-lg font-medium mb-2'>Start Empty Canvas</h3>
              <p className='text-sm text-muted-foreground'>
                Create your own story plot and write from scratch
              </p>
            </CardContent>
          </Card>

          <Card
            className='cursor-pointer hover:border-primary transition-colors'
            onClick={() => {
              document.querySelector('#featured-stories')?.scrollIntoView({
                behavior: 'smooth',
              });
            }}
          >
            <CardContent className='p-6 flex flex-col items-center text-center'>
              <FilePlus2 className='h-12 w-12 text-primary mb-4' />
              <h3 className='text-lg font-medium mb-2'>Use Template</h3>
              <p className='text-sm text-muted-foreground'>
                Continue a story from our featured templates
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
      </section>

      {/* Featured Stories Section */}
      <section
        id='featured-stories'
        className='py-16 px-4 sm:px-6 lg:px-8 bg-background'
      >
        <div className='container mx-auto max-w-6xl'>
          <div className='text-center mb-12'>
            <h2 className='text-3xl font-bold mb-4'>Featured Stories</h2>
            <p className='text-xl text-muted-foreground max-w-3xl mx-auto'>
              Explore these collaborative human-AI stories created with PlotPact
            </p>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
            {/* Lila Story */}
            <div
              className='group cursor-pointer'
              onClick={() => handleTemplateStory('1')}
            >
              <div className='bg-card rounded-lg overflow-hidden shadow-md transition-all duration-300 hover:shadow-xl h-full flex flex-col'>
                <div className='relative h-64 w-full'>
                  <div className='absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10' />
                  <Image
                    src={lila}
                    alt='Lila holding a box'
                    fill
                    className='object-cover'
                  />
                </div>
                <div className='p-6 flex-grow'>
                  <h3 className='text-2xl font-bold mb-2 group-hover:text-primary transition-colors'>
                    The Box with the Brass Dial
                  </h3>
                  <p className='text-muted-foreground'>
                    Lila discovers a mysterious wooden box on her doorstep,
                    adorned with a brass dial and an ominous note: &quot;Turn
                    the dial to the right number to save him.&quot; With no clue
                    who &quot;him&quot; refers to—her brother, her father, or
                    someone else—panic grips her. As she turns the box over,
                    faint numbers etched along its edges hint at a hidden code.
                    Racing against an unknown clock, she must decipher the
                    message before it&apos;s too late.
                  </p>
                </div>
                <div className='px-6 pb-6 pt-2'>
                  <div className='inline-flex items-center text-primary font-medium'>
                    Continue story <ArrowRight className='ml-2 h-4 w-4' />
                  </div>
                </div>
              </div>
            </div>

            {/* Knight story */}
            <div
              className='group cursor-pointer'
              onClick={() => handleTemplateStory('2')}
            >
              <div className='bg-card rounded-lg overflow-hidden shadow-md transition-all duration-300 hover:shadow-xl h-full flex flex-col'>
                <div className='relative h-64 w-full'>
                  <div className='absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10' />
                  <Image
                    src={knight}
                    alt='Knight facing a dragon'
                    fill
                    className='object-cover'
                  />
                </div>
                <div className='p-6 flex-grow'>
                  <h3 className='text-2xl font-bold mb-2 group-hover:text-primary transition-colors'>
                    A Knight&apos;s Stand
                  </h3>
                  <p className='text-muted-foreground'>
                    When the ancient dragon Malgrath descends upon the peaceful
                    village of Oakendale, retired knight Sir Brannen takes up
                    his rusted armor for one final battle to protect his home.
                    Experience the journey of a broken hero who must rediscover
                    his courage as he confronts impossible odds, devising a
                    desperate plan that will determine the fate of everyone he
                    holds dear.
                  </p>
                </div>
                <div className='px-6 pb-6 pt-2'>
                  <div className='inline-flex items-center text-primary font-medium'>
                    Continue story <ArrowRight className='ml-2 h-4 w-4' />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className='py-16 px-4 sm:px-6 lg:px-8 bg-primary/5' id='problem'>
        <div className='container mx-auto max-w-6xl'>
          <div className='text-center mb-12'>
            <h2 className='text-3xl font-bold mb-4'>
              The Problem We&apos;re Solving
            </h2>
            <p className='text-xl text-muted-foreground max-w-3xl mx-auto'>
              The rise of large language models has made it easy to generate
              content — but at a cost. People are thinking less, creating less,
              and collaborating less.
            </p>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
            <Card>
              <CardContent className='pt-6'>
                <div className='mb-4 bg-primary/10 p-3 rounded-full w-12 h-12 flex items-center justify-center'>
                  <Brain className='h-6 w-6 text-primary' />
                </div>
                <h3 className='text-xl font-semibold mb-2'>
                  Diminished Creativity
                </h3>
                <p className='text-muted-foreground'>
                  Overreliance on AI can impede creative brainstorming and
                  original thinking.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className='pt-6'>
                <div className='mb-4 bg-primary/10 p-3 rounded-full w-12 h-12 flex items-center justify-center'>
                  <Users className='h-6 w-6 text-primary' />
                </div>
                <h3 className='text-xl font-semibold mb-2'>
                  Disconnected Narratives
                </h3>
                <p className='text-muted-foreground'>
                  Current AI-assisted storytelling systems often lack meaningful
                  collaborative interaction.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className='pt-6'>
                <div className='mb-4 bg-primary/10 p-3 rounded-full w-12 h-12 flex items-center justify-center'>
                  <Lightbulb className='h-6 w-6 text-primary' />
                </div>
                <h3 className='text-xl font-semibold mb-2'>
                  Passive Consumption
                </h3>
                <p className='text-muted-foreground'>
                  Users often passively consume AI-generated content rather than
                  actively participating in creation.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How Constraints Enhance Creativity */}
      <section className='py-20 px-4 sm:px-6 lg:px-8 bg-primary/5'>
        <div className='container mx-auto max-w-5xl'>
          <div className='text-center mb-12'>
            <h2 className='text-4xl font-bold mb-4'>
              Why Constraints Spark Creativity
            </h2>
            <p className='text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto'>
              Constraints don&rsquo;t limit imagination — they ignite it. In
              PlotPact, you co-create with AI by selecting meaningful
              constraints that shape, guide, and challenge your storytelling.
            </p>
          </div>

          <div className='space-y-12'>
            {/* Step 1: Function */}
            <div className='flex flex-col md:flex-row gap-6 items-start'>
              <div className='bg-primary/10 p-4 rounded-full'>
                <Lightbulb className='w-8 h-8 text-primary' />
              </div>
              <div>
                <h3 className='text-2xl font-semibold mb-2'>
                  1. Constraint Function
                </h3>
                <p className='text-muted-foreground text-base md:text-lg'>
                  Constraints in PlotPact serve one of two cognitive roles:{' '}
                  <strong>focusing</strong> or <strong>exclusionary</strong>. A
                  focusing constraint directs the story toward specific ideas or
                  elements (“Include a haunting tune”), while an exclusionary
                  constraint removes overused patterns (“Avoid any character who
                  is a chosen one”), forcing you into fresh narrative territory.
                </p>
              </div>
            </div>

            {/* Step 2: Type */}
            <div className='flex flex-col md:flex-row gap-6 items-start'>
              <div className='bg-primary/10 p-4 rounded-full'>
                <BookOpen className='w-8 h-8 text-primary' />
              </div>
              <div>
                <h3 className='text-2xl font-semibold mb-2'>
                  2. Constraint Type
                </h3>
                <p className='text-muted-foreground text-base md:text-lg'>
                  Each constraint is either an <strong>anchor</strong> or a{' '}
                  <strong>channel</strong>. Anchors are specific prompts— a
                  phrase, object, or character idea that sparks a story thread
                  (e.g., “A shattered compass”). Channels are broader themes or
                  categories (e.g., “Loss and memory”) that set a tone or direct
                  the scope of exploration.
                </p>
              </div>
            </div>

            {/* Step 3: Flexibility */}
            <div className='flex flex-col md:flex-row gap-6 items-start'>
              <div className='bg-primary/10 p-4 rounded-full'>
                <RefreshCcw className='w-8 h-8 text-primary' />
              </div>
              <div>
                <h3 className='text-2xl font-semibold mb-2'>
                  3. Constraint Flexibility
                </h3>
                <p className='text-muted-foreground text-base md:text-lg'>
                  Not all constraints are created equal.{' '}
                  <strong>Fixed constraints</strong> are rules that must be
                  followed, creating high-stakes boundaries.{' '}
                  <strong>Flexible constraints</strong> offer softer guidance
                  and can be interpreted creatively or re-negotiated if they
                  don&rsquo;t serve your story&rsquo;s evolution. You control
                  how strict or open-ended your inspiration is.
                </p>
              </div>
            </div>
          </div>

          <div className='mt-16 text-center text-muted-foreground text-lg max-w-4xl mx-auto'>
            Every time you write in PlotPact, you select a unique blend of these
            three elements. The AI interprets them to propose creative
            constraints that challenge assumptions, push boundaries, and make
            your stories truly your own.
          </div>
        </div>
      </section>
      {/* PlotPact Workflow Section */}
      <section className='py-16 px-4 sm:px-6 lg:px-8 bg-background'>
        <div className='container mx-auto max-w-6xl'>
          <div className='text-center mb-12'>
            <h2 className='text-3xl font-bold mb-4'>How PlotPact Works</h2>
            <p className='text-xl text-muted-foreground max-w-3xl mx-auto'>
              PlotPact blends human creativity with AI guidance by using
              constraints to co-shape stories. Here&rsquo;s how the
              collaborative process unfolds.
            </p>
          </div>

          <div className='bg-card rounded-lg shadow-lg overflow-hidden'>
            <div className='p-6 md:p-8'>
              <h3 className='text-2xl font-bold mb-4'>Workflow</h3>

              <div className='space-y-6'>
                {/* Step 1 */}
                <div className='flex flex-col md:flex-row gap-4 p-4 border rounded-lg bg-background'>
                  <div className='flex-shrink-0 w-full md:w-24 font-semibold text-primary'>
                    Step 1
                  </div>
                  <div className='flex-grow'>
                    <p className='font-medium'>Start your story</p>
                    <p className='text-muted-foreground mt-1'>
                      Create a plot from scratch or choose from PlotPact&rsquo;s
                      curated templates to begin.
                    </p>
                  </div>
                </div>

                {/* Step 2 */}
                <div className='flex flex-col md:flex-row gap-4 p-4 border rounded-lg bg-background'>
                  <div className='flex-shrink-0 w-full md:w-24 font-semibold text-primary'>
                    Step 2
                  </div>
                  <div className='flex-grow'>
                    <p className='font-medium'>
                      Initial constraints are generated
                    </p>
                    <p className='text-muted-foreground mt-1'>
                      Based on your plot, AI creates a starting set of
                      constraints to guide the direction of your narrative.
                    </p>
                  </div>
                </div>

                {/* Step 3 */}
                <div className='flex flex-col md:flex-row gap-4 p-4 border rounded-lg bg-background'>
                  <div className='flex-shrink-0 w-full md:w-24 font-semibold text-primary'>
                    Step 3
                  </div>
                  <div className='flex-grow'>
                    <p className='font-medium'>
                      Continue the story under constraints
                    </p>
                    <p className='text-muted-foreground mt-1'>
                      Write your story freely, but adhere to the active
                      constraints — they&rsquo;re here to challenge and inspire.
                    </p>
                  </div>
                </div>

                {/* Step 4 */}
                <div className='flex flex-col md:flex-row gap-4 p-4 border rounded-lg bg-background'>
                  <div className='flex-shrink-0 w-full md:w-24 font-semibold text-primary'>
                    Step 4
                  </div>
                  <div className='flex-grow'>
                    <p className='font-medium'>
                      Constraint violations are flagged
                    </p>
                    <p className='text-muted-foreground mt-1'>
                      If your text violates a constraint, you&rsquo;ll receive
                      gentle feedback so you can revise or rethink creatively.
                    </p>
                    <div className='mt-2 text-sm text-red-600'>
                      Violation detected: constraint not followed
                    </div>
                  </div>
                </div>

                {/* Step 5 */}
                <div className='flex flex-col md:flex-row gap-4 p-4 border rounded-lg bg-background'>
                  <div className='flex-shrink-0 w-full md:w-24 font-semibold text-primary'>
                    Step 5
                  </div>
                  <div className='flex-grow'>
                    <p className='font-medium'>
                      Generate new constraints with AI
                    </p>
                    <p className='text-muted-foreground mt-1'>
                      Need inspiration or tension? Choose the function, type,
                      and flexibility — the AI will generate a new constraint
                      tailored to your creative goals.
                    </p>
                    <div className='mt-2 text-sm text-green-600'>
                      New constraint added successfully
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className='py-8 px-4 sm:px-6 lg:px-8 bg-muted/50 border-t'>
        <div className='container mx-auto max-w-6xl'>
          <div className='flex flex-col md:flex-row justify-between items-center'>
            <div className='mb-4 md:mb-0'>
              <h3 className='text-xl font-bold'>
                <span className='text-primary'>Plot</span>Pact
              </h3>
              <p className='text-muted-foreground'>
                Interactive Storytelling with Human-AI Constraint Negotiation
              </p>
            </div>
            <div className='flex gap-4'>
              <Link
                href='#'
                className='text-muted-foreground hover:text-foreground'
              >
                About
              </Link>
              <Link
                href='#'
                className='text-muted-foreground hover:text-foreground'
              >
                Features
              </Link>
              <Link
                href='#'
                className='text-muted-foreground hover:text-foreground'
              >
                Contact
              </Link>
            </div>
          </div>
          <div className='mt-8 text-center text-sm text-muted-foreground'>
            &copy; {new Date().getFullYear()} PlotPact. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
