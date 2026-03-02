import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { CreativeProject } from '../backend';
import { ExternalBlob, ProjectStatus } from '../backend';

export function useGetAllProjects() {
  const { actor, isFetching } = useActor();

  return useQuery<CreativeProject[]>({
    queryKey: ['projects'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllProjects();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetProject(id: string) {
  const { actor, isFetching } = useActor();

  return useQuery<CreativeProject>({
    queryKey: ['project', id],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.getProject(id);
    },
    enabled: !!actor && !isFetching && !!id,
  });
}

export function useCreateProject() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      title: string;
      description: string;
      completionTimestamp: bigint;
      amazonUploadTimestamp: bigint | null;
      images: ExternalBlob[];
      status: ProjectStatus;
    }) => {
      if (!actor) throw new Error('Actor not initialized');

      const id = `project-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

      await actor.createProject(
        id,
        data.title,
        data.description,
        data.completionTimestamp,
        data.amazonUploadTimestamp,
        data.images,
        data.status
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });
}

export function useUpdateProject() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      id: string;
      title: string;
      description: string;
      completionTimestamp: bigint;
      amazonUploadTimestamp: bigint | null;
      images: ExternalBlob[];
      status: ProjectStatus;
    }) => {
      if (!actor) throw new Error('Actor not initialized');

      await actor.updateProject(
        data.id,
        data.title,
        data.description,
        data.completionTimestamp,
        data.amazonUploadTimestamp,
        data.images,
        data.status
      );
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      queryClient.invalidateQueries({ queryKey: ['project', variables.id] });
    },
  });
}

export function useDeleteProject() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      if (!actor) throw new Error('Actor not initialized');
      await actor.deleteProject(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });
}

export function useAddPositionalComment() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      projectId: string;
      text: string;
      xPercentage: number;
      yPercentage: number;
    }) => {
      if (!actor) throw new Error('Actor not initialized');
      await actor.addPositionalComment(
        data.projectId,
        data.text,
        data.xPercentage,
        data.yPercentage
      );
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['project', variables.projectId] });
    },
  });
}

export function useDeletePositionalComment() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { projectId: string; commentId: bigint }) => {
      if (!actor) throw new Error('Actor not initialized');
      await actor.deletePositionalComment(data.projectId, data.commentId);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['project', variables.projectId] });
    },
  });
}
