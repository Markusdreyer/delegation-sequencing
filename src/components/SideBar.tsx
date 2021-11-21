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
  renderTable,
} from "../actions";
import useStyles from "../Styles";
import { dialogOptions, tableTypes } from "../utils/const";
import { RootState } from "../types";

const Sidebar = () => {
  const procedures = useSelector((state: RootState) => state.procedures);
  const showSidebar = useSelector((state: RootState) => state.showSidebar);
  const taxonomies = useSelector((state: RootState) => state.taxonomies);
  const showProcedures = useSelector(
    (state: RootState) => state.showProcedures
  );

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
            data-testid="new-procedure"
            primary={"New procedure"}
            onClick={() => dispatch(toggleDialog(dialogOptions.PROCEDURE))}
          />
        </ListItem>
        <ListItem button>
          <ListItemIcon>
            <Add />
          </ListItemIcon>
          <ListItemText
            data-testid="new-taxonomy"
            primary={"New taxonomy"}
            onClick={() => dispatch(toggleDialog(dialogOptions.TAXONOMY))}
          />
        </ListItem>
        <Divider />
        <ListItem button onClick={() => dispatch(toggleProcedures())}>
          <ListItemIcon>
            <Assignment />
          </ListItemIcon>
          <ListItemText data-testid="procedure-dropdown" primary="Procedures" />
          {showProcedures ? <ExpandLess /> : <ExpandMore />}
        </ListItem>
        <Collapse in={showProcedures} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {Object.keys(procedures).map((procedure: string) => (
              <ListItem
                data-testid="procedure"
                button
                className={classes.nested}
                key={procedure}
              >
                <ListItemIcon>
                  <Description />
                </ListItemIcon>
                <ListItemText
                  primary={procedure}
                  onClick={() =>
                    dispatch(
                      // @ts-ignore: Object is possibly 'undefined'. //https://github.com/microsoft/TypeScript/issues/29642
                      renderTable(
                        tableTypes.PROCEDURES,
                        procedure,
                        procedures[procedure]
                      )
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
          <ListItemText data-testid="taxonomy-dropdown" primary="Taxonomies" />
          {displayTaxonomies ? <ExpandLess /> : <ExpandMore />}
        </ListItem>
        <Collapse in={displayTaxonomies} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {Object.keys(taxonomies).map((taxonomy: string) => (
              <ListItem
                data-testid="taxonomy"
                button
                className={classes.nested}
                key={taxonomy}
              >
                <ListItemIcon>
                  <Description />
                </ListItemIcon>
                <ListItemText
                  primary={taxonomy}
                  onClick={() =>
                    dispatch(
                      // @ts-ignore: Object is possibly 'undefined'. //https://github.com/microsoft/TypeScript/issues/29642
                      renderTable(
                        tableTypes.TAXONOMIES,
                        taxonomy,
                        taxonomies[taxonomy]
                      )
                    )
                  }
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
