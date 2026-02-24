import { useNavigate } from '@tanstack/react-router';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Upload } from 'lucide-react';
import type { CreativeProject } from '../backend';

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

  const thumbnailUrl = project.images.length > 0 ? project.images[0].getDirectURL() : null;

  return (
    <Card
      className="group cursor-pointer hover:shadow-lg transition-all duration-300 overflow-hidden border-2 hover:border-primary/20"
      onClick={() => navigate({ to: '/project/$id', params: { id: project.id } })}
    >
      <div className="aspect-video bg-muted relative overflow-hidden">
        {thumbnailUrl ? (
          <img
            src={thumbnailUrl}
            alt={project.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-6xl font-serif text-muted-foreground/30">
              {project.title.charAt(0).toUpperCase()}
            </span>
          </div>
        )}
      </div>

      <CardHeader className="pb-3">
        <CardTitle className="font-serif text-xl line-clamp-2 group-hover:text-primary transition-colors">
          {project.title}
        </CardTitle>
      </CardHeader>

      <CardContent className="pb-3">
        <p className="text-sm text-muted-foreground line-clamp-2">{project.description}</p>
      </CardContent>

      <CardFooter className="flex flex-col gap-2 pt-3 border-t">
        <div className="flex items-center gap-2 text-sm w-full">
          <Calendar className="w-4 h-4 text-muted-foreground" />
          <span className="text-muted-foreground">Completion:</span>
          <span className="font-medium ml-auto">{formatDate(project.completionTimestamp)}</span>
        </div>
        {project.amazonUploadTimestamp && (
          <div className="flex items-center gap-2 text-sm w-full">
            <Upload className="w-4 h-4 text-muted-foreground" />
            <span className="text-muted-foreground">Amazon Upload:</span>
            <span className="font-medium ml-auto">
              {formatDate(project.amazonUploadTimestamp)}
            </span>
          </div>
        )}
        {!project.amazonUploadTimestamp && (
          <Badge variant="secondary" className="w-fit">
            Upload Pending
          </Badge>
        )}
      </CardFooter>
    </Card>
  );
}
