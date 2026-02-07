
import { ApiClient } from './api-client';
import { CanvasItem } from '@/types/canvas';

interface CanvasData {
    id: string | null;
    project_id: string;
    data: { items?: CanvasItem[] };
    name?: string;
    created_at: string | null;
    updated_at?: string | null;
}

export const canvasApi = {
    getProjectCanvases: async (projectId: string): Promise<CanvasData[]> => {
        return ApiClient.get<CanvasData[]>(`/canvas/projects/${projectId}/canvases`);
    },

    getProjectCanvas: async (projectId: string): Promise<CanvasData> => {
        return ApiClient.get<CanvasData>(`/canvas/projects/${projectId}/canvas`);
    },

    createProjectCanvas: async (projectId: string, data: { items: CanvasItem[] }, name?: string): Promise<CanvasData> => {
        return ApiClient.post<CanvasData>(`/canvas/projects/${projectId}/canvas`, { data, name });
    },

    getCanvas: async (canvasId: string): Promise<CanvasData> => {
        return ApiClient.get<CanvasData>(`/canvas/canvas/${canvasId}`);
    },

    updateCanvas: async (canvasId: string, data: { items: CanvasItem[] }, name?: string): Promise<CanvasData> => {
        return ApiClient.put<CanvasData>(`/canvas/canvas/${canvasId}`, { data, name });
    },
};
