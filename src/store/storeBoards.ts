import { create } from "zustand";

// Интерфейс доски (соответствует бэкенду)
export interface IBoard {
  id: string;           // UUID (не number!)
  name: string;         // Изменено с title на name
  emoji?: string;
  description?: string;
  color?: string;
  order: number;
  isSystem: boolean;    // Системная доска (нельзя удалить)
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface IBoardsStore {
  boards: IBoard[];
  setBoards: (boards: IBoard[]) => void;  // Загрузка досок с сервера
  createBoard: (board: IBoard) => void;
  deleteBoard: (id: string) => void;
  updateBoard: (id: string, updates: Partial<IBoard>) => void;
}

const useBoardsStore = create<IBoardsStore>((set) => ({
  boards: [],  // Пустой массив - доски загружаются с сервера
  
  setBoards: (boards: IBoard[]) => set({ boards }),
  
  createBoard: (board: IBoard) =>
    set((state) => ({ boards: [...state.boards, board] })),
    
  deleteBoard: (id: string) =>
    set((state) => ({ boards: state.boards.filter((b) => b.id !== id) })),
    
  updateBoard: (id: string, updates: Partial<IBoard>) =>
    set((state) => ({
      boards: state.boards.map((board) =>
        board.id === id ? { ...board, ...updates } : board
      ),
    })),
}));

export default useBoardsStore;
  
  