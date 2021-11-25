import React, { useEffect, useState } from "react";
import MaterialTable, { MTableToolbar } from "material-table";
import { makeStyles } from "@material-ui/core/styles";
import { useDispatch, useSelector } from "react-redux";
import {
  ColumnDef,
  MaterialTableData,
  MultiselectOptions,
  ProcedureData,
  RootState,
  TableData,
  TaxonomyData,
} from "../types";
import { setActiveTaxonomy, setProcedure, setTaxonomy } from "../actions";
import { initialLookup, tableTypes } from "../utils/const";
import { FormControl, InputLabel, MenuItem, Select } from "@material-ui/core";
import { unique } from "../utils/utils";
import EditComponent from "./EditComponent";
import { doc, collection, updateDoc } from "firebase/firestore";
import {
  useFirestore,
  useFirestoreCollectionData,
  useFirestoreDocData,
} from "reactfire";

interface Props {
  data: TableData;
}

const Table: React.FC<Props> = (props) => {
  const db = useFirestore();
  const taxonomiesCollection = collection(db, "taxonomies");
  const { data: firestoreTaxonomies } = useFirestoreCollectionData(
    taxonomiesCollection,
    { idField: "key" }
  );
  const ref = doc(db, props.data.type, props.data.key);
  const { data: document } = useFirestoreDocData(ref, {
    idField: "key",
  });

  const activeTaxonomy = useSelector(
    (state: RootState) => state.activeTaxonomy
  );
  const { data } = props;
  const classes = useStyles();
  const dispatch = useDispatch();
  const [columns, setColumns] = useState<any>();
  const [multiselectOptions, setMultiselectOptions] =
    useState<MultiselectOptions>({ role: [], agent: [] });
  const tableColumns = {
    procedures: [
      { title: "Action", field: "action" },
      {
        title: "Role",
        field: "role",
        options: multiselectOptions,
        editComponent: (props: {
          columnDef: ColumnDef;
          onChange: any;
          value: string[];
        }) => (
          <EditComponent
            columnDef={props.columnDef}
            onChange={props.onChange}
            value={props.value}
          />
        ),
      },
      {
        title: "Agent",
        field: "agent",
        options: multiselectOptions,
        editComponent: (props: {
          columnDef: ColumnDef;
          onChange: any;
          value: string[];
        }) => (
          <EditComponent
            columnDef={props.columnDef}
            onChange={props.onChange}
            value={props.value}
          />
        ),
      },
      {
        title: "Quantity",
        field: "quantity",
      },
      {
        title: "Abbreviation",
        field: "abbreviation",
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
    ],
    taxonomies: [
      {
        title: "Agent",
        field: "agent",
      },
      {
        title: "Role",
        field: "role",
      },
      {
        title: "Parent",
        field: "parent",
        lookup: initialLookup[data.key],
      },
    ],
  };

  useEffect(() => {
    if (firestoreTaxonomies) {
      const currentTaxonomyData = firestoreTaxonomies.find(
        (el) => el.key === activeTaxonomy
      );
      const roles = currentTaxonomyData?.tableData
        .filter((el: TaxonomyData) => el.role)
        .map((el: any) => el.role)
        .filter(unique) as string[];

      const agents = currentTaxonomyData?.tableData
        .filter((el: TaxonomyData) => el.parent === "None")
        .filter((el: TaxonomyData) => el.agent)
        .map((el: TaxonomyData) => el.agent)
        .filter(unique) as string[];

      console.log("ROLES:: ", roles);
      console.log("AGENTS:: ", agents);
      setMultiselectOptions({ role: roles, agent: agents });
      // @ts-ignore: Object is possibly 'undefined'. //https://github.com/microsoft/TypeScript/issues/29642
      setColumns(tableColumns[data.type]);
    }
  }, [firestoreTaxonomies, activeTaxonomy]);

  useEffect(() => {
    // @ts-ignore: Object is possibly 'undefined'. //https://github.com/microsoft/TypeScript/issues/29642
    setColumns(tableColumns[data.type]);
  }, [multiselectOptions]);

  useEffect(() => {
    // @ts-ignore: Object is possibly 'undefined'. //https://github.com/microsoft/TypeScript/issues/29642
    setColumns(tableColumns[data.type]);
  }, [data.type]);

  //Renders parent lookup for each taxonomy
  useEffect(() => {
    if (data.type === tableTypes.TAXONOMIES) {
      // @ts-ignore: Object is possibly 'undefined'. //https://github.com/microsoft/TypeScript/issues/29642
      const update = tableColumns[data.type] as ColumnDef[];
      const index = update.findIndex((el) => el.field === "parent");
      update[index].lookup = initialLookup[data.key];
      setColumns(update);
    }
  }, [data.key, data.type]);

  const handleTaxonomyChange = (evt: any) => {
    // @ts-ignore: Object is possibly 'undefined'. //https://github.com/microsoft/TypeScript/issues/29642
    dispatch(setActiveTaxonomy(evt.target.value));

    const newTaxonomyData = firestoreTaxonomies.find(
      (el) => el.key === evt.target.value
    );

    let updateColumns: any = [...columns];
    updateColumns[1].lookup = newTaxonomyData?.tableData
      .filter((el: any) => el.hasOwnProperty("parentId") && el["role"])
      // @ts-ignore: Object is possibly 'undefined'. //https://github.com/microsoft/TypeScript/issues/29642
      // eslint-disable-next-line no-sequences
      .reduce((acc, curr) => ((acc[curr.role] = curr.role), acc), {});
    updateColumns[2].lookup = newTaxonomyData?.tableData
      .filter((el: any) => !el.hasOwnProperty("parentId") && el["agent"])
      // @ts-ignore: Object is possibly 'undefined'. //https://github.com/microsoft/TypeScript/issues/29642
      // eslint-disable-next-line no-sequences
      .reduce((acc, curr) => ((acc[curr.agent] = curr.agent), acc), {});
  };

  const addTableRow = async (
    newData: ProcedureData | TaxonomyData
  ): Promise<void> => {
    const currentTableData = document.tableData;

    console.log("currentTableData", currentTableData);

    if (data.type === tableTypes.PROCEDURES) {
      const dataUpdate = currentTableData as ProcedureData[];
      const procedureData = newData as unknown as ProcedureData;
      procedureData.id = currentTableData.length + 1;
      if (!procedureData.role) {
        procedureData.role = [""];
      }

      dataUpdate.push(procedureData as ProcedureData);
      await updateDoc(doc(db, data.type, data.key), {
        tableData: dataUpdate,
      });
      //firebase refactor dispatch(setProcedure(data.key, dataUpdate));
    } else if (data.type === tableTypes.TAXONOMIES) {
      let taxonomyData = newData as TaxonomyData;
      if (taxonomyData.parent && taxonomyData.parent !== "None") {
        const parentId = currentTableData!.find(
          (el: TaxonomyData) => el.agent === taxonomyData.parent
        )!.id;
        taxonomyData.parentId = parentId;
        taxonomyData.id = parentId + 1;
      } else {
        const prevId = Math.max.apply(
          Math,
          currentTableData.map((el: ProcedureData) => el.id)
        );
        newData.id = prevId < 0 ? 1 : prevId + 1;
        taxonomyData.role = "";
        taxonomyData.parent = "None";
      }
      const dataUpdate = currentTableData as TaxonomyData[];
      dataUpdate.push(taxonomyData);
      const columnUpdate: any = tableColumns;
      columnUpdate.taxonomies[2].lookup[taxonomyData.agent] =
        taxonomyData.agent;
      await updateDoc(doc(db, data.type, data.key), {
        tableData: dataUpdate,
      });
    } else {
      console.log(
        `${data.type} does not match ${tableTypes.PROCEDURES} or ${tableTypes.TAXONOMIES}`
      );
    }
  };

  const updateTableRow = async (
    newData: TaxonomyData | ProcedureData,
    oldData: MaterialTableData | undefined
  ): Promise<void> => {
    console.log("UPDATE TABLE", newData);
    if (oldData) {
      const dataUpdate = data.data!;
      const index = oldData.tableData.id;
      dataUpdate[index] = newData;
      console.log("newData: ", newData);
      await updateDoc(doc(db, data.type, data.key), {
        tableData: dataUpdate,
      });
    }
  };

  const deleteTableRow = async (
    oldData: MaterialTableData | undefined
  ): Promise<void> => {
    if (oldData) {
      const dataDelete = data.data!;
      const index = oldData.tableData.id;
      dataDelete.splice(index, 1);

      await updateDoc(doc(db, data.type, data.key), {
        tableData: dataDelete,
      });
    }
  };

  return (
    <MaterialTable
      title={data.key}
      columns={columns}
      data={
        document &&
        document.tableData.map((obj: ProcedureData[] | TaxonomyData[]) => ({
          ...obj,
        }))
      }
      parentChildData={(row, rows) => rows.find((o) => o.id === row.parentId)}
      options={{
        rowStyle: (rowData: any) => ({
          backgroundColor:
            rowData.parent !== "None" && data.type === "taxonomies"
              ? "#EEE"
              : "",
        }),
      }}
      editable={{
        onRowAdd: (newData: ProcedureData | TaxonomyData) =>
          new Promise((resolve: any, reject) => {
            setTimeout(() => {
              addTableRow(newData);
              resolve();
            }, 0);
          }),
        onRowUpdate: (newData: ProcedureData | TaxonomyData, oldData: any) =>
          new Promise((resolve: any, reject) => {
            setTimeout(() => {
              updateTableRow(newData, oldData);
              resolve();
            }, 0);
          }),
        onRowDelete: (oldData: any) =>
          new Promise((resolve: any, reject) => {
            setTimeout(() => {
              deleteTableRow(oldData);
              resolve();
            }, 0);
          }),
      }}
      components={{
        Toolbar: (props) => (
          <div>
            <MTableToolbar {...props} />
            {data.type === tableTypes.PROCEDURES && (
              <div style={{ padding: "0px 10px" }}>
                <FormControl className={classes.formControl}>
                  {console.log(document)}
                  <InputLabel>Taxonomy</InputLabel>
                  <Select
                    data-testid="taxonomy-selector"
                    value={activeTaxonomy}
                    onChange={handleTaxonomyChange}
                  >
                    {firestoreTaxonomies &&
                      firestoreTaxonomies.map((taxonomy) => (
                        <MenuItem value={taxonomy.key}>{taxonomy.key}</MenuItem>
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

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;

const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

export default Table;
