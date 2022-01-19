import { Button } from "@material-ui/core";
import React from "react";
import { Action, RootState, ProcedureData, BackendResponse } from "../types";
import { useSelector, useDispatch } from "react-redux";
import { generateActionCardData, getASPModels } from "../utils/utils";
import {
  setAcceptedActions,
  setActionCardData,
  setPreviousModel,
  setRevisedPlan,
  setRevisionOptions,
} from "../actions";
import { doc } from "@firebase/firestore";
import { useFirestore, useFirestoreDocData } from "reactfire";
import ActionCard from "./ActionCard";
import ActionCardSectionHeader from "./ActionCardSectionHeader";

interface Props {
  setFailureMessage: (data: string) => void;
  setIsLoading: (isLoading: boolean) => void;
}

const ActionCardSection: React.FC<Props> = (props) => {
  const { setFailureMessage, setIsLoading } = props;
  const firestore = useFirestore();

  const actionCardData = useSelector(
    (state: RootState) => state.actionCardData
  );
  const revisedPlan = useSelector((state: RootState) => state.revisedPlan);
  const collapsed = useSelector((state: RootState) => state.collapsed);
  const previousModel = useSelector((state: RootState) => state.previousModel);
  const tableMetaData = useSelector((state: RootState) => state.tableMetaData);
  const dispatch = useDispatch();

  const procedureRef = doc(firestore, "procedures", tableMetaData.key);
  const { data: procedureData } = useFirestoreDocData(procedureRef, {
    idField: "key",
  });

  const resetData = () => {
    dispatch(setActionCardData(null));
    dispatch(setRevisedPlan([]));
    dispatch(setRevisionOptions({ key: "", agents: [] }));
    dispatch(setAcceptedActions([]));
  };

  const submitRevision = async () => {
    resetData();
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
      dispatch(setActionCardData([]));
      setFailureMessage(JSON.stringify(error, null, 2));
      return;
    } else {
      dispatch(setPreviousModel(newPreviousModel as string[]));
      dispatch(
        setActionCardData(generateActionCardData(newModels as Action[][]))
      );
    }
  };

  return (
    <>
      {actionCardData &&
        actionCardData.map((actionCardSection) => (
          <>
            {console.log("ACEJFGEIO", actionCardData)}
            {actionCardSection.map((actions, i) => (
              <>
                <ActionCardSectionHeader index={i} actions={actions} />
                {!collapsed[i] && (
                  <div className="action-card-horizontal-scroll">
                    {actions.map((action, j) => (
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
