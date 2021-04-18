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
} from "@material-ui/core";
import {
  Add,
  Description,
  ChevronLeft,
  ChevronRight,
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

import { useSelector, useDispatch } from "react-redux";
import { toggleSidebar, toggleDialog } from "../actions";

interface Props {
  data: any;
}

const Sidebar: React.FC<Props> = (props) => {
  const sidebar = useSelector((state: any) => state.sidebar);

  const dispatch = useDispatch();
  const { data } = props;
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
    <Drawer
      className={classes.drawer}
      variant="persistent"
      anchor="left"
      open={sidebar}
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
      <ListItem button onClick={() => setDisplayProcedures(!displayProcedures)}>
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
      <ListItem button onClick={() => setDisplayTaxonomies(!displayTaxonomies)}>
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
  );
};
