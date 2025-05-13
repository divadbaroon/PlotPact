'use client';

import { forwardRef } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowRight, ChevronDown } from 'lucide-react';

import { FeaturedStoriesSectionProps } from "@/types"

const FeaturedStoriesSection = forwardRef<HTMLElement, FeaturedStoriesSectionProps>(
  ({ onSelectStory, onScrollDown }, ref) => {
    return (
      <section
        ref={ref}
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
              onClick={() => onSelectStory("1")}
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
                    note: &quot;Turn the dial to the right number to save him.&quot; With no clue who &quot;him&quot; refers to—her brother,
                    her father, or someone else—panic grips her. As she turns the box over, faint numbers etched along
                    its edges hint at a hidden code. Racing against an unknown clock, she must decipher the message
                    before it&apos;s too late.
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
              onClick={() => onSelectStory("2")}
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
                    A Knight&apos;s Stand
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
          onClick={onScrollDown}
        >
          <ChevronDown className="w-8 h-8 text-primary/70" />
        </motion.div>
      </section>
    );
  }
);

FeaturedStoriesSection.displayName = 'FeaturedStoriesSection';

export default FeaturedStoriesSection;