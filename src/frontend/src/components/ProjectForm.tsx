import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ImageUpload } from './ImageUpload';
import { Loader2 } from 'lucide-react';
import type { CreativeProject } from '../backend';
import { ExternalBlob } from '../backend';

interface ProjectFormProps {
  initialData?: CreativeProject;
  onSubmit: (data: {
    title: string;
    description: string;
    completionTimestamp: bigint;
    amazonUploadTimestamp: bigint | null;
    images: ExternalBlob[];
  }) => Promise<void>;
  onCancel: () => void;
  isSubmitting: boolean;
}

export function ProjectForm({ initialData, onSubmit, onCancel, isSubmitting }: ProjectFormProps) {
  const [title, setTitle] = useState(initialData?.title || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [completionDate, setCompletionDate] = useState('');
  const [amazonUploadDate, setAmazonUploadDate] = useState('');
  const [images, setImages] = useState<ExternalBlob[]>(initialData?.images || []);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialData) {
      const completionDateObj = new Date(Number(initialData.completionTimestamp));
      setCompletionDate(completionDateObj.toISOString().split('T')[0]);

      if (initialData.amazonUploadTimestamp) {
        const uploadDateObj = new Date(Number(initialData.amazonUploadTimestamp));
        setAmazonUploadDate(uploadDateObj.toISOString().split('T')[0]);
      }
    }
  }, [initialData]);

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (!completionDate) {
      newErrors.completionDate = 'Completion date is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    const completionTimestamp = BigInt(new Date(completionDate).getTime());
    const amazonUploadTimestamp = amazonUploadDate
      ? BigInt(new Date(amazonUploadDate).getTime())
      : null;

    await onSubmit({
      title,
      description,
      completionTimestamp,
      amazonUploadTimestamp,
      images,
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle className="font-serif">Project Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">
              Project Title <span className="text-destructive">*</span>
            </Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter project title"
              className={errors.title ? 'border-destructive' : ''}
            />
            {errors.title && <p className="text-sm text-destructive">{errors.title}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">
              Description <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the creative project"
              rows={4}
              className={errors.description ? 'border-destructive' : ''}
            />
            {errors.description && (
              <p className="text-sm text-destructive">{errors.description}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="completionDate">
                Completion Date <span className="text-destructive">*</span>
              </Label>
              <Input
                id="completionDate"
                type="date"
                value={completionDate}
                onChange={(e) => setCompletionDate(e.target.value)}
                className={errors.completionDate ? 'border-destructive' : ''}
              />
              {errors.completionDate && (
                <p className="text-sm text-destructive">{errors.completionDate}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="amazonUploadDate">Amazon Upload Date</Label>
              <Input
                id="amazonUploadDate"
                type="date"
                value={amazonUploadDate}
                onChange={(e) => setAmazonUploadDate(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">Optional - leave blank if not yet uploaded</p>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Creative Images</Label>
            <ImageUpload images={images} onChange={setImages} />
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-3 mt-6">
        <Button type="submit" disabled={isSubmitting} className="gap-2">
          {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
          {initialData ? 'Update Project' : 'Create Project'}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
