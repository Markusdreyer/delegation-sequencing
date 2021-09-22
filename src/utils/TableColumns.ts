export const tableColumns = {
  procedures: [
    { title: "Action", field: "action" },
    {
      title: "Role",
      field: "role",
      lookup: {
        driver: "driver",
      },
    },
    {
      title: "Agent",
      field: "agent",
      lookup: {
        ae_crew: "ae_crew",
        se_crew: "se_crew",
        lt_crew: "lt_crew",
      },
    },
    {
      title: "Quantity",
      field: "quantity",
    },
    {
      title: "Abbreviation",
      field: "abbreviation",
      lookup: {
        a: "a",
        b: "b",
        c: "c",
        d: "d",
        e: "e",
        f: "f",
        g: "g",
        h: "h",
        i: "i",
        j: "j",
        k: "k",
        l: "l",
        m: "m",
        n: "n",
      },
    },

    {
      title: "Precedence",
      field: "precedence",
      lookup: {
        None: "None",
        a: "a",
        b: "b",
        c: "c",
        d: "d",
        e: "e",
        f: "f",
        g: "g",
        h: "h",
        i: "i",
        j: "j",
        k: "k",
        l: "l",
        m: "m",
        n: "n",
      },
    },
  ],
  taxonomies: [
    {
      title: "Agent",
      field: "agent",
    },
    {
      title: "Role",
      field: "role",
    },
    {
      title: "Parent",
      field: "parent",
      lookup: {
        None: "None",
        "1st Attack Engine Crew": "1st Attack Engine Crew",
        "2nd Attack Engine Crew": "2nd Attack Engine Crew",
      },
    },
  ],
};
