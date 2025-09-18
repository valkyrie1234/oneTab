import React, { useState } from "react";
import styles from "./AllTaskList.module.css";
import TaskCard from "../TaskCard/TaskCard";
import Pagination from "../../uiKit/Pagination/Pagination";
import useTasksStore from "../../store/storeTasks";

const AllTaskList = () => {
  const { tasks } = useTasksStore();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  
  // Фильтруем только задачи, которые находятся в All Tasks (boardId === 0)
  const allTasks = tasks.filter(task => task.boardId === 0);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = allTasks.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <>
      <div className={styles.allTasks}>
        {currentItems.map((task) => (
          <TaskCard
            key={task.id}
            id={task.id}
            description={task.description}
            status={task.status}
            title={task.title}
            reward={task.reward}
          />
        ))}
      </div>
      {allTasks.length <= 6 ? (
        ""
      ) : (
        <Pagination
          totalItems={allTasks.length}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
        />
      )}
    </>
  );
};

export default AllTaskList;
