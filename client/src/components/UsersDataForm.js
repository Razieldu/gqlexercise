import React, { useState, useEffect, useContext } from "react";
import { BarLoader } from "react-spinners";
import { getQuery } from "../GQL/query/query";
import {
  DataGrid,
  GridToolbarColumnsButton,
  GridToolbarContainer,
  GridToolbarExport,
  GridToolbarDensitySelector,
} from "@mui/x-data-grid";
import { createColumns, createRow } from "../logic";
import client from "../apollo";
import { handleSearchDataContext } from "../store/handleSearchContextApi";
let defaultRow = [
  {
    id: 1,
    col1: "",
    col2: "",
    col3: "",
    col4: "查無資料",
    col5: "",
    col6: "",
    col7: "",
    col8: "",
  },
];

const CustomToolBar = () => {
  return (
    <GridToolbarContainer>
      <GridToolbarColumnsButton />
      <GridToolbarDensitySelector />
      <GridToolbarExport
        csvOptions={{
          utf8WithBom: true,
          fileName: `會員資料_${new Date().toLocaleString()}`,
        }}
        printOptions={{
          disableToolbarButton: true,
        }}
      ></GridToolbarExport>
    </GridToolbarContainer>
  );
};

const UsersDataForm = () => {
  const [loading, setLoading] = useState(true);
  const [resultdata, setData] = useState([]);
  const [error, setError] = useState(false);
  const [rowState, setRowState] = useState([]);
  const [columnState, setColumnState] = useState([]);
  const { updateDateBaseFn } = useContext(handleSearchDataContext);
  const fetchData = async () => {
    const {
      loading: queryLoading,
      errors,
      data,
    } = await client.query({
      query: getQuery,
    });
    let datalength = data.userdata.length;
    let dealedData = data.userdata.slice(datalength - 6, datalength);
    setData(() => dealedData);
    setLoading(queryLoading);
    setError(errors);
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    setRowState();
    setColumnState(createColumns(resultdata));
    setRowState(
      createRow(resultdata).length ? createRow(resultdata) : defaultRow
    );
  }, [resultdata]);

  // const handleRowEditStart = (params, event) => {
  //   event.defaultMuiPrevented = true;
  // };

  // const handleRowEditStop = (params, event) => {
  //   event.defaultMuiPrevented = true;
  // };
  const handleCellEditCommit = (newRow) => {
    const updatedRow = { ...newRow, isNew: false };
    console.log(updatedRow);
    setRowState(() => {
      return rowState.map((row) => (row.id === newRow.id ? updatedRow : row));
    });
    delete updatedRow["isNew"];
    let dataBaseFormat = {
      dataId: updatedRow["id"],
      id: updatedRow["col1"],
      name: updatedRow["col2"],
      email: updatedRow["col3"],
      workplace: updatedRow["col4"],
      worktitle: updatedRow["col5"],
      address: updatedRow["col6"],
      tel: updatedRow["col7"],
      mobilephone: updatedRow["col8"],
    };
    updateDateBaseFn(dataBaseFormat,dataBaseFormat.dataId);
    return updatedRow;
  };

  return (
    <div
      style={{
        position: "relative",
        display: "flex",
        justifyContent: "flex-start",
        alignItems: "center",
        flexDirection: "column",
        height: "90vh",
      }}
    >
      <h1>向資料庫要資料並顯示</h1>
      {loading ? (
        <div
          className="loading-container"
          style={{
            height: "100vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            position: "absolute",
            zIndex: "100",
            paddingTop: `${loading ? "200px" : "0px"}`,
            top: "-30%",
          }}
        >
          <BarLoader color="#36D7B7" loading={loading} />
        </div>
      ) : (
        <DataGrid
          // onRowEditStart={handleRowEditStart}
          // onRowEditStop={handleRowEditStop}
          processRowUpdate={handleCellEditCommit}
          onProcessRowUpdateError={(error) => {
            // 处理行更新错误的逻辑
            console.error("行更新错误:", error);
          }}
          slots={{ toolbar: CustomToolBar }}
          sx={{
            m: 3,
            fontWeight: "400",
            fontSize: "16px",
            boxShadow: 2,
            border: 2,
            borderColor: "silver",
            "& .MuiDataGrid-cell:hover": {
              color: "primary.main",
            },
          }}
          density="standard"
          rows={rowState}
          columns={columnState}
        />
      )}
      {error && <p>Error {error.message}</p>}
    </div>
  );
};

export default UsersDataForm;
