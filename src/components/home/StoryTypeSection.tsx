'use client';

import { forwardRef } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Edit, FilePlus2, ChevronDown } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

import { StoryTypeSectionProps } from "@/types"

const StoryTypeSection = forwardRef<HTMLElement, StoryTypeSectionProps>(
  ({ onStartEmptyCanvas, onUseTemplate, onScrollDown }, ref) => {
    return (
      <section
        ref={ref}
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
                onClick={onStartEmptyCanvas}
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
                onClick={onUseTemplate}
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
          onClick={onScrollDown}
        >
          <ChevronDown className="w-8 h-8 text-primary/70" />
        </motion.div>
      </section>
    );
  }
);

StoryTypeSection.displayName = 'StoryTypeSection';

export default StoryTypeSection;