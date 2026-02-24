import { useNavigate } from '@tanstack/react-router';
import { useGetAllProjects } from '../hooks/useQueries';
import { ProjectCard } from '../components/ProjectCard';
import { Button } from '@/components/ui/button';
import { Plus, Loader2 } from 'lucide-react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';

export function Dashboard() {
  const navigate = useNavigate();
  const { data: projects, isLoading } = useGetAllProjects();
  const { isLoginSuccess } = useInternetIdentity();

  if (!isLoginSuccess) {
    return (
      <div className="container mx-auto px-6 py-16">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-serif font-bold mb-4">Welcome to Creative Tracker</h2>
          <p className="text-muted-foreground mb-8">
            Please login to view and manage your creative projects.
          </p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-6 py-16">
        <div className="flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (!projects || projects.length === 0) {
    return (
      <div className="container mx-auto px-6 py-16">
        <div className="max-w-2xl mx-auto text-center">
          <div className="w-24 h-24 rounded-full bg-muted mx-auto mb-6 flex items-center justify-center">
            <Plus className="w-12 h-12 text-muted-foreground" />
          </div>
          <h2 className="text-3xl font-serif font-bold mb-4">No Projects Yet</h2>
          <p className="text-muted-foreground mb-8">
            Start tracking your creative work by creating your first project.
          </p>
          <Button onClick={() => navigate({ to: '/create' })} size="lg" className="gap-2">
            <Plus className="w-5 h-5" />
            Create Your First Project
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-12">
      <div className="mb-8">
        <h2 className="text-4xl font-serif font-bold mb-2">Your Projects</h2>
        <p className="text-muted-foreground">
          Track and manage your creative work for Amazon marketing campaigns.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </div>
  );
}
