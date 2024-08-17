import { BehaviorSubject, Observable } from "rxjs";
import { GridItem } from "../types/grid-item";
import { v4 as uuidv4 } from "uuid";
import { ItemType } from "../types/item-type";
import { ItemIconMappings, ItemLabelMappings, ItemMergeMappings } from "../types/item-mappings";

export class GridContentUtils {
    static allItemTypes = Object.keys(ItemType);

    static getInitialGrid(dimension: number): GridItem[][] {
        const gridItems = [];

        for (let i = 0; i < dimension; i++) {
            const newRow: GridItem[] = [];
            gridItems[i] = newRow;

            for (let j = 0; j < dimension; j++) {
                const newItem = this.getRandomItemType();
                newRow.push(this.getRandomGridItem(i, j));
            }
        }

        return gridItems;
    }

    static getMergedLabel(curr: GridItem, target: GridItem): string {
        return ItemLabelMappings[this.getMergedItem(curr, target)];
    }

    static getMergedIcon(curr: GridItem, target: GridItem): string {
        return ItemIconMappings[this.getMergedItem(curr, target)];
    }

    static getMergedItem(curr: GridItem, target: GridItem): ItemType {
        return ItemMergeMappings[curr.itemType][target.itemType];
    }

    static getRandomGridItem(i: number, j: number): GridItem {
        const newItem = this.getRandomItemType();
        return {
            id: uuidv4(),
            itemType: newItem.toString(),
            label: ItemLabelMappings[newItem],
            icon: ItemIconMappings[newItem],
            index: { row: i, col: j }
        };
    }

    static getRandomItemType(): ItemType {
        const random = Math.floor(Math.random() * this.allItemTypes.length);
        return this.allItemTypes[random] as ItemType;
    }
}
