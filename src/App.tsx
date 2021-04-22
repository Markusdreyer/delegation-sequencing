import { useState } from "react";
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
import { ProcedureData, State, TableData, TaxonomyData } from "./types";
import { useSelector, useDispatch } from "react-redux";
import { setTableData, setProcedure, toggleDialog } from "./actions";
import Sidebar from "./components/Sidebar";
import Table from "./components/Table";
import useStyles from "./Styles";
import { tableTypes } from "./utils/const";

const App = () => {
  const showSidebar = useSelector((state: State) => state.showSidebar);
  const dialog = useSelector((state: State) => state.dialog);
  const tableData = useSelector((state: State) => state.tableData);

  const dispatch = useDispatch();

  const classes = useStyles();
  const [sunburstData, setSunburstData] = useState(sunburstMockData);

  const [newProcedure, setNewProcedure] = useState("");

  const createNewProcedure = () => {
    dispatch(setTableData(tableTypes.PROCEDURES, newProcedure));
    dispatch(setProcedure(newProcedure));
    dispatch(toggleDialog(false));
  };

  const generateSunburst = () => {
    const tableJSON = JSON.stringify(tableData.contents);
    axios({
      method: "post",
      url: "http://localhost:8000/asp-parser",
      data: tableJSON,
      headers: {
        "Content-Type": "application/json",
      },
    }).then((res) => {
      console.log(res);
      const data = JSON.parse(res.data);
      console.log(data);
      const [optimum] = data.Call[0].Witnesses.slice(-1);
      const optimumCost = optimum.Costs[0];
      let parsedActions: any = [];
      optimum.Value.map((el: any) => {
        const expedite = el.split(/[\(\)\s,]+/);
        const abbreviation = expedite[1];
        const agent = expedite[2];
        const time = expedite[3];

        // @ts-ignore: Object is possibly 'undefined'. //https://github.com/microsoft/TypeScript/issues/29642
        const actionLookup = tableData.contents.find(
          (el: ProcedureData | TaxonomyData) => el.abbreviation === abbreviation
        ).action;

        const actionObject = {
          action: actionLookup,
          agent: agent,
          time: time,
        };
        parsedActions.push(actionObject);
      });
      const sortedActions = parsedActions.sort((a: any, b: any) =>
        a.time > b.time ? 1 : b.time > a.time ? -1 : 0
      );
      console.log(sortedActions);

      setSunburstData(
        sortedActions.map((el: any, i: any) => ({
          id: `${i}.0`,
          parent: `${i === 0 ? "" : `${i - 1}.0`}`,
          name: `${el.agent}, ${el.action}, at ${el.time}`,
          value: 100,
        }))
      );
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
        <Table />
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
