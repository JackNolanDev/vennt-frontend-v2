export interface Image {
  id: string;
  name: string;
  url: string;
  width?: number | null;
  height?: number | null;
}

export const BACKGROUNDS: Image[] = [
  {
    id: "a59bd97e-2aac-45f2-94ec-7a4605503211",
    name: "Edge of the Woods - Mirky",
    url: "/images/map/backgrounds/Edge of the Woods - Mirky - 22x16.jpg",
    width: 950,
    height: 560,
  },
  {
    id: "78120afa-76f1-4aa4-894b-aa5099764a90",
    name: "Edge of the Woods - Night",
    url: "/images/map/backgrounds/Edge of the Woods - Night - 22x16.jpg",
    width: 3800,
    height: 2240,
  },
];
