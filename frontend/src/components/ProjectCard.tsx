import { useNavigate } from '@tanstack/react-router';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Upload } from 'lucide-react';
import type { CreativeProject } from '../backend';
import { ProjectStatus } from '../backend';

interface ProjectCardProps {
  project: CreativeProject;
}

export function ProjectCard({ project }: ProjectCardProps) {
  const navigate = useNavigate();

  const formatDate = (timestamp: bigint) => {
    const date = new Date(Number(timestamp));
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getStatusDisplay = (status: ProjectStatus) => {
    switch (status) {
      case ProjectStatus.done:
        return { label: 'Done', variant: 'default' as const, className: 'bg-emerald-600 hover:bg-emerald-700 text-white' };
      case ProjectStatus.inProgress:
        return { label: 'In Progress', variant: 'secondary' as const, className: 'bg-amber-600 hover:bg-amber-700 text-white' };
      case ProjectStatus.approvalPending:
        return { label: 'Approval Pending', variant: 'outline' as const, className: 'bg-orange-600 hover:bg-orange-700 text-white border-orange-600' };
      default:
        return { label: 'Unknown', variant: 'secondary' as const, className: '' };
    }
  };

  const thumbnailUrl = project.images.length > 0 ? project.images[0].getDirectURL() : null;
  const statusDisplay = getStatusDisplay(project.status);

  return (
    <Card
      className="group cursor-pointer hover:shadow-lg transition-all duration-300 overflow-hidden border-2 hover:border-primary/20"
      onClick={() => navigate({ to: '/project/$id', params: { id: project.id } })}
    >
      {/* Compact thumbnail — fixed height ~100px */}
      <div className="h-24 bg-muted relative overflow-hidden">
        {thumbnailUrl ? (
          <img
            src={thumbnailUrl}
            alt={project.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-4xl font-serif text-muted-foreground/30">
              {project.title.charAt(0).toUpperCase()}
            </span>
          </div>
        )}
        <div className="absolute top-2 right-2">
          <Badge className={`text-xs px-2 py-0.5 ${statusDisplay.className}`}>
            {statusDisplay.label}
          </Badge>
        </div>
      </div>

      <CardHeader className="px-3 pt-2 pb-1">
        <CardTitle className="font-serif text-sm leading-snug line-clamp-1 group-hover:text-primary transition-colors">
          {project.title}
        </CardTitle>
      </CardHeader>

      <CardContent className="px-3 pb-1">
        <p className="text-xs text-muted-foreground line-clamp-1">{project.description}</p>
      </CardContent>

      <CardFooter className="flex flex-col gap-0.5 px-3 pt-2 pb-2 border-t">
        <div className="flex items-center gap-1.5 text-xs w-full">
          <Calendar className="w-3 h-3 text-muted-foreground shrink-0" />
          <span className="text-muted-foreground">Completion:</span>
          <span className="font-medium ml-auto">{formatDate(project.completionTimestamp)}</span>
        </div>
        {project.amazonUploadTimestamp ? (
          <div className="flex items-center gap-1.5 text-xs w-full">
            <Upload className="w-3 h-3 text-muted-foreground shrink-0" />
            <span className="text-muted-foreground">Amazon Upload:</span>
            <span className="font-medium ml-auto">
              {formatDate(project.amazonUploadTimestamp)}
            </span>
          </div>
        ) : (
          <div className="flex items-center gap-1.5 text-xs w-full">
            <Upload className="w-3 h-3 text-muted-foreground shrink-0" />
            <Badge variant="secondary" className="text-xs px-1.5 py-0 h-4">
              Upload Pending
            </Badge>
          </div>
        )}
      </CardFooter>
    </Card>
  );
}
