'use client'

import { useRouter } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';

import NavigationDots from '@/components/home/NavigationDots';
import ScrollToTop from '@/components/home/ScrollToTop';
import HeroSection from '@/components/home/HeroSection';
import StoryTypeSection from '@/components/home/StoryTypeSection';
import FeaturedStoriesSection from '@/components/home/FeaturedStoriesSection';
import ProblemSection from '@/components/home/ProblemSection';
import ConstraintsSection from '@/components/home/ConstraintsSection';
import WorkflowSection from '@/components/home/WorkflowSection';
import Footer from '@/components/home/Footer';

export default function Home() {
  const router = useRouter();
  const [activeSection, setActiveSection] = useState(0);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const sectionsRef = useRef<(HTMLElement | null)[]>([]);

  const sections = ['hero', 'story-type', 'featured-stories', 'problem', 'constraints', 'workflow'];

  // Handles scroll effect
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const windowHeight = window.innerHeight;

      // Show/hide scroll to top button
      if (scrollPosition > windowHeight) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }

      // Determine active section
      sectionsRef.current.forEach((section, index) => {
        if (!section) return;

        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;

        if (
          scrollPosition >= sectionTop - windowHeight / 3 &&
          scrollPosition < sectionTop + sectionHeight - windowHeight / 3
        ) {
          setActiveSection(index);
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (index: number) => {
    sectionsRef.current[index]?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStartEmptyCanvas = () => {
    router.push(`/story/customStory`);
  };

  const handleTemplateStory = (storyId: string) => {
    router.push(`/story/${storyId}`);
  };

  return (
    <div className="flex flex-col">
      <NavigationDots 
        sections={sections} 
        activeSection={activeSection} 
        onSelectSection={scrollToSection} 
      />
      
      <ScrollToTop 
        show={showScrollTop} 
        onClick={scrollToTop} 
      />
      
      <HeroSection 
        ref={(el) => {
          sectionsRef.current[0] = el;
          return undefined;
        }}
        onStartClick={() => scrollToSection(1)}
        onLearnMoreClick={() => scrollToSection(3)}
        onScrollDown={() => scrollToSection(1)}
      />
      
      <StoryTypeSection 
        ref={(el) => {
          sectionsRef.current[1] = el;
          return undefined;
        }}
        onStartEmptyCanvas={handleStartEmptyCanvas}
        onUseTemplate={() => scrollToSection(2)}
        onScrollDown={() => scrollToSection(2)}
      />
      
      <FeaturedStoriesSection 
        ref={(el) => {
          sectionsRef.current[2] = el;
          return undefined;
        }}
        onSelectStory={handleTemplateStory}
        onScrollDown={() => scrollToSection(3)}
      />
      
      <ProblemSection 
        ref={(el) => {
          sectionsRef.current[3] = el;
          return undefined;
        }}
        onScrollDown={() => scrollToSection(4)}
      />
      
      <ConstraintsSection 
        ref={(el) => {
          sectionsRef.current[4] = el;
          return undefined;
        }}
        onScrollDown={() => scrollToSection(5)}
      />
      
      <WorkflowSection 
        ref={(el) => {
          sectionsRef.current[5] = el;
          return undefined;
        }}
      />
      
      <Footer />
    </div>
  );
}