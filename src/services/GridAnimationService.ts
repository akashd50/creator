import { Injectable } from "@angular/core";
import { GridItem } from "../types/grid-item";
import { Point } from "../types/point";
import { Direction } from "../types/direction";

@Injectable({ providedIn: "root" })
export class GridAnimationService {
    selected: string;
    selectedElement: HTMLElement;
    selectedElementPosition: Point;
    moveDir: Direction;

    constructor() {
    }

    onMouseDown(event: MouseEvent, cell: GridItem, element: HTMLElement) {
        this.selected = cell.id;
        this.selectedElement = element;
        this.selectedElementPosition = {
            x: event.x,
            y: event.y
        };

        this.selectedElement.classList.add("selected");
    }

    onMouseMove(event: MouseEvent) {
        if (!this.selectedElement || !this.selectedElementPosition) {
            return;
        }

        const xDiff = event.x - this.selectedElementPosition.x;
        const yDiff = event.y - this.selectedElementPosition.y;
        const isVertical = Math.abs(yDiff) > Math.abs(xDiff);

        if (isVertical && Math.abs(yDiff) > this.selectedElement.getBoundingClientRect().width/2) {
            if (yDiff < 0) {
                this.move(Direction.Up);
            } else {
                this.move(Direction.Down);
            }
        } else if (!isVertical && Math.abs(xDiff) > this.selectedElement.getBoundingClientRect().width/2) {
            if (xDiff > 0) {
                this.move(Direction.Right);
            } else {
                this.move(Direction.Left);
            }
        } else {
            this.move(undefined);
        }

        this.applyClasses(this.selectedElement, this.moveDir);
    }

    onMouseUp(event: MouseEvent) {
        this.reset();
    }

    reset() {
        if (!this.selectedElement) {
            return;
        }

        this.selectedElement?.classList?.remove("selected");
        this.move(undefined);
        this.applyClasses(this.selectedElement, this.moveDir);
        this.selected = undefined;
        this.selectedElement = undefined;
    }

    applyMoved() {
        if (this.selectedElement) {
            const element = this.selectedElement;
            element.classList.add("moved");

            setTimeout(() => {
                element?.classList?.remove("moved");
            });
        }
    }



    private move(dir: Direction) {
        this.moveDir = dir;
    }

    public applyClasses(htmlElement: HTMLElement, moveDir: Direction) {
        if (moveDir === undefined) {
            htmlElement.classList.add("moved");

            setTimeout(() => {
                htmlElement?.classList?.remove("moved");
            }, 10);
        }

        moveDir === Direction.Up ? htmlElement.classList.add("up") : htmlElement.classList.remove("up");
        moveDir === Direction.Right ? htmlElement.classList.add("right") : htmlElement.classList.remove("right");
        moveDir === Direction.Left ? htmlElement.classList.add("left") : htmlElement.classList.remove("left");
        moveDir === Direction.Down ? htmlElement.classList.add("down") : htmlElement.classList.remove("down");
    }
}
