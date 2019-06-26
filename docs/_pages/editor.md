---
layout: single
permalink : /editor
excerpt: "Create diagrams online and save as SVG"
toc: false
toc_label: Contents
toc_sticky: true
title: Editor
codemirror: 1
permissivejson: 1
filesaver: 1
header:
  title: Editor
  overlay_image: /assets/images/banner.png
---

# Editor

<a href="#"  onclick="drawHDElkNewSnippet('StarterSnippet')" class="btn btn--inverse">Simple</a>
<a href="#"  onclick="drawHDElkNewSnippet('ColorSnippet')" class="btn btn--inverse">Color</a>
<a href="#"  onclick="drawHDElkNewSnippet('ChildrenSnippet')" class="btn btn--inverse">Children</a>
<a href="#"  onclick="drawHDElkNewSnippet('HostFPGASnippet')" class="btn btn--inverse">Host-FPGA</a>
<a href="#"  onclick="drawHDElkNewSnippet('PipeSnippet')" class="btn btn--inverse">Pipeline</a>
<a href="#"  onclick="drawHDElkNewSnippet('BannerSnippet')" class="btn btn--inverse">Banner</a>
<a href="#"  onclick="drawHDElkNewSnippet('BusySnippet')" class="btn btn--inverse">Busy</a>

<div id="dev"></div>

<div id="dev_message" style="display: none;" class="notice--danger">
Loading
</div>

<div><br></div>

<a href="#" class="btn btn--primary" onclick="drawHDElkSnippet()">Redraw</a>
<a href="#" class="btn btn--success" onclick="saveHDElkSvg()">Save svg</a>
<a href="#" class="btn btn--success" onclick="saveHDElkText()">Save text</a>
<a href="#" class="btn btn--success" onclick="saveHDElkJson()">Save json</a>

<div>
  <textarea rows="20" cols="50" id="codesnippet" name="codesnippet">

</textarea>
</div>

<div id="StarterSnippet" style="display: none;">
{
    children:[
        { id:"P1", port:1  }
        { id:"C1", ports:[ "In", "Out" ] },
        { id:"C2", ports:[ "In", "Out" ] },
        { id:"P2", port:1  }
    ],
    edges:[
        ["P1","C1.In"],
        ["C1.Out","C2.In"],
        ["C2.Out","P2"]
    ]
}
</div>

<div id="ColorSnippet" style="display: none;">
{
    label:"Simple",
    color:"#EEE",
    children:[
        { id:"P1", port:1  }
        { id:"C1", highlight:2, ports:[ "In", "Out" ] },
        { id:"C2", highlight:3, ports:[ "In", "Out" ] },
        { id:"P2", port:1  }
    ],
    edges:[
        ["P1","C1.In"],
        ["C1.Out","C2.In"],
        ["C2.Out","P2"]
    ]
}
</div>

<div id="ChildrenSnippet" style="display: none;">
{
    children:[
        { id:"5", constant:1 },
        { id:"C1", parameters:["Size"], inPorts:[ "In" ], outPorts:[ "Out" ] },
        { id:"C2",  inPorts:[ "In" ], outPorts:[ "Out" ],
            children:[
                { id:"GC1", ports:[ "In", "Out" ] },
                { id:"GC2", ports:[ "In", "Out" ] }
            ],
            edges:[
                ["C2.In", "GC1.In"],
                ["GC1.Out", "GC2.In"],
                ["GC2.Out", "C2.Out"],
            ]
        },
        { id:"C3" }
    ],
    edges:[
        ["5", "C1.Size"],
        ["C1.Out","C2.In"],
        ["C2.Out","C3"]
    ]
}
</div>

<div id="BusySnippet" style="display: none;">
{
    id:"",
    highlight:0,
    children:[
        { id:"ExtIn", port:1, highlight:0 },
        { id:"C2_OR",
            type:"C2_Type",
            inPorts:[ "In", { id:"InOut", label:"LA" } ], outPorts:[ "Output" ],
            children:[
                { id:"PS_8", constant:1 },
                { id:"PS_16", constant:1 },
                { id:"GC1",
                    highlight:0,
                    type:"GCT",
                    inPorts:[ "In", "Out" ] },
                { id:"GC2", type:"GC2 Type Type Type", parameters:["InSpec", "OutSpec"], ports:[ "In", "Out" ] },
                { id:"Little", label:"", ports:[ "In", "Out" ] },
                { id:"Direct", label:"", northPorts:[ "North1", "North2" ], southPorts:[ "South1", "South2" ],
                                            eastPorts:[ "East1", "East2" ], westPorts:[ "West1", "West2" ] },
                { id:"Portly1", highlight:1, type:"-lots-", inPorts:[ "Start1", "Middle1", "End1" ], outPorts:[ "Start2", "Middle2", "End2" ] },
                { id:"Portly2", highlight:1, type:"-lots-", inPorts:[ "Start1", "Middle1", "End1" ], outPorts:[ "Start2", "Middle2", "End2" ] }
            ],
            edges:[
                {route:["C2_OR.In", "GC1.In"], label:"Link", bus:1, highlight:0 },
                { sources:["GC1.Out"],
                    targets:["GC2.In"],
                    labels:[ "EL1", "EL2" ], highlight:3 },
                ["PS_8", "GC2.InSpec" ],
                ["PS_16", "GC2.OutSpec" ],
                ["GC2.Out", "C2_OR.Output", "Out Now"],
                ["Portly2.End1", "Portly1.End2", "end" ],
                ["Portly1.Middle2", "Portly2.Middle1", "middle", 1 ],
                ["Portly1.Start2", "Portly2.Start1", "start" ],
            ]
        },
        { id:"ExtOut", port:1 },
    ],
    edges:[
        ["ExtIn","C2_OR.In", "Input"],
        ["C2_OR.Output","ExtOut"],
    ]
}
</div>

