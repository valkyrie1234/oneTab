import React, { useState } from "react";
import Input from "../../uiKit/Input/Input";
import Select from "../../uiKit/Select/Select";
import { statusOptions } from "../../Consts/options";
import { DifficultyStatus } from "../../Consts/status";
import useTasksStore from "../../store/storeTasks";
import styles from "./CreateModal.module.css";
import Button from "../../uiKit/Button/Button";
import RangeInput from "../../uiKit/RangeInput/RangeInput";
import useReward from "../../hooks/useReward";
import { v4 as uuidv4 } from "uuid";

const CreateModal = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<DifficultyStatus>("easy");
  const [gold, setGold] = useState(0);
  const [exp, setExpr] = useState(0);
  const [expiredDate, setExpiredDate] = useState<string>("");

  const { createTask } = useTasksStore();
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

  const createHandler = () => {
    if (!title || !status || !description) return;

    // Парсим дату окончания, если она указана
    let parsedExpiredDate: Date | null = null;
    if (expiredDate) {
      const date = new Date(expiredDate);
      if (!isNaN(date.getTime())) {
        parsedExpiredDate = date;
      }
    }

    createTask({
      id: uuidv4(),
      boardId: 0,
      title: title,
      status: status,
      description: description,
      dateCreate: new Date(),
      expiredDate: parsedExpiredDate,
      reward: {
        gold: gold,
        exp: exp,
      },
    });
    setTitle("");
    setDescription("");
    setStatus("easy");
    setExpr(0);
    setGold(0);
    setExpiredDate("");
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
      <Button onClick={() => createHandler()}>Создать квест</Button>
    </div>
  );
};

export default CreateModal;
