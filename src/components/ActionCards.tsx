import MaterialTable from "material-table";
import React from "react";
import { Action } from "../types";

interface Props {
  models: Action[][][];
}

const ActionCards: React.FC<Props> = (props) => {
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

  return (
    <>
      {models.map((model) => (
        <>
          {model.map((time, i) => (
            <>
              <h2>Actions at {i + 1}: </h2>
              <div className="action-card-horizontal-scroll">
                {time.map((action) => (
                  <div className="action-card">
                    <MaterialTable
                      options={options}
                      columns={columns}
                      data={parseActionToTableFormat(action)}
                    />
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
