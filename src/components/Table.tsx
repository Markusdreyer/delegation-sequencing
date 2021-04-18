import React from "react";
import MaterialTable from "material-table";

interface Props {
  data: any;
}

const Table: React.FC<Props> = (props) => {
  const { data } = props;
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
              setTableData({
                ...tableData,
                [currentProcedure]: [...dataUpdate],
              });

              resolve();
            }, 1000);
          }),
        onRowUpdate: (newData, oldData: any) =>
          new Promise((resolve: any, reject) => {
            setTimeout(() => {
              const dataUpdate = [...tableData[currentProcedure]];
              const index = oldData.tableData.id;
              dataUpdate[index] = newData;
              setTableData({
                ...tableData,
                [currentProcedure]: [...dataUpdate],
              });

              resolve();
            }, 1000);
          }),
        onRowDelete: (oldData: any) =>
          new Promise((resolve: any, reject) => {
            setTimeout(() => {
              const dataDelete = [...tableData[currentProcedure]];
              const index = oldData.tableData.id;
              dataDelete.splice(index, 1);
              setTableData({
                ...tableData,
                [currentProcedure]: [...dataDelete],
              });

              resolve();
            }, 1000);
          }),
      }}
    />
  );
};

export default Table;
