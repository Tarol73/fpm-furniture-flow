
import React from 'react';
import { Button } from '@/components/ui/button';

interface ProjectCallToActionProps {
  onContactClick: () => void;
}

const ProjectCallToAction = ({ onContactClick }: ProjectCallToActionProps) => {
  return (
    <div className="bg-gray-50 rounded-lg p-8 text-center mb-16">
      <h2 className="text-2xl font-light text-fpm-blue mb-4">Хотите реализовать подобный проект?</h2>
      <p className="text-gray-600 mb-6 max-w-3xl mx-auto font-light">
        Наша команда готова помочь вам воплотить в жизнь проект любой сложности. 
        Расскажите нам о своих потребностях, и мы предложим оптимальное решение.
      </p>
      <Button 
        className="bg-fpm-teal hover:bg-fpm-teal/90 text-white font-light contact-btn" 
        onClick={onContactClick}
      >
        Связаться с нами
      </Button>
    </div>
  );
};

export default ProjectCallToAction;
