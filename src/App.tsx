import { useState } from "react";
import clsx from "clsx";
import Drawer from "@material-ui/core/Drawer";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Divider from "@material-ui/core/Divider";
import IconButton from "@material-ui/core/IconButton";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import AddIcon from "@material-ui/icons/Add";
import DescriptionIcon from "@material-ui/icons/Description";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import MenuIcon from "@material-ui/icons/Menu";
import {
  makeStyles,
  useTheme,
  Theme,
  createStyles,
} from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Highcharts from "highcharts";
import HighchartsSunburst from "highcharts/modules/sunburst";
import HighchartsReact from "highcharts-react-official";
import MaterialTable from "material-table";
import { sunburstMockData, tableMockData } from "./utils/mockData";
import { table } from "console";

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
            <MenuIcon />
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
            {theme.direction === "ltr" ? (
              <ChevronLeftIcon />
            ) : (
              <ChevronRightIcon />
            )}
          </IconButton>
        </div>
        <ListItem button key={"Create new"}>
          <ListItemIcon>
            <AddIcon />
          </ListItemIcon>
          <ListItemText
            primary={"Create new"}
            onClick={() => setCurrentProcedure("Create new")}
          />
        </ListItem>
        <Divider />
        <List>
          {procedures.map((text: string) => (
            <ListItem button key={text}>
              <ListItemIcon>
                <DescriptionIcon />
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
