import React, { useEffect, useState } from "react";
import MaterialTable, { MTableToolbar } from "material-table";
import { makeStyles } from "@material-ui/core/styles";
import { useDispatch, useSelector } from "react-redux";
import { ProcedureData, RootState, TableData, TaxonomyData } from "../types";
import { tableColumns } from "../utils/TableColumns";
import { setProcedure, setTaxonomy } from "../actions";
import { tableTypes } from "../utils/const";
import { FormControl, InputLabel, MenuItem, Select } from "@material-ui/core";
interface Props {
  data: TableData;
}

const Table: React.FC<Props> = (props) => {
  const taxonomies = useSelector((state: RootState) => state.taxonomies);
  const [activeTaxonomy, setActiveTaxonomy] = useState(
    Object.keys(taxonomies)[0]
  );
  console.log(activeTaxonomy);
  const { data } = props;
  const classes = useStyles();
  const dispatch = useDispatch();
  const [columns, setColumns] = useState([]);

  useEffect(() => {
    // @ts-ignore: Object is possibly 'undefined'. //https://github.com/microsoft/TypeScript/issues/29642
    setColumns(tableColumns[data.type]);
  }, [data.type]);

  const handleChange = () => {};

  return (
    <MaterialTable
      title={data.key}
      columns={columns}
      data={data.data.map((o: any) => ({ ...o }))} //Ugly immutable hack: https://github.com/mbrn/material-table/issues/666
      parentChildData={(row, rows) => rows.find((o) => o.id === row.parentId)}
      editable={{
        onRowAdd: (newData) =>
          new Promise((resolve: any, reject) => {
            setTimeout(() => {
              const dataUpdate = data.data!;
              dataUpdate.push(newData);
              if (data.type === tableTypes.PROCEDURES) {
                dispatch(setProcedure(data.key, dataUpdate as ProcedureData[]));
              } else if (data.type === tableTypes.TAXONOMIES) {
                dispatch(setTaxonomy(data.key, dataUpdate as TaxonomyData[]));
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
                dispatch(setProcedure(data.key, dataUpdate as ProcedureData[]));
              } else if (data.key === tableTypes.TAXONOMIES) {
                dispatch(setTaxonomy(data.key, dataUpdate as TaxonomyData[]));
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
                dispatch(setProcedure(data.key, dataDelete as ProcedureData[]));
              } else if (data.key === tableTypes.TAXONOMIES) {
                dispatch(setTaxonomy(data.key, dataDelete as TaxonomyData[]));
              } else {
                console.error(
                  `${data.key} does not match ${tableTypes.PROCEDURES} or ${tableTypes.TAXONOMIES}`
                );
              }

              resolve();
            }, 1000);
          }),
      }}
      components={{
        Toolbar: (props) => (
          <div>
            <MTableToolbar {...props} />
            {data.type === tableTypes.PROCEDURES && (
              <div style={{ padding: "0px 10px" }}>
                <FormControl className={classes.formControl}>
                  <InputLabel>Taxonomy</InputLabel>
                  <Select value={activeTaxonomy} onChange={handleChange}>
                    {Object.keys(taxonomies).map((taxonomy) => (
                      <MenuItem value={taxonomy}>{taxonomy}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>
            )}
          </div>
        ),
      }}
    />
  );
};

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));

export default Table;
