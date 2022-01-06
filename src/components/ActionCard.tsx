import { Button } from "@material-ui/core";
import { CheckCircle } from "@material-ui/icons";
import { doc } from "firebase/firestore";
import MaterialTable from "material-table";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useFirestore, useFirestoreDocData } from "reactfire";
import {
  setAcceptedActions,
  setRevisedPlan,
  setRevisionOptions,
} from "../actions";
import { Action, ProcedureData, RootState, TaxonomyData } from "../types";
import { unique } from "../utils/utils";

interface Props {
  index: number;
  action: Action;
}

const ActionCard: React.FC<Props> = ({ index, action }) => {
  const firestore = useFirestore();
  const tableMetaData = useSelector((state: RootState) => state.tableMetaData);
  const revisedPlan = useSelector((state: RootState) => state.revisedPlan);
  const acceptedActions = useSelector(
    (state: RootState) => state.acceptedActions
  );

  const revisionOptions = useSelector(
    (state: RootState) => state.revisionOptions
  );
  const activeTaxonomy = useSelector(
    (state: RootState) => state.activeTaxonomy
  );

  const taxonomyRef = doc(firestore, "taxonomies", activeTaxonomy);
  const { data: taxonomyData } = useFirestoreDocData(taxonomyRef, {
    idField: "key",
  });

  const dispatch = useDispatch();

  const procedureRef = doc(firestore, "procedures", tableMetaData.key);
  const { data: procedureData } = useFirestoreDocData(procedureRef, {
    idField: "key",
  });

  const reviseAction = (actionName: string, index: number) => {
    const agents = possibleAgents(actionName);
    dispatch(setRevisionOptions({ key: actionName + index, agents }));
  };

  const getActionAbbreviation = (action: Action) => {
    const index = procedureData.tableData.findIndex(
      (el: ProcedureData) => el.action === action.name
    );
    return procedureData.tableData[index].abbreviation;
  };

  const possibleAgents = (actionName: string) => {
    const index = procedureData.tableData.findIndex(
      (el: ProcedureData) => el.action === actionName
    );
    const teams = procedureData.tableData[index].agent as string[];
    const roles = procedureData.tableData[index].role as string[];
    const filteredRoles = roles.filter((el) => el);

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

  const acceptAction = (action: Action, index: number) => {
    const abbreviation = getActionAbbreviation(action);
    const update = `schedule(${abbreviation}, ${action.agent}, ${action.time}).`;

    dispatch(setRevisedPlan([...revisedPlan, update]));
    dispatch(setAcceptedActions([...acceptedActions, action.name + index]));
  };

  const handleRevisionChange = (e: any, action: Action, index: number) => {
    const agent: string = e.currentTarget.value;
    const abbreviation = getActionAbbreviation(action);
    let update: string;
    if (agent === action.agent) {
      update = `relieve(${abbreviation}, ${agent}).`;
    } else {
      update = `schedule(${abbreviation}, ${agent}, ${action.time}).`;
    }

    dispatch(setRevisedPlan([...revisedPlan, update]));
    dispatch(setAcceptedActions([...acceptedActions, action.name + index]));
    dispatch(setRevisionOptions({ key: "", agents: [] }));
  };

  const parseActionToTableFormat = (action: Action) => {
    return [
      {
        agent: action.agent,
        action: action.name,
        time: action.time,
      },
    ];
  };

  const undoAccept = (actionName: string) => {
    const update = acceptedActions.filter((el) => el !== actionName);
    dispatch(setAcceptedActions(update));
  };

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

  return (
    <>
      {acceptedActions.includes(action.name + index) && (
        <CheckCircle
          className="checkmark"
          fontSize="large"
          onClick={() => undoAccept(action.name + index)}
        />
      )}
      <div
        data-testid="action-card"
        className={`action-card ${
          acceptedActions.includes(action.name + index) ? "accepted" : ""
        }`}
      >
        <MaterialTable
          options={options}
          columns={columns}
          data={parseActionToTableFormat(action)}
        />
        <div
          className={`confirmation-card ${
            acceptedActions.includes(action.name + index) ? "hidden" : ""
          } ${revisionOptions.key === action.name + index ? "expanded" : ""}`}
        >
          {revisionOptions.key === action.name + index &&
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
                  variant={agent === action.agent ? "outlined" : "contained"}
                  color={agent === action.agent ? "secondary" : "primary"}
                  value={agent}
                  onClick={(e) => handleRevisionChange(e, action, index)}
                >
                  {agent === action.agent ? "Relieve" : "Schedule"}
                </Button>
              </div>
            ))}
          {revisionOptions.key !== action.name + index && (
            <>
              <Button
                variant="contained"
                color="primary"
                onClick={() => acceptAction(action, index)}
              >
                Accept
              </Button>
              <Button
                data-testid="revise-button"
                variant="outlined"
                color="secondary"
                onClick={() => reviseAction(action.name, index)}
              >
                Revise
              </Button>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default ActionCard;