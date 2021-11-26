import { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Button,
  CircularProgress,
} from "@material-ui/core";

import Sunburst from "./components/Sunburst";
import clsx from "clsx";
import {
  generateActionCardData,
  generateSunburstData,
  getASPModels,
} from "./utils/utils";
import { Action, BackendResponse, ProcedureData, RootState } from "./types";
import { useSelector, useDispatch } from "react-redux";
import { renderTable, setPreviousModel, toggleDialog } from "./actions";
import Sidebar from "./components/Sidebar";
import Table from "./components/Table";
import useStyles from "./Styles";
import { dialogOptions, modelTypes, tableTypes } from "./utils/const";
import ActionCards from "./components/ActionCards";
import { FirestoreProvider, useFirestoreDocData } from "reactfire";
import { collection, doc, setDoc } from "firebase/firestore";
import { getFirestore } from "@firebase/firestore";

const App = () => {
  const db = getFirestore();
  const showSidebar = useSelector((state: RootState) => state.showSidebar);
  const tableData = useSelector((state: RootState) => state.tableData);
  const activeTaxonomy = useSelector(
    (state: RootState) => state.activeTaxonomy
  );
  const dialog = useSelector((state: RootState) => state.dialog);
  const [sunburstData, setSunburstData] = useState();
  const [actionCardData, setActionCardData] = useState<Action[][][]>();
  const [newDocument, setNewDocument] = useState("");
  const [failureMessage, setFailureMessage] = useState<string>();
  const [isLoading, setIsLoading] = useState(false);

  const taxonomyRef = doc(db, "taxonomies", activeTaxonomy);
  const { data: taxonomyData } = useFirestoreDocData(taxonomyRef, {
    idField: "key",
  });
  const procedureRef = doc(db, "procedures", tableData.key);
  const { data: procedureData } = useFirestoreDocData(procedureRef, {
    idField: "key",
  });

  const dispatch = useDispatch();
  const classes = useStyles();

  useEffect(() => {
    setActionCardData(undefined);
    setSunburstData(undefined);
    setFailureMessage(undefined);
  }, [activeTaxonomy]);

  const createNewDocument = async () => {
    if (dialog.title === dialogOptions.PROCEDURE.title) {
      dispatch(renderTable(tableTypes.PROCEDURES, newDocument));
      await setDoc(doc(db, "procedures", newDocument), { tableData: [] });
      //firebase refactor dispatch(setProcedure(newDocument, []));
    } else if (dialog.title === dialogOptions.TAXONOMY.title) {
      dispatch(renderTable(tableTypes.TAXONOMIES, newDocument));
      await setDoc(doc(db, "taxonomies", newDocument), { tableData: [] });
      //firebase refactor dispatch(setTaxonomy(newDocument, []));
    } else {
      console.log(
        `${dialog.title} does not match ${dialogOptions.PROCEDURE.title} or ${dialogOptions.TAXONOMY.title}`
      );
    }
    dispatch(toggleDialog());
  };

  const generateModels = async (modelType: string) => {
    setSunburstData(undefined);
    setActionCardData(undefined);
    setFailureMessage(undefined);

    const tmpProcedure = JSON.parse(JSON.stringify(procedureData.tableData));
    tmpProcedure.forEach((el: ProcedureData) => {
      el.role = (el.role as string[]).filter((e) => e).join(",");
      el.agent = (el.agent as string[]).filter((e) => e).join(",");
    });

    const requestData = {
      taxonomy: taxonomyData.tableData,
      procedure: tmpProcedure,
    };

    setIsLoading(true);
    const { newModels, newPreviousModel, error }: BackendResponse =
      await getASPModels(tmpProcedure, requestData, "initial", 1);
    setIsLoading(false);

    if (error) {
      setSunburstData(undefined);
      setActionCardData(undefined);
      setFailureMessage(JSON.stringify(error, null, 2));
      return;
    }

    console.log("MODELS:: ", newModels);

    dispatch(setPreviousModel(newPreviousModel as string[]));
    if (modelType === modelTypes.SUNBURST) {
      setFailureMessage(undefined);
      setActionCardData(undefined);
      setSunburstData(generateSunburstData(newModels as Action[][]));
    } else if (modelType === modelTypes.ACTION_CARDS) {
      setFailureMessage(undefined);
      setSunburstData(undefined);
      setActionCardData(generateActionCardData(newModels as Action[][]));
    } else {
      console.log(`${modelType} is not yet implemented`);
    }
  };

  return (
    <FirestoreProvider sdk={db}>
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
                  data-testid="generate-action-cards-button"
                  variant="contained"
                  color="primary"
                  onClick={() => generateModels(modelTypes.ACTION_CARDS)}
                >
                  Generate action cards
                </Button>
              </div>
              {failureMessage && PrettyPrintJson(failureMessage)}
              {sunburstData && <Sunburst data={sunburstData} />}
            </>
          )}
        </main>
      </div>
      {isLoading && (
        <div style={{ display: "flex", justifyContent: "center" }}>
          <CircularProgress />
        </div>
      )}
      {actionCardData && (
        <ActionCards
          models={actionCardData}
          setActionCardData={setActionCardData}
          setFailureMessage={setFailureMessage}
          setIsLoading={setIsLoading}
        />
      )}
    </FirestoreProvider>
  );
};

const PrettyPrintJson = (data: any) => {
  return (
    <div>
      <pre>{data}</pre>
    </div>
  );
};

export default App;
