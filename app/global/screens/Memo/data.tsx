import {
  Anchor,
  Headphones,
  Coffee,
  Heart,
  Paperclip,
  Zap,
  Umbrella,
  Tv,
  ShoppingCart,
  Sun,
} from "lucide-react";
import type { Tile } from "./Memo";

export const initialData = [
  {
    id: "0",
    icon: ShoppingCart,
    color: "#83ffc1",
  },
  {
    id: "1",
    icon: Zap,
    color: "#f3ff83",
  },
  {
    id: "2",
    icon: Anchor,
    color: "#92ff83",
  },
  {
    id: "3",
    icon: Coffee,
    color: "#ff83f9",
  },
  {
    id: "5",
    icon: Heart,
    color: "#83fff5",
  },
  {
    id: "6",
    icon: Headphones,
    color: "#ff8383",
  },
  {
    id: "7",
    icon: Paperclip,
    color: "#ffbb83",
  },
  {
    id: "8",
    icon: Umbrella,
    color: "#daff83",
  },
  {
    id: "9",
    icon: Tv,
    color: "#83e6ff",
  },
  {
    id: "10",
    icon: Sun,
    color: "#ff83da",
  },
];

export const tilesData: Tile[] = initialData
  .flatMap((tile) => [tile, { ...tile, id: `${tile.id}-copy` }])
  .sort(() => Math.random() - 0.5);
