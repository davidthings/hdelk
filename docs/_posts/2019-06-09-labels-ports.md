---
layout: single
header:
  title: Labels Ports
  overlay_image: /assets/images/banner.svg
---

Did a significant upgrade of the labeling and port placement code.


<div id="add_constant"></div>

<script type="text/javascript">

    var graph = {
        children:[
            { id:"16", constant:1 },
            { id:"PS_d8", constant:1 },
            { id:"PS_d16", constant:1 },
            { id:"C1", parameters:["Size", "PipeSpecIn", "PipeSpecOut"], inPorts:[ "In", "X", "Y", "Z" ], outPorts:[ "Out", "P", "Q", "R" ] },
            { id:"C2",  inPorts:[ "In", "A", "B", "C" ], outPorts:[ "Out" ] },
            { id:"C3" }
        ],
        edges:[
            ["16","C1.Size"],
            ["PS_d8","C1.PipeSpecIn"],
            ["PS_d16","C1.PipeSpecOut"],
            {route:["C1.Out","C2.In"],bus:1,label:"Through"},
            {route:["C2.Out","C3"],bus:1,label:"Summary"}
        ]
    }

    hdelk.layout( graph, "add_constant" );
</script>


Added `parameters` - ports that appear on the top of the node with vertical type

Added `constants` - nodes that are drawn slightly differently.  Used to connect to parameters.

Added `edge labels` - an extra parameter on the compact edge spec to add a label

Fixed the width and height calculations for nodes.  Everything is much smaller now.

Made the text width function more accurate meaning better feature sizes, better text placement

