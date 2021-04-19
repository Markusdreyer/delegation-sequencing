import React, { useState } from "react";
import MaterialTable from "material-table";
import { useSelector, useDispatch } from "react-redux";
import { addTableData } from "../actions";

const Table = () => {
  const currentProcedure = useSelector((state: any) => state.currentProcedure);
  const tableData = useSelector((state: any) => state.tableData);

  const dispatch = useDispatch();

  const [columns, setColumns]: any = useState([
    { title: "Action", field: "action" },
    {
      title: "Agents",
      field: "agents",
    },
    {
      title: "Quantity",
      field: "quantity",
    },
    {
      title: "Abbreviation",
      field: "abbreviation",
      lookup: {
        a: "a",
        b: "b",
        c: "c",
        d: "d",
        e: "e",
        f: "f",
        g: "g",
        h: "h",
        i: "i",
        j: "j",
        k: "k",
        l: "l",
        m: "m",
        n: "n",
      },
    },

    {
      title: "Precedence",
      field: "precedence",
      lookup: {
        None: "None",
        a: "a",
        b: "b",
        c: "c",
        d: "d",
        e: "e",
        f: "f",
        g: "g",
        h: "h",
        i: "i",
        j: "j",
        k: "k",
        l: "l",
        m: "m",
        n: "n",
      },
    },
  ]);

  return (
    <MaterialTable
      title={currentProcedure}
      columns={columns}
      data={tableData[currentProcedure]}
      cellEditable={{
        cellStyle: {},
        onCellEditApproved: (newValue, oldValue, rowData, columnDef) => {
          return new Promise((resolve: any, reject) => {
            setTimeout(() => {
              console.log(rowData);
              console.log(columnDef);
              const dataUpdate = [...tableData[currentProcedure]];
              dataUpdate[rowData.tableData.id][columnDef.field!] = newValue;
              resolve();
            }, 1000);
          });
        },
      }}
      editable={{
        onRowAdd: (newData) =>
          new Promise((resolve: any, reject) => {
            setTimeout(() => {
              const dataUpdate = [...tableData[currentProcedure]];
              dataUpdate.push(newData);
              dispatch(
                addTableData({
                  ...tableData,
                  [currentProcedure]: [...dataUpdate],
                })
              );

              resolve();
            }, 1000);
          }),
        onRowUpdate: (newData, oldData: any) =>
          new Promise((resolve: any, reject) => {
            setTimeout(() => {
              const dataUpdate = [...tableData[currentProcedure]];
              const index = oldData.tableData.id;
              dataUpdate[index] = newData;
              dispatch(
                addTableData({
                  ...tableData,
                  [currentProcedure]: [...dataUpdate],
                })
              );

              resolve();
            }, 1000);
          }),
        onRowDelete: (oldData: any) =>
          new Promise((resolve: any, reject) => {
            setTimeout(() => {
              const dataDelete = [...tableData[currentProcedure]];
              const index = oldData.tableData.id;
              dataDelete.splice(index, 1);
              dispatch(
                addTableData({
                  ...tableData,
                  [currentProcedure]: [...dataDelete],
                })
              );

              resolve();
            }, 1000);
          }),
      }}
    />
  );
};

export default Table;
