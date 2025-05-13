'use client';

import { forwardRef } from 'react';
import { motion } from 'framer-motion';
import { Lightbulb, BookOpen, RefreshCcw, ChevronDown } from 'lucide-react';

import { ConstraintsSectionProps } from "@/types"

const ConstraintsSection = forwardRef<HTMLElement, ConstraintsSectionProps>(
  ({ onScrollDown }, ref) => {
    return (
      <section
        ref={ref}
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
              Constraints don&apos;t limit imagination — they ignite it. In PlotPact, you co-create with AI by selecting
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
                  toward specific ideas or elements (&quot;Include a haunting tune&quot;), while an exclusionary constraint
                  removes overused patterns (&quot;Avoid any character who is a chosen one&quot;), forcing you into fresh
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
                  or character idea that sparks a story thread (e.g., &quot;A shattered compass&quot;). Channels are broader
                  themes or categories (e.g., &quot;Loss and memory&quot;) that set a tone or direct the scope of exploration.
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
                  interpreted creatively or re-negotiated if they don&apos;t serve your story&apos;s evolution. You control how
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
          onClick={onScrollDown}
        >
          <ChevronDown className="w-8 h-8 text-primary/70" />
        </motion.div>
      </section>
    );
  }
);

ConstraintsSection.displayName = 'ConstraintsSection';

export default ConstraintsSection;