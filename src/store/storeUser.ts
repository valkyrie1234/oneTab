import { create } from "zustand";


export interface IUserTask {
    id: string;
    isCompleted: boolean;
    isFailed: boolean;
    reward: {
        gold: number;
        exp: number;
    };
}

export interface IUser {
    id: string;
    name: string;
    email: string;
    password: string;
    createdAt: Date;
    updatedAt: Date;
    tasks: IUserTask[];
}
export interface IUserStore {
    user: IUser | null;
    setUser: (user: IUser) => void;
}


const useUserStore = create<IUserStore>((set) => ({
  user: null,
  setUser: (user: IUser) => set({ user }),
}));

export default useUserStore;