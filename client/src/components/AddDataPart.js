import { useReducer } from "react";
import { ADD_USER_MUTATION } from "../GQL/mutation/mutations";
import { useMutation } from "@apollo/client";

let initialState = {
  id: "",
  name: "",
  email: "",
  workplace: "",
  worktitle: "",
  address: "",
  tel: "",
  mobilephone: "",
};

const addFormReducer = (state, action) => {
  switch (action.type) {
    case "id":
      return { ...state, id: action.payload };
    case "name":
      return { ...state, name: action.payload };
    case "email":
      return { ...state, email: action.payload };
    case "workplace":
      return { ...state, workplace: action.payload };
    case "worktitle":
      return { ...state, worktitle: action.payload };
    case "address":
      return { ...state, address: action.payload };
    case "tel":
      return { ...state, tel: action.payload };
    case "mobilephone":
      return { ...state, mobilephone: action.payload };
    case "reset":
      return initialState;
    default:
      throw new Error(`Invalid action type ${action.type}`);
  }
};

const AddDataPart = () => {
  const [formState, dispatchFn] = useReducer(addFormReducer, initialState);

  // const [addUserMutation, { sendLoading, sendDataError, sendData }] =
  const [addUserMutation] = useMutation(ADD_USER_MUTATION, {
    onCompleted: (data) => {
      // console.log(data);
      alert("成功新增資料"); // 成功回應資料
    },
  });

  const handleFormSubmit = (event, formState) => {
    event.preventDefault();
    if (Object.keys(formState).some((key) => formState[key] === "")) return;
    dispatchFn({ type: "reset" });
    addUserMutation({
      variables: {
        userInput: formState,
      },
    })
      .then((result) => console.log(result))
      .catch((error) => console.error(error));
    // console.log(formState);
  };

  let labels = [
    "單位",
    "姓名",
    "E-mail",
    "工作單位",
    "工作職稱",
    "地址",
    "電話",
    "手機",
  ];
  let types = [
    "id",
    "name",
    "email",
    "workplace",
    "worktitle",
    "address",
    "tel",
    "mobilephone",
  ];
  return (
    <div style={{ position: "absolute", top: "70vh", width: "300px" }}>
      <form onSubmit={(event) => handleFormSubmit(event, formState)}>
        <h1 style={{ textAlign: "center" }}>添加資料到資料庫</h1>
        {labels.map((eachLabel, index) => {
          return (
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <label>{eachLabel}</label>
              <input
                onChange={(e) =>
                  dispatchFn({ type: types[index], payload: e.target.value })
                }
                value={formState[types[index]]}
              />
            </div>
          );
        })}
        <div
          style={{
            width: "300px",
            display: "flex",
            justifyContent: "center",
            paddingTop: "20px",
          }}
        >
          <button>送出</button>
        </div>
      </form>
    </div>
  );
};

export default AddDataPart;
