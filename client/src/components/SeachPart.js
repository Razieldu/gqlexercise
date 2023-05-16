import { useState, useContext, useCallback } from "react";
// import { SEARCH_USERS_QUERY } from "../GQL/query/query";
// import client from "../apollo.js";
import DeletePart from "./DeletePart";
import MyInput from "./MyInput";
import { throttle } from "lodash";
import { handleSearchDataContext } from "../store/handleSearchContextApi";
const SearchPartandDeletePart = () => {
  const [targetSearchInput, setTargetSearchInput] = useState("");
  // const [targetSearchData, setTargetSearchData] = useState([]);
  // const [saveSearchData, setSaveSearchData] = useState([]);
  const ctx = useContext(handleSearchDataContext);

  // async function searchUsers(searchTerm) {
  //   // console.log(`${searchTerm} searchTerm`);
  //   try {
  //     const { data } = await client.query({
  //       query: SEARCH_USERS_QUERY,
  //       variables: { searchTerm },
  //     });
  //     setTargetSearchData(data.searchUsers);
  //     setSaveSearchData(data.searchUsers);
  //   } catch (error) {
  //     console.error(error);
  //   }
  // }

  const handleTargetSearchFormSubmit = (event, value) => {
    event.preventDefault();
    if (value === "") return;
    ctx.searchUsersFn(value);
    setTargetSearchInput("");
  };
  const handleTargetSearch = (event) => {
    setTargetSearchInput(event.target.value);
  };

  const throttleInputChangeHandle = useCallback(
    throttle((updateObject, dataId) => {
      console.log(updateObject, dataId);
      ctx.updateDateBaseFn(updateObject, dataId);
    }, 10000),
    []
  );

  const inputChangeHandle = (event, dataId, id, key) => {
    let changeValue = event.target.value;
    let updateObject;
    ctx.setSearchDataValue(() => {
      let readyToUpdateArray = [...ctx.searchDataValue];
      for (let i = 0; i < ctx.searchDataValue.length; i++) {
        for (let keykey in ctx.searchDataValue[i]) {
          let tempObj = ctx.searchDataValue[i];
          if (keykey === "id" && tempObj[keykey] === id) {
            updateObject = { ...tempObj, [key]: changeValue };
            delete updateObject.__typename;
            readyToUpdateArray[i] = updateObject;
            throttleInputChangeHandle(updateObject, dataId);
            return readyToUpdateArray;
          }
        }
      }
    });
  };
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        position: "absolute",
        top: "195vh",
        width: "500px",
        minHeight: "300px",
        flexDirection: "column",
        gap: "10px",
      }}
    >
      <h1>查詢符合條件的資料</h1>
      <form
        onSubmit={(event) =>
          handleTargetSearchFormSubmit(event, targetSearchInput)
        }
      >
        <div style={{ display: "flex", justifyContent: "center" }}>
          <input value={targetSearchInput} onChange={handleTargetSearch} />
          <button>查找</button>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              ctx.searchDataValue.length === 1 ? "1fr" : "1fr 1fr 1fr",
            paddingTop: "40px",
          }}
        >
          {ctx.searchDataValue.map((each, index) => {
            return (
              <MyInput
                key={each.dataId}
                each={each}
                index={index}
                handleChange={inputChangeHandle}
              />
            );
          })}
        </div>
      </form>
      <DeletePart />
    </div>
  );
};

export default SearchPartandDeletePart;
