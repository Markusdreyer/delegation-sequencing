import { useEffect, useState } from "react";
import axios from "axios";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Button,
} from "@material-ui/core";

import Sunburst from "./components/Sunburst";
import clsx from "clsx";

import { sunburstMockData } from "./utils/mockData";
import { generateSunburstData } from "./utils/utils";
import { ProcedureData, RootState, TaxonomyData } from "./types";
import { useSelector, useDispatch } from "react-redux";
import { renderTable, setProcedure, toggleDialog } from "./actions";
import Sidebar from "./components/SideBar";
import Table from "./components/Table";
import useStyles from "./Styles";
import { tableTypes } from "./utils/const";

const App = () => {
  const showSidebar = useSelector((state: RootState) => state.showSidebar);
  const tableData = useSelector((state: RootState) => state.tableData);
  const procedures = useSelector((state: RootState) => state.procedures);
  const dialog = useSelector((state: RootState) => state.dialog);
  const [sunburstData, setSunburstData] = useState(sunburstMockData);
  const [newProcedure, setNewProcedure] = useState("");

  console.log(tableData);

  const [taxonomies, setTaxonomies]: any = useState([
    "Land fire incidents",
    "Offshore incidents",
    "Terror incidents",
  ]);

  const dispatch = useDispatch();
  const classes = useStyles();

  useEffect(() => {
    if (tableData.key) {
      console.log("USE EFFECT");
      dispatch(
        renderTable(
          tableTypes.PROCEDURES,
          tableData.key,
          procedures[tableData.key]
        )
      );
    }
  }, [tableData.key, procedures]);

  const createNewProcedure = () => {
    dispatch(renderTable(tableTypes.PROCEDURES, newProcedure, []));
    dispatch(setProcedure(newProcedure));
    dispatch(toggleDialog(false));
  };

  const generateSunburst = () => {
    const tableJSON = JSON.stringify(procedures[tableData.key]);
    axios({
      method: "post",
      url: "http://localhost:8000/asp-parser",
      data: tableJSON,
      headers: {
        "Content-Type": "application/json",
      },
    }).then((res) => {
      const data = JSON.parse(res.data);
      const [optimum] = data.Call[0].Witnesses.slice(-1);
      const optimumCost = optimum.Costs[0];

      const optimumModels = data.Call[0].Witnesses.filter((el: any) => {
        return el.Costs[0] === optimumCost;
      });

      console.log(optimumModels);

      let parsedModels: any = [];
      optimumModels.map((model: any) => {
        let tmpParsedModel: any = [];
        model.Value.map((el: any) => {
          const expedite = el.split(/[\(\)\s,]+/);
          const abbreviation = expedite[1];
          const agent = expedite[2];
          const time = expedite[3];

          // @ts-ignore: Object is possibly 'undefined'. //https://github.com/microsoft/TypeScript/issues/29642
          const actionLookup = procedures[tableData.key].find(
            (el: ProcedureData | TaxonomyData) =>
              el.abbreviation === abbreviation
          ).action;

          const actionObject = {
            action: actionLookup,
            agent: agent,
            time: time,
          };
          tmpParsedModel.push(actionObject);
        });
        parsedModels.push(tmpParsedModel);
      });

      parsedModels.map((model: any) => {
        model.sort((a: any, b: any) =>
          a.time > b.time ? 1 : b.time > a.time ? -1 : 0
        );
      });

      setSunburstData(generateSunburstData(parsedModels));
    });
  };

  return (
    <div className={classes.root}>
      <Sidebar />
      <main
        className={clsx(classes.content, {
          [classes.contentShift]: showSidebar,
        })}
      >
        <div className={classes.drawerHeader} />
        <Dialog
          open={dialog.show}
          onClose={() => dispatch(toggleDialog(true, "some", "thing"))}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">{dialog.title}</DialogTitle>
          <DialogContent>
            <TextField
              onChange={(e) => setNewProcedure(e.target.value)}
              autoFocus
              margin="dense"
              id="name"
              label={dialog.label}
              type="text"
              fullWidth
            />
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => dispatch(toggleDialog(false))}
              color="primary"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              onClick={() => createNewProcedure()}
              color="primary"
            >
              Create
            </Button>
          </DialogActions>
        </Dialog>
        <Table data={tableData} />
        <Sunburst data={sunburstData} />
        <div className="center padding-l">
          <Button
            variant="contained"
            color="primary"
            onClick={generateSunburst}
          >
            Run simulation
          </Button>
        </div>
      </main>
    </div>
  );
};

export default App;
