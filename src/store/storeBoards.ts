import { create } from "zustand";



export interface IBoard {
    id: number;
    title: string;
    emoji?: string;
  }
  
  export interface IStore {
    boards: IBoard[];
    createBoard: (board: IBoard) => void;
    //   deleteBoard: (id: number) => void;
  }
  
  const useBoardsStore = create<IStore>((set) => ({
    boards: [
      { title: "All Tasks", emoji: "📋", id: 0 },
      { title: "start", emoji: "🎯", id: 1 },
      { title: "in progress", emoji: "⚔️", id: 2 },
      { title: "victory", emoji: "🌟🌟🌟", id: 3 },
      { title: "defeat", emoji: "☠️", id: 4 },
    ],
    createBoard: (board: IBoard) =>
      set((state) => ({ boards: [...state.boards, board] })),
  }));
  
  export default useBoardsStore;
  
  