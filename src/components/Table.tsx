import React, { useState } from "react";
import MaterialTable from "material-table";
import { useDispatch } from "react-redux";
import { TableData } from "../types";
import { procedureColumns } from "../utils/TableColumns";
import { setProcedure, setTaxonomy } from "../actions";
import { tableTypes } from "../utils/const";
interface Props {
  data: TableData;
}

const Table: React.FC<Props> = (props) => {
  const { data } = props;
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
              if (data.type === tableTypes.PROCEDURES) {
                dispatch(setProcedure(data.key, dataUpdate));
              } else if (data.type === tableTypes.TAXONOMIES) {
                dispatch(setTaxonomy(data.key, dataUpdate));
              } else {
                console.error(
                  `${data.type} does not match ${tableTypes.PROCEDURES} or ${tableTypes.TAXONOMIES}`
                );
              }

              resolve();
            }, 1000);
          }),
        onRowUpdate: (newData, oldData: any) =>
          new Promise((resolve: any, reject) => {
            setTimeout(() => {
              const dataUpdate = data.data!;
              const index = oldData.tableData.id;
              dataUpdate[index] = newData;

              if (data.key === tableTypes.PROCEDURES) {
                dispatch(setProcedure(data.key, dataUpdate));
              } else if (data.key === tableTypes.TAXONOMIES) {
                dispatch(setTaxonomy(data.key, dataUpdate));
              } else {
                console.error(
                  `${data.key} does not match ${tableTypes.PROCEDURES} or ${tableTypes.TAXONOMIES}`
                );
              }
              resolve();
            }, 1000);
          }),
        onRowDelete: (oldData: any) =>
          new Promise((resolve: any, reject) => {
            setTimeout(() => {
              const dataDelete = data.data!;
              const index = oldData.tableData.id;
              dataDelete.splice(index, 1);

              if (data.key === tableTypes.PROCEDURES) {
                dispatch(setProcedure(data.key, dataDelete));
              } else if (data.key === tableTypes.TAXONOMIES) {
                dispatch(setTaxonomy(data.key, dataDelete));
              } else {
                console.error(
                  `${data.key} does not match ${tableTypes.PROCEDURES} or ${tableTypes.TAXONOMIES}`
                );
              }

              resolve();
            }, 1000);
          }),
      }}
    />
  );
};

export default Table;
