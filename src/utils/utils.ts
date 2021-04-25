import md5 from "md5";

export const generateSunburstData = (models: any) => {
  /**
   * Iterate through all the models, looking through all the data to set the correct
   * values and parents.
   */
  const values = generateValues(models);
  const sunburstData: any = [];
  models
    .map((model: any, i: number) => {
      let parents: string[] = [];
      return model.map((el: any, j: number) => {
        const hash = md5(`${el.agent}${el.action}, at ${el.time}`);
        const id = `${hash}-${el.time}`;
        const parent = getParent(parents, el.time, j);

        parents.push(id);

        const sunburstSection = {
          id: id,
          parent: parent,
          name: `${el.agent}, ${el.action}, at ${el.time}`,
          value: 100 / values[el.time].length,
        };
        if (!sunburstData.some((section: any) => section.id === id)) {
          //Check if section already exist
          sunburstData.push(sunburstSection);
        }
      });
    })
    .flat(1);
  return sunburstData;
};

const getParent = (parents: string[], time: string, index: number) => {
  /**
   *
   * Check through parents, and find latest parent from circle before.
   * 1. Every element should have a parent, except the first
   * 2. No elements should have parent at the same level
   * 3. The parent of a level should be the last in the previous
   * 4.
   */
  if (parents.length < 1) {
    //Satisfies #1
    return "";
  }

  //each entry in parents is a hashed value of agent, action and time with the time appended with dash: AD3df2dj84KaL8-1
  if (parents[index - 1].split("-")[1] === time && time === "1") {
    //Satistfies #2
    return "";
  }

  if (parents[index - 1].split("-")[1] === time) {
    /**
     * Child and parrent occur on the same level. Need to find element from previous level
     * Currently this is causing issues, since it's finding the last element from the previous level
     * and all the models has the same action and agent as the last element.
     */
    for (let i = 0; i < parents.length; i++) {
      if (parents[i].split("-")[1] === time) {
        //Means we reached current level, and should set the previous element as parent
        return parents[i - 1];
      }
    }
  } else {
    return parents[index - 1];
  }
};

const generateValues = (models: any) => {
  /**
   * Estimate value for each section by finding out how many sections are
   * on the current level.
   */
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
