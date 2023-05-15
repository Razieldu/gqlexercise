import { useState } from "react";

const MyInput = (props) => {
  const [inputShow, setInputShow] = useState({
    0: false,
    1: false,
    2: false,
    3: false,
    4: false,
    5: false,
    6: false,
  });

  const handleInputShow = (index) => {
   
    setInputShow((prev) => {
      let temp = prev;
      let updatedObject = {
        ...temp,
        [index]: !temp[index],
      };
      return updatedObject;
    });
  };
  let keysArray = Object.keys(props.each).filter((one) => {
    return one !== "id" && one !== "dataId" && one !== "__typename";
  });
  return (
    <div
      style={{
        padding:"40px 40px 140px 40px ",
        backgroundColor: props.index % 2 === 0 ? "white" : "silver",
      }}
      key={`${props.index}div${props.index}`}
    >

      <div style={{ display: "flex", justifyContent: "flex-start" }}>
        <div>資料庫id:{props.each.dataId}</div>
      </div>
      <div style={{ display: "flex", justifyContent: "flex-start" }}>
        <div>id:{props.each.id}</div>
      </div>
      {keysArray.map((one, index) => {
        let every = props.each;
        return (
          <div style={{ display: "flex", justifyContent: "flex-start" }}>
            <div>{`${one}:`}</div>
            {!inputShow[index] && (
              <div
                onClick={() => handleInputShow(index)}
                style={{ width: "100%" }}
                value={every[one]}
              >
                {every[one]}
              </div>
            )}
            {inputShow[index] && (
              <input
                autoFocus
                id={`${props.index}input${props.index}_input`}
                style={{ textAlign: "left",backgroundColor:"pink" }}
                onBlur={() => { handleInputShow(index)}}
                onChange={(event) =>
                  props.handleChange(event, every.dataId, every.id, one)
                }
                value={every[one]}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default MyInput;
