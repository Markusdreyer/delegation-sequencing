import * as converter from "number-to-words";

export const isSubClass = (child: string, parent: string) => {
  return `is_subclass(${createReadableConst(child)}, ${createReadableConst(
    parent
  )}).\n`;
};

export const isA = (child: string, parent: string) => {
  return `is_a(${createReadableConst(child)}, ${createReadableConst(
    parent
  )}).\n`;
};

export const property = (child: string, parent: string) => {
  return `property(${createReadableConst(child)}, ${createReadableConst(
    parent
  )}).\n`;
};

export const roleProperty = (role: string) => {
  return `property(Ag, ${createReadableConst(role)}), `;
};

export const delegate = (
  abbreviation: string,
  quantity: number,
  agent: string
) => {
  return `delegate(${abbreviation}, ${quantity}, ${createReadableConst(
    agent
  )}) :- ${deploy(abbreviation)}`;
};

export const responsible = (abbreviation: string) => {
  return `responsible(${abbreviation}, Ag) :- ${deploy(abbreviation)}`;
};

const deploy = (abbreviation: string) => {
  return `deploy(${abbreviation}), `;
};

export const member = (agent: string) => {
  return `member(Ag, ${createReadableConst(agent)}). \n`;
};

export const collaborative = (abbreviation: string) => {
  return `collaborative(${abbreviation}) . \n`;
};

export const primitive = (abbreviation: string) => {
  return `primitive(${abbreviation}) . \n`;
};

export const createReadableConst = (input: string) => {
  if (!input) {
    console.log("No input");
    return null;
  }
  const readableConst = input
    .replace(/\d.{2}/g, numberConverter)
    .replace(/\s/g, "")
    .replace(/[æøå]/g, "");
  return readableConst.charAt(0).toLowerCase() + readableConst.slice(1);
};

const numberConverter = (stringNumber: string) => {
  console.log("Number converter match: ", stringNumber);
  const ordinals = ["st", "nd", "rd", "th"];

  if (ordinals.includes(stringNumber.slice(-2).toLowerCase())) {
    return converter.toWordsOrdinal(stringNumber.slice(0, -2));
  }

  return stringNumber.replace(/\d/g, converter.toWordsOrdinal);
};
