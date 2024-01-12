import {
  FiAnchor,
  FiHeadphones,
  FiCoffee,
  FiHeart,
  FiPaperclip,
  FiZap,
  FiUmbrella,
  FiTv,
  FiShoppingCart,
  FiSun,
} from "react-icons/fi";
import { Tile } from "./Memo";

export const tilesData: Tile[] = [
  {
    id: "0",
    icon: <FiShoppingCart />,
    color: "#83ffc1",
  },
  {
    id: "1",
    icon: <FiZap />,
    color: "#f3ff83",
  },
  {
    id: "2",
    icon: <FiAnchor />,
    color: "#92ff83",
  },
  {
    id: "3",
    icon: <FiCoffee />,
    color: "#ff83f9",
  },
  {
    id: "5",
    icon: <FiHeart />,
    color: "#83fff5",
  },
  {
    id: "6",
    icon: <FiHeadphones />,
    color: "#ff8383",
  },
  {
    id: "7",
    icon: <FiPaperclip />,
    color: "#ffbb83",
  },
  {
    id: "8",
    icon: <FiUmbrella />,
    color: "#daff83",
  },
  {
    id: "9",
    icon: <FiTv />,
    color: "#83e6ff",
  },
  {
    id: "10",
    icon: <FiSun />,
    color: "#ff83da",
  },
]
  .flatMap((tile) => [tile, { ...tile, id: `${tile.id}-copy` }])
  .sort(() => Math.random() - 0.5);
