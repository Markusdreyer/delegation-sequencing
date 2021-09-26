import { useEffect, useState } from "react";
import * as dotenv from "dotenv";
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
import { generateSunburstData, getASPModels } from "./utils/utils";
import { Action, ProcedureData, RootState } from "./types";
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
import ActionCards from "./components/ActionCards";

dotenv.config();

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
  const [actionCardData, setActionCardData] = useState<Action[][]>();
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

  const generateActionCards = async () => {
    const tmpProcedures = JSON.parse(JSON.stringify(procedures[tableData.key]));
    tmpProcedures.forEach((el: ProcedureData) => {
      el.role = (el.role as string[]).filter((e) => e).join(",");
      el.agent = (el.agent as string[]).filter((e) => e).join(",");
    });

    console.log("PARDDS", tmpProcedures);
    const models: Action[][] = await getASPModels(
      taxonomies[activeTaxonomy],
      tmpProcedures
    );
    console.log(models);
    setActionCardData(models);
  };

  const generateSunburst = async () => {
    const models: Action[][] = await getASPModels(
      taxonomies[activeTaxonomy],
      procedures[tableData.key]
    );

    setSunburstData(generateSunburstData(models));
  };

  const logTableData = () => {
    console.log("Procedure: ", procedures[tableData.key]);
    console.log("Taxonomy: ", taxonomies[activeTaxonomy]);
  };

  return (
    <>
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
                  Generate sunburst
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={generateActionCards}
                >
                  Generate action cards
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={logTableData}
                >
                  Log table data
                </Button>
              </div>
              {sunburstData && <Sunburst data={sunburstData} />}
            </>
          )}
        </main>
      </div>
      {actionCardData && <ActionCards data={actionCardData} />}
    </>
  );
};

export default App;
