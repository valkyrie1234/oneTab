import React from "react";
import styles from "./Kanban.module.css";
import Board from "../../Components/Board/Board";
import useBoardsStore from "../../store/storeBoards";
import useTasksStore from "../../store/storeTasks";
import useNotificationStore from "../../store/storeNotifications";
import useExpiredTasksChecker from "../../hooks/useExpiredTasksChecker";
import { TasksAPI } from "../../api/client";
import {
  DndContext,
  DragEndEvent,
  DragStartEvent,
  MouseSensor,
  useSensor,
  useSensors,
  closestCenter,
  DragOverlay,
} from "@dnd-kit/core";

const Kanban = () => {
  const boards = useBoardsStore((state) => state.boards);
  const { moveTask, tasks } = useTasksStore();
  const addNotification = useNotificationStore((state) => state.addNotification);
  
  // Разделяем доски
  const allTasksBoard = boards.find(b => b.name === 'all tasks');
  const otherBoards = boards.filter(b => b.name !== 'all tasks').sort((a, b) => a.order - b.order);
  
  // Debug
  React.useEffect(() => {
    console.log('📋 Kanban render - Boards count:', boards.length);
    console.log('📋 All Tasks board:', allTasksBoard);
    console.log('📋 Other boards:', otherBoards);
  }, [boards]);
  
  // Автоматически проверяем просроченные задачи
  useExpiredTasksChecker();

  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 5,
      },
    })
  );

  const [activeId, setActiveId] = React.useState<string | null>(null);

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    setActiveId(null);

    if (!over || !active) {
      return;
    }

    const taskId = active.id as string;
    const newBoardId = over.id as string;  // UUID строка
    
    // Находим задачу и старую доску
    const task = tasks.find(t => t.id === taskId);
    const oldBoardId = task?.boardId;
    
    // Если доска не изменилась, ничего не делаем
    if (oldBoardId === newBoardId) {
      return;
    }

    // Находим имена досок для уведомления
    const newBoard = boards.find(b => b.id === newBoardId);
    const boardName = newBoard?.name || 'unknown';
    
    console.log('🎯 DragEnd event:', { taskId, oldBoardId, newBoardId, boardName });

    // Оптимистичное обновление UI
    await moveTask(taskId, newBoardId);

    // Синхронизация с backend
    try {
      const response = await TasksAPI.update(taskId, { boardId: newBoardId }) as { success: boolean };
      
      if (response.success) {
        console.log('✅ Задача синхронизирована с backend');
        
        // Уведомление об успехе
        addNotification(
          "info",
          `Квест перемещен в "${boardName}"`,
          "📦",
          3000
        );
      } else {
        // Откат изменений при ошибке
        if (oldBoardId) {
          await moveTask(taskId, oldBoardId);
        }
        
        addNotification(
          "error",
          "Не удалось синхронизировать квест с сервером",
          "☠️",
          5000
        );
      }
    } catch (error) {
      console.error('❌ Ошибка синхронизации:', error);
      
      // Откат изменений
      if (oldBoardId) {
        await moveTask(taskId, oldBoardId);
      }
      
      addNotification(
        "error",
        "Не удалось синхронизировать квест с сервером",
        "☠️",
        5000
      );
    }
  };

  const activeTask = tasks.find((task) => task.id === activeId);

  return (
    <DndContext
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      sensors={sensors}
      collisionDetection={closestCenter}
    >
      <div className={styles.trelloContainer}>
        <div className={styles.allBoardsContainer}>
          {/* All Tasks - отдельная большая доска */}
          {allTasksBoard && (
            <div className={styles.allTasksSection}>
              <Board {...allTasksBoard} title={allTasksBoard.name} />
            </div>
          )}

          {/* Остальные доски (start, in progress, victory, defeat) */}
          <div className={styles.kanbanBoardsContainer}>
            {otherBoards.map((board) => (
              <Board
                {...board}
                title={board.name}
                key={board.id}
              />
            ))}
          </div>
        </div>
      </div>

      <DragOverlay>
        {activeTask ? (
          <div className={styles.dragOverlay}>
            <div className={styles.dragOverlayContent}>{activeTask.title}</div>
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};

export default Kanban;
