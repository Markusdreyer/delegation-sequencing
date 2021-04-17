primitive(0) . 
description(0, "Operation central receives fire alert") .
delegate(0, 1, ae_crew):-deploy(0) . 
mandatory(0) . primitive(1) . 
description(1, "Operation central gathers location information") .
delegate(1, 1, ae_crew):-deploy(1) . 
mandatory(1) . collaborative(1) . 
description(1, "Operation central alerts fire department") .
delegate(1, 1, ae_crew, se_crew):-deploy(1) . 
mandatory(1) . primitive(2) . 
description(2, "Fire department move to scene") .
delegate(2, 2, se_crew):-deploy(2) . 
mandatory(2) . collaborative(2) . 
description(2, "Operation central requests police resources to redirect traffic") .
delegate(2, 1, ae_crew, lt_crew):-deploy(2) . 
mandatory(2) . collaborative(2) . 
description(2, "Operation central requests ambulance resources to take care of wounded") .
delegate(2, 1, ae_crew, lt_crew):-deploy(2) . 
mandatory(2) . 