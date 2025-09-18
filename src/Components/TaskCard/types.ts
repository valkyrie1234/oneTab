import { DifficultyStatus } from "../../Consts/status";

export type TaskCardProps = {
    id: string;
    title: string;
    description: string;
    dateCreate: Date;
    expiredDate: Date | null;
    boardId: number;
    status: DifficultyStatus;
    reward: {
        gold: number;
        exp: number;
    }
};