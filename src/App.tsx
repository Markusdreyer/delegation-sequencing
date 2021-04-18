import React, { useState } from "react";
import axios from "axios";
import {
  Divider,
  Toolbar,
  AppBar,
  Drawer,
  ListItem,
  List,
  ListItemIcon,
  IconButton,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Button,
  Collapse,
} from "@material-ui/core";
import {
  Add,
  Description,
  ChevronLeft,
  ChevronRight,
  Menu,
  Assignment,
  ExpandLess,
  ExpandMore,
  AccountTree,
} from "@material-ui/icons";
import {
  makeStyles,
  useTheme,
  Theme,
  createStyles,
} from "@material-ui/core/styles";
import Sunburst from "./components/Sunburst";
import clsx from "clsx";

import { sunburstMockData, tableMockData } from "./utils/mockData";
import { TableData } from "./types";
import { useSelector, useDispatch } from "react-redux";
import { toggleSidebar, toggleDialog } from "./actions";

const drawerWidth = 240;
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: "flex",
    },
    appBar: {
      transition: theme.transitions.create(["margin", "width"], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
    },
    appBarShift: {
      width: `calc(100% - ${drawerWidth}px)`,
      marginLeft: drawerWidth,
      transition: theme.transitions.create(["margin", "width"], {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
    hide: {
      display: "none",
    },
    drawer: {
      width: drawerWidth,
      flexShrink: 0,
    },
    drawerPaper: {
      width: drawerWidth,
    },
    drawerHeader: {
      display: "flex",
      alignItems: "center",
      padding: theme.spacing(0, 1),
      // necessary for content to be below app bar
      ...theme.mixins.toolbar,
      justifyContent: "flex-end",
    },
    content: {
      flexGrow: 1,
      transition: theme.transitions.create("margin", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      marginLeft: -drawerWidth,
    },
    contentShift: {
      transition: theme.transitions.create("margin", {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: 0,
    },
    nested: {
      paddingLeft: theme.spacing(4),
    },
  })
);

const App = () => {
  const sidebar = useSelector((state: any) => state.sidebar);
  const dialog = useSelector((state: any) => state.dialog);

  const dispatch = useDispatch();

  const classes = useStyles();
  const theme = useTheme();
  const [sunburstData, setSunburstData] = useState(sunburstMockData);

  const [newProcedure, setNewProcedure] = useState("");
  const [tableData, setTableData]: any = useState(tableMockData);

  const [columns, setColumns]: any = useState([
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
  ]);
  const [currentProcedure, setCurrentProcedure] = useState(procedures[0]);

  const createNewProcedure = () => {
    setTableData({
      ...tableData,
      [newProcedure]: [],
    });
    setProcedures([...procedures, newProcedure]);
    setCurrentProcedure(newProcedure);
    dispatch(toggleDialog());
    console.log(procedures);
    console.log(tableData);
  };

  const generateSunburst = () => {
    const tableJSON = JSON.stringify(tableData[currentProcedure]);
    axios({
      method: "post",
      url: "http://localhost:8000/asp-parser",
      data: tableJSON,
      headers: {
        "Content-Type": "application/json",
      },
    }).then((res) => {
      console.log(res);
      const data = JSON.parse(res.data);
      console.log(data);
      const [optimum] = data.Call[0].Witnesses.slice(-1);
      const optimumCost = optimum.Costs[0];
      let parsedActions: any = [];
      optimum.Value.map((el: any) => {
        const expedite = el.split(/[\(\)\s,]+/);
        const abbreviation = expedite[1];
        const agent = expedite[2];
        const time = expedite[3];
        const actionLookup = tableData[currentProcedure].find(
          (el: TableData) => el.abbreviation === abbreviation
        ).action;

        const actionObject = {
          action: actionLookup,
          agent: agent,
          time: time,
        };
        parsedActions.push(actionObject);
      });
      const sortedActions = parsedActions.sort((a: any, b: any) =>
        a.time > b.time ? 1 : b.time > a.time ? -1 : 0
      );
      console.log(sortedActions);

      setSunburstData(
        sortedActions.map((el: any, i: any) => ({
          id: `${i}.0`,
          parent: `${i === 0 ? "" : `${i - 1}.0`}`,
          name: `${el.agent}, ${el.action}, at ${el.time}`,
          value: 100,
        }))
      );
    });
  };

  return (
    <div className={classes.root}>
      <main
        className={clsx(classes.content, {
          [classes.contentShift]: sidebar,
        })}
      >
        <div className={classes.drawerHeader} />
        <Dialog
          open={dialog}
          onClose={() => dispatch(toggleDialog())}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">Create new procedure</DialogTitle>
          <DialogContent>
            <TextField
              onChange={(e) => setNewProcedure(e.target.value)}
              autoFocus
              margin="dense"
              id="name"
              label="Name of procedure"
              type="text"
              fullWidth
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => dispatch(toggleDialog())} color="primary">
              Cancel
            </Button>
            <Button
              type="submit"
              onClick={() => createNewProcedure()}
              color="primary"
            >
              Create
            </Button>
          </DialogActions>
        </Dialog>

        <Sunburst data={sunburstData} />
        <div className="center padding-l">
          <Button
            variant="contained"
            color="primary"
            onClick={generateSunburst}
          >
            Run simulation
          </Button>
        </div>
      </main>
    </div>
  );
};

export default App;
