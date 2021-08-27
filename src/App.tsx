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
import { generateSunburstData } from "./utils/utils";
import { Action, ProcedureData, RootState, TaxonomyData } from "./types";
import { useSelector, useDispatch } from "react-redux";
import {
  renderTable,
  setProcedure,
  setTaxonomy,
  toggleDialog,
} from "./actions";
import Sidebar from "./components/SideBar";
import Table from "./components/Table";
import useStyles from "./Styles";
import { dialogOptions, tableTypes } from "./utils/const";

const App = () => {
  const showSidebar = useSelector((state: RootState) => state.showSidebar);
  const tableData = useSelector((state: RootState) => state.tableData);
  const procedures = useSelector((state: RootState) => state.procedures);
  const taxonomies = useSelector((state: RootState) => state.taxonomies);
  const activeTaxonomy = useSelector(
    (state: RootState) => state.activeTaxonomy
  );
  const dialog = useSelector((state: RootState) => state.dialog);
  const [sunburstData, setSunburstData] = useState();
  const [newDocument, setNewDocument] = useState("");

  const dispatch = useDispatch();
  const classes = useStyles();

  useEffect(() => {
    if (tableData.key) {
      if (tableData.type === tableTypes.PROCEDURES) {
        console.log("Update procedure table");
        dispatch(
          renderTable(
            tableTypes.PROCEDURES,
            tableData.key,
            procedures[tableData.key]
          )
        );
      } else if (tableData.type === tableTypes.TAXONOMIES) {
        console.log("Update taxonomy table");
        dispatch(
          renderTable(
            tableTypes.TAXONOMIES,
            tableData.key,
            taxonomies[tableData.key]
          )
        );
      } else {
        console.log(
          `${tableData.type} does not match ${tableTypes.PROCEDURES} or ${tableTypes.TAXONOMIES}`
        );
      }
    }
  }, [procedures, taxonomies, tableData.type, tableData.key, dispatch]);

  const createNewDocument = () => {
    if (dialog.title === dialogOptions.PROCEDURE.title) {
      dispatch(renderTable(tableTypes.PROCEDURES, newDocument, []));
      dispatch(setProcedure(newDocument, []));
    } else if (dialog.title === dialogOptions.TAXONOMY.title) {
      dispatch(renderTable(tableTypes.TAXONOMIES, newDocument, []));
      dispatch(setTaxonomy(newDocument, []));
    } else {
      console.log(
        `${dialog.title} does not match ${dialogOptions.PROCEDURE.title} or ${dialogOptions.TAXONOMY.title}`
      );
    }
    dispatch(toggleDialog());
  };

  const generateSunburst = () => {
    const simulationData = {
      taxonomy: taxonomies[activeTaxonomy],
      procedure: procedures[tableData.key],
    };
    const simulationRequest = JSON.stringify(simulationData);

    axios({
      method: "post",
      url: "http://localhost:8000/asp-parser",
      data: simulationRequest,
      headers: {
        "Content-Type": "application/json",
      },
    }).then((res) => {
      const data = res.data;
      console.log("DATA ", data);
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
          const time = parseInt(expedite[3]);

          // @ts-ignore: Object is possibly 'undefined'. //https://github.com/microsoft/TypeScript/issues/29642
          const actionLookup = procedures[tableData.key].find(
            (el: ProcedureData) => el.abbreviation === abbreviation
          ).action;

          const actionObject: Action = {
            name: actionLookup,
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
          onClose={() => dispatch(toggleDialog())}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">{dialog.title}</DialogTitle>
          <DialogContent>
            <TextField
              onChange={(e) => setNewDocument(e.target.value)}
              autoFocus
              margin="dense"
              id="name"
              label={dialog.label}
              type="text"
              fullWidth
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => dispatch(toggleDialog())} color="primary">
              Cancel
            </Button>
            <Button
              type="submit"
              onClick={() => createNewDocument()}
              color="primary"
            >
              Create
            </Button>
          </DialogActions>
        </Dialog>
        <Table data={tableData} />
        {tableData.type === tableTypes.PROCEDURES && (
          <>
            <div className="center padding-l">
              <Button
                variant="contained"
                color="primary"
                onClick={generateSunburst}
              >
                Run simulation
              </Button>
            </div>
            {sunburstData && <Sunburst data={sunburstData} />}
          </>
        )}
      </main>
    </div>
  );
};

export default App;
