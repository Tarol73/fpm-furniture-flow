
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ContactDialog from '@/components/contact/ContactDialog';

// Components
import ProjectHeader from '@/components/project/ProjectHeader';
import ProjectMainImage from '@/components/project/ProjectMainImage';
import ProjectGallery from '@/components/project/ProjectGallery';
import ProjectDescription from '@/components/project/ProjectDescription';
import ProjectInfoSidebar from '@/components/project/ProjectInfoSidebar';
import ProjectCallToAction from '@/components/project/ProjectCallToAction';
import RelatedProjects from '@/components/project/RelatedProjects';
import LoadingState from '@/components/project/LoadingState';
import ErrorState from '@/components/project/ErrorState';
import NotFoundState from '@/components/project/NotFoundState';

// Types and Services
import { ExtendedProject } from '@/types/project';
import { fetchProjectById, fetchRelatedProjects } from '@/services/projectService';
import { useCarouselNavigation } from '@/hooks/use-carousel-navigation';

const ProjectDetail = () => {
  const { id } = useParams();
  const [project, setProject] = useState<ExtendedProject | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [relatedProjects, setRelatedProjects] = useState<ExtendedProject[]>([]);
  
  // Use our custom hook for gallery navigation
  const {
    currentIndex: selectedImageIndex,
    setCurrentIndex: setSelectedImageIndex,
    goToNext: handleNextImage,
    goToPrev: handlePrevImage
  } = useCarouselNavigation({
    itemCount: project?.photos?.length || 0,
    initialIndex: null,
    loop: true
  });
  
  useEffect(() => {
    // Scroll to top when component mounts or id changes
    window.scrollTo(0, 0);
    
    const loadProjectData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        if (!id) {
          throw new Error('Проект не найден');
        }
        
        // Fetch project details
        const projectData = await fetchProjectById(id);
        setProject(projectData);
        
        // Fetch related projects
        const relatedData = await fetchRelatedProjects(projectData.id, projectData.category);
        setRelatedProjects(relatedData);
        
      } catch (err) {
        console.error('Error fetching project details:', err);
        setError(err instanceof Error ? err.message : 'Произошла ошибка при загрузке данных');
      } finally {
        setLoading(false);
      }
    };
    
    loadProjectData();
  }, [id]);

  // Handle image viewing
  const handleImageClick = (index: number | null) => {
    setSelectedImageIndex(index);
  };

  const handleContactClick = () => {
    document.dispatchEvent(new CustomEvent('open-contact-dialog'));
  };

  // Render states
  if (loading) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState error={error} />;
  }

  if (!project) {
    return <NotFoundState />;
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <ProjectHeader project={project} />
          
          <ProjectMainImage 
            src={project.mainImage || '/placeholder.svg'} 
            alt={project.title}
            onImageClick={() => handleImageClick(0)}
            selectedImageIndex={selectedImageIndex}
            onPrev={handlePrevImage}
            onNext={handleNextImage}
          />
          
          <ProjectGallery 
            photos={project.photos || []}
            projectTitle={project.title}
            selectedImageIndex={selectedImageIndex}
            onImageClick={handleImageClick}
            onPrev={handlePrevImage}
            onNext={handleNextImage}
          />
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-16">
            <ProjectDescription project={project} />
            <ProjectInfoSidebar project={project} />
          </div>
          
          <ProjectCallToAction onContactClick={handleContactClick} />
          
          <RelatedProjects projects={relatedProjects} />
        </div>
      </main>
      <Footer />
      <ContactDialog />
    </div>
  );
};

export default ProjectDetail;
