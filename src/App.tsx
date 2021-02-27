import React, { useState } from "react";
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
  DialogContentText,
  TextField,
  DialogActions,
  Button,
} from "@material-ui/core";
import {
  Add,
  Description,
  ChevronLeft,
  ChevronRight,
  Menu,
} from "@material-ui/icons";
import {
  makeStyles,
  useTheme,
  Theme,
  createStyles,
} from "@material-ui/core/styles";
import Highcharts from "highcharts";
import HighchartsSunburst from "highcharts/modules/sunburst";
import HighchartsReact from "highcharts-react-official";
import MaterialTable from "material-table";
import clsx from "clsx";

import { sunburstMockData, tableMockData } from "./utils/mockData";

HighchartsSunburst(Highcharts);

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
  })
);

const App = () => {
  const classes = useStyles();
  const theme = useTheme();
  const [displayDrawer, setDisplayDrawer] = useState(true);
  const [newProcedure, setNewProcedure] = useState("");
  const [displayDialog, setDisplayDialog] = useState(false);
  const [tableData, setTableData]: any = useState(tableMockData);
  const [procedures, setProcedures]: any = useState([
    "Car fires",
    "Mulch/Compost fires",
    "Aircraft emergencies",
    "Brush and Wildland fires",
  ]);
  const [columns, setColumns]: any = useState([
    { title: "Action", field: "action" },
    {
      title: "Agents",
      field: "agents",
    },
    {
      title: "Abbreviation",
      field: "abbreviation",
      lookup: { 0: "None", 1: "1", 2: "2", 3: "3", 4: "4", 5: "5" },
    },

    {
      title: "Precedence",
      field: "precedence",
      lookup: { 0: "None", 1: "1", 2: "2", 3: "3", 4: "4", 5: "5" },
    },
  ]);
  const [currentProcedure, setCurrentProcedure] = useState(procedures[0]);

  const options = {
    credits: {
      enabled: false,
    },
    title: {
      text: "Result",
    },
    series: [
      {
        allowDrillToNode: true,
        type: "sunburst",
        data: sunburstMockData,
      },
    ],
  };

  const createNewProcedure = () => {
    setTableData({
      ...tableData,
      [newProcedure]: [],
    });
    setProcedures([...procedures, newProcedure]);
    setCurrentProcedure(newProcedure);
    setDisplayDialog(false);
    console.log(procedures);
    console.log(tableData);
  };

  return (
    <div className={classes.root}>
      <AppBar
        position="fixed"
        className={clsx(classes.appBar, {
          [classes.appBarShift]: displayDrawer,
        })}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={() => setDisplayDrawer(true)}
            edge="start"
            className={clsx(classes.menuButton, displayDrawer && classes.hide)}
          >
            <Menu />
          </IconButton>
          <h4>Sequencing</h4>
        </Toolbar>
      </AppBar>
      <Drawer
        className={classes.drawer}
        variant="persistent"
        anchor="left"
        open={displayDrawer}
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        <div className={classes.drawerHeader}>
          <IconButton onClick={() => setDisplayDrawer(false)}>
            {theme.direction === "ltr" ? <ChevronLeft /> : <ChevronRight />}
          </IconButton>
        </div>
        <ListItem button>
          <ListItemIcon>
            <Add />
          </ListItemIcon>
          <ListItemText
            primary={"Create new"}
            onClick={() => setDisplayDialog(true)}
          />
        </ListItem>
        <Divider />
        <List>
          {procedures.map((text: string) => (
            <ListItem button key={text}>
              <ListItemIcon>
                <Description />
              </ListItemIcon>
              <ListItemText
                primary={text}
                onClick={() => setCurrentProcedure(text)}
              />
            </ListItem>
          ))}
        </List>
      </Drawer>
      <main
        className={clsx(classes.content, {
          [classes.contentShift]: displayDrawer,
        })}
      >
        <div className={classes.drawerHeader} />
        <Dialog
          open={displayDialog}
          onClose={() => setDisplayDialog(false)}
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
            <Button onClick={() => setDisplayDialog(false)} color="primary">
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
        <MaterialTable
          title={currentProcedure}
          columns={columns}
          data={tableData[currentProcedure]}
          editable={{
            onRowAdd: (newData) =>
              new Promise((resolve: any, reject) => {
                setTimeout(() => {
                  setTableData({
                    ...tableData,
                    [currentProcedure]: newData,
                  });

                  resolve();
                }, 1000);
              }),
            onRowUpdate: (newData, oldData: any) =>
              new Promise((resolve: any, reject) => {
                setTimeout(() => {
                  const dataUpdate = [...tableData[currentProcedure]];
                  const index = oldData.tableData.id;
                  dataUpdate[index] = newData;
                  setTableData({
                    ...tableData,
                    [currentProcedure]: [...dataUpdate],
                  });

                  resolve();
                }, 1000);
              }),
          }}
        />
        <HighchartsReact
          highcharts={Highcharts}
          options={options}
          constructorType={"chart"}
        />
      </main>
    </div>
  );
};

export default App;
