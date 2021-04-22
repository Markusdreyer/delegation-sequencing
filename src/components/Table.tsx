import { useState } from "react";
import MaterialTable from "material-table";
import { useSelector, useDispatch } from "react-redux";
import { setTableData } from "../actions";
import { State } from "../types";
import { procedureColumns, taxonomyColumns } from "../utils/TableColumns";

const Table = () => {
  const tableData = useSelector((state: State) => state.tableData);

  const dispatch = useDispatch();

  const [columns, setColumns]: any = useState(procedureColumns);

  return (
    <MaterialTable
      title={tableData.key}
      columns={columns}
      data={tableData.contents}
      cellEditable={{
        cellStyle: {},
        onCellEditApproved: (newValue, oldValue, rowData: any, columnDef) => {
          return new Promise((resolve: any, reject) => {
            setTimeout(() => {
              const dataUpdate = tableData.contents as any;
              dataUpdate[rowData.tableData.id!][columnDef.field!] = newValue;
              resolve();
            }, 1000);
          });
        },
      }}
      editable={{
        onRowAdd: (newData) =>
          new Promise((resolve: any, reject) => {
            setTimeout(() => {
              const dataUpdate = tableData.contents;
              dataUpdate.push(newData);
              dispatch(setTableData(tableData.type, tableData.key, dataUpdate));
              resolve();
            }, 1000);
          }),
        onRowUpdate: (newData, oldData: any) =>
          new Promise((resolve: any, reject) => {
            setTimeout(() => {
              const dataUpdate = tableData.contents;
              const index = oldData.tableData.id;
              dataUpdate[index] = newData;
              dispatch(setTableData(tableData.type, tableData.key, dataUpdate));

              resolve();
            }, 1000);
          }),
        onRowDelete: (oldData: any) =>
          new Promise((resolve: any, reject) => {
            setTimeout(() => {
              const dataDelete = tableData.contents;
              const index = oldData.tableData.id;
              dataDelete.splice(index, 1);
              dispatch(setTableData(tableData.type, tableData.key, dataDelete));
              resolve();
            }, 1000);
          }),
      }}
    />
  );
};

export default Table;
