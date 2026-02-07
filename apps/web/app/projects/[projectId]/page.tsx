'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { FileText, Users, Calendar, ArrowRight, Plus, Presentation } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ApiClient } from '@/lib/api-client';
import { getProjectDocuments, createProjectDocument, type Document } from '@/lib/documents';

interface Project {
  id: string;
  name: string;
  description?: string;
  updated_at: string;
  created_at?: string;
  members?: any[];
}

export default function ProjectPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.projectId as string;

  // Handle invalid project ID
  useEffect(() => {
    if (projectId === 'undefined') {
      router.push('/dashboard');
    }
  }, [projectId, router]);

  const [project, setProject] = useState<Project | null>(null);
  const [docCount, setDocCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      if (!projectId || projectId === 'undefined') return;

      try {
        setLoading(true);
        // Fetch project details
        const projectData = await ApiClient.get<Project>(`/projects/${projectId}`);
        setProject(projectData);

        // Fetch documents count
        const docs = await getProjectDocuments(projectId);
        setDocCount(docs.length);

      } catch (err) {
        console.error('Failed to fetch project data:', err);
        setError('Failed to load project details');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [projectId]);

  const handleCreateDocument = async () => {
    try {
      setCreating(true);
      const newDoc = await createProjectDocument('Untitled Document', projectId);
      router.push(`/documents/${newDoc.id}`);
    } catch (err) {
      console.error('Failed to create document:', err);
    } finally {
      setCreating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Error</h2>
          <p className="text-muted-foreground">{error || 'Project not found'}</p>
          <Button asChild className="mt-4">
            <Link href="/dashboard">Back to Dashboard</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-auto">
      <div className="p-8 max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex justify-between items-start">
          <div>
            <h1 className="text-4xl font-bold mb-2">{project.name}</h1>
            <p className="text-lg text-muted-foreground">{project.description || 'No description provided'}</p>
          </div>
          <Button variant="outline" asChild>
            <Link href="/dashboard">Back</Link>
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
          {/* Documents Count */}
          <div className="p-6 rounded-lg border border-border hover:border-accent/50 transition-colors">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Documents</p>
                <p className="text-3xl font-bold">{docCount}</p>
              </div>
              <FileText className="w-6 h-6 text-accent" />
            </div>
          </div>

          {/* Collaborators */}
          <div className="p-6 rounded-lg border border-border hover:border-accent/50 transition-colors">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Collaborators</p>
                <p className="text-3xl font-bold">{project.members?.length || 1}</p>
              </div>
              <Users className="w-6 h-6 text-accent" />
            </div>
          </div>

          {/* Updated Date */}
          <div className="p-6 rounded-lg border border-border hover:border-accent/50 transition-colors">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Last Updated</p>
                <p className="text-base font-semibold">
                  {project.updated_at ? new Date(project.updated_at).toLocaleDateString() : 'N/A'}
                </p>
              </div>
              <Calendar className="w-6 h-6 text-accent" />
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Link href={`/projects/${projectId}/documents`}>
                <Button
                  variant="outline"
                  className="w-full justify-between group bg-transparent h-auto py-4"
                >
                  <span className="font-medium">View All Documents</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Button
                variant="outline"
                className="w-full justify-between group bg-transparent h-auto py-4"
                onClick={handleCreateDocument}
                disabled={creating}
              >
                <span className="font-medium">
                  {creating ? 'Creating...' : 'Create New Document'}
                </span>
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4">Presentations & Slides</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Link href={`/projects/${projectId}/presentations`}>
                <Button
                  variant="outline"
                  className="w-full justify-between group bg-transparent h-auto py-4"
                >
                  <span className="font-medium">View All Presentations</span>
                  <Presentation className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href={`/projects/${projectId}/presentations`}>
                <Button
                  variant="outline"
                  className="w-full justify-between group bg-transparent h-auto py-4"
                >
                  <span className="font-medium">Create New Presentation</span>
                  <Plus className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
