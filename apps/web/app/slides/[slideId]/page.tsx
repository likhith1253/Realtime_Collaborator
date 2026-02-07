'use client';

import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Loader2, Share2, Presentation } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { getSlide, updateSlide, type Slide } from '@/lib/slides';
import { joinSlide, emitSlideUpdate, onSlideUpdate, disconnectSocket } from '@/lib/socket';

export default function SlideEditorPage() {
    const params = useParams();
    const router = useRouter();
    const searchParams = useSearchParams();
    const slideId = params.slideId as string;
    const presentationId = searchParams.get('presentationId');
    const projectId = searchParams.get('projectId');

    const [slide, setSlide] = useState<Slide | null>(null);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    // Ref to track if the update comes from local user or remote to prevent loops
    const isLocalUpdate = useRef(false);

    useEffect(() => {
        const init = async () => {
            if (!slideId) return;

            try {
                setLoading(true);
                const data = await getSlide(slideId);
                setSlide(data);
                setTitle(data.title);
                setContent(data.content || '');

                // Connect to socket and join room
                joinSlide(slideId);
            } catch (err) {
                console.error('Failed to load slide:', err);
                setError('Failed to load slide');
            } finally {
                setLoading(false);
            }
        };

        init();

        return () => {
            disconnectSocket();
        };
    }, [slideId]);

    // Listen for remote updates
    useEffect(() => {
        const cleanup = onSlideUpdate((data) => {
            // Only update if we are NOT currently editing/typing to avoid conflicts?
            // Actually last-write-wins means we should update. 
            // But if I am typing, I don't want my cursor to jump or my text to be overwritten by OLDER remote text.
            // For this simple implementation, we just accept the update.
            // In a real app with CRDTs (like Yjs), this is handled better.
            // Here we just update state.

            console.log('Received remote update:', data);
            if (data.title !== undefined) setTitle(data.title);
            if (data.content !== undefined) setContent(data.content);
        });

        return cleanup;
    }, []);

    // Debounced Save to Backend
    // We use a ref to store the timeout ID
    const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const saveToBackend = useCallback((newTitle: string, newContent: string) => {
        setSaving(true);
        if (saveTimeoutRef.current) {
            clearTimeout(saveTimeoutRef.current);
        }

        saveTimeoutRef.current = setTimeout(async () => {
            try {
                await updateSlide(slideId, { title: newTitle, content: newContent });
                setSaving(false);
            } catch (err) {
                console.error('Failed to save slide:', err);
                setSaving(false);
            }
        }, 1000); // Save after 1 second of inactivity
    }, [slideId]);

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newTitle = e.target.value;
        setTitle(newTitle);
        isLocalUpdate.current = true;

        // Emit to socket
        emitSlideUpdate(slideId, newTitle, undefined);

        // Schedule save
        saveToBackend(newTitle, content);
    };

    const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const newContent = e.target.value;
        setContent(newContent);
        isLocalUpdate.current = true;

        // Emit to socket
        emitSlideUpdate(slideId, undefined, newContent);

        // Schedule save
        saveToBackend(title, newContent);
    };

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center bg-background">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (error || !slide) {
        return (
            <div className="flex h-screen flex-col items-center justify-center bg-background gap-4">
                <h2 className="text-xl font-semibold text-destructive">{error || 'Slide not found'}</h2>
                <Button onClick={() => router.back()} variant="outline">
                    <ArrowLeft className="mr-2 h-4 w-4" /> Go Back
                </Button>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-screen bg-background">
            {/* Navbar */}
            <header className="border-b h-14 flex items-center justify-between px-4 lg:px-6 bg-card">
                <div className="flex items-center gap-4">
                    <Link
                        href={presentationId && projectId ? `/projects/${projectId}/presentations/${presentationId}` : '/dashboard'}
                        className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                        <ArrowLeft className="h-5 w-5" />
                    </Link>
                    <div className="flex flex-col">
                        <span className="text-sm font-medium leading-none">Slide Editor</span>
                        {saving ? (
                            <span className="text-xs text-muted-foreground mt-1 flex items-center">
                                <Loader2 className="h-3 w-3 animate-spin mr-1" /> Saving...
                            </span>
                        ) : (
                            <span className="text-xs text-muted-foreground mt-1">Saved</span>
                        )}
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <div className="px-3 py-1 bg-green-500/10 text-green-600 text-xs rounded-full font-medium flex items-center">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500 mr-2 animate-pulse"></div>
                        Live Sync Active
                    </div>
                    <Button variant="outline" size="sm" className="hidden sm:flex">
                        <Presentation className="h-4 w-4 mr-2" />
                        Present
                    </Button>
                    <Button size="sm">
                        <Share2 className="h-4 w-4 mr-2" />
                        Share
                    </Button>
                </div>
            </header>

            {/* Editor Area */}
            <div className="flex-1 overflow-hidden flex flex-col md:flex-row">
                {/* Main Slide Canvas */}
                <main className="flex-1 p-8 overflow-y-auto bg-muted/20 flex items-center justify-center">
                    <div className="w-full max-w-4xl aspect-video bg-white shadow-xl rounded-xl overflow-hidden flex flex-col border border-border">
                        {/* Slide Header (Title) */}
                        <div className="p-8 border-b-2 border-dashed border-gray-100">
                            <Input
                                value={title}
                                onChange={handleTitleChange}
                                className="text-4xl font-bold border-none shadow-none focus-visible:ring-0 p-0 h-auto placeholder:text-gray-300"
                                placeholder="Click to add title"
                            />
                        </div>

                        {/* Slide Body (Content) */}
                        <div className="flex-1 p-8 bg-white">
                            <Textarea
                                value={content}
                                onChange={handleContentChange}
                                className="w-full h-full resize-none border-none shadow-none focus-visible:ring-0 p-0 text-xl text-gray-700 placeholder:text-gray-300 leading-relaxed custom-scrollbar"
                                placeholder="Click to add content..."
                                style={{ minHeight: '100%' }}
                            />
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
