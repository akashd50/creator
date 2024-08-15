import { Component, HostListener } from "@angular/core";
import { GridItem } from "../../types/grid-item";
import { GridService } from "../../services/GridService";
import { NgForOf, NgIf } from "@angular/common";
import { CdkOverlayOrigin } from "@angular/cdk/overlay";
import { GridAnimationService } from "../../services/GridAnimationService";

@Component({
  selector: 'word-grid',
  standalone: true,
    imports: [
        NgForOf,
        CdkOverlayOrigin,
        NgIf
    ],
  templateUrl: './word-grid.component.html',
  styleUrl: './word-grid.component.scss'
})
export class WordGridComponent {
    grid: GridItem[][];

    constructor(
        private readonly gridService: GridService,
        private readonly gridAnimationService: GridAnimationService
    ) {
        this.grid = gridService.grid;
    }

    onMouseDown(event: MouseEvent, cell: GridItem, element: HTMLElement) {
        this.gridAnimationService.onMouseDown(event, cell, element);
        this.gridService.onMouseDown(cell);
    }

    onMouseMove(event: MouseEvent) {
        this.gridAnimationService.onMouseMove(event);
        this.gridService.onMouseMove();
    }

    onMouseMoveGrid(event: MouseEvent, cell: GridItem, element: HTMLElement) {
    }

    trackById(index: number, item: GridItem) {
        return item.id;
    }

    @HostListener("mouseup")
    onMouseUp(event: MouseEvent) {
        this.gridService.onMouseUp();
        this.gridAnimationService.onMouseUp(event);
    }
}
