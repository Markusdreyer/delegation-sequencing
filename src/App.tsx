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
    nested: {
      paddingLeft: theme.spacing(4),
    },
  })
);

const App = () => {
  const classes = useStyles();
  const theme = useTheme();
  const [displayDrawer, setDisplayDrawer] = useState(false);
  const [displaySunburst, setDisplaySunburst] = useState(false);
  const [displayProcedures, setDisplayProcedures] = useState(false);
  const [displayTaxonomies, setDisplayTaxonomies] = useState(false);
  const [newProcedure, setNewProcedure] = useState("");
  const [displayDialog, setDisplayDialog] = useState(false);
  const [tableData, setTableData]: any = useState(tableMockData);
  const [taxonomies, setTaxonomies]: any = useState([
    "Land fire incidents",
    "Offshore incidents",
    "Terror incidents",
  ]);
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
      title: "Quantity",
      field: "quantity",
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
      console.log(res.data);
    });
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
            primary={"New procedure"}
            onClick={() => setDisplayDialog(true)}
          />
        </ListItem>
        <ListItem button>
          <ListItemIcon>
            <Add />
          </ListItemIcon>
          <ListItemText
            primary={"New Taxonomy"}
            onClick={() => setDisplayDialog(true)}
          />
        </ListItem>
        <Divider />
        <ListItem
          button
          onClick={() => setDisplayProcedures(!displayProcedures)}
        >
          <ListItemIcon>
            <Assignment />
          </ListItemIcon>
          <ListItemText primary="Procedures" />
          {displayProcedures ? <ExpandLess /> : <ExpandMore />}
        </ListItem>
        <Collapse in={displayProcedures} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {procedures.map((text: string) => (
              <ListItem button className={classes.nested} key={text}>
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
        </Collapse>
        <ListItem
          button
          onClick={() => setDisplayTaxonomies(!displayTaxonomies)}
        >
          <ListItemIcon>
            <AccountTree />
          </ListItemIcon>
          <ListItemText primary="Taxonomies" />
          {displayTaxonomies ? <ExpandLess /> : <ExpandMore />}
        </ListItem>
        <Collapse in={displayTaxonomies} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {taxonomies.map((text: string) => (
              <ListItem button className={classes.nested} key={text}>
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
        </Collapse>
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
          cellEditable={{
            cellStyle: {},
            onCellEditApproved: (newValue, oldValue: any) => {
              return new Promise((resolve: any, reject) => {
                setTimeout(() => {
                  const dataUpdate = [...tableData[currentProcedure]];
                  const index = oldValue.tableData.id;
                  dataUpdate[index] = newValue;
                  setTableData({
                    ...tableData,
                    [currentProcedure]: [...dataUpdate],
                  });

                  resolve();
                }, 1000);
              });
            },
          }}
          editable={{
            onRowAdd: (newData) =>
              new Promise((resolve: any, reject) => {
                setTimeout(() => {
                  const dataUpdate = [...tableData[currentProcedure]];
                  dataUpdate.push(newData);
                  setTableData({
                    ...tableData,
                    [currentProcedure]: [...dataUpdate],
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
            onRowDelete: (oldData: any) =>
              new Promise((resolve: any, reject) => {
                setTimeout(() => {
                  const dataDelete = [...tableData[currentProcedure]];
                  const index = oldData.tableData.id;
                  dataDelete.splice(index, 1);
                  setTableData({
                    ...tableData,
                    [currentProcedure]: [...dataDelete],
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
