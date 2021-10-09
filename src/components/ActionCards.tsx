import MaterialTable from "material-table";
import Button from "@mui/material/Button";
import React, { useState } from "react";
import { Action } from "../types";

interface Props {
  models: Action[][][];
}

const ActionCards: React.FC<Props> = (props) => {
  const [foo, setFoo] = useState<Action>();
  const { models } = props;
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

  const acceptAction = (action: any) => {
    setFoo(action);
  };

  return (
    <>
      {models.map((model) => (
        <>
          {model.map((time, i) => (
            <>
              <h2>Actions at {i + 1}: </h2>
              <div className="action-card-horizontal-scroll">
                {time.map((action) => (
                  <div
                    className={`action-card ${
                      foo === action ? "accepted" : ""
                    }`}
                  >
                    <MaterialTable
                      options={options}
                      columns={columns}
                      data={parseActionToTableFormat(action)}
                    />
                    <div className="confirmation-card">
                      <Button
                        variant="contained"
                        color="success"
                        onClick={() => acceptAction(action)}
                      >
                        Accept
                      </Button>
                      <Button variant="outlined" color="error">
                        Revise
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ))}
          <hr />
        </>
      ))}
    </>
  );
};

export default ActionCards;
