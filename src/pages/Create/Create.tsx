import styles from './Create.module.css'
import CreateModal from "../../Components/CreateModal/CreateModal";



const Create = () => {

  return (
    <div className={styles.CreatePage}>
      <h1>Create Page for the Wizard (admin) </h1>
      <CreateModal />
    </div>
  );
};

export default Create;
