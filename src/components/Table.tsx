import React, { useState } from "react";
import MaterialTable from "material-table";
import { useDispatch } from "react-redux";
import { TableData } from "../types";
import { procedureColumns } from "../utils/TableColumns";
import { setProcedure } from "../actions";
interface Props {
  data: TableData;
}

const Table: React.FC<Props> = (props) => {
  const { data } = props;
  console.log(data.data);
  const dispatch = useDispatch();
  const [columns, setColumns]: any = useState(procedureColumns);

  return (
    <MaterialTable
      title={data.key}
      columns={columns}
      data={data.data.map((o) => ({ ...o }))} //Ugly immutable hack: https://github.com/mbrn/material-table/issues/666
      editable={{
        onRowAdd: (newData) =>
          new Promise((resolve: any, reject) => {
            setTimeout(() => {
              const dataUpdate = data.data!;
              dataUpdate.push(newData);
              dispatch(setProcedure(data.key, dataUpdate));
              resolve();
            }, 1000);
          }),
        onRowUpdate: (newData, oldData: any) =>
          new Promise((resolve: any, reject) => {
            setTimeout(() => {
              const dataUpdate = data.data!;
              const index = oldData.tableData.id;
              dataUpdate[index] = newData;
              dispatch(setProcedure(data.key, dataUpdate));
              resolve();
            }, 1000);
          }),
        onRowDelete: (oldData: any) =>
          new Promise((resolve: any, reject) => {
            setTimeout(() => {
              const dataDelete = data.data!;
              const index = oldData.tableData.id;
              dataDelete.splice(index, 1);
              dispatch(setProcedure(data.key, dataDelete));
              resolve();
            }, 1000);
          }),
      }}
    />
  );
};

export default Table;
