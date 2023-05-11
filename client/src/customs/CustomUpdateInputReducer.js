import { useReducer } from "react";

let initialState = {
  dataId:"",
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
    case "dataId":
      return { ...state, dataId: action.payload };
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

const CustomUpdateInputReducer = () => {
  const [state, dispatch] = useReducer(addFormReducer, initialState);
  // return{state,dispatch}
  return [state, dispatch];
};

export default CustomUpdateInputReducer;