<div id="HostFPGASnippet" style="display: none;">
{
    color: "#888",
    children: [
        { id: "HOST", outPorts: ["usb"],
            children: [
                { id: "Lib", label:"Comms Lib"  },
                { id: "App", highlight:1 }
            ],
            edges: [
                ["App","Lib"],
                ["Lib", "HOST.usb"]
            ]
            },
        { id: "FPGA", inPorts: [ "usb"],
            children: [
                { id: "usb_s", label:"usb serial", inPorts: ["usb"], outPorts:[ "in", "out" ]  },
                { id: "escape", eastPorts: ["in"], westPorts:[ "out" ]  },
                { id: "unescape", inPorts: ["in"], outPorts:[ "out" ]  },
                { id: "Internals", type:"Verilog", westPorts:["in", "out" ], highlight:1  }
            ],
            edges: [
                ["FPGA.usb","usb_s.usb" ],
                ["Internals.out","escape.in"],
                ["escape.out","usb_s.in"],
                ["usb_s.out","unescape.in"],
                ["unescape.out","Internals.in"]
            ] }
    ],
    edges: [
        [ "HOST.usb","FPGA.usb" ]
    ]
}
</div>

<div id="PipeSnippet" style="display: none;">
{
    children: [
        { id: "p1", type:"Producer", outPorts: ["out_start", "out_stop", "out_data", "out_valid", "out_ready"] },
        { id: "p2", type:"Consumer", inPorts: [ "in_start", "in_stop", "in_data", "in_valid", "in_ready"] }
    ],
    edges: [
        ["p1.out_start","p2.in_start"],
        ["p1.out_stop","p2.in_stop"],
        ["p1.out_data","p2.in_data", 1],
        ["p1.out_valid","p2.in_valid"],
        ["p2.in_ready","p1.out_ready"]
    ]
}
</div>

<div id="BannerSnippet" style="display: none;">
{
    color: "#555",
    children: [
        { id: "in", port: 1, highlight:1 },
        { id: "one", color: "#999", ports: ["in", "out"] },
        { id: "two", color: "#999", ports: ["in", "out"] },
        { id: "three", color: "#999", ports: ["in", "out"] },
        { id: "four", label:"", inPorts:["in"], outPorts:["out"],
            color: "#666",
            children:[
            {id:"Child1", highlight:2, ports:["in", "outA", "outB"]},
            {id:"Child2A", highlight:3, ports:["in", "out"]},
            {id:"Child2B", highlight:5, ports:["in", "out"]},
            {id:"Child3", highlight:4, ports:["inA", "inB", "out"]}
            ],
            edges:[
            [ "four.in", "Child1.in" ],
            [ "Child1.outA", "Child2A.in" ],
            [ "Child1.outB", "Child2B.in" ],
            [ "Child2A.out", "Child3.inA" ],
            [ "Child2B.out", "Child3.inB" ],
            [ "Child3.out", "four.out" ]
            ] },
        { id: "five", color: "#999", ports: ["in", "out"] },
        { id: "six", color: "#999", ports: ["in", "out"] },
        { id: "seven", color: "#999", ports: ["in", "out"] },
        { id: "out", port: 1, highlight:1 }
    ],
    edges: [
        ["in","one.in"],
        {route:["one.out","two.in"]},
        {route:["two.out","three.in"]},
        {route:["three.out","four.in"] },
        {route:["four.out","five.in"] },
        {route:["five.out","six.in"] },
        {route:["six.out","seven.in"] },
        {route:["seven.out","out"] }
    ]
}
</div>

<script type="text/javascript">

    var codeMirror = CodeMirror.fromTextArea(document.getElementById('codesnippet'), {
        mode: "javascript",
        theme: "default",
        lineNumbers: true,
        readOnly: false
    });

    var svgId = "dev"

    var drawHDElk = function( diagramId ) {

        var cmText = codeMirror.getValue();
        if ( cmText ) {
            var graph = PermissiveJSON.parse( cmText );

            hdelk.layout( graph, diagramId );
        }
    }

    var drawHDElkNewSnippet = function( newCodeId ) {
        var snippetElement = document.getElementById( newCodeId );
        var snippetText = snippetElement.innerHTML;
        codeMirror.setValue( snippetText );
        drawHDElkSnippet();
    }

    var drawHDElkSnippet = function( ) {
        drawHDElk( svgId );
    }


    var saveHDElkSvg = function() {
        var snippetElement = document.getElementById( svgId );
        var snippetText = snippetElement.innerHTML;
        var blob = new Blob([snippetText], {type: "text/plain;charset=utf-8"});
        saveAs(blob, "hdelk.svg");
    }

    var saveHDElkText = function() {
        var cmText = codeMirror.getValue();
        var blob = new Blob([cmText], {type: "text/plain;charset=utf-8"});
        saveAs(blob, "hdelk.txt");
    }

    var saveHDElkJson = function() {
        var cmText = codeMirror.getValue();
        var graph = PermissiveJSON.parse( cmText );
        var jsonText = JSON.stringify( graph, null, 4 );
        var blob = new Blob([jsonText], {type: "text/plain;charset=utf-8"});
        saveAs(blob, "hdelk.json");
    }

    drawHDElkNewSnippet("StarterSnippet");
</script>

