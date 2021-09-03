import { Models, Response, Witnesses } from "./types";

export const isSubClass = (child: string, parent: string) => {
  return `is_subclass(${child}, ${parent}).\n`;
};

export const isA = (child: string, parent: string) => {
  return `is_a(${child}, ${parent}).\n`;
};

export const property = (child: string, parent: string) => {
  return `property(${child}, ${parent}).\n`;
};

export const sortModels = (models: any): Response => {
  if (!models) {
    const error: Response = {
      status: 500,
      body: "No models to sort",
    };
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
