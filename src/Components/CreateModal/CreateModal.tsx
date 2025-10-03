import React, { useState } from "react";
import Input from "../../uiKit/Input/Input";
import Select from "../../uiKit/Select/Select";
import { statusOptions } from "../../Consts/options";
import { DifficultyStatus } from "../../Consts/status";
import useTasksStore, { ITasks } from "../../store/storeTasks";
import useBoardsStore from "../../store/storeBoards";
import useNotificationStore from "../../store/storeNotifications";
import useAuthStore from "../../store/storeAuth";
import { TasksAPI } from "../../api/client";
import type { IApiResponse } from "../../api/types";
import styles from "./CreateModal.module.css";
import Button from "../../uiKit/Button/Button";
import RangeInput from "../../uiKit/RangeInput/RangeInput";
import useReward from "../../hooks/useReward";

const CreateModal = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<DifficultyStatus>("easy");
  const [gold, setGold] = useState(100);
  const [exp, setExpr] = useState(50);
  const [expiredDate, setExpiredDate] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const { createTask } = useTasksStore();
  const boards = useBoardsStore((state) => state.boards);
  const { user } = useAuthStore();
  const addNotification = useNotificationStore((state) => state.addNotification);
  const { setReward, setExp } = useReward();
  
  const onChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  const onChangeHandler1 = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDescription(e.target.value);
  };

  const onChangeExpiredDate = (e: React.ChangeEvent<HTMLInputElement>) => {
    setExpiredDate(e.target.value);
  };

  const handleStatusChange = (selectedStatus: DifficultyStatus) => {
    setStatus(selectedStatus);
  };

  const createHandler = async () => {
    if (!title || !status || !description) {
      addNotification("warning", "Заполните все обязательные поля квеста!", "📜");
      return;
    }

    if (!user) {
      addNotification("error", "Войдите в гильдию чтобы создать квест!", "🚪");
      return;
    }

    setLoading(true);

    try {
      // Маппинг status → difficulty для API
      const difficultyMap = {
        'easy': 'EASY',
        'medium': 'MEDIUM',
        'hard': 'HARD',
        'epic': 'EPIC',
        'completed': 'COMPLETED'
      } as const;

      // Находим доску "all tasks" для новых задач
      // Новые задачи должны попадать в общий пул "all tasks"
      const allTasksBoard = boards.find(b => b.name === 'all tasks');
      const boardId = allTasksBoard?.id || undefined;

      const response = await TasksAPI.create({
        title,
        description,
        difficulty: difficultyMap[status],
        rewardExp: exp,
        rewardGold: gold,
        expiredDate: expiredDate || undefined,
        boardId,
        userId: user.id
      }) as IApiResponse<{ message: string; task: ITasks }>;

      console.log("📝 Response от создания задачи:", response);

      if (response.success) {
        // Добавляем задачу в локальный store
        console.log("✅ Задача создана:", response.data.task);
        
        // Проверяем структуру данных
        const taskData = response.data.task;
        if (!taskData.boardId) {
          console.warn("⚠️ Задача создана без boardId, устанавливаем null");
        }
        
        createTask(taskData);
        
        // ✅ Успех - квест создан!
        addNotification(
          "success",
          "⚔️ Квест успешно создан! Да начнется приключение!",
          "🎯",
          5000
        );

        // Очищаем форму
        setTitle("");
        setDescription("");
        setStatus("easy");
        setExpr(50);
        setGold(100);
        setExpiredDate("");
      } else {
        // ❌ Ошибка от API
        addNotification(
          "error",
          "☠️ Квест не получилось создать, уже разбираемся с гильдией...",
          "🛡️",
          6000
        );
      }
    } catch (error) {
      // ❌ Ошибка сети/сервера
      console.error("Ошибка создания квеста:", error);
      addNotification(
        "error",
        "☠️ Квест не получилось создать, уже разбираемся с гильдией...",
        "🛡️",
        6000
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.createModalContainer}>
      <Input
        label="Заголовок задачи"
        value={title}
        onChange={onChangeHandler}
      />
      <Input
        label="Описание задачи"
        value={description}
        onChange={onChangeHandler1}
      />
      <Input
        label="Дата окончания (необязательно)"
        type="datetime-local"
        value={expiredDate}
        onChange={onChangeExpiredDate}
      />
      <p>
        Золото: {gold} {setReward(gold)}
      </p>
      <RangeInput
        max={500}
        inputSize="large"
        value={gold}
        onChange={(e) => setGold(Number(e.target.value))}
      />
      <p>
        exp: {exp} {setExp(exp)}
      </p>
      <RangeInput
        max={500}
        inputSize="large"
        value={exp}
        onChange={(e) => setExpr(Number(e.target.value))}
      />

      <p>Сложность задачи</p>
      <Select
        currentStatus={status}
        options={statusOptions}
        onStatusChange={handleStatusChange}
      />
      <Button onClick={() => createHandler()} disabled={loading}>
        {loading ? "⏳ Создание квеста..." : "⚔️ Создать квест"}
      </Button>
    </div>
  );
};

export default CreateModal;
