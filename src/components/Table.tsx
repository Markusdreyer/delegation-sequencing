import React, { useEffect, useRef, useState } from "react";
import MaterialTable, { MTableEditField, MTableToolbar } from "material-table";
import { makeStyles, Theme, useTheme } from "@material-ui/core/styles";
import { useDispatch, useSelector } from "react-redux";
import {
  ColumnDef,
  MaterialTableData,
  MultiselectValues,
  ProcedureData,
  RootState,
  TableData,
  TaxonomyData,
} from "../types";
import Autocomplete from "@mui/material/Autocomplete";
import { setActiveTaxonomy, setProcedure, setTaxonomy } from "../actions";
import { tableTypes } from "../utils/const";
import {
  FormControl,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  TextField,
} from "@material-ui/core";
interface Props {
  data: TableData;
}

const Table: React.FC<Props> = (props) => {
  const theme = useTheme();
  const taxonomies = useSelector((state: RootState) => state.taxonomies);
  const activeTaxonomy = useSelector(
    (state: RootState) => state.activeTaxonomy
  );
  const { data } = props;
  const classes = useStyles();
  const dispatch = useDispatch();
  const [columns, setColumns] = useState<any>([
    [
      { title: "Action", field: "action" },
      {
        title: "Role",
        field: "role",
        options: ["fj", "fk"],
        editComponent: (props: {
          columnDef: ColumnDef;
          onChange: any;
          value: string[];
        }) => (
          <Select
            multiple
            value={props.value ? props.value : [""]}
            onChange={(evt) => {
              console.log("PROPS:: ", props);
              console.log("evt ", multiselectOptions);
              props.onChange(evt.target.value);
            }}
            input={<OutlinedInput label="Name" />}
            MenuProps={MenuProps}
          >
            {/* @ts-ignore: Object is possibly 'undefined'. //https://github.com/microsoft/TypeScript/issues/29642*/}
            {multiselectOptions.role.map((el: string) => (
              <MenuItem key={el} value={el}>
                {el}
              </MenuItem>
            ))}
          </Select>
        ),
      },
      {
        title: "Agent",
        field: "agent",
        lookup: {
          ae_crew: "ae_crew",
          se_crew: "se_crew",
          lt_crew: "lt_crew",
        },
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
  ]);
  const [multiselectOptions, setMultiselectOptions] =
    useState<MultiselectValues>({ role: [], agent: [] });

  useEffect(() => {
    // @ts-ignore: Object is possibly 'undefined'. //https://github.com/microsoft/TypeScript/issues/29642
    setColumns(tableColumns[data.type]);
    console.log("TAXONOM USEEFFECT");
    const roles = taxonomies[activeTaxonomy]
      .filter((el: TaxonomyData) => el.role)
      .map((el: any) => el.role)
      .filter(unique) as string[];

    const agents = taxonomies[activeTaxonomy]
      .filter((el: TaxonomyData) => el.parent === "None")
      .filter((el: TaxonomyData) => el.agent)
      .map((el: TaxonomyData) => el.agent)
      .filter(unique) as string[];

    setMultiselectOptions({ role: roles, agent: agents });
  }, [taxonomies, activeTaxonomy]);

  useEffect(() => {
    console.log("MULTISELECT OPTIONS ", multiselectOptions);
    setColumns(tableColumns.procedures);
  }, [multiselectOptions]);

  const tableColumns = {
    procedures: [
      { title: "Action", field: "action" },
      {
        title: "Role",
        field: "role",
        editComponent: (props: {
          columnDef: ColumnDef;
          onChange: any;
          value: string[];
        }) => (
          <Select
            multiple
            value={props.value ? props.value : [""]}
            onChange={(evt) => {
              console.log("PROPS:: ", props);
              console.log("MULTISELECT OPTIONS:: ", multiselectOptions);
              props.onChange(evt.target.value);
            }}
            input={<OutlinedInput label="Name" />}
            MenuProps={MenuProps}
          >
            {/* @ts-ignore: Object is possibly 'undefined'. //https://github.com/microsoft/TypeScript/issues/29642*/}
            {multiselectOptions.role.map((el: string) => (
              <MenuItem key={el} value={el}>
                {el}
              </MenuItem>
            ))}
          </Select>
        ),
      },
      {
        title: "Agent",
        field: "agent",
        lookup: {
          ae_crew: "ae_crew",
          se_crew: "se_crew",
          lt_crew: "lt_crew",
        },
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
  };

  useEffect(() => {
    console.log("DATATYPE USEEFFECT");
    // @ts-ignore: Object is possibly 'undefined'. //https://github.com/microsoft/TypeScript/issues/29642
    setColumns(tableColumns[data.type]);
  }, [data.type]);

  const handleChangeTaxonomyChange = (evt: any) => {
    console.log("TAXONOMY CHANGE");
    // @ts-ignore: Object is possibly 'undefined'. //https://github.com/microsoft/TypeScript/issues/29642
    dispatch(setActiveTaxonomy(evt.target.value));

    let updateColumns: any = [...columns];
    updateColumns[1].lookup = taxonomies[evt.target.value] //Fetch role lookup data from taxonomy
      .filter((el) => el.hasOwnProperty("parentId") && el["role"])
      // @ts-ignore: Object is possibly 'undefined'. //https://github.com/microsoft/TypeScript/issues/29642
      // eslint-disable-next-line no-sequences
      .reduce((acc, curr) => ((acc[curr.role] = curr.role), acc), {});
    updateColumns[2].lookup = taxonomies[evt.target.value] //Fetch agent lookup data from taxonomy
      .filter((el) => !el.hasOwnProperty("parentId") && el["agent"])
      // @ts-ignore: Object is possibly 'undefined'. //https://github.com/microsoft/TypeScript/issues/29642
      // eslint-disable-next-line no-sequences
      .reduce((acc, curr) => ((acc[curr.agent] = curr.agent), acc), {});
  };

  const addTableRow = (newData: ProcedureData | TaxonomyData): void => {
    const currentTaxonomy = taxonomies[data.key];
    const currentTableData = data.data;

    if (data.type === tableTypes.PROCEDURES) {
      const dataUpdate = currentTableData as ProcedureData[];
      const procedureData = newData as unknown as ProcedureData;
      procedureData.id = 1;
      procedureData.role = multiselectOptions.role;
      procedureData.agent = multiselectOptions.agent;

      dataUpdate.push(procedureData as ProcedureData);
      dispatch(setProcedure(data.key, dataUpdate));
    } else if (data.type === tableTypes.TAXONOMIES) {
      let taxonomyData = newData as TaxonomyData;
      if (taxonomyData.parent && taxonomyData.parent !== "None") {
        const parentId = currentTaxonomy!.find(
          (el: TaxonomyData) => el.agent === taxonomyData.parent
        )!.id;
        taxonomyData.parentId = parentId;
        taxonomyData.id = parentId + 1;
      } else {
        const prevId = Math.max.apply(
          Math,
          currentTaxonomy.map((el) => el.id)
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
      dispatch(setTaxonomy(data.key, dataUpdate));
    } else {
      console.log(
        `${data.type} does not match ${tableTypes.PROCEDURES} or ${tableTypes.TAXONOMIES}`
      );
    }
  };

  const updateTableRow = (
    newData: TaxonomyData | ProcedureData,
    oldData: MaterialTableData | undefined
  ): void => {
    console.log("UPDATE TABLE", newData);
    if (oldData) {
      const dataUpdate = data.data!;
      const index = oldData.tableData.id;
      dataUpdate[index] = newData;
      console.log("newData: ", newData);
      if (data.type === tableTypes.PROCEDURES) {
        dispatch(setProcedure(data.key, dataUpdate as ProcedureData[]));
      } else if (data.type === tableTypes.TAXONOMIES) {
        dispatch(setTaxonomy(data.key, dataUpdate as TaxonomyData[]));
      } else {
        console.log(
          `${data.type} does not match ${tableTypes.PROCEDURES} or ${tableTypes.TAXONOMIES}`
        );
      }
    }
  };

  const deleteTableRow = (oldData: MaterialTableData | undefined): void => {
    if (oldData) {
      const dataDelete = data.data!;
      const index = oldData.tableData.id;
      dataDelete.splice(index, 1);

      if (data.type === tableTypes.PROCEDURES) {
        dispatch(setProcedure(data.key, dataDelete as ProcedureData[]));
      } else if (data.type === tableTypes.TAXONOMIES) {
        dispatch(setTaxonomy(data.key, dataDelete as TaxonomyData[]));
      } else {
        console.log(
          `${data.type} does not match ${tableTypes.PROCEDURES} or ${tableTypes.TAXONOMIES}`
        );
      }
    }
  };

  const unique = (value: any, index: any, self: any) => {
    return self.indexOf(value) === index;
  };

  return (
    <MaterialTable
      title={data.key}
      columns={columns}
      data={data.data.map((o: any) => ({ ...o }))} //Ugly immutable hack: https://github.com/mbrn/material-table/issues/666
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
            }, 1000);
          }),
        onRowAddCancelled: (rowData) => console.log("Row adding cancelled"),
        onRowUpdateCancelled: (rowData) => console.log("Row editing cancelled"),
        onRowUpdate: (newData: ProcedureData | TaxonomyData, oldData: any) =>
          new Promise((resolve: any, reject) => {
            setTimeout(() => {
              updateTableRow(newData, oldData);
              resolve();
            }, 1000);
          }),
        onRowDelete: (oldData: any) =>
          new Promise((resolve: any, reject) => {
            setTimeout(() => {
              deleteTableRow(oldData);
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
                  <Select
                    value={activeTaxonomy}
                    onChange={handleChangeTaxonomyChange}
                  >
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
