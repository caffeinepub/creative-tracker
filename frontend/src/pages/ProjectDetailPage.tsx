import { useState } from 'react';
import { useNavigate, useParams } from '@tanstack/react-router';
import {
  useGetProject,
  useDeleteProject,
  useAddPositionalComment,
  useDeletePositionalComment,
} from '../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { ArrowLeft, Calendar, Upload, Edit, Trash2, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { ImageWithComments } from '../components/ImageWithComments';

export function ProjectDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams({ from: '/project/$id' });
  const { data: project, isLoading } = useGetProject(id);
  const deleteProject = useDeleteProject();
  const addComment = useAddPositionalComment();
  const deleteComment = useDeletePositionalComment();

  // Track which comment is currently being deleted for per-pin loading state
  const [deletingCommentId, setDeletingCommentId] = useState<bigint | null>(null);

  const handleDelete = async () => {
    try {
      await deleteProject.mutateAsync(id);
      toast.success('Project deleted successfully!');
      navigate({ to: '/' });
    } catch (error) {
      toast.error('Failed to delete project. Please try again.');
      console.error('Delete project error:', error);
    }
  };

  const handleAddComment = async (
    text: string,
    xPercentage: number,
    yPercentage: number
  ) => {
    try {
      await addComment.mutateAsync({ projectId: id, text, xPercentage, yPercentage });
      toast.success('Comment added!');
    } catch (error) {
      toast.error('Failed to add comment. Please try again.');
      console.error('Add comment error:', error);
      throw error;
    }
  };

  const handleDeleteComment = async (commentId: bigint) => {
    setDeletingCommentId(commentId);
    try {
      await deleteComment.mutateAsync({ projectId: id, commentId });
      toast.success('Comment removed.');
    } catch (error) {
      toast.error('Failed to delete comment. Please try again.');
      console.error('Delete comment error:', error);
    } finally {
      setDeletingCommentId(null);
    }
  };

  const formatDate = (timestamp: bigint) => {
    const date = new Date(Number(timestamp));
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
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
    <div className="container mx-auto px-6 py-12 max-w-6xl">
      <div className="mb-8">
        <Button
          variant="ghost"
          onClick={() => navigate({ to: '/' })}
          className="mb-4 gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Button>

        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-4xl font-serif font-bold mb-2">{project.title}</h1>
            <p className="text-muted-foreground">{project.description}</p>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={() => navigate({ to: '/project/$id/edit', params: { id } })}
              variant="outline"
              className="gap-2"
            >
              <Edit className="w-4 h-4" />
              Edit
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" className="gap-2">
                  <Trash2 className="w-4 h-4" />
                  Delete
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete the project and all
                    associated images.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDelete}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    Delete Project
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Completion Date
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-serif font-bold">
              {formatDate(project.completionTimestamp)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Upload className="w-4 h-4" />
              Amazon Upload Date
            </CardTitle>
          </CardHeader>
          <CardContent>
            {project.amazonUploadTimestamp ? (
              <p className="text-2xl font-serif font-bold">
                {formatDate(project.amazonUploadTimestamp)}
              </p>
            ) : (
              <Badge variant="secondary">Upload Pending</Badge>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Images</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-serif font-bold">{project.images.length}</p>
            <p className="text-sm text-muted-foreground">
              {project.images.length === 1 ? 'image' : 'images'} uploaded
            </p>
          </CardContent>
        </Card>
      </div>

      {project.images.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-serif font-bold">Creative Images</h2>
            <p className="text-sm text-muted-foreground">
              Click on any image to leave a pinned comment
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {project.images.map((image, index) => (
              <Card key={index} className="overflow-hidden">
                <ImageWithComments
                  imageUrl={image.getDirectURL()}
                  imageAlt={`${project.title} - Image ${index + 1}`}
                  comments={project.positionalComments}
                  onAddComment={handleAddComment}
                  onDeleteComment={handleDeleteComment}
                  isAddingComment={addComment.isPending}
                  isDeletingCommentId={deletingCommentId}
                />
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
