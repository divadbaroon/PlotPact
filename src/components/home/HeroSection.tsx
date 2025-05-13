'use client';

import { forwardRef } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowRight, BookOpen, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';

import { HeroSectionProps } from "@/types"

const HeroSection = forwardRef<HTMLElement, HeroSectionProps>(
  ({ onStartClick, onLearnMoreClick, onScrollDown }, ref) => {
    return (
      <section
        ref={ref}
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
              <Button size="lg" className="gap-2" onClick={onStartClick}>
                Start Writing <ArrowRight className="h-4 w-4" />
              </Button>

              <Button size="lg" variant="outline" className="gap-2" onClick={onLearnMoreClick}>
                Learn More <BookOpen className="h-4 w-4" />
              </Button>
            </motion.div>
          </motion.div>
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

HeroSection.displayName = 'HeroSection';

export default HeroSection;