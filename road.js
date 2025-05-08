import { useState } from 'react';
import { Roadmap } from '@/utils/roadmapData';
import { Button } from '@/components/ui/button';
import MilestoneNode from './MilestoneNode';
import ProgressTracker from './ProgressTracker';

interface RoadmapViewProps {
  roadmap: Roadmap;
}

const RoadmapView = ({ roadmap }: RoadmapViewProps) => {
  const [currentRoadmap, setCurrentRoadmap] = useState(roadmap);
  
  const handleMilestoneComplete = (milestoneId: string) => {
    setCurrentRoadmap(prev => {
      // Create a copy of the milestones array
      const updatedMilestones = prev.milestones.map(milestone => {
        if (milestone.id === milestoneId) {
          return { ...milestone, isCompleted: !milestone.isCompleted };
        }
        return milestone;
      });
      
      // Calculate new progress based on completed milestones
      const completedCount = updatedMilestones.filter(m => m.isCompleted).length;
      const progress = Math.round((completedCount / updatedMilestones.length) * 100);
      
      // Update the next milestone's locked status if applicable
      const currentIndex = updatedMilestones.findIndex(m => m.id === milestoneId);
      if (currentIndex >= 0 && currentIndex < updatedMilestones.length - 1) {
        const currentMilestone = updatedMilestones[currentIndex];
        const nextMilestone = updatedMilestones[currentIndex + 1];
        
        if (currentMilestone.isCompleted && nextMilestone.isLocked) {
          updatedMilestones[currentIndex + 1] = { ...nextMilestone, isLocked: false };
        }
      }
      
      return { ...prev, milestones: updatedMilestones, progress };
    });
  };

  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Left sidebar with progress tracker */}
        <div className="md:w-1/4">
          <div className="sticky top-24 bg-card rounded-xl border border-border p-6 text-center">
            <ProgressTracker 
              progress={currentRoadmap.progress} 
              size={120} 
              strokeWidth={10} 
              className="mb-4"
            />
            
            <h3 className="text-lg font-semibold mb-1">{currentRoadmap.title}</h3>
            <p className="text-sm text-foreground/70 mb-4">
              {currentRoadmap.estimatedWeeks} {currentRoadmap.estimatedWeeks === 1 ? 'week' : 'weeks'} estimated
            </p>
            
            <Button className="w-full mb-2">Continue Learning</Button>
            <Button variant="outline" className="w-full">Share Roadmap</Button>
          </div>
        </div>
        
        {/* Main content with milestone nodes */}
        <div className="md:w-3/4">
          <div className="bg-card rounded-xl border border-border p-6 mb-6">
            <h2 className="text-2xl font-bold mb-2">{currentRoadmap.title}</h2>
            <p className="text-foreground/70">{currentRoadmap.description}</p>
          </div>
          
          <div className="pl-4">
            {currentRoadmap.milestones.map((milestone, index) => (
              <MilestoneNode 
                key={milestone.id}
                milestone={milestone}
                onComplete={handleMilestoneComplete}
                isFirst={index === 0}
                isLast={index === currentRoadmap.milestones.length - 1}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoadmapView;
