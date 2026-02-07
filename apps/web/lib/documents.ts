/**
 * Document API client for interacting with document-service.
 * Uses ApiClient for request handling.
 */

import { ApiClient } from './api-client';

/**
 * Document object returned from API.
 */
export interface Document {
    id: string;
    title: string;
    content: string | null;
    project_id: string;
    created_by: string;
    created_at: string;
    updated_at: string;
}

/**
 * Fetches documents for a project using the project-scoped endpoint.
 */
export async function getProjectDocuments(projectId: string): Promise<Document[]> {
    const data = await ApiClient.get<{ documents: Document[] }>(`/projects/${encodeURIComponent(projectId)}/documents`);
    return data.documents || (data as unknown as Document[]);
}

/**
 * Fetches all documents for the user.
 */
export async function getAllDocuments(): Promise<Document[]> {
    const data = await ApiClient.get<{ documents: Document[] }>('/documents');
    return data && data.documents ? data.documents : (Array.isArray(data) ? data : []);
}

/**
 * Fetches a single document by ID.
 */
export async function getDocument(id: string): Promise<Document> {
    return ApiClient.get<Document>(`/documents/${encodeURIComponent(id)}`);
}

/**
 * Updates a document title and/or content.
 */
export async function updateDocument(
    id: string,
    data: { title?: string; content?: unknown }
): Promise<Document> {
    return ApiClient.put<Document>(`/documents/${encodeURIComponent(id)}`, data);
}

/**
 * Creates a new document in a project using the project-scoped endpoint.
 */
export async function createProjectDocument(
    title: string,
    projectId: string
): Promise<Document> {
    return ApiClient.post<Document>(`/projects/${encodeURIComponent(projectId)}/documents`, {
        title
    });
}

/**
 * Deletes a document by ID.
 */
export async function deleteDocument(id: string): Promise<void> {
    return ApiClient.delete<void>(`/documents/${encodeURIComponent(id)}`);
}

