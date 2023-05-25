import CustomInputReducer from "../customs/CustomAddInputReducer";
import { ADD_USER_MUTATION } from "../GQL/mutation/mutations";
import { useMutation } from "@apollo/client";

const AddDataPart = () => {
  // const { state: formState, dispatch: dispatchFn } = CustomInputReducer();
  const [formState, dispatchFn] = CustomInputReducer();
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
      .catch((error) => {
        console.error(error.message);
        alert(error.message);
      });
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
    <div
      style={{
        position: "absolute",
        top: "115vh",
        width: "300px",
        backgroundColor: "silver",
        padding: "20px",
      }}
    >
      <form onSubmit={(event) => handleFormSubmit(event, formState)}>
        <h1 style={{ textAlign: "center" }}>添加資料到資料庫</h1>
        {labels.map((eachLabel, index) => {
          return (
            <div
              key={`${types[index]}_${labels[index]}`}
              style={{ display: "flex", justifyContent: "space-between" }}
            >
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
