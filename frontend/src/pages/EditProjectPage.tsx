import { useNavigate, useParams } from '@tanstack/react-router';
import { ProjectForm } from '../components/ProjectForm';
import { useGetProject, useUpdateProject } from '../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { ExternalBlob, ProjectStatus } from '../backend';

export function EditProjectPage() {
  const navigate = useNavigate();
  const { id } = useParams({ from: '/project/$id/edit' });
  const { data: project, isLoading } = useGetProject(id);
  const updateProject = useUpdateProject();

  const handleSubmit = async (data: {
    title: string;
    description: string;
    completionTimestamp: bigint;
    amazonUploadTimestamp: bigint | null;
    images: ExternalBlob[];
    status: ProjectStatus;
  }) => {
    try {
      await updateProject.mutateAsync({ id, ...data });
      toast.success('Project updated successfully!');
      navigate({ to: '/project/$id', params: { id } });
    } catch (error) {
      toast.error('Failed to update project. Please try again.');
      console.error('Update project error:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-6 py-16">
        <div className="flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="container mx-auto px-6 py-16">
        <div className="text-center">
          <h2 className="text-2xl font-serif font-bold mb-4">Project Not Found</h2>
          <Button onClick={() => navigate({ to: '/' })}>Return to Dashboard</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-12 max-w-4xl">
      <div className="mb-8">
        <Button
          variant="ghost"
          onClick={() => navigate({ to: '/project/$id', params: { id } })}
          className="mb-4 gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Project
        </Button>
        <h1 className="text-4xl font-serif font-bold mb-2">Edit Project</h1>
        <p className="text-muted-foreground">Update your project details and images.</p>
      </div>

      <ProjectForm
        initialData={project}
        onSubmit={handleSubmit}
        onCancel={() => navigate({ to: '/project/$id', params: { id } })}
        isSubmitting={updateProject.isPending}
      />
    </div>
  );
}
