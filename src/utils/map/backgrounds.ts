export interface Image {
  id: string;
  name: string;
  url: string;
  type: "background" | "detail";
  width?: number | null;
  height?: number | null;
}

export const BACKGROUNDS: Image[] = [
  {
    id: "a59bd97e-2aac-45f2-94ec-7a4605503211",
    name: "Edge of the Woods - Mirky",
    url: "/images/map/backgrounds/Edge of the Woods - Mirky - 22x16.jpg",
    type: "background",
    width: 950,
    height: 560,
  },
  {
    id: "78120afa-76f1-4aa4-894b-aa5099764a90",
    name: "Edge of the Woods - Night",
    url: "/images/map/backgrounds/Edge of the Woods - Night - 22x16.jpg",
    type: "background",
    width: 950,
    height: 560,
  },
  {
    id: "472f3aba-ca93-41aa-b431-6982488943f7",
    name: "Tree Stump 1 - Cut",
    url: "/images/map/details/Tree Stump 1 - Cut.png",
    type: "detail",
    width: 420 / 6,
    height: 372 / 6,
  },
  {
    id: "b3ac7fa7-b247-4221-9440-da106b74b14d",
    name: "Tree Stump 1 - Tree",
    url: "/images/map/details/Tree Stump 1 - Tree.png",
    type: "detail",
    width: 420 / 6,
    height: 372 / 6,
  },
];
