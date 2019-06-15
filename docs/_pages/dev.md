---
layout: single
permalink : /dev
toc: true
toc_label: Contents
toc_sticky: true
header:
  title: Dev
  overlay_image: /assets/images/banner.png
---

# Development

## Coded

<div id="via_code"></div>
<script>

var dg = {  
            layoutOptions: {
                // "elk.algorithm":"stress", 
                "elk.layered.priority.straightness":100,
                "elk.layered.nodePlacement.favorStraightEdges":1,
                "elk.layered.nodePlacement.bk.edgeStraightening":"IMPROVE_STRAIGHTNESS"
            },
            children:[],
            edges:[]
        };

for ( var i = 0; i < 16; i++ )
    dg.children.push( {id:"N"+i, label:"", northPorts:["N"], southPorts:["S"], eastPorts:["E"], westPorts:["W"]})

for ( var j = 0; j < 4; j++ ) {
    var h = j * 4;
    for ( i = 0; i < 3; i++ ) {
        dg.edges.push( ["N"+(h+i)+".E", "N"+(h+i+1)+".W"] )
    }
   
    if ( j < 3 ) {
        for ( i = 0; i < 4; i++ ) {
            var v = h + i; 
            dg.edges.push( { route:["N"+(v)+".S", "N"+(v+4)+".N"],
                             layoutOptions: { 
                                 "elk.layered.priority.straightness":100,
                                 "elk.layered.nodePlacement.favorStraightEdges":1,
                                 "elk.layered.nodePlacement.bk.edgeStraightening":"IMPROVE_STRAIGHTNESS"
                             } 
                           } )
        }
    }
    
}

hdelk.layout( dg, "via_code" );

</script>    

## Diagram Boundaries

<div id="dev"></div>

<div id="dev_input"></div>

<div id="dev_preprocessed"></div>

<div id="dev_elk"></div>


<script type="text/javascript">

    var graph = {
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

    hdelk.layout( graph, "dev" );
</script>

## Back story

<div id="diagram"></div>

<script>
    var dg = {
        id: "main",
        color:"#F7F7F7",
        children: [
            { id: "input", port:1 },
            { id: "node_one", inPorts: ["in"], outPorts:[{id:"p1",label:"Loop"},"p2"] },
            { id: "n2", label: "n_2", type:"output", ports: ["p1", "p2", {id:"p3",label:"Long Label"},"p4"] },
            { id: "n3", type:"pipe",  ports: ["p1","p2", "p3"] },
            { id: "n4", type:"pipeA", ports: ["p1","p2"]  },
            { id: "n5", type:"pipeB", ports: ["p1","p2","p3"]  },
            { id: "n6", type:"pipeC", ports: ["p1","p2","p3","p4"]  },
            { id: "n7",
                highlight:1,
                inPorts:["pIn"], outPorts: ["p1","p2"],
                children: [
                    { id: "pIn", highlight:1, label:"", port:1, inPorts: ["pIn"], outPorts:["Valid","Ready"] },
                    { id: "c1", highlight:5, type:"compA", inPorts: ["Valid", "Ready"], outPorts:[{id:"p1",label:"Loop"},"p2","p3"] },
                    { id: "c2", highlight:3, type:"compB", ports: ["p1","p2","p3"] },
                    { id: "c3", highlight:4, type:"compC", ports: ["p1","p2","p3","p4"] },
                    { id: "c4", highlight:2, type:"compD", ports: ["p1","p2"] }
                ],
                edges: [
                    { sources:["c1.p2"], targets:["c2.p1"], bus:1, highlight:5 },
                    { source:"n7.p1", target:"c1.p1" },
                    { route:[ "c2.p2", "c4.p1" ], bus:1, highlight:3 },
                    { route:[ "c4.p2", "n7.p2" ], bus:1, highlight:2 },
                    { route:["c1.p3","c3.p3"], highlight:5  },
                    { route:[ "c3.p4", "c2.p3" ], bus:1, highlight:4 },
                    { route:[ "c3.p1", "c3.p2"], highlight:4 },
                    [ "pIn.Valid", "c1.Valid"],
                    [ "c1.Ready", "pIn.Ready" ],
                    [ "n7.pIn", "pIn.pIn"]
                ]
            }
        ],
        edges: [
            ["input","node_one.in"],
            {source:"node_one.p1", target:"n2.p1", bus:1 },
            {source:"node_one.p2", target:"n3.p1" },
            ["n3.p2", "n4.p1" ],
            ["n4.p2", "n5.p1" ],
            {source:"n5.p2", target:"n6.p1" },
            {source:"n5.p3", target:"n6.p3", bus:1 },
            {route:["n6.p2", "n2.p2" ]},
            {route:["n6.p4", "n2.p4" ], bus:1},
            ["n3.p2", "n7.p1" ],
            ["n7.p2", "n2.p3"],
            ["n3.p3", "n7.pIn" ]
        ]
    }

    hdelk.layout( dg, "diagram" );
</script>


<div id="HDElk_diagram"></div>

<script type="text/javascript">

    const HDElk_graph = {
        id: "HDElk FLOW",
        label: "",
        children: [
            { id: "diagram", highlight:2, type:"JSON" },
            { id: "HDElk", highlight:1, inPorts: [ "layout()" ], outPorts:[{ id:"svg", label:" " }  ],
                children: [
                    { id: "transform()", type:"JavaScript" },
                    { id: "Elk.js", type:"Library" },
                    { id: "diagram()", type:"JavaScript" },
                    { id: "SVG.js", type:"Library" },
                ],
                edges:[
                    ["HDElk.layout()", "transform()" ],
                    ["transform()", "Elk.js" ],
                    ["Elk.js", "diagram()" ],
                    ["diagram()", "SVG.js" ],
                    ["SVG.js", "HDElk.svg" ],
                ]
            },
            { id: "webpage", highlight:4, type:"HTML", ports: [ "div" ] }
        ],
        edges: [ ["diagram","HDElk.layout()"], ["HDElk.svg","webpage.div"] ]
    }

    hdelk.layout( HDElk_graph, "HDElk_diagram" );
</script>
<div id="title_diagram"></div>

<script>
    var title_graph = {
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

    hdelk.layout( title_graph, "title_diagram" );


</script>

