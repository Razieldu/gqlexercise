import { useState } from "react";
import { SEARCH_USERS_QUERY } from "../GQL/query/query";
import client from "../apollo.js";
import DeletePart from "./DeletePart";

const SearchPartandDeletePart = () => {
  const [targetSearchInput, setTargetSearchInput] = useState("");
  const [targetSearchData, setTargetSearchData] = useState([]);
  async function searchUsers(searchTerm) {
    // console.log(`${searchTerm} searchTerm`);
    try {
      const { data } = await client.query({
        query: SEARCH_USERS_QUERY,
        variables: { searchTerm },
      });
      setTargetSearchData(data.searchUsers);
    } catch (error) {
      console.error(error);
    }
  }

  const handleTargetSearchFormSubmit = (event, value) => {
    event.preventDefault();
    if (value === "") return;
    searchUsers(value);
    setTargetSearchInput("");
    // console.log(targetSearchData)
  };
  const handleTargetSearch = (event) => {
    setTargetSearchInput(event.target.value);
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        position: "absolute",
        top: "170vh",
        width: "300px",
        minHeight: "300px",
        flexDirection: "column",
      }}
    >
      <h1>查詢符合條件的資料</h1>
      <form
        onSubmit={(event) =>
          handleTargetSearchFormSubmit(event, targetSearchInput)
        }
      >
        <input value={targetSearchInput} onChange={handleTargetSearch} />
        <button>查找</button>
        {targetSearchData.map((each, index) => {
          console.log(each);
          return (
            <div
              style={{
                paddingBottom: "140px",
                backgroundColor: index % 2 === 0 ? "white" : "silver",
              }}
              key={`${index}${each}${index}`}
            >
              <p>資料庫id:{each.dataId}</p>
              <p>id:{each.id}</p>
              <p>name:{each.name}</p>
              <p>email:{each.email}</p>
              <p>workplace:{each.workplace}</p>
              <p>worktitle:{each.worktitle}</p>
              <p>address:{each.address}</p>
              <p>tel:{each.tel}</p>
              <p>mobilephone:{each.mobilephone}</p>
            </div>
          );
        })}
      </form>
      <DeletePart />
    </div>
  );
};

export default SearchPartandDeletePart;
