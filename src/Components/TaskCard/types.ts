import { DifficultyStatus } from "../../Consts/status";

export type TaskCardProps = {
    id: string;
    title: string;
    description: string;
    dateCreate: Date;
    expiredDate: Date | null;
    boardId: number;
    status: DifficultyStatus;
    isCompleted: boolean;
    isFailed: boolean;
    reward: {
        gold: number;
        exp: number;
    }
};