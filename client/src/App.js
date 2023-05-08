import { useEffect, useState, useReducer } from "react";
import { gql } from "@apollo/client";
import "./App.css";
import client from "./apollo.js";
import { BarLoader } from "react-spinners";

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

const formReducer = (state, action) => {
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
      return initialState
    default:
      throw new Error(`Invalid action type ${action.type}`);
  }
};
function App() {
  const [loading, setLoading] = useState(true);
  const [resultdata, setData] = useState([]);
  const [error, setError] = useState(false);
  // const [apiState, setApiState] = useState("name");
  const [inputValue, setInputValue] = useState("");
  const [formState, dispatchFn] = useReducer(formReducer, initialState);

  // client
  //   .query({
  //     query: gql`
  //       query {
  //         getData {
  //           name
  //         }
  //       }
  //     `,
  //   })
  //   .then((result) => {
  //     console.log(result);
  //     setData(result.data.getData);
  //   })
  //   .catch((error) => console.log(error));
  let defaultApi = "name";
  const fetchData = async (key) => {
    const {
      loading: queryLoading,
      errors,
      data,
    } = await client.query({
      query: gql`
        query {
          userdata {
            ${key}
          }
        }
      `,
    });
    // console.log(errors)
    let dealedData = data.userdata.slice(0, 5);
    setData(dealedData);
    setLoading(queryLoading);
    setError(errors);
  };
  const handleInputValue = (event) => {
    setInputValue(event.target.value);
  };

  const handleAPI = (event) => {
    event.preventDefault();
    setLoading(true);
    if (inputValue === "") return;
    fetchData(inputValue);
  };

  useEffect(() => {
    fetchData(defaultApi);
  }, [defaultApi]);

  const handleFormSubmit = (event, formState) => {
    event.preventDefault();
    for (let key in formState) {
      if (formState[key] === "") return;
    }
    dispatchFn({type:"reset"})
    console.log(formState);
  };

  return (
    <div
      style={{
        position: "relative",
        display: "flex",
        justifyContent: "center",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <form onSubmit={handleAPI}>
        <input value={inputValue} onChange={handleInputValue} />
        <button>Search</button>
      </form>

      {loading ? (
        <div
          className="loading-container"
          style={{
            height: "100vh",
            display: "flex",
            alignItems: "center",
            position: "absolute",
            zIndex: "100",
            top: "50%",
          }}
        >
          <BarLoader color="#36D7B7" loading={loading} />
        </div>
      ) : (
        <div>
          {resultdata.map((each, index) => {
            for (let key in each) {
              if (key === "__typename") continue;
              return <h1 key={`${each[key]}${index}77`}>{each[key]}</h1>;
            }
          })}
        </div>
      )}

      {error && <p>Error {error.message}</p>}
      <div style={{ position: "absolute", top: "65vh", width: "300px" }}>
        <form onSubmit={(event)=>handleFormSubmit(event,formState)}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <label>單位</label>
            <input
              onChange={(e) =>
                dispatchFn({ type: "id", payload: e.target.value })
              }
              value={formState.id}
            />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <label>姓名</label>
            <input
              onChange={(e) =>
                dispatchFn({ type: "name", payload: e.target.value })
              }
              value={formState.name}
            />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <label>E-mail</label>
            <input
              onChange={(e) =>
                dispatchFn({ type: "email", payload: e.target.value })
              }
              value={formState.email}
            />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <label>工作單位</label>
            <input
              onChange={(e) =>
                dispatchFn({ type: "workplace", payload: e.target.value })
              }
              value={formState.workplace}
            />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <label>工作職稱</label>
            <input
              onChange={(e) =>
                dispatchFn({ type: "worktitle", payload: e.target.value })
              }
              value={formState.worktitle}
            />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <label>地址</label>
            <input
              onChange={(e) =>
                dispatchFn({ type: "address", payload: e.target.value })
              }
              value={formState.address}
            />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <label>電話</label>
            <input
              onChange={(e) =>
                dispatchFn({ type: "tel", payload: e.target.value })
              }
              value={formState.tel}
            />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <label>手機</label>
            <input
              onChange={(e) =>
                dispatchFn({ type: "mobilephone", payload: e.target.value })
              }
              value={formState.mobilephone}
            />
          </div>
          <div
            style={{
              width: "300px",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <button>送出</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default App;
