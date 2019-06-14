---
layout: single
header:
  title: Labels Ports
  overlay_image: /assets/images/banner.png
---

Some simple improvements to the port and edge spec's.

<div id="add_add_layout_bus"></div>

<script type="text/javascript">

    var graph = {
        children:[
            { id:"Little1", ports:[ "In", "Out" ] },
            { id:"Little2", ports:[ "In", "Out" ] },
            { id:"Direct", northPorts:[ "North1", "North2" ], southPorts:[ "South1", "South2" ], 
                                        eastPorts:[ "East1", "East2" ], westPorts:[ "West1", "West2" ] }
        ],
        edges:[
            ["Little1.Out", "Direct.West1", "Go West" ],
            ["Little2.Out", "Direct.West2", "Go West by Bus", 1 ]
        ]
    }

    hdelk.layout( graph, "add_add_layout_bus" );
</script>


Added north, south, east and west port groups so a port may be explicitly located anywhere on the node.

Added edge bus spec shortcut - if there is an extra non-string parameter on the compact edge spec, and that parameter is not 0, the edge is made into a bus.
