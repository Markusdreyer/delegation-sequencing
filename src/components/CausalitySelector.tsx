import { Input, MenuItem, Select } from "@material-ui/core";
import React, { useState } from "react";
import { CausalityOptions } from "../types";

interface Props {
  onChange: (value: string[]) => void;
  options: CausalityOptions;
  values: string[];
}
//TODO: Causality table have ghost entries which need to be cleaned up. Also, the procedure table need to get real time updates from the causality editor,
//e.g. when adding a new causality, this should be immediately available in the multiselect options for the causality selector
const CausalitySelector: React.FC<Props> = (props) => {
  const { onChange, options, values } = props;
  const [causalitySelection, setCausalitySelection] = useState(
    values ? values : ["None", "None", "None"]
  );

  const handleChange = (
    evt: React.ChangeEvent<{
      name?: string | undefined;
      value: unknown;
    }>
  ) => {
    const update = causalitySelection;
    switch (evt.target.name) {
      case "causality":
        update[0] = evt.target.value as string;
        break;
      case "comparisonOperator":
        update[1] = evt.target.value as string;
        break;
      case "threshold":
        update[2] = evt.target.value as string;
        break;
      default:
        break;
    }
    setCausalitySelection(update);
    onChange(causalitySelection);
  };

  return (
    <>
      <Select
        onChange={(
          evt: React.ChangeEvent<{
            name?: string | undefined;
            value: unknown;
          }>
        ) => {
          handleChange(evt);
        }}
        name="causality"
        value={
          causalitySelection[0] !== undefined ? causalitySelection[0] : "None"
        }
      >
        {options.causalities.map((el: string) => (
          <MenuItem key={el} value={el}>
            {el}
          </MenuItem>
        ))}
      </Select>
      <Select
        onChange={(
          evt: React.ChangeEvent<{
            name?: string | undefined;
            value: unknown;
          }>
        ) => {
          handleChange(evt);
        }}
        name="comparisonOperator"
        value={
          causalitySelection[1] !== undefined ? causalitySelection[1] : "None"
        }
      >
        {options.comparisonOperators.map((el: string) => (
          <MenuItem key={el} value={el}>
            {el}
          </MenuItem>
        ))}
      </Select>
      <Input
        placeholder="Threshold"
        onChange={(
          evt: React.ChangeEvent<{
            name?: string | undefined;
            value: unknown;
          }>
        ) => {
          handleChange(evt);
        }}
        name="threshold"
        value={
          causalitySelection[2] !== undefined ? causalitySelection[2] : "None"
        }
      />
    </>
  );
};

export default CausalitySelector;
