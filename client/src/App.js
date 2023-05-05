import { useEffect, useState } from "react";
import { gql } from "@apollo/client";
import "./App.css";
import client from "./apollo.js";
import { BarLoader } from 'react-spinners';
function App() {
  const [loading, setLoading] = useState(true);
  const [resultdata, setData] = useState([]);
  const [error,setError] =useState(false)
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
    const { loading: queryLoading, error,data } = await client.query({
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
    setLoading(queryLoading)
    setError(error)
  };
  const handleInputValue = (event) => {
    setInputValue(event.target.value);
  };

  const handleAPI = (event) => {
    event.preventDefault()
    setLoading(true)
    if(inputValue==="") return
    fetchData(inputValue);
  };

  useEffect(() => {
    fetchData(defaultApi);
  }, [defaultApi]);


  return (
    <div style={{position:"relative",display:"flex",justifyContent:"center",flexDirection:"column",alignItems:"center"}}>
    <form onSubmit={handleAPI}>
      <input value={inputValue} onChange={handleInputValue} />
      <button>Search</button>
    </form>

    {loading ? (
      <div className="loading-container"style={{height:"100vh",display:"flex",alignItems:"center",position:"absolute",zIndex:"100",top:"50%"}} >
        <BarLoader color="#36D7B7" loading={loading} />
      </div>
    ) : (
      <div>
        {resultdata.map((each) => {
          for (let key in each) {
            if (key === "__typename") continue;
            return <h1>{each[key]}</h1>;
          }
        })}
      </div>
    )}
    {error && <p>Error {error.message}</p>}
  </div>
  );
}

export default App;
