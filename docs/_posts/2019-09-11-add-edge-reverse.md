---
layout: single
excerpt: "Edge reverse flag improves link appearance"
title: Added Edge Reverse Flag
codemirror: 1
permissivejson: 1
header:
  title: Added Edge Reverse Flag
  overlay_image: /assets/images/banner.png
---

## Add Edge Reverse

Elk *really* wants to make edges go left to right.  *Really*.  So much so that if you ever create a feedback edge (one going in the reverse direction from the regular data flow) it shifts heaven and earth (all the nodes!) so that it can do this.  This results in some pretty awful diagrams.

The solution implemented here is to add a flag that conveys to Elk that this link, in fact, *wants* to run in reverse.

### Before

<div id="ReversePre" style="display: none;">
{
    label:"Simple",
    color:"#EEE",
    children:[
        { id:"P1", port:1  }
        { id:"C1", highlight:2, inPorts:[ "In",  "Loop" ], outPorts:[ "Out", ] },
        { id:"C2", highlight:3, inPorts:[ "In" ], outPorts:["Out", "Loop" ] }
        { id:"P2", port:1  }
    ],
    edges:[
        ["P1","C1.In"],
        ["C1.Out","C2.In"],
        ["C2.Out","P2"]
        ["C2.Loop","C1.Loop"]
    ]
}
</div>

<div>
    <textarea rows="20" cols="50" id="ReversePreCode" name="ReversePreCode">
    </textarea>
</div>
<br>
<div id="ReversePreDiagram"></div>

This problem is solved by adding a "-1" after the link spec to hint to the layout engine that the link should be rendered backwards.

### After

<div id="Reverse" style="display: none;">
{
    label:"Simple",
    color:"#EEE",
    children:[
        { id:"P1", port:1  }
        { id:"C1", highlight:2, inPorts:[ "In",  "Loop" ], outPorts:[ "Out", ] },
        { id:"C2", highlight:3, inPorts:[ "In" ], outPorts:["Out", "Loop" ] }
        { id:"P2", port:1  }
    ],
    edges:[
        ["P1","C1.In"],
        ["C1.Out","C2.In"],
        ["C2.Out","P2"]
        ["C2.Loop","C1.Loop", -1]
    ]
}
</div>

<div>
    <textarea rows="20" cols="50" id="ReverseCode" name="ReverseCode">
    </textarea>
</div>
<br>
<div id="ReverseDiagram"></div>

So much nicer.

<script type="text/javascript">

    var drawHDElkNewSnippet = function( newCodeId ) {
        var cm = CodeMirror.fromTextArea(document.getElementById(newCodeId + "Code"), {
            mode: "javascript",
            theme: "default",
            lineNumbers: true,
            readOnly: true
        });
        var snippetElement = document.getElementById( newCodeId );
        var snippetText = snippetElement.innerHTML;
        cm.setValue( snippetText );
        drawHDElk( cm, newCodeId + "Diagram" );
    }

    var drawHDElk = function( cm, diagramId ) {
        var cmText = cm.getValue();
        if ( cmText ) {
            var graph = PermissiveJSON.parse( cmText );

            hdelk.layout( graph, diagramId );
        }
    }

    drawHDElkNewSnippet( "ReversePre" );
    drawHDElkNewSnippet( "Reverse" );
</script>

