/**
 * Типы для хука useTaskExpiry
 */

export interface TaskExpiryInfo {
  isExpired: boolean;
  timeLeft: number;
  formattedTime: string;
  daysLeft: number;
  hoursLeft: number;
  minutesLeft: number;
}

export type TaskExpiryResult = TaskExpiryInfo | null;

