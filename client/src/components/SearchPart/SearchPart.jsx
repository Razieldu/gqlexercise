import { useState, useContext, useCallback } from "react";
import DeletePart from "../DeletePart/DeletePart";
import { throttle } from "lodash";
import { handleSearchDataContext } from "../../store/handleSearchContextApi";
import MyData from "../MyData/MyData";
import "./SearchPart.scss";
const SearchPartandDeletePart = () => {
  const [targetSearchInput, setTargetSearchInput] = useState("");
  const ctx = useContext(handleSearchDataContext);

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
            delete updateObject.favorite;
            console.log(updateObject);
            readyToUpdateArray[i] = updateObject;
            throttleInputChangeHandle(updateObject, dataId);
            return readyToUpdateArray;
          }
        }
      }
    });
  };
  return (
    <div className="searchPart">
      <h1>查詢符合條件的資料</h1>
      <form
        onSubmit={(event) =>
          handleTargetSearchFormSubmit(event, targetSearchInput)
        }
      >
        <div className="inputAndButton">
          <input value={targetSearchInput} onChange={handleTargetSearch} />
          <button>查找</button>
        </div>
        <div
          className={`renderGetDataPart ${
            ctx.searchDataValue.length === 1 ? "lengthOne" : "lengthNotOne"
          }`}
        >
          {ctx.searchDataValue.map((each, index) => {
            return (
              <MyData
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
