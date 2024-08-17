import { Injectable } from "@angular/core";
import { GridItem } from "../types/grid-item";
import { BehaviorSubject, Observable } from "rxjs";
import { OverlayRef } from "@angular/cdk/overlay";
import { v4 as uuidv4 } from "uuid";
import { cloneDeep } from "lodash";
import { GridAnimationService } from "./GridAnimationService";
import { Direction } from "../types/direction";
import { Index2D } from "../types/index-2D";
import { GridContentUtils } from "./GridContentService";

@Injectable({ providedIn: "root" })
export class GridService {
    private dimension = 5;
    private gridItemsSubject = new BehaviorSubject<GridItem[][]>([]);
    private selectedSubject = new BehaviorSubject<GridItem>(undefined);
    private grid: GridItem[][];
    overlayRef: OverlayRef;

    constructor(
        private readonly gridAnimationService: GridAnimationService
    ) {
        this.gridItemsSubject.next(GridContentUtils.getInitialGrid(this.dimension));
    }

    get grid$(): Observable<GridItem[][]> {
        return this.gridItemsSubject.asObservable();
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
        this.grid = this.gridItemsSubject.value;
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
                curr.mergedLabel = GridContentUtils.getMergedLabel(curr, toMergeWith);
                curr.mergedIcon = GridContentUtils.getMergedIcon(curr, toMergeWith);
            } else {
                curr.itemType = GridContentUtils.getMergedItem(curr, toMergeWith);
                curr.label = GridContentUtils.getMergedLabel(curr, toMergeWith);
                curr.icon = GridContentUtils.getMergedIcon(curr, toMergeWith);
                curr.mergedLabel = undefined;
                curr.mergedIcon = undefined;
                this.replaceTile(curr, toMergeWith);
            }
        } else {
            curr.mergedLabel = undefined;
            curr.mergedIcon = undefined;
        }
    }

    private replaceTile(current: GridItem, target: GridItem) {
        this.gridAnimationService.applyMoved();

        const currentIndexClone = cloneDeep(current.index);

        this.grid[current.index.row][current.index.col] = undefined;
        current.index.row = target.index.row;
        current.index.col = target.index.col;
        this.grid[target.index.row][target.index.col] = current;

        this.gridItemsSubject.next(this.grid);

        this.collapse(currentIndexClone);
    }

    private collapse(index: Index2D) {
        const dir = this.gridAnimationService.moveDir;
        switch (dir) {
            case Direction.Up:
                this.collapseHelper(index, Direction.Up);
                break;
            case Direction.Down:
                this.collapseHelper(index, Direction.Down);
                break;
            case Direction.Left:
                this.collapseHelper(index, Direction.Left);
                break;
            case Direction.Right:
                this.collapseHelper(index, Direction.Right);
                break;
        }
    }

    private collapseHelper(index: Index2D, dir: Direction) {
        const points = this.getPointsToMove(index, dir);
        this.applyClasses(points, dir);
        setTimeout(() => {
            this.applyClasses(points, undefined);
            this.moveRow(points, dir, index);
        }, 200);
    }

    private getPointsToMove(index: Index2D, dir: Direction) {
        const points: Index2D[] = [];
        switch (dir) {
            case Direction.Right: {
                const rightPoints = this.generatePoints(index.row, 0, index.row, index.col);
                rightPoints.reverse();
                return rightPoints;
            }
            case Direction.Left: {
                return this.generatePoints(index.row, index.col + 1, index.row, this.dimension);
            }
            case Direction.Up: {
                return this.generatePoints(index.row + 1, index.col, this.dimension, index.col);
            }
            case Direction.Down: {
                const downPoints = this.generatePoints(0, index.col, index.row, index.col);
                downPoints.reverse();
                return downPoints;
            }
        }
        return points;
    }

    private generatePoints(startRow: number, startCol: number, endRow: number, endCol: number): Index2D[] {
        const list = [];
        if (startCol === endCol) {
            for (let i = startRow; i < endRow; i++) {
                list.push(cloneDeep(this.grid[i][startCol].index));
            }
        } else if (startRow === endRow) {
            for (let i = startCol; i < endCol; i++) {
                list.push(cloneDeep(this.grid[startRow][i].index));
            }
        }
        return list;
    }

    private moveRow(points: Index2D[], dir: Direction, index: Index2D) {
        const gridItems = cloneDeep(this.grid);
        const colAdd = dir === Direction.Right ? 1 : dir === Direction.Left ? -1 : 0;
        const rowAdd = dir === Direction.Down ? 1 : dir === Direction.Up ? -1 : 0;

        for (let i = 0; i < points.length; i++) {
            const p = points[i];

            const gridItem = gridItems[p.row][p.col];
            gridItems[p.row + rowAdd][p.col + colAdd] = gridItem;
            if (gridItem) {
                gridItem.index.col = p.col + colAdd;
                gridItem.index.row = p.row + rowAdd;
            }

            if (i === points.length - 1) {
                gridItems[p.row][p.col] = GridContentUtils.getRandomGridItem(p.row, p.col);
            }
        }

        if (points.length === 0) {
            gridItems[index.row][index.col] = GridContentUtils.getRandomGridItem(index.row, index.col);
        }

        this.gridItemsSubject.next(gridItems);
    }

    private applyClasses(points: Index2D[], dir: Direction) {
        for (const point of points) {
            this.gridAnimationService.applyClasses(document.querySelector(`#g_${this.grid[point.row][point.col].id}`), dir);
        }
    }

}
