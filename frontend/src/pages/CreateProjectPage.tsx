import { useNavigate } from '@tanstack/react-router';
import { ProjectForm } from '../components/ProjectForm';
import { useCreateProject } from '../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { ExternalBlob, ProjectStatus } from '../backend';

export function CreateProjectPage() {
  const navigate = useNavigate();
  const createProject = useCreateProject();

  const handleSubmit = async (data: {
    title: string;
    description: string;
    completionTimestamp: bigint;
    amazonUploadTimestamp: bigint | null;
    images: ExternalBlob[];
    status: ProjectStatus;
  }) => {
    try {
      await createProject.mutateAsync(data);
      toast.success('Project created successfully!');
      navigate({ to: '/' });
    } catch (error) {
      toast.error('Failed to create project. Please try again.');
      console.error('Create project error:', error);
    }
  };

  return (
    <div className="container mx-auto px-6 py-12 max-w-4xl">
      <div className="mb-8">
        <Button
          variant="ghost"
          onClick={() => navigate({ to: '/' })}
          className="mb-4 gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Button>
        <h1 className="text-4xl font-serif font-bold mb-2">Create New Project</h1>
        <p className="text-muted-foreground">
          Add a new creative project to track its progress and Amazon upload status.
        </p>
      </div>

      <ProjectForm
        onSubmit={handleSubmit}
        onCancel={() => navigate({ to: '/' })}
        isSubmitting={createProject.isPending}
      />
    </div>
  );
}
