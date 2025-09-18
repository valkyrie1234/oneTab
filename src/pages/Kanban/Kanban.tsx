import React from "react";
import styles from "./Kanban.module.css";
import Board from "../../Components/Board/Board";
import useBoardsStore from "../../store/storeBoards";
import useTasksStore from "../../store/storeTasks";
import useExpiredTasksChecker from "../../hooks/useExpiredTasksChecker";
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

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    setActiveId(null);

    if (!over || !active) {
      return;
    }

    const taskId = active.id as string;
    const newBoardId = over.id as number;

    // Перемещаем задачу на новую доску
    if (!isNaN(newBoardId)) {
      moveTask(taskId, newBoardId);
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
          {boards
            ?.filter((board) => board.id === 0)
            .map((board) => (
              <div key={board.id} className={styles.allTasksSection}>
                <Board id={board.id} title={board.title} emoji={board.emoji} />
              </div>
            ))}

          <div className={styles.kanbanBoardsContainer}>
            {boards
              ?.filter((board) => board.id !== 0)
              .map((board) => (
                <Board
                  id={board.id}
                  title={board.title}
                  emoji={board.emoji}
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
