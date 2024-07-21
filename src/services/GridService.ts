import { Injectable } from "@angular/core";
import { GridItem } from "../types/grid-item";
import { BehaviorSubject } from "rxjs";
import { OverlayRef } from "@angular/cdk/overlay";
import { v4 as uuidv4 } from "uuid";
import { cloneDeep } from "lodash";
import { GridAnimationService } from "./GridAnimationService";
import { Direction } from "../types/direction";
import { Index2D } from "../types/index-2D";

@Injectable({ providedIn: "root" })
export class GridService {
    private dimension = 10;
    private gridItems: GridItem[][];
    private selectedSubject = new BehaviorSubject<GridItem>(undefined);

    overlayRef: OverlayRef;

    constructor(
        private readonly gridAnimationService: GridAnimationService
    ) {
        this.gridItems = [];

        for (let i = 0; i < this.dimension; i++) {
            const newRow: GridItem[] = [];
            this.gridItems[i] = newRow;

            for (let j = 0; j < this.dimension; j++) {
                newRow.push({
                    id: uuidv4(),
                    label: this.getRandomCharacter(),
                    index: { row: i, col: j }
                });
            }
        }
    }

    get grid(): GridItem[][] {
        return this.gridItems;
    }

    onMouseDown(cell: GridItem) {
        this.selectedSubject.next(cell);
    }

    onMouseUp() {
        this.mergeElements(false);
    }

    onMouseMove() {
        this.mergeElements();
    }

    private mergeElements(dryRun = true) {
        if (!this.selectedSubject.value) {
            return;
        }

        let toMergeWith;
        const curr = this.selectedSubject.value;

        switch (this.gridAnimationService.moveDir) {
            case Direction.Up:
                toMergeWith = this.grid[curr.index.row - 1][curr.index.col];
                break;
            case Direction.Down:
                toMergeWith = this.grid[curr.index.row + 1][curr.index.col];
                break;
            case Direction.Left:
                toMergeWith = this.grid[curr.index.row][curr.index.col - 1];
                break;
            case Direction.Right:
                toMergeWith = this.grid[curr.index.row][curr.index.col + 1];
                break;
            default:
                break;
        }

        if (toMergeWith) {
            if (dryRun) {
                curr.mergedLabel = `${curr.label}${toMergeWith.label}`;
            } else {
                curr.label = `${curr.label}${toMergeWith.label}`;
                curr.mergedLabel = undefined;
                this.replaceTile(curr, toMergeWith);
            }
        } else {
            curr.mergedLabel = undefined;
        }
    }

    private replaceTile(current: GridItem, target: GridItem) {
        this.gridAnimationService.applyMoved();

        const currentIndexClone = cloneDeep(current.index);

        this.grid[current.index.row][current.index.col] = undefined;
        current.index.row = target.index.row;
        current.index.col = target.index.col;
        this.grid[target.index.row][target.index.col] = current;

        this.collapse(currentIndexClone);
    }

    private collapse(index: Index2D) {
        const dir = this.gridAnimationService.moveDir;
        switch (dir) {
            case Direction.Up:
                for (let i = index.row; i <= this.grid[index.row].length - 1; i++) {

                    if (i === this.grid[index.row].length - 1){
                        this.grid[i][index.col] = this.getRandomCell(i, index.col);
                        continue;
                    }
                    // if (this.grid[i + 1][index.col]) {
                    //     this.gridAnimationService.applyClasses(document.querySelector(`#g_${this.grid[i + 1][index.col].id}`), Direction.Up)
                    // }

                    this.grid[i][index.col] = this.grid[i + 1][index.col];

                    if (this.grid[i][index.col]) {
                        this.grid[i][index.col].index.row = i;
                    }
                }
                break;
            case Direction.Down:
                for (let i = index.row; i >= 0; i--) {

                    if (i === 0){
                        this.grid[i][index.col] = this.getRandomCell(i, index.col);
                        continue;
                    }

                    // if (this.grid[i - 1][index.col]) {
                    //     this.gridAnimationService.applyClasses(document.querySelector(`#g_${this.grid[i - 1][index.col].id}`), Direction.Down)
                    // }

                    this.grid[i][index.col] = this.grid[i - 1][index.col];

                    if (this.grid[i][index.col]) {
                        this.grid[i][index.col].index.row = i;
                    }
                }
                break;
            case Direction.Left:
                for (let i = index.col; i <= this.grid[index.row].length - 1; i++) {
                    if (i === this.grid[index.row].length - 1){
                        this.grid[index.row][i] = this.getRandomCell(index.row, i);
                        continue;
                    }

                    // if (this.grid[index.row][i + 1]) {
                    //     this.gridAnimationService.applyClasses(document.querySelector(`#g_${this.grid[index.row][i + 1].id}`), Direction.Left)
                    // }

                    this.grid[index.row][i] = this.grid[index.row][i + 1];

                    if (this.grid[index.row][i]) {
                        this.grid[index.row][i].index.col = i;
                    }
                }
                break;
            case Direction.Right:
                for (let i = index.col; i >= 0; i--) {
                    if (i === 0){
                        this.grid[index.row][i] = this.getRandomCell(index.row, i);
                        continue;
                    }

                    // if (this.grid[index.row][i - 1]) {
                    //     this.gridAnimationService.applyClasses(document.querySelector(`#g_${this.grid[index.row][i - 1].id}`), Direction.Right)
                    // }

                    this.grid[index.row][i] = this.grid[index.row][i - 1];
                    if (this.grid[index.row][i]) {
                        this.grid[index.row][i].index.col = i;
                    }
                }
                break;
        }
    }

    /*private moveRow(start: number, end: number, index: Index2D, dir: Direction) {
        for (let i = start; i <= end; i++) {
            if (dir === Direction.Right) {
                if (i === end){
                    this.grid[index.row][i] = undefined;
                    continue;
                }

                const toMove = this.grid[index.row][i];
                if (toMove) {
                    toMove.index.col = i + 1;
                    this.grid[index.row][i + 1] = this.grid[index.row][i];
                }
            }
        }
    }*/

    private getRandomCell(i: number, j: number): GridItem {
        return {
            id: uuidv4(),
            label: this.getRandomCharacter(),
            index: { row: i, col: j }
        };
    }

    private getRandomCharacter(): string {
        return String.fromCharCode(65 + Math.floor(Math.random() * 26));
    }
}
