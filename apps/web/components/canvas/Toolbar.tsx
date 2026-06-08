
'use client';

import React from 'react';
import { MousePointer2, Pencil, Square, Circle, Type, Image as ImageIcon, Save, Eraser, Trash2, Undo2, Redo2 } from 'lucide-react';
import { ShapeType } from '@/types/canvas';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

// Predefined colors
const COLORS = [
    '#000000', // Black
    '#ffffff', // White
    '#ef4444', // Red
    '#f97316', // Orange
    '#eab308', // Yellow
    '#22c55e', // Green
    '#3b82f6', // Blue
    '#a855f7', // Purple
];

interface ToolbarProps {
    activeTool: 'select' | 'pencil' | 'eraser';
    setActiveTool: (tool: 'select' | 'pencil' | 'eraser') => void;
    onAddShape: (type: 'rect' | 'circle' | 'text') => void;
    onUploadImage: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onClearAll?: () => void;
    strokeColor: string;
    setStrokeColor: (color: string) => void;
    strokeWidth: number;
    setStrokeWidth: (width: number) => void;
    eraserWidth: number;
    setEraserWidth: (width: number) => void;
    onSave?: () => void;
    onUndo?: () => void;
    onRedo?: () => void;
    canUndo?: boolean;
    canRedo?: boolean;
}

export const CanvasToolbar = ({
    activeTool,
    setActiveTool,
    onAddShape,
    onUploadImage,
    onClearAll,
    strokeColor,
    setStrokeColor,
    strokeWidth,
    setStrokeWidth,
    eraserWidth,
    setEraserWidth,
    onSave,
    onUndo,
    onRedo,
    canUndo = false,
    canRedo = false
}: ToolbarProps) => {
    return (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-background border px-4 py-2 rounded-lg shadow-lg flex flex-col gap-2 z-50">
            {/* Tools Row */}
            <div className="flex items-center gap-2">
                <Button
                    variant={activeTool === 'select' ? 'secondary' : 'ghost'}
                    size="icon"
                    onClick={() => setActiveTool('select')}
                    title="Select (V)"
                >
                    <MousePointer2 className="h-4 w-4" />
                </Button>
                <div className="w-px h-6 bg-border mx-1" />
                <Button
                    variant={activeTool === 'pencil' ? 'secondary' : 'ghost'}
                    size="icon"
                    onClick={() => setActiveTool('pencil')}
                    title="Freehand Draw (P)"
                >
                    <Pencil className="h-4 w-4" />
                </Button>
                <Button
                    variant={activeTool === 'eraser' ? 'secondary' : 'ghost'}
                    size="icon"
                    onClick={() => setActiveTool('eraser')}
                    title="Eraser (E)"
                >
                    <Eraser className="h-4 w-4" />
                </Button>
                <div className="w-px h-6 bg-border mx-1" />
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onUndo?.()}
                    disabled={!canUndo}
                    title="Undo"
                >
                    <Undo2 className="h-4 w-4" />
                </Button>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onRedo?.()}
                    disabled={!canRedo}
                    title="Redo"
                >
                    <Redo2 className="h-4 w-4" />
                </Button>
                <div className="w-px h-6 bg-border mx-1" />
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onAddShape('rect')}
                    title="Add Rectangle"
                >
                    <Square className="h-4 w-4" />
                </Button>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onAddShape('circle')}
                    title="Add Circle"
                >
                    <Circle className="h-4 w-4" />
                </Button>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onAddShape('text')}
                    title="Add Text"
                >
                    <Type className="h-4 w-4" />
                </Button>
                <div className="relative">
                    <Input
                        type="file"
                        accept="image/*"
                        className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                        onChange={onUploadImage}
                        title="Upload Image"
                    />
                    <Button variant="ghost" size="icon">
                        <ImageIcon className="h-4 w-4" />
                    </Button>
                </div>
                <div className="w-px h-6 bg-border mx-1" />
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onSave?.()}
                    title="Save Canvas"
                >
                    <Save className="h-4 w-4" />
                </Button>
                {onClearAll && (
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={onClearAll}
                        title="Clear canvas"
                        className="text-destructive hover:text-destructive"
                    >
                        <Trash2 className="h-4 w-4" />
                    </Button>
                )}

            </div>

            {/* Properties Row */}
            <div className="flex items-center gap-4 pt-2 border-t mt-1">
                {/* Color Picker — hide when eraser is active */}
                {activeTool !== 'eraser' && (
                    <>
                        <div className="flex items-center gap-1">
                            {COLORS.map((color) => (
                                <button
                                    key={color}
                                    className={`w-6 h-6 rounded-full border ${strokeColor === color ? 'ring-2 ring-primary ring-offset-2' : ''}`}
                                    style={{ backgroundColor: color }}
                                    onClick={() => setStrokeColor(color)}
                                    title={color}
                                />
                            ))}
                            <div className="relative ml-2">
                                <input
                                    type="color"
                                    value={strokeColor}
                                    onChange={(e) => setStrokeColor(e.target.value)}
                                    className="w-8 h-8 p-0 border-0 rounded cursor-pointer"
                                    title="Custom Color"
                                />
                            </div>
                        </div>
                        <div className="w-px h-6 bg-border mx-1" />
                        <div className="flex items-center gap-2">
                            <Label htmlFor="stroke-width" className="text-xs whitespace-nowrap">Brush: {strokeWidth}px</Label>
                            <Input
                                id="stroke-width"
                                type="range"
                                min="1"
                                max="50"
                                step="1"
                                value={strokeWidth}
                                onChange={(e) => setStrokeWidth(parseInt(e.target.value))}
                                className="w-24 h-8"
                            />
                        </div>
                    </>
                )}

                {/* Eraser size — only when eraser is active */}
                {activeTool === 'eraser' && (
                    <div className="flex items-center gap-2">
                        <Eraser className="h-3.5 w-3.5 text-muted-foreground" />
                        <Label htmlFor="eraser-width" className="text-xs whitespace-nowrap">Eraser: {eraserWidth}px</Label>
                        <Input
                            id="eraser-width"
                            type="range"
                            min="5"
                            max="80"
                            step="1"
                            value={eraserWidth}
                            onChange={(e) => setEraserWidth(parseInt(e.target.value))}
                            className="w-24 h-8"
                        />
                    </div>
                )}
            </div>
        </div>
    )
}
