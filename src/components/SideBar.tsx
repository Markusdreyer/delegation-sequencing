import React, { useState } from "react";
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
  ChevronRight,
  Assignment,
  ExpandLess,
  ExpandMore,
  Menu,
  AccountTree,
} from "@material-ui/icons";
import {
  makeStyles,
  useTheme,
  Theme,
  createStyles,
} from "@material-ui/core/styles";
import clsx from "clsx";

import { useSelector, useDispatch } from "react-redux";
import {
  toggleSidebar,
  toggleDialog,
  toggleProcedures,
  setCurrentProcedure,
  addProcedure,
} from "../actions";

const Sidebar = () => {
  const showSidebar = useSelector((state: any) => state.showSidebar);
  const showProcedures = useSelector((state: any) => state.showProcedures);
  const showDialog = useSelector((state: any) => state.showDialog);
  const procedures = useSelector((state: any) => state.procedures);

  const [displayDrawer, setDisplayDrawer] = useState(false);

  const dispatch = useDispatch();
  const [displayProcedures, setDisplayProcedures] = useState(false);
  const [displayTaxonomies, setDisplayTaxonomies] = useState(false);
  const [taxonomies, setTaxonomies]: any = useState([
    "Land fire incidents",
    "Offshore incidents",
    "Terror incidents",
  ]);

  const drawerWidth = 240;
  const theme = useTheme();
  const useStyles = makeStyles((theme: Theme) =>
    createStyles({
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
      nested: {
        paddingLeft: theme.spacing(4),
      },
    })
  );
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
            {theme.direction === "ltr" ? <ChevronLeft /> : <ChevronRight />}
          </IconButton>
        </div>
        <ListItem button>
          <ListItemIcon>
            <Add />
          </ListItemIcon>
          <ListItemText
            primary={"New procedure"}
            onClick={() => dispatch(toggleDialog())}
          />
        </ListItem>
        <ListItem button>
          <ListItemIcon>
            <Add />
          </ListItemIcon>
          <ListItemText
            primary={"New Taxonomy"}
            onClick={() => dispatch(toggleDialog())}
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
            {procedures.map((text: string) => (
              <ListItem button className={classes.nested} key={text}>
                <ListItemIcon>
                  <Description />
                </ListItemIcon>
                <ListItemText
                  primary={text}
                  onClick={() => dispatch(setCurrentProcedure(text))}
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
                  onClick={() => dispatch(addProcedure(text))}
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
