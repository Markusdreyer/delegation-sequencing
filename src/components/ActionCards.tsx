import MaterialTable from "material-table";
import { CheckCircle, ExpandMore, ExpandLess } from "@mui/icons-material/";
import { Button } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { Action, RootState, TaxonomyData, ProcedureData } from "../types";
import { ExpanderOptions } from "../utils/const";
import { useSelector } from "react-redux";
import { unique } from "../utils/utils";

interface Props {
  models: Action[][][];
}

const ActionCards: React.FC<Props> = (props) => {
  const taxonomies = useSelector((state: RootState) => state.taxonomies);
  const tableData = useSelector((state: RootState) => state.tableData);
  const activeTaxonomy = useSelector(
    (state: RootState) => state.activeTaxonomy
  );
  const { models } = props;
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

  const parseActionToTableFormat = (action: Action) => {
    return [
      {
        agent: action.agent,
        action: action.name,
        time: action.time,
      },
    ];
  };

  const acceptAction = (actionName: string) => {
    setAcceptedActions((previous) => [...previous, actionName]);
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

  const reviseAction = (actionName: string) => {
    const agents = possibleAgents(actionName);
    setRevisionOptions({ key: actionName, agents });
  };

  const possibleAgents = (actionName: string) => {
    const procedureData = tableData.data as ProcedureData[];
    const index = procedureData.findIndex((el) => el.action === actionName);
    const teams = procedureData[index].agent as string[];

    return teams.map((team) => agentsIn(team)).flat();
  };

  const agentsIn = (team: string) => {
    return taxonomies[activeTaxonomy]
      .filter((el: TaxonomyData) => el.parent === team)
      .map((el: TaxonomyData) => el.agent)
      .filter(unique) as string[];
  };

  const handleRevisionChange = (e: any) => {
    //TODO: IMPLEMENT. Need to get abbreviation somehow
    const action: string = e.target.value.toLowerCase();
    let update: string;
    if (action === "relieve") {
      update = `relieve()`;
    }

    setChanges((previous) => [...previous]);
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
                      {acceptedActions.includes(action.name) && (
                        <CheckCircle
                          className="checkmark"
                          fontSize="large"
                          onClick={() => undoAccept(action.name)}
                        />
                      )}
                      <div
                        className={`action-card ${
                          acceptedActions.includes(action.name)
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
                            acceptedActions.includes(action.name)
                              ? "hidden"
                              : ""
                          } ${
                            revisionOptions.key === action.name
                              ? "expanded"
                              : ""
                          }`}
                        >
                          {revisionOptions.key === action.name &&
                            revisionOptions.agents.map((agent) => (
                              <div className="revision-list-item">
                                <p>{agent}</p>
                                <Button
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
                                  onClick={(e) => handleRevisionChange(e)}
                                >
                                  {agent === action.agent
                                    ? "Relieve"
                                    : "Schedule"}
                                </Button>
                              </div>
                            ))}
                          {revisionOptions.key !== action.name && (
                            <>
                              <Button
                                variant="contained"
                                color="primary"
                                onClick={() => acceptAction(action.name)}
                              >
                                Accept
                              </Button>
                              <Button
                                variant="outlined"
                                color="secondary"
                                onClick={() => reviseAction(action.name)}
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
    </>
  );
};

export default ActionCards;
