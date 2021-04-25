import React, { useEffect, useState } from "react";
import MaterialTable from "material-table";
import { useSelector, useDispatch } from "react-redux";
//import { setTableData } from "../actions";
import { ProcedureData, RootState, TableData, TaxonomyData } from "../types";
import { procedureColumns, taxonomyColumns } from "../utils/TableColumns";
import { setProcedure } from "../actions";
interface Props {
  type: string;
  title: string;
}

const Table: React.FC<Props> = (props) => {
  const { type, title } = props;
  const procedures = useSelector((state: any) => state.procedures[title]);
  const dispatch = useDispatch();

  const [columns, setColumns]: any = useState(procedureColumns);

  return (
    <MaterialTable
      title={title}
      columns={columns}
      data={procedures}
      editable={{
        onRowAdd: (newData) =>
          new Promise((resolve: any, reject) => {
            setTimeout(() => {
              const dataUpdate = procedures;
              dataUpdate.push(newData);
              dispatch(setProcedure(title, dataUpdate));
              resolve();
            }, 1000);
          }),
        onRowUpdate: (newData, oldData: any) =>
          new Promise((resolve: any, reject) => {
            setTimeout(() => {
              const dataUpdate = procedures;
              const index = oldData.tableData.id;
              dataUpdate[index] = newData;
              dispatch(setProcedure(title, dataUpdate));

              resolve();
            }, 1000);
          }),
        onRowDelete: (oldData: any) =>
          new Promise((resolve: any, reject) => {
            setTimeout(() => {
              const dataDelete = procedures;
              const index = oldData.tableData.id;
              dataDelete.splice(index, 1);
              dispatch(setProcedure(title, dataDelete));
              resolve();
            }, 1000);
          }),
      }}
    />
  );
};

export default Table;
