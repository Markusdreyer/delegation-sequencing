import * as converter from "number-to-words";
import { Models, Response, Witnesses } from "./types";

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

export const sortModels = (models: any): Response => {
  if (!models) {
    const error: Response = {
      status: 500,
      body: "No models to sort",
    };
    return error;
  }

  if (Object.keys(models.Call[0]).length < 1) {
    const error: Response = {
      status: 400,
      body: models,
    };
    console.log("UNSATISFIABLE MODEL: ", models);
    return error;
  }

  if (models.Call.length > 1) {
    const error: Response = {
      status: 500,
      body: "Could not sort models because multiple calls were detected",
    };
    return error;
  }

  models.Call[0].Witnesses.map((model: Witnesses) => {
    model.Value.sort((a, b) =>
      a.split(",")[2].localeCompare(b.split(",")[2], "en", { numeric: true })
    );
  });

  const success: Response = {
    status: 200,
    body: models,
  };

  return success;
};

export const createReadableConst = (input: string): string => {
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

export const parseModel = (model: string) => {
  const parsedModel = model.split(")");
  parsedModel.filter((el) => el);
  const resList: string[] = [];
  parsedModel.forEach((el) => {
    let res = el.trim();
    if (res.slice(-1) !== ")") {
      res += ")";
    }
    resList.push(res);
  });
  return resList;
};
