'use client';

import React, { useState } from 'react';
import { Plus, Palette, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';

interface CanvasSummary {
    id: string | null;
    name?: string;
    updated_at?: string | null;
    created_at: string | null;
}

interface CanvasListProps {
    canvases: CanvasSummary[];
    onSelect: (id: string) => void;
    onCreate: (name: string) => void;
    creating: boolean;
}

export const CanvasList = ({ canvases, onSelect, onCreate, creating }: CanvasListProps) => {
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [newName, setNewName] = useState('');

    const handleCreate = () => {
        if (!newName.trim()) return;
        onCreate(newName);
        setNewName('');
        setIsCreateOpen(false);
    };

    return (
        <div className="p-8 max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Canvases</h1>
                    <p className="text-muted-foreground mt-1">
                        Whiteboards and diagrams for your project
                    </p>
                </div>
                <Button onClick={() => setIsCreateOpen(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    New Canvas
                </Button>
            </div>

            {canvases.length === 0 ? (
                <div className="text-center py-20 border-2 border-dashed rounded-lg">
                    <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Palette className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">No canvases yet</h3>
                    <p className="text-muted-foreground mb-6">Create your first canvas to start drawing</p>
                    <Button onClick={() => setIsCreateOpen(true)} variant="outline">
                        Create Canvas
                    </Button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {canvases.map((canvas) => (
                        <Card
                            key={canvas.id || 'temp'}
                            className="p-5 hover:border-primary/50 hover:shadow-md transition-all cursor-pointer group"
                            onClick={() => canvas.id && onSelect(canvas.id)}
                        >
                            <div className="flex items-start justify-between mb-3">
                                <div className="p-2 bg-primary/10 rounded-md group-hover:bg-primary/20 transition-colors">
                                    <Palette className="w-6 h-6 text-primary" />
                                </div>
                            </div>
                            <h3 className="font-semibold text-lg mb-1 truncate group-hover:text-primary transition-colors">
                                {canvas.name || 'Untitled Canvas'}
                            </h3>
                            <div className="flex items-center text-xs text-muted-foreground mt-4">
                                <Calendar className="w-3 h-3 mr-1" />
                                <span>
                                    {canvas.updated_at
                                        ? new Date(canvas.updated_at).toLocaleDateString()
                                        : canvas.created_at ? new Date(canvas.created_at).toLocaleDateString() : 'Unknown'}
                                </span>
                            </div>
                        </Card>
                    ))}
                </div>
            )}

            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Create New Canvas</DialogTitle>
                    </DialogHeader>
                    <div className="py-4">
                        <Label htmlFor="canvas-name">Name</Label>
                        <Input
                            id="canvas-name"
                            value={newName}
                            onChange={(e) => setNewName(e.target.value)}
                            placeholder="e.g. System Architecture"
                            className="mt-2"
                            autoFocus
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') handleCreate();
                            }}
                        />
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsCreateOpen(false)}>Cancel</Button>
                        <Button onClick={handleCreate} disabled={creating || !newName.trim()}>
                            {creating ? 'Creating...' : 'Create'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};
