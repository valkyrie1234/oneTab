
export interface IBoards { 
  id: number;
  label: string;
  emoji? : string;
}


export const boards = [
  { label: "start", emoji: "🎯", id:1 },
  { label: "in progress", emoji: "⚔️", id:2 },
  { label: "victory", emoji: "🌟🌟🌟", id:3 },
  { label: "defeat", emoji: "☠️", id:4 },
];


