
export type ShapeType = 'rect' | 'circle' | 'text' | 'image' | 'pencil';

export interface BaseItem {
    id: string;
    type: ShapeType;
    x: number;
    y: number;
    rotation?: number;
    scaleX?: number;
    scaleY?: number;
    fill?: string;
    stroke?: string;
    strokeWidth?: number;
    opacity?: number;
}

export interface RectangleItem extends BaseItem {
    type: 'rect';
    width: number;
    height: number;
    cornerRadius?: number;
}

export interface CircleItem extends BaseItem {
    type: 'circle';
    radius: number;
}

export interface TextItem extends BaseItem {
    type: 'text';
    text: string;
    fontSize: number;
    fontFamily: string;
    fontStyle?: string;
    align?: string;
    width?: number; // for text wrapping
}

export interface ImageItem extends BaseItem {
    type: 'image';
    src: string;
    width: number;
    height: number;
}

export interface PencilItem extends BaseItem {
    type: 'pencil';
    points: number[]; // [x1, y1, x2, y2, ...]
    tension?: number;
    closed?: boolean;
}

export type CanvasItem = RectangleItem | CircleItem | TextItem | ImageItem | PencilItem;

export interface CanvasState {
    items: CanvasItem[];
    selectedId: string | null;
}
