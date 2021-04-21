import { useState } from "react";
import MaterialTable from "material-table";
import { useSelector, useDispatch } from "react-redux";
import { setTableData } from "../actions";
import { State } from "../types";
import { procedureColumns, taxonomyColumns } from "../utils/TableColumns";

const Table = () => {
  const tableMeta = useSelector((state: State) => state.tableMeta);
  const tableData = useSelector((state: State) => state.tableData);

  const dispatch = useDispatch();

  const [columns, setColumns]: any = useState(procedureColumns);

  return (
    <MaterialTable
      title={tableMeta.key}
      columns={columns}
      data={tableData[tableMeta.key]}
      cellEditable={{
        cellStyle: {},
        onCellEditApproved: (newValue, oldValue, rowData: any, columnDef) => {
          return new Promise((resolve: any, reject) => {
            setTimeout(() => {
              const dataUpdate = [...tableData[tableMeta.key]] as any; //This is pretty weird, but it works
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
              const dataUpdate = [...tableData[tableMeta.key]];
              dataUpdate.push(newData);
              dispatch(setTableData(tableMeta.key, dataUpdate));
              resolve();
            }, 1000);
          }),
        onRowUpdate: (newData, oldData: any) =>
          new Promise((resolve: any, reject) => {
            setTimeout(() => {
              const dataUpdate = [...tableData[tableMeta.key]];
              const index = oldData.tableData.id;
              dataUpdate[index] = newData;
              dispatch(setTableData(tableMeta.key, dataUpdate));

              resolve();
            }, 1000);
          }),
        onRowDelete: (oldData: any) =>
          new Promise((resolve: any, reject) => {
            setTimeout(() => {
              const dataDelete = [...tableData[tableMeta.key]];
              const index = oldData.tableData.id;
              dataDelete.splice(index, 1);
              dispatch(setTableData(tableMeta.key, dataDelete));
              resolve();
            }, 1000);
          }),
      }}
    />
  );
};

export default Table;
