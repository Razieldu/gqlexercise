import React, { useState, useEffect } from "react";
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

  return (
    <div
      style={{
        position: "relative",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        height:"90vh"
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
            top: "50%",
          }}
        >
          <BarLoader color="#36D7B7" loading={loading} />
        </div>
      ) : (
        <DataGrid
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
          density="compact"
          rows={
            createRow(resultdata).length ? createRow(resultdata) : defaultRow
          }
          columns={createColumns(resultdata)}
        />
      )}
      {error && <p>Error {error.message}</p>}
    </div>
  );
};

export default UsersDataForm;
