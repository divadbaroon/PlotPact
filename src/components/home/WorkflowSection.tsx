'use client';

import { forwardRef } from 'react';
import { motion } from 'framer-motion';

const WorkflowSection = forwardRef<HTMLElement>(
  (props, ref) => {
    return (
      <section
        ref={ref}
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
              PlotPact blends human creativity with AI guidance by using constraints to co-shape stories. Here&apos;s how the
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
                      Create a plot from scratch or choose from PlotPact&apos;s curated templates to begin.
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
                      Write your story freely, but adhere to the active constraints — they&apos;re here to challenge and
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
                      If your text violates a constraint, you&apos;ll receive gentle feedback so you can revise or rethink
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
    );
  }
);

WorkflowSection.displayName = 'WorkflowSection';

export default WorkflowSection;