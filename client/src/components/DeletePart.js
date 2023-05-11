import { useState} from "react";
import { useMutation } from "@apollo/client";
import {
  DELETE_USER_MUTATION,
} from "../GQL/mutation/mutations";

const DeletePart = () => {
  const [deleteInput, setDeleteInput] = useState("");
  const handleDeleteInput = (event) => {
    setDeleteInput(event.target.value);
  };
  const handledelete = (event, value) => {
    if (value === "") return;
    event.preventDefault();
    deleteUserMutation({
      variables: {
        deleteUserId: value,
      },
    })
      .then((result) => console.log(result))
      .catch((error) => console.error(error));
  };

  const [deleteUserMutation] = useMutation(DELETE_USER_MUTATION, {
    onCompleted: (data) => {
      console.log(data);
      alert("成功刪除資料"); // 成功回應資料
    },
  });

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        position: "fixed",
        bottom: "10px",
        width: "300px",
        flexDirection: "column",
        backgroundColor: "pink",
        paddingBottom: "40px",
        height: "100px",
      }}
    >
      <h1>刪除區塊</h1>
      <form onSubmit={(event) => handledelete(event, deleteInput)}>
        <input value={deleteInput} onChange={handleDeleteInput} />
        <button>刪除</button>
      </form>
    </div>
  );
};

export default DeletePart;
