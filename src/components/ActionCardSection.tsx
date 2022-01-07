import { Button } from "@material-ui/core";
import React from "react";
import { Action, RootState, ProcedureData, BackendResponse } from "../types";
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
import ActionCardSectionHeader from "./ActionCardSectionHeader";

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
  const collapsed = useSelector((state: RootState) => state.collapsed);
  const previousModel = useSelector((state: RootState) => state.previousModel);
  const tableMetaData = useSelector((state: RootState) => state.tableMetaData);
  const dispatch = useDispatch();

  const procedureRef = doc(firestore, "procedures", tableMetaData.key);
  const { data: procedureData } = useFirestoreDocData(procedureRef, {
    idField: "key",
  });

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
              <ActionCardSectionHeader index={i} actions={time} />
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
