import { useState } from "react";
import Drawer from "@material-ui/core/Drawer";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
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
      padding: theme.spacing(3),
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
    "Tire fires",
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
    <>
      <AppBar position="fixed">
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={() => setDisplayDrawer(true)}
            edge="start"
          >
            <MenuIcon />
          </IconButton>
          <h5>Operational procedure</h5>
        </Toolbar>
      </AppBar>
      <Drawer
        title="Procedures"
        anchor="left"
        variant="persistent"
        open={displayDrawer}
      >
        <List>
          {procedures.map((text: string) => (
            <ListItem button key={text}>
              <ListItemText primary={text} />
            </ListItem>
          ))}
        </List>
      </Drawer>
      <MaterialTable
        title="Operational procedure"
        columns={columns}
        data={tableData}
        editable={{
          onRowAdd: (newData) =>
            new Promise((resolve: any, reject) => {
              setTimeout(() => {
                setTableData([...tableData, newData]);

                resolve();
              }, 1000);
            }),
          onRowUpdate: (newData, oldData: any) =>
            new Promise((resolve: any, reject) => {
              setTimeout(() => {
                const dataUpdate = [...tableData];
                const index = oldData.tableData.id;
                dataUpdate[index] = newData;
                setTableData([...dataUpdate]);

                resolve();
              }, 1000);
            }),
        }}
        cellEditable={{
          onCellEditApproved: (newValue, oldValue, rowData, columnDef) => {
            return new Promise((resolve, reject) => {
              console.log("newValue: " + newValue);
              setTimeout(resolve, 1000);
            });
          },
        }}
      />
      <HighchartsReact
        highcharts={Highcharts}
        options={options}
        constructorType={"chart"}
      />
    </>
  );
};

export default App;
