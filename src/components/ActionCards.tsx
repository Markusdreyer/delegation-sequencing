import MaterialTable from "material-table";
import { CheckCircle, ExpandMore, ExpandLess } from "@mui/icons-material/";
import { Button } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import {
  Action,
  RootState,
  TaxonomyData,
  ProcedureData,
  BackendResponse,
} from "../types";
import { ExpanderOptions } from "../utils/const";
import { useSelector, useDispatch } from "react-redux";
import { generateActionCardData, getASPModels, unique } from "../utils/utils";
import { setPreviousModel } from "../actions";
import { doc } from "@firebase/firestore";
import { useFirestore, useFirestoreDocData } from "reactfire";

interface Props {
  models: Action[][][];
  setActionCardData: (data: Action[][][]) => void;
  setFailureMessage: (data: string) => void;
  setIsLoading: (isLoading: boolean) => void;
}

const ActionCards: React.FC<Props> = (props) => {
  const { models, setActionCardData, setFailureMessage, setIsLoading } = props;
  const firestore = useFirestore();
  const activeTaxonomy = useSelector(
    (state: RootState) => state.activeTaxonomy
  );
  const previousModel = useSelector((state: RootState) => state.previousModel);
  const tableMetaData = useSelector((state: RootState) => state.tableMetaData);
  const dispatch = useDispatch();

  const taxonomyRef = doc(firestore, "taxonomies", activeTaxonomy);
  const { data: taxonomyData } = useFirestoreDocData(taxonomyRef, {
    idField: "key",
  });

  const procedureRef = doc(firestore, "procedures", tableMetaData.key);
  const { data: procedureData } = useFirestoreDocData(procedureRef, {
    idField: "key",
  });

  const [acceptedActions, setAcceptedActions] = useState<string[]>([]);
  const [collapsed, setCollapsed] = useState<boolean[]>([]);
  const [revisionOptions, setRevisionOptions] = useState<{
    key: string;
    agents: string[];
  }>({ key: "", agents: [] });

  const [changes, setChanges] = useState<string[]>([]);
  const columns = [
    { title: "Agent", field: "agent" },
    {
      title: "Action",
      field: "action",
    },
    {
      title: "Time",
      field: "time",
    },
  ];

  const options = {
    search: false,
    selection: false,
    showTitle: false,
    toolbar: false,
    paging: false,
    cellStyle: {
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
      overflow: "hidden",
      maxWidth: 300,
    },
    headerStyle: {
      width: 100,
      maxWidth: 100,
      height: 20,
      maxHeight: 20,
    },
    tableLaoyt: "auto",
  };

  useEffect(() => {
    console.log("PREVIOUS MODEL CHANGE", previousModel);
  }, [previousModel]);

  const parseActionToTableFormat = (action: Action) => {
    return [
      {
        agent: action.agent,
        action: action.name,
        time: action.time,
      },
    ];
  };

  const acceptAction = (action: Action, j: number) => {
    const abbreviation = getActionAbbreviation(action);
    const update = `schedule(${abbreviation}, ${action.agent}, ${action.time}).`;
    setChanges((previous) => [...previous, update]);
    setAcceptedActions((previous) => [...previous, action.name + j]);
  };

  const undoAccept = (actionName: string) => {
    const update = acceptedActions.filter((el) => el !== actionName);
    setAcceptedActions(update);
  };

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

  const reviseAction = (actionName: string, index: number) => {
    const agents = possibleAgents(actionName);
    setRevisionOptions({ key: actionName + index, agents });
  };

  const possibleAgents = (actionName: string) => {
    const index = procedureData.tableData.findIndex(
      (el: ProcedureData) => el.action === actionName
    );
    const teams = procedureData.tableData[index].agent as string[];
    const roles = procedureData.tableData[index].role as string[];
    const filteredRoles = roles.filter((el) => el);

    console.log("teams", teams);
    console.log("roles", roles);

    if (filteredRoles.length > 0) {
      return teams.map((team) => agentsWithRoleIn(team, filteredRoles)).flat();
    } else {
      return teams.map((team) => agentsIn(team)).flat();
    }
  };

  const agentsIn = (team: string) =>
    taxonomyData.tableData
      .filter((el: TaxonomyData) => el.parent === team)
      .map((el: TaxonomyData) => el.agent.toLowerCase())
      .filter(unique) as string[];

  const agentsWithRoleIn = (team: string, roles: string[]) =>
    taxonomyData.tableData
      .filter((el: TaxonomyData) => el.parent === team)
      .filter((el: TaxonomyData) => roles.includes(el.role))
      .map((el: TaxonomyData) => el.agent.toLowerCase())
      .filter(unique) as string[];

  const getActionAbbreviation = (action: Action) => {
    const index = procedureData.tableData.findIndex(
      (el: ProcedureData) => el.action === action.name
    );
    return procedureData.tableData[index].abbreviation;
  };

  const handleRevisionChange = (e: any, action: Action, j: number) => {
    const agent: string = e.currentTarget.value;
    const abbreviation = getActionAbbreviation(action);
    let update: string;
    if (agent === action.agent) {
      update = `relieve(${abbreviation}, ${agent}).`;
    } else {
      update = `schedule(${abbreviation}, ${agent}, ${action.time}).`;
    }

    setChanges((previous) => [...previous, update]);
    setRevisionOptions({ key: "", agents: [] });
    setAcceptedActions((previous) => [...previous, action.name + j]);
  };

  const submitRevision = async () => {
    const revisionRequest: any = {
      previousModel,
      changes,
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

      setChanges([]);
      setRevisionOptions({ key: "", agents: [] });
      setAcceptedActions([]);
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
                      {acceptedActions.includes(action.name + j) && (
                        <CheckCircle
                          className="checkmark"
                          fontSize="large"
                          onClick={() => undoAccept(action.name + j)}
                        />
                      )}
                      <div
                        data-testid="action-card"
                        className={`action-card ${
                          acceptedActions.includes(action.name + j)
                            ? "accepted"
                            : ""
                        }`}
                      >
                        <MaterialTable
                          options={options}
                          columns={columns}
                          data={parseActionToTableFormat(action)}
                        />
                        <div
                          className={`confirmation-card ${
                            acceptedActions.includes(action.name + j)
                              ? "hidden"
                              : ""
                          } ${
                            revisionOptions.key === action.name + j
                              ? "expanded"
                              : ""
                          }`}
                        >
                          {revisionOptions.key === action.name + j &&
                            revisionOptions.agents.map((agent) => (
                              <div
                                data-testid="revision-options"
                                className="revision-list-item"
                              >
                                <p>{agent}</p>
                                <Button
                                  data-testid={
                                    agent === action.agent
                                      ? "relieve-button"
                                      : "schedule-button"
                                  }
                                  variant={
                                    agent === action.agent
                                      ? "outlined"
                                      : "contained"
                                  }
                                  color={
                                    agent === action.agent
                                      ? "secondary"
                                      : "primary"
                                  }
                                  value={agent}
                                  onClick={(e) =>
                                    handleRevisionChange(e, action, j)
                                  }
                                >
                                  {agent === action.agent
                                    ? "Relieve"
                                    : "Schedule"}
                                </Button>
                              </div>
                            ))}
                          {revisionOptions.key !== action.name + j && (
                            <>
                              <Button
                                variant="contained"
                                color="primary"
                                onClick={() => acceptAction(action, j)}
                              >
                                Accept
                              </Button>
                              <Button
                                data-testid="revise-button"
                                variant="outlined"
                                color="secondary"
                                onClick={() => reviseAction(action.name, j)}
                              >
                                Revise
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
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

export default ActionCards;
