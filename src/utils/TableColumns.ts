export const tableColumns = {
  procedures: [
    { title: "Action", field: "action" },
    {
      title: "Agents",
      field: "agents",
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
  ],
};
