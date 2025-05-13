'use client';

import { forwardRef } from 'react';
import { motion } from 'framer-motion';
import { Brain, Users, Lightbulb, ChevronDown } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

import { ProblemSectionProps } from "@/types"

const ProblemSection = forwardRef<HTMLElement, ProblemSectionProps>(
  ({ onScrollDown }, ref) => {
    return (
      <section
        ref={ref}
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
            <h2 className="text-3xl font-bold mb-4">The Problem We&apos;re Solving</h2>
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
          onClick={onScrollDown}
        >
          <ChevronDown className="w-8 h-8 text-primary/70" />
        </motion.div>
      </section>
    );
  }
);

ProblemSection.displayName = 'ProblemSection';

export default ProblemSection;