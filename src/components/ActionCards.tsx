import MaterialTable from "material-table";
import React from "react";
import { Action } from "../types";

interface Props {
  data: Action[][];
}

const ActionCards: React.FC<Props> = (props) => {
  const { data } = props;
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
      {data.map((model) => (
        <>
          <div className="action-card-horizontal-scroll">
            {model.map((action) => (
              <div className="action-card">
                <MaterialTable
                  options={options}
                  columns={columns}
                  data={parseActionToTableFormat(action)} //Ugly immutable hack: https://github.com/mbrn/material-table/issues/666
                />
              </div>
            ))}
          </div>
          <hr />
        </>
      ))}
    </>
  );
};

export default ActionCards;
