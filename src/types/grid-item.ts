import { Index2D } from "./index-2D";

export interface GridItem {
    id: string;
    itemType: string;
    icon: string;
    mergedIcon?: string;
    label?: string;
    mergedLabel?: string;
    index: Index2D;
}
