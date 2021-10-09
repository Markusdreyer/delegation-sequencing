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
import {
  generateActionCardData,
  generateSunburstData,
  getASPModels,
} from "./utils/utils";
import { Action, Models, RootState } from "./types";
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
import { dialogOptions, modelTypes, tableTypes } from "./utils/const";
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
  const [actionCardData, setActionCardData] = useState<Action[][][]>();
  const [newDocument, setNewDocument] = useState("");
  const [failureMessage, setFailureMessage] = useState<string>();

  const dispatch = useDispatch();
  const classes = useStyles();

  useEffect(() => {
    setActionCardData(undefined);
    setSunburstData(undefined);
    setFailureMessage(undefined);
  }, [activeTaxonomy]);

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

  const generateModels = async (modelType: string) => {
    const models: string | Action[][] = await getASPModels(
      taxonomies[activeTaxonomy],
      procedures[tableData.key],
      1
    );

    console.log("MODELS:: ", models);

    if (models instanceof Array) {
      if (modelType === modelTypes.SUNBURST) {
        setFailureMessage(undefined);
        setActionCardData(undefined);
        setSunburstData(generateSunburstData(models));
      } else if (modelType === modelTypes.ACTION_CARDS) {
        setFailureMessage(undefined);
        setSunburstData(undefined);
        setActionCardData(generateActionCardData(models));
      } else {
        console.log(`${modelType} is not yet implemented`);
      }
    } else {
      setSunburstData(undefined);
      setActionCardData(undefined);
      setFailureMessage(JSON.stringify(models, null, 2));
      return;
    }
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
                  onClick={() => generateModels(modelTypes.SUNBURST)}
                >
                  Generate sunburst
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => generateModels(modelTypes.ACTION_CARDS)}
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
              {failureMessage && PrettyPrintJson(failureMessage)}
              {sunburstData && <Sunburst data={sunburstData} />}
            </>
          )}
        </main>
      </div>
      {actionCardData && <ActionCards models={actionCardData} />}
    </>
  );
};

const PrettyPrintJson = (data: any) => {
  // (destructured) data could be a prop for example
  return (
    <div>
      <pre>{data}</pre>
    </div>
  );
};

export default App;
