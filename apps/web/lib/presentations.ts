/**
 * Presentation API client for interacting with document-service.
 * Uses ApiClient for request handling.
 */

import { ApiClient } from './api-client';

/**
 * Presentation object returned from API.
 */
export interface Presentation {
    id: string;
    project_id: string;
    title: string;
    template?: string;
    created_at: string;
    updated_at: string;
}

/**
 * Fetches presentations for a project.
 */
export async function getProjectPresentations(projectId: string): Promise<Presentation[]> {
    return ApiClient.get<Presentation[]>(`/projects/${encodeURIComponent(projectId)}/presentations`);
}

/**
 * Fetches a single presentation by ID.
 */
export async function getPresentation(id: string): Promise<Presentation> {
    return ApiClient.get<Presentation>(`/presentations/${encodeURIComponent(id)}`);
}

/**
 * Creates a new presentation in a project.
 */
export async function createPresentation(
    title: string,
    projectId: string,
    template?: string
): Promise<Presentation> {
    return ApiClient.post<Presentation>(`/projects/${encodeURIComponent(projectId)}/presentations`, {
        title,
        template
    });
}

/**
 * Updates a presentation title or template.
 */
export async function updatePresentation(
    id: string,
    data: { title?: string; template?: string }
): Promise<Presentation> {
    return ApiClient.put<Presentation>(`/presentations/${encodeURIComponent(id)}`, data);
}

/**
 * Deletes a presentation by ID.
 */
export async function deletePresentation(id: string): Promise<void> {
    return ApiClient.delete<void>(`/presentations/${encodeURIComponent(id)}`);
}
