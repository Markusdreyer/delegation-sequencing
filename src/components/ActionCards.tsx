import MaterialTable from "material-table";
import { CheckCircle, ExpandMore, ExpandLess } from "@mui/icons-material/";
import Button from "@mui/material/Button";
import React, { useState } from "react";
import { Action } from "../types";
import { ExpanderOptions } from "../utils/const";

interface Props {
  models: Action[][][];
}

const ActionCards: React.FC<Props> = (props) => {
  const { models } = props;
  const [acceptedActions, setAcceptedActions] = useState<string[]>([]);
  const [collapsed, setCollapsed] = useState<boolean[]>([]);
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
                  {time.map((action) => (
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
                          }`}
                        >
                          <Button
                            variant="contained"
                            color="success"
                            onClick={() => acceptAction(action.name)}
                          >
                            Accept
                          </Button>
                          <Button variant="outlined" color="error">
                            Revise
                          </Button>
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
