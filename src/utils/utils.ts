import md5 from "md5";

export const generateSunburstData = (models: any) => {
  const values = generateValues(models);
  console.log("VALUES: ", values);
  const foo: any = [];
  const preparedData = models
    .map((model: any, i: number) => {
      let parents: string[] = [];
      const thing = model.map((el: any, j: number) => {
        const hash = md5(`${el.agent}${el.action}, at ${el.time}`);
        parents.push(`${hash}-${el.time}`);
        const bar = {
          id: hash,
          parent: `${
            parents.length > 1 && parents[j - 1].split("-")[1] === el.time
              ? ""
              : parents[j - 1]
          }`,
          name: `${el.agent}, ${el.action}, at ${el.time}`,
          value: 100 / values[el.time].length,
        };
        if (!foo.some((el: any) => el.id === hash)) {
          foo.push(bar);
        }
      });
      return thing;
    })
    .flat(1);
  return foo;
};

//SET PARENT PROPERLY

const generateValues = (models: any) => {
  const valueEstimator: any = [];
  models.map((model: any, i: number) => {
    model.map((el: any, j: number) => {
      const hash = md5(`${el.agent}${el.action}, at ${el.time}`);
      if (typeof valueEstimator[el.time] === "undefined") {
        valueEstimator[el.time] = [];
      }

      if (valueEstimator[el.time].indexOf(hash) === -1) {
        valueEstimator[el.time].push(`${hash}`);
      }
    });
  });
  return valueEstimator;
};

const prepareMetaData = (models: any) => {
  const valueEstimator: any = []; //USED TO CALCULATE VALUE
  models
    .map((model: any, i: number) => {
      const parents: string[] = [];
      const thing = model.map((el: any, j: number) => {
        const hash = md5(`${el.agent}${el.action}, at ${el.time}`);
        parents.push(hash);
        return {
          id: hash,
          parent: `${parents.length < 2 ? "" : parents[j - 1]}`,
          name: `${el.agent}, ${el.action}, at ${el.time}`,
          value: 0,
        };
      });
      return thing;
    })
    .flat(1);
};

/**
 * 1. Estimere verdi per nivå -> Samle antall elementer per nivå / 100
 * 2. Sette parent per element -> Parent er hash av forrige action
 */

const props = [
  { id: "hash", parent: "", name: "action1", value: 50 },
  { id: "hash2", parent: "", name: "action2", value: 50 },
  { id: "hash4", parent: "hash", name: "action3", value: 75 },
  { id: "hash5", parent: "has4", name: "action4", value: 25 },
];

const propose = {
  1: ["hash1", "hash2", "hash3"],
  2: ["hash1", "hash2", "hash3"],
  3: ["hash1", "hash2", "hash3"],
};

/* [
  {actions, actions, actions},
  {action}
] */

/* [
  {
    id: "0.0.0",
    parent: "",
    name: "liz, Second attack engine crew turn-out, at 1",
    value: 20,
  },
  {
    id: "0.1.0",
    parent: "0.0.0",
    name: "barry, Attack engine crew turn-out, at 1",
    value: 20,
  },
  {
    id: "0.2.0",
    parent: "0.1.0",
    name: "kathrin, Travel of second engine crew to 911 address, at 2",
    value: 20,
  },
]; */

/**
 * "expedite(b,liz,1)"
 * "expedite(a,barry,1)"
 * "expedite(c,lin,1)"
 * "expedite(b,kathrin,1)"
 * "expedite(b,jan,1)"
 * "expedite(c,xi,1)"
 */
