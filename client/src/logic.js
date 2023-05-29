export const createColumns = (permission) => {
  const heads = [
    "會員屬性",
    "姓名",
    "E-mail",
    "服務單位",
    "職稱",
    "地址",
    "電話",
    "手機",
  ];
  const columns = heads.map((head, index) => {
    const widthChanged = (head) => {
      switch (head) {
        case "姓名":
          return 100;
        case "E-mail":
        case "地址":
          return 200;
        case "職稱":
          return 100;
        default:
          return 150;
      }
    };
    let resultObj = {};
    if (permission) {
      resultObj = {
        field: `col${index + 1}`,
        headerName: head,
        width: widthChanged(head),
        editable: head === "會員屬性" ? false : true,
      };
    } else {
      resultObj = {
        field: `col${index + 1}`,
        headerName: head,
        width: widthChanged(head),
        editable: head === false,
      };
    }
    return resultObj;
  });
  return columns;
};
export const createRow = (data) => {
  let contentData = [];
  for (let i = 0; i < data.length; i++) {
    let temp = [];
    for (let name in data[i]) {
      if (name === "__typename") continue;
      temp.push(data[i][name]);
    }
    contentData.push(temp);
  }
  let resultRow = [];

  for (let i = 0; i < contentData.length; i++) {
    resultRow.push({
      id: `${contentData[i][0]}`,
      col1: `${contentData[i][1]}`,
      col2: `${contentData[i][2]}`,
      col3: `${contentData[i][3]}`,
      col4: `${contentData[i][4]}`,
      col5: `${contentData[i][5]}`,
      col6: `${contentData[i][6]}`,
      col7: `${contentData[i][7]}`,
      col8: `${contentData[i][8]}`,
      // col9: `${contentData[i][8]}`,
      // col10: `${contentData[i][9]}`,
      // col11: `${contentData[i][10]}`,
      // col12: `${contentData[i][11]}`,
      // col13: `${contentData[i][12]}`,
      // col14: `${contentData[i][13]}`,
    });
  }
  // console.log(resultRow)
  return resultRow;
};
