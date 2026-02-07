
'use client';

import React, { useState, useEffect } from 'react';
import { use } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import CanvasEditor from '@/components/canvas/CanvasEditor';
import { CanvasList } from '@/components/canvas/CanvasList';
import { canvasApi } from '@/lib/canvas';
import { ApiClient } from '@/lib/api-client';

interface CanvasSummary {
    id: string | null;
    name?: string;
    updated_at?: string | null;
    created_at: string | null;
}

export default function CanvasPage({ params }: { params: Promise<{ projectId: string }> }) {
    const resolvedParams = use(params);
    // Sanitize projectId: replace spaces with hyphens if necessary (handling potential URL/UUID formatting issues)
    const projectId = resolvedParams.projectId.replace(/%20| /g, '-');
    const router = useRouter();

    const [view, setView] = useState<'list' | 'editor'>('list');
    const [selectedCanvasId, setSelectedCanvasId] = useState<string | null>(null);
    const [canvases, setCanvases] = useState<CanvasSummary[]>([]);
    const [loading, setLoading] = useState(true);
    const [creating, setCreating] = useState(false);

    const loadCanvases = async () => {
        try {
            setLoading(true);
            const data = await canvasApi.getProjectCanvases(projectId);
            setCanvases(data || []);
        } catch (error) {
            console.error('Failed to load canvases:', error);
            toast.error('Failed to load canvases');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadCanvases();
    }, [projectId]);

    const handleSelectCanvas = (id: string) => {
        setSelectedCanvasId(id);
        setView('editor');
    };

    const handleCreateCanvas = async (name: string) => {
        try {
            setCreating(true);
            const newCanvas = await canvasApi.createProjectCanvas(projectId, { items: [] }, name);
            setCanvases([newCanvas, ...canvases]);
            setSelectedCanvasId(newCanvas.id);
            setView('editor');
            toast.success('Canvas created');
        } catch (error) {
            console.error('Failed to create canvas:', error);
            toast.error('Failed to create canvas');
        } finally {
            setCreating(false);
        }
    };

    const handleBackToList = () => {
        setSelectedCanvasId(null);
        setView('list');
        loadCanvases(); // Reload to update timestamps or names if changed
    };

    if (loading && view === 'list') {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (view === 'editor' && selectedCanvasId) {
        return (
            <div className="h-full w-full">
                <CanvasEditor
                    canvasId={selectedCanvasId}
                    projectId={projectId}
                    onBack={handleBackToList}
                />
            </div>
        );
    }

    return (
        <div className="h-full w-full overflow-auto bg-background">
            <CanvasList
                canvases={canvases}
                onSelect={handleSelectCanvas}
                onCreate={handleCreateCanvas}
                creating={creating}
            />
        </div>
    );
}
