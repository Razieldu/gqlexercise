import { useState, useEffect, useCallback } from "react";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { useMutation } from "@apollo/client";
import { HANDLE_FAVORITE } from "../../GQL/mutation/mutations";
import { throttle } from "lodash";
import "./MyData.scss";
const MyData = (props) => {
  const [inputShow, setInputShow] = useState({
    0: false,
    1: false,
    2: false,
    3: false,
    4: false,
    5: false,
    6: false,
  });

  const [like, setLike] = useState(false);
  const [handleFavoriteMutation] = useMutation(HANDLE_FAVORITE, {
    onCompleted: (data) => {
      // console.log(data);
      console.log("我的最愛狀態改變"); // 成功回應資料
    },
  });

  const handleInputShow = (index) => {
    if (
      JSON.parse(localStorage.getItem("userData")).username !==
      "s202032808@gmail.com"
    )
      return;
    setInputShow((prev) => {
      let temp = prev;
      let updatedObject = {
        ...temp,
        [index]: !temp[index],
      };
      return updatedObject;
    });
  };

  const throttledHandleFavoriteMutation = useCallback(
    throttle(handleFavoriteMutation, 10000),
    []
  );
  const handleFavorite = async (event, dataId, favorite) => {
    try {
      setLike(() => !like);
      const result = await throttledHandleFavoriteMutation({
        variables: {
          token: JSON.parse(localStorage.getItem("userData"))?.token,
          dataId,
        },
      });
    } catch (error) {
      console.error(error.message);
    }
  };

  let keysArray = Object.keys(props.each).filter((one) => {
    return (
      one !== "id" &&
      one !== "dataId" &&
      one !== "__typename" &&
      one !== "favorite"
    );
  });

  useEffect(() => {
    if (props.each.favorite === true) setLike(true);
  }, []);
  let every = props.each;
  return (
    <div
      className={`myData ${
        props.index % 2 === 0 ? "divideByTwo" : "notDivideByTwo"
      }`}
      key={`${props.index}div${props.index}`}
    >
      <div className="databaseIdTitle">
        <div>資料庫id : {props.each.dataId}</div>
      </div>
      <div className="idTitle">
        <div>id : {props.each.id}</div>
      </div>
      {keysArray.map((one, index) => {
        return (
          <div key={`updatePart${index}`} className="otherInput">
            <div>{`${one}:`}</div>
            {!inputShow[index] && (
              <div
                className="inputNotShow"
                onClick={() => handleInputShow(index)}
                value={every[one]}
              >
                {every[one]}
              </div>
            )}
            {inputShow[index] && (
              <input
                className="inputShow"
                autoFocus
                id={`${props.index}input${props.index}_input`}
                onBlur={() => {
                  handleInputShow(index);
                }}
                onChange={(event) =>
                  props.handleChange(event, every.dataId, every.id, one)
                }
                value={every[one]}
              />
            )}
          </div>
        );
      })}
      <div className="likePart">
        {like ? (
          <FavoriteIcon
            sx={{ color: "red" }}
            onClick={(event) =>
              handleFavorite(event, every.dataId, every.favorite)
            }
          />
        ) : (
          <FavoriteBorderIcon
            onClick={(event) =>
              handleFavorite(event, every.dataId, every.favorite)
            }
          />
        )}
      </div>
    </div>
  );
};

export default MyData;
