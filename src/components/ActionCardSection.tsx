import { ExpandMore, ExpandLess } from "@mui/icons-material/";
import { Button } from "@material-ui/core";
import React, { useState } from "react";
import { Action, RootState, ProcedureData, BackendResponse } from "../types";
import { ExpanderOptions } from "../utils/const";
import { useSelector, useDispatch } from "react-redux";
import { generateActionCardData, getASPModels } from "../utils/utils";
import {
  setAcceptedActions,
  setPreviousModel,
  setRevisedPlan,
  setRevisionOptions,
} from "../actions";
import { doc } from "@firebase/firestore";
import { useFirestore, useFirestoreDocData } from "reactfire";
import ActionCard from "./ActionCard";

interface Props {
  models: Action[][][];
  setActionCardData: (data: Action[][][]) => void;
  setFailureMessage: (data: string) => void;
  setIsLoading: (isLoading: boolean) => void;
}

const ActionCardSection: React.FC<Props> = (props) => {
  const { models, setActionCardData, setFailureMessage, setIsLoading } = props;
  const firestore = useFirestore();

  const revisedPlan = useSelector((state: RootState) => state.revisedPlan);
  const acceptedActions = useSelector(
    (state: RootState) => state.acceptedActions
  );
  const previousModel = useSelector((state: RootState) => state.previousModel);
  const tableMetaData = useSelector((state: RootState) => state.tableMetaData);
  const dispatch = useDispatch();

  const procedureRef = doc(firestore, "procedures", tableMetaData.key);
  const { data: procedureData } = useFirestoreDocData(procedureRef, {
    idField: "key",
  });

  const [collapsed, setCollapsed] = useState<boolean[]>([]);

  const handleExpand = (option: ExpanderOptions, index: number) => {
    const update = [...collapsed];
    if (option === ExpanderOptions.EXPAND) {
      update[index] = false;
      setCollapsed(update);
    } else {
      update[index] = true;
      setCollapsed(update);
    }
  };

  const submitRevision = async () => {
    const revisionRequest: any = {
      previousModel,
      changes: revisedPlan,
    };

    setIsLoading(true);
    const { newModels, newPreviousModel, error }: BackendResponse =
      await getASPModels(
        procedureData.tableData as ProcedureData[],
        revisionRequest,
        "revise",
        1
      );
    setIsLoading(false);

    if (error) {
      console.log("Error", error);
      setActionCardData([]);
      setFailureMessage(JSON.stringify(error, null, 2));
      return;
    } else {
      dispatch(setPreviousModel(newPreviousModel as string[]));
      setActionCardData(generateActionCardData(newModels as Action[][]));

      dispatch(setRevisedPlan([]));
      dispatch(setRevisionOptions({ key: "", agents: [] }));
      dispatch(setAcceptedActions([]));
    }
  };

  return (
    <>
      {models.map((model) => (
        <>
          {model.map((time, i) => (
            <>
              <div className="actions-header">
                <h2>Actions at {i + 1}: </h2>
                <p>
                  {" "}
                  Accepted{" "}
                  {time.reduce(
                    (a, v) => (acceptedActions.includes(v.name) ? a + 1 : a),
                    0
                  )}{" "}
                  of {time.length}
                </p>
                {collapsed[i] ? (
                  <div
                    className="expander"
                    onClick={() => handleExpand(ExpanderOptions.EXPAND, i)}
                  >
                    <p>Show actions</p>
                    <ExpandMore />
                  </div>
                ) : (
                  <div
                    className="expander"
                    onClick={() => handleExpand(ExpanderOptions.COLLAPSE, i)}
                  >
                    <p>Hide actions</p>
                    <ExpandLess />
                  </div>
                )}
              </div>
              {!collapsed[i] && (
                <div className="action-card-horizontal-scroll">
                  {time.map((action, j) => (
                    <div className="container">
                      <ActionCard index={j} action={action} />
                    </div>
                  ))}
                </div>
              )}
            </>
          ))}
          <hr />
        </>
      ))}
      <Button
        data-testid="revision-submit-button"
        variant="contained"
        color="primary"
        onClick={() => submitRevision()}
      >
        Submit revised plan
      </Button>
    </>
  );
};

export default ActionCardSection;
