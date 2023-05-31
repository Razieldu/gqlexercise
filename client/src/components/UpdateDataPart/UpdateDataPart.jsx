import CustomUpdateInputReducer from "../../customs/CustomUpdateInputReducer";
import { useMutation } from "@apollo/client";
import { UPDATE_USER_MUTATION } from "../../GQL/mutation/mutations";
import "./UpdateDataPart.scss";
const UpdateDataPart = () => {
  const [formState, dispatchFn] = CustomUpdateInputReducer();
  let labels = [
    "資料庫id",
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
    "dataId",
    "id",
    "name",
    "email",
    "workplace",
    "worktitle",
    "address",
    "tel",
    "mobilephone",
  ];
  const [updateUserMutation] = useMutation(UPDATE_USER_MUTATION, {
    onCompleted: (data) => {
      // console.log(data);
      alert("成功更新資料"); // 成功回應資料
    },
  });

  const handleFormSubmit = (event, formState) => {
    event.preventDefault();
    console.log(formState);
    dispatchFn({ type: "reset" });
    updateUserMutation({
      variables: {
        updateUserInput: formState,
        dataId: formState.dataId,
      },
    })
      .then((result) => console.log(result))
      .catch((error) => {
        console.error(error.message);
        alert(error.message);
      });
    console.log(formState);
  };

  return (
    <div className="updateDataPart">
      <form onSubmit={(event) => handleFormSubmit(event, formState)}>
        <h1 className="title">更新資料</h1>
        {labels.map((eachLabel, index) => {
          return (
            <div
              key={`${types[index]}_${labels[index]}`}
              className="contentAndInputDiv"
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
        <div className="button">
          <button>送出</button>
        </div>
      </form>
    </div>
  );
};

export default UpdateDataPart;
