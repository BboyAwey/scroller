export declare type ScrollDirection = 'both' | 'vertical' | 'horizontal' | 'both' | 'none';
export interface ScrollerOptions {
    el?: HTMLElement | null;
    direction?: ScrollDirection;
    trackClassName?: string;
    barClassName?: string;
    offset?: number;
    scaleable?: boolean;
}
export default class Scroller {
    #private;
    constructor(options: ScrollerOptions);
    getScroll(): {
        scrollTop: number;
        scrollLeft: number;
    };
    scrollTo(position: {
        scrollTop?: number;
        scrollLeft?: number;
    }): this;
    onScroll(cb: EventListener): this;
    offScroll(cb: EventListener): this;
    setDirection(direction: ScrollDirection, lazy?: boolean): this;
    destroy(): void;
}
