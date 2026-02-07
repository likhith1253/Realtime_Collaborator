/**
 * Slide Service
 * Business logic for slide management
 */

import { PrismaClient } from '@collab/database';
import { ProjectNotFoundError, ValidationError } from '../utils/errors';

const prisma = new PrismaClient();

/**
 * Create a new slide
 */
export async function createSlide(
    presentationId: string,
    title: string,
    content: string,
    userId: string
) {
    // Verify presentation exists and user is owner of the project
    const presentation = await prisma.presentation.findUnique({
        where: { id: presentationId },
        include: { project: true }
    });

    if (!presentation) {
        throw new ValidationError('Presentation not found');
    }

    // @ts-ignore
    if (presentation.project.owner_id !== userId) {
        throw new ProjectNotFoundError();
    }

    // Get the current max order to append the new slide
    const lastSlide = await prisma.slide.findFirst({
        where: { presentation_id: presentationId },
        orderBy: { order: 'desc' },
        take: 1
    });

    const newOrder = lastSlide ? lastSlide.order + 1 : 1;

    const slide = await prisma.slide.create({
        data: {
            presentation_id: presentationId,
            title,
            content,
            order: newOrder
        }
    });

    return slide;
}

/**
 * List slides for a presentation
 */
export async function listSlides(presentationId: string, userId: string) {
    // Verify presentation exists and user is owner of the project
    const presentation = await prisma.presentation.findUnique({
        where: { id: presentationId },
        include: { project: true }
    });

    if (!presentation) {
        throw new ValidationError('Presentation not found');
    }

    // @ts-ignore
    if (presentation.project.owner_id !== userId) {
        throw new ProjectNotFoundError();
    }

    const slides = await prisma.slide.findMany({
        where: { presentation_id: presentationId },
        orderBy: { order: 'asc' }
    });

    return slides;
}

/**
 * Update a slide
 */
export async function updateSlide(
    slideId: string,
    userId: string,
    data: { title?: string; content?: string; order?: number }
) {
    // Verify slide ownership through presentation -> project
    const slide = await prisma.slide.findUnique({
        where: { id: slideId },
        include: {
            presentation: {
                include: {
                    project: true
                }
            }
        }
    });

    if (!slide) {
        throw new ValidationError('Slide not found');
    }

    // Check ownership
    // @ts-ignore
    if (slide.presentation.project.owner_id !== userId) {
        throw new ProjectNotFoundError();
    }

    const updatedSlide = await prisma.slide.update({
        where: { id: slideId },
        data: {
            ...data,
            updated_at: new Date()
        }
    });

    return updatedSlide;
}

/**
 * Delete a slide
 */
export async function deleteSlide(slideId: string, userId: string) {
    // Verify slide ownership
    const slide = await prisma.slide.findUnique({
        where: { id: slideId },
        include: {
            presentation: {
                include: {
                    project: true
                }
            }
        }
    });

    if (!slide) {
        throw new ValidationError('Slide not found');
    }

    // @ts-ignore
    if (slide.presentation.project.owner_id !== userId) {
        throw new ProjectNotFoundError();
    }

    await prisma.slide.delete({
        where: { id: slideId }
    });

    return { success: true };
}

/**
 * Get a single slide
 */
export async function getSlide(slideId: string, userId: string) {
    const slide = await prisma.slide.findUnique({
        where: { id: slideId },
        include: {
            presentation: {
                include: {
                    project: true
                }
            }
        }
    });

    if (!slide) {
        throw new ValidationError('Slide not found');
    }

    // @ts-ignore
    if (slide.presentation.project.owner_id !== userId) {
        throw new ProjectNotFoundError();
    }

    return slide;
}
