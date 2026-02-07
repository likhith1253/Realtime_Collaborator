import { ApiClient } from './api-client';

export interface Project {
    id: string;
    name: string;
    description: string | null;
    organization_id: string;
    created_at: string;
    updated_at: string;
    members?: {
        name: string;
        avatar: string | null;
        email: string;
    }[];
}

interface ProjectsResponse {
    projects: Project[];
}

/**
 * Fetches all projects for the user.
 */
/**
 * Fetches all projects for the user.
 */
export async function getProjects(): Promise<Project[]> {
    try {
        const data = await ApiClient.get<ProjectsResponse | Project[]>('/projects');
        if (Array.isArray(data)) {
            return data;
        }
        return data.projects || [];
    } catch (error) {
        console.error('Failed to fetch projects:', error);
        return [];
    }
}

/**
 * Creates a new project.
 */
export async function createProject(name: string, description?: string): Promise<Project> {
    return ApiClient.post<Project>('/projects', { name, description });
}
