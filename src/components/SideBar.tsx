import { useState } from "react";
import {
  Divider,
  Drawer,
  ListItem,
  List,
  ListItemIcon,
  IconButton,
  ListItemText,
  Collapse,
  Toolbar,
  AppBar,
} from "@material-ui/core";
import {
  Add,
  Description,
  ChevronLeft,
  Assignment,
  ExpandLess,
  ExpandMore,
  Menu,
  AccountTree,
} from "@material-ui/icons";
import clsx from "clsx";

import { useSelector, useDispatch } from "react-redux";
import {
  toggleSidebar,
  toggleDialog,
  toggleProcedures,
  setProcedure,
  renderTable,
} from "../actions";
import useStyles from "../Styles";
import { tableTypes } from "../utils/const";
import { ProcedureData, RootState, TaxonomyData } from "../types";

const Sidebar = () => {
  const procedures = useSelector((state: RootState) => state.procedures);
  const showSidebar = useSelector((state: RootState) => state.showSidebar);
  const showProcedures = useSelector(
    (state: RootState) => state.showProcedures
  );

  const [taxonomies, setTaxonomies]: any = useState([
    "Land fire incidents",
    "Offshore incidents",
    "Terror incidents",
  ]);

  const dispatch = useDispatch();
  const [displayTaxonomies, setDisplayTaxonomies] = useState(false);

  const classes = useStyles();

  return (
    <>
      <AppBar
        position="fixed"
        className={clsx(classes.appBar, {
          [classes.appBarShift]: showSidebar,
        })}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={() => dispatch(toggleSidebar())}
            edge="start"
            className={clsx(classes.menuButton, showSidebar && classes.hide)}
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
        open={showSidebar}
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        <div className={classes.drawerHeader}>
          <IconButton onClick={() => dispatch(toggleSidebar())}>
            <ChevronLeft />
          </IconButton>
        </div>
        <ListItem button>
          <ListItemIcon>
            <Add />
          </ListItemIcon>
          <ListItemText
            primary={"New procedure"}
            onClick={() =>
              dispatch(
                toggleDialog(true, "Create new procedure", "Name of procedure")
              )
            }
          />
        </ListItem>
        <ListItem button>
          <ListItemIcon>
            <Add />
          </ListItemIcon>
          <ListItemText
            primary={"New Taxonomy"}
            onClick={() =>
              dispatch(
                toggleDialog(true, "Create new taxonomy", "Name of taxonomy")
              )
            }
          />
        </ListItem>
        <Divider />
        <ListItem button onClick={() => dispatch(toggleProcedures())}>
          <ListItemIcon>
            <Assignment />
          </ListItemIcon>
          <ListItemText primary="Procedures" />
          {showProcedures ? <ExpandLess /> : <ExpandMore />}
        </ListItem>
        <Collapse in={showProcedures} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {Object.keys(procedures).map((text: string) => (
              <ListItem button className={classes.nested} key={text}>
                <ListItemIcon>
                  <Description />
                </ListItemIcon>
                <ListItemText
                  primary={text}
                  onClick={() =>
                    dispatch(
                      // @ts-ignore: Object is possibly 'undefined'. //https://github.com/microsoft/TypeScript/issues/29642
                      renderTable(tableTypes.PROCEDURES, text, procedures[text])
                    )
                  }
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
                  //onClick={() =>
                  //dispatch(setTableData(tableTypes.TAXONOMIES, text))
                  //}
                />
              </ListItem>
            ))}
          </List>
        </Collapse>
      </Drawer>
    </>
  );
};

export default Sidebar;
