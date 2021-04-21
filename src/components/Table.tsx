import { useState } from "react";
import MaterialTable from "material-table";
import { useSelector, useDispatch } from "react-redux";
import { setTableData } from "../actions";
import { State } from "../types";

const Table = () => {
  const currentProcedure = useSelector(
    (state: State) => state.currentProcedure
  );
  const tableData = useSelector((state: State) => state.tableData);

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
        onCellEditApproved: (newValue, oldValue, rowData: any, columnDef) => {
          return new Promise((resolve: any, reject) => {
            setTimeout(() => {
              const dataUpdate = [...tableData[currentProcedure]] as any; //This is pretty weird, but it works
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
              dispatch(setTableData(currentProcedure, dataUpdate));
              resolve();
            }, 1000);
          }),
        onRowUpdate: (newData, oldData: any) =>
          new Promise((resolve: any, reject) => {
            setTimeout(() => {
              const dataUpdate = [...tableData[currentProcedure]];
              const index = oldData.tableData.id;
              dataUpdate[index] = newData;
              dispatch(setTableData(currentProcedure, dataUpdate));

              resolve();
            }, 1000);
          }),
        onRowDelete: (oldData: any) =>
          new Promise((resolve: any, reject) => {
            setTimeout(() => {
              const dataDelete = [...tableData[currentProcedure]];
              const index = oldData.tableData.id;
              dataDelete.splice(index, 1);
              dispatch(setTableData(currentProcedure, dataDelete));
              resolve();
            }, 1000);
          }),
      }}
    />
  );
};

export default Table;
