import { useNavigate } from '@tanstack/react-router';
import { useGetAllProjects } from '../hooks/useQueries';
import { ProjectCard } from '../components/ProjectCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Loader2, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { ProjectStatus } from '../backend';

export function Dashboard() {
  const navigate = useNavigate();
  const { data: projects, isLoading } = useGetAllProjects();

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

  // Calculate status counts
  const statusCounts = projects.reduce(
    (acc, project) => {
      if (project.status === ProjectStatus.done) {
        acc.done++;
      } else if (project.status === ProjectStatus.inProgress) {
        acc.inProgress++;
      } else if (project.status === ProjectStatus.approvalPending) {
        acc.approvalPending++;
      }
      return acc;
    },
    { done: 0, inProgress: 0, approvalPending: 0 }
  );

  return (
    <div className="container mx-auto px-6 py-12">
      <div className="mb-8">
        <h2 className="text-4xl font-serif font-bold mb-2">Dashboard</h2>
        <p className="text-muted-foreground">
          Track and manage your creative work for Amazon marketing campaigns.
        </p>
      </div>

      {/* Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <Card className="border-2 hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-medium text-muted-foreground">
                Done
              </CardTitle>
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold font-serif text-emerald-600">
              {statusCounts.done}
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              {statusCounts.done === 1 ? 'project' : 'projects'} completed
            </p>
          </CardContent>
        </Card>

        <Card className="border-2 hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-medium text-muted-foreground">
                In Progress
              </CardTitle>
              <Clock className="w-5 h-5 text-amber-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold font-serif text-amber-600">
              {statusCounts.inProgress}
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              {statusCounts.inProgress === 1 ? 'project' : 'projects'} in progress
            </p>
          </CardContent>
        </Card>

        <Card className="border-2 hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-medium text-muted-foreground">
                Approval Pending
              </CardTitle>
              <AlertCircle className="w-5 h-5 text-orange-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold font-serif text-orange-600">
              {statusCounts.approvalPending}
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              {statusCounts.approvalPending === 1 ? 'project' : 'projects'} awaiting approval
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Projects Grid */}
      <div className="mb-6">
        <h3 className="text-2xl font-serif font-bold mb-4">All Projects</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </div>
  );
}
