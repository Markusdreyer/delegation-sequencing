import React, { useEffect, useState } from "react";
import MaterialTable, { MTableEditField, MTableToolbar } from "material-table";
import { makeStyles, Theme, useTheme } from "@material-ui/core/styles";
import { useDispatch, useSelector } from "react-redux";
import {
  FieldProps,
  MaterialTableData,
  MultiselectOptions,
  MultiselectValues,
  ProcedureData,
  RootState,
  TableData,
  TaxonomyData,
} from "../types";
import Autocomplete from "@mui/material/Autocomplete";
import { tableColumns } from "../utils/TableColumns";
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
  const [columns, setColumns] = useState([]);
  const [multiselectOptions, setMultiselectOptions] =
    useState<MultiselectOptions>({ role: [], agent: [] });
  const [multiselectValues, setMultiselectValues] = useState<MultiselectValues>(
    { role: "", agent: "" }
  );

  useEffect(() => {
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
    // @ts-ignore: Object is possibly 'undefined'. //https://github.com/microsoft/TypeScript/issues/29642
    setColumns(tableColumns[data.type]);
  }, [data.type]);

  const handleChangeTaxonomyChange = (evt: any) => {
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

  const handleMultiselectChange = (fieldProps: FieldProps, evt: any) => {
    const value = evt.target.value;
    console.log("FIELDPROPS:: ", fieldProps);
    console.log("MULTISELECT CHANGE:: ", value);

    // @ts-ignore: Object is possibly 'undefined'. //https://github.com/microsoft/TypeScript/issues/29642
    setMultiselectValues({
      ...multiselectValues,
      [fieldProps.columnDef.field]:
        typeof value === "string" ? value.split(",") : value,
    });
    console.log("MULTISELECT VAL:: ", multiselectValues);
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
    if (oldData) {
      const dataUpdate = data.data!;
      const index = oldData.tableData.id;
      dataUpdate[index] = newData;

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

  const renderMultiselectOptions = (fieldProps: FieldProps): string[] => {
    if (data.type === tableTypes.PROCEDURES) {
      switch (fieldProps.columnDef.field) {
        case "agent":
          return taxonomies[activeTaxonomy]
            .filter((el: TaxonomyData) => el.parent === "None")
            .filter((el: any) => el[fieldProps.columnDef.field])
            .map((el: any) => el[fieldProps.columnDef.field])
            .filter(unique) as string[];
        default:
          return taxonomies[activeTaxonomy]
            .filter((el: any) => el[fieldProps.columnDef.field])
            .map((el: any) => el[fieldProps.columnDef.field])
            .filter(unique) as string[];
      }
    } else {
      console.log("Not procedure data");
      return [];
    }
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
        EditField: (fieldProps: FieldProps) => {
          const {
            columnDef: { lookup, field },
          } = fieldProps;
          if ((lookup && field === "role") || field === "agent") {
            console.info(fieldProps);
            return (
              <Select
                labelId="demo-multiple-name-label"
                id="demo-multiple-name"
                multiple
                value={multiselectValues[field]}
                onChange={(evt) => handleMultiselectChange(fieldProps, evt)}
                input={<OutlinedInput label="Name" />}
                MenuProps={MenuProps}
              >
                {multiselectOptions[field].map((el: string) => (
                  <MenuItem
                    key={el}
                    value={el}
                    style={getStyles(el, multiselectOptions[field], theme)}
                  >
                    {el}
                  </MenuItem>
                ))}
              </Select>
            );
          } else {
            return (
              <MTableEditField
                {...{ ...fieldProps, value: fieldProps.value || "" }}
              />
            );
          }
        },
        Toolbar: (props) => (
          <div>
            {console.log(taxonomies[activeTaxonomy])}
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

function getStyles(name: string, personName: string[], theme: Theme) {
  return {
    fontWeight:
      personName.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}

export default Table;
