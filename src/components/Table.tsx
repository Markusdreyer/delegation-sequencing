import React, { useState } from "react";
import MaterialTable from "material-table";
import { useSelector, useDispatch } from "react-redux";
//import { setTableData } from "../actions";
import { ProcedureData, State, TableData, TaxonomyData } from "../types";
import { procedureColumns, taxonomyColumns } from "../utils/TableColumns";
interface Props {
  type: string;
  title: string;
}

const Table: React.FC<Props> = (props) => {
  const { type, title } = props;
  const procedures = useSelector((state: any) => state.procedures);
  const data = procedures[title];
  const dispatch = useDispatch();

  const [columns, setColumns]: any = useState(procedureColumns);

  return (
    <MaterialTable
      title={title}
      columns={columns}
      data={data}
      editable={{
        onRowAdd: (newData) =>
          new Promise((resolve: any, reject) => {
            setTimeout(() => {
              const dataUpdate = data;
              dataUpdate.push(newData);
              //dispatch(setTableData(type, title, dataUpdate));
              resolve();
            }, 1000);
          }),
        onRowUpdate: (newData, oldData: any) =>
          new Promise((resolve: any, reject) => {
            setTimeout(() => {
              const dataUpdate = data;
              const index = oldData.tableData.id;
              dataUpdate[index] = newData;
              //dispatch(setTableData(type, title, dataUpdate));

              resolve();
            }, 1000);
          }),
        onRowDelete: (oldData: any) =>
          new Promise((resolve: any, reject) => {
            setTimeout(() => {
              const dataDelete = data;
              const index = oldData.tableData.id;
              dataDelete.splice(index, 1);
              //dispatch(setTableData(type, title, dataDelete));
              resolve();
            }, 1000);
          }),
      }}
    />
  );
};

export default Table;
