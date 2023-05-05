import { useEffect, useState } from "react";
import { gql } from "@apollo/client";
import "./App.css";
import client from "./apollo.js";
function App() {
  const [resultdata, setData] = useState([]);
  // const [apiState, setApiState] = useState("name");
  const [inputValue, setInputValue] = useState("");
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
  let defaultApi="name"
  const fetchData = async (key) => {
    const { data } = await client.query({
      query: gql`
        query {
          userdata {
            ${key}
          }
        }
      `,
    });
    // console.log(errors)
    setData(data.userdata);
  };
  const handleInputValue = (event) => {
    setInputValue(event.target.value);
  };

  const handleAPI = (event) => {
    event.preventDefault()
    if(inputValue==="") return
    fetchData(inputValue);
  };

  useEffect(() => {
    fetchData(defaultApi);
  }, []);
  return (
    <div>
      <form onSubmit={handleAPI}>
        <input
          value={inputValue}
          onChange={handleInputValue}
        />
        <button >search</button>
      </form>
      <ul>
        {resultdata.map((each) => {
          // console.log(each.id)
          for (let key in each) {
            if (key === "__typename") continue;
            return <h1>{each[key]}</h1>;
          }
        })}
        {/* {data} */}
      </ul>
    </div>
  );
}

export default App;
