/**
 * Slide API client for interacting with document-service.
 * Uses ApiClient for request handling.
 */

import { ApiClient } from './api-client';

/**
 * Slide object returned from API.
 */
export interface Slide {
    id: string;
    title: string;
    content: string | null;
    presentation_id: string;
    order: number;
    created_at: string;
    updated_at: string;
}

/**
 * Fetches slides for a presentation using the presentation-scoped endpoint.
 */
export async function getPresentationSlides(presentationId: string): Promise<Slide[]> {
    return ApiClient.get<Slide[]>(`/presentations/${encodeURIComponent(presentationId)}/slides`);
}

/**
 * Fetches a single slide by ID.
 */
export async function getSlide(id: string): Promise<Slide> {
    return ApiClient.get<Slide>(`/slides/${encodeURIComponent(id)}`);
}

/**
 * Updates a slide title, content, or order.
 */
export async function updateSlide(
    id: string,
    data: { title?: string; content?: string; order?: number }
): Promise<Slide> {
    return ApiClient.put<Slide>(`/slides/${encodeURIComponent(id)}`, data);
}

/**
 * Creates a new slide in a presentation using the presentation-scoped endpoint.
 */
export async function createPresentationSlide(
    title: string,
    presentationId: string,
    content: string = ''
): Promise<Slide> {
    return ApiClient.post<Slide>(`/presentations/${encodeURIComponent(presentationId)}/slides`, {
        title,
        content
    });
}

/**
 * Deletes a slide by ID.
 */
export async function deleteSlide(id: string): Promise<void> {
    return ApiClient.delete<void>(`/slides/${encodeURIComponent(id)}`);
}
