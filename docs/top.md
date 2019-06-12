---
layout: single
permalink : /
toc: true
toc_label: Contents
toc_sticky: true
header:
  overlay_image: /assets/images/banner.svg
---

## Introduction

HDElk is a web-based diagramming tool designed to permit the easy visual representation of diagrams which feature sets of interconnected nodes in web pages.  The diagram is described in [JSON](https://www.json.org/) and then rendered in [SVG](https://en.wikipedia.org/wiki/Scalable_Vector_Graphics)

One area that uses interconnected nodes is FPGA programming in Hardware Description Languages (HDL's) like Verilog and VHDL.  HDElk came about in response to a need to document an FPGA library, but it is not limited to FPGA applications.

What follows is an overview of the project, but if you're eager to get in to the details, here are the quick links.

- [Installation]({{site.baseurl}}/installation)
- [Tutorial]({{site.baseurl}}/tutorial)

## Motivation

There are many many diagramming solutions, so why HDElk? WYSIWYG editors are high touch, by design. This means it is sometimes hard to control the look and feel of a diagram, and it can also be quite hard to maintain (for example, change the name of something, change the size of all nodes, etc.).  There are a (number of Javascript diagrammers)[https://modeling-languages.com/javascript-drawing-libraries-diagrams/] but very often they are complex and often don't depict nodes and ports efficiently.  The great project [WaveDrom](https://wavedrom.com/) shows the way.  Its job is to draw waveforms, but rather than provide an online WYSIWYG tool or omnibus draw anything library, it lets the user describe the diagram in a very domain specific JSON right in the page.  Wavedrom then renders the wave in SVG.

![]({{site.baseurl}}/assets/images/wavedrom.png)

Here you can see the JSON describing the waveform and the resulting output.  This is very convenient, it can be modified easily, customized and so on.

Back to rendering HDL, it should be noted that a much more sophisticated tool than HDElk exists, called [netlistsvg](https://github.com/nturley/netlistsvg).  This tool takes actual output from the incredible open source synthesizer, [Yosys](https://github.com/cliffordwolf/yosys) and renders the actual logic.

![]({{site.baseurl}}/assets/images/netlistsvg.svg)

This is an SVG sample from the home page.  Clearly if you want real diagrams generated from actual code, NetListSVG is the project to look into.  NetListSVG uses [Elk.JS](https://github.com/OpenKieler/elkjs) for its layout, and was an inspiration for HDElk.

## Simple Example

What does HDElk do, and what does it look like?  Here's a simple diagram

<div id="simple_diagram"></div>

<script type="text/javascript">

    var simple_graph = {
        id: "Simple",
        children: [
            { id: "in", port: 1 },
            { id: "one", ports: ["in", "out"] },
            { id: "two", highlight:1, ports: ["in", "out"] },
            { id: "three", ports: ["in", "out"] },
            { id: "out", port: 1 }
        ],
        edges: [
            ["in","one.in"],
            {route:["one.out","two.in"],highlight:1},
            {route:["two.out","three.in"],highlight:1,bus:1},
            {route:["three.out","out"], bus:1 }
        ]
    }

    hdelk.layout( simple_graph, "simple_diagram" );
</script>

There are nested nodes, and edges that connect them together, via node ports.  Edge direction is represented by a small glyph on the end and there is a mechanism to represent buses (thicker lines) as distinct from plain wires.

And here's the code that created it.  If you view the source of this page, you'll see the exact code below twice!  Once doing the work and another time for the documentation.

<!-- Hi! -->

```js
<div id="simple_diagram"></div>

<script type="text/javascript">

    var simple_graph = {
        id: "Simple",
        children: [
            { id: "in", port: 1 },
            { id: "one", ports: ["in", "out"] },
            { id: "two", highlight:1, ports: ["in", "out"] },
            { id: "three", ports: ["in", "out"] },
            { id: "out", port: 1 }
        ],
        edges: [
            ["in","one.in"],
            {route:["one.out","two.in"],highlight:1},
            {route:["two.out","three.in"],highlight:1,bus:1},
            {route:["three.out","out"], bus:1 }
        ]
    }

    hdelk.layout( simple_graph, "simple_diagram" );
</script>
```
While this is very far from Verilog or VHDL, you can see that the structure is set out in relatively simple JSON, with no hints as to how it should appear.  HDElk does all the layout work automatically for us, finally adding the SVG into the web page `<div>`

We'll cover this much more in the [Tutorial]({{site.baseurl}}/tutorial) but for now there are two main features to point out:

- `children` is an array of nodes, which may have ports and may describe other things that modify the node's appearance or behavior, like labels, highlighting and so on.

- `edges` is an array of connections between child nodes, where each edge describes its start and end point, whether it's a bus or not and whether it is highlighted.

For completeness, somewhere the following library files need to be loaded.  They are available from the repo [here](https://github.com/davidthings/hdelk)

```js
<script src="/js/elk.bundled.js"></script>
<script src="/js/svg.min.js"></script>
<script src="/js/hdelk.js"></script>
```

## How it Works

The system is based around [ElkJS](https://github.com/OpenKieler/elkjs), a Javascript translation of [Elk](https://www.eclipse.org/elk/), the Eclipse Layout Kernel.  This codebase, which is under 1000 lines, takes textual specifications of a graph of nodes and edges and arranges them into something that can be displayed on a 2D screen.  That is where ElkJs ends, with a JavaScript object with added locations and sizes.  From there something has to render the objects, adding styles, etc.  This is what HDElk does, with the help of [SVG.js](https://svgjs.com/), a small library that makes generating SVG trivial.

ElkJS uses a rather long form of description.

```js
const graph = {
  id: "root",
  layoutOptions: { 'elk.algorithm': 'layered' },
  children: [
    { id: "n1", width: 30, height: 30 },
    { id: "n2", width: 30, height: 30 },
    { id: "n3", width: 30, height: 30 }
  ],
  edges: [
    { id: "e1", sources: [ "n1" ], targets: [ "n2" ] },
    { id: "e2", sources: [ "n1" ], targets: [ "n3" ] }
  ]
}
```

This snippet is from the ElkJS home page, illustrating how it can be a little long winded.  Ports are not even presented in this snippet - they are another large structure.

To get around the lengthy input files, HDElk provides a simple preprocessor that takes a simplified form of diagram description and outputs what is required for ElkJS to run.

As an example, you can see above, ElkJS needs an edge between `n1` and `n2`, to look like this:

`{id:"e1", sources:["n1"], targets:["n1"]}`

This is a great general structure, flexible, and fine for machine generation, but less than ideal for hand coding.  The HDElk preprocessor internally, lets us shrink it to:

`{source:"n1", target:"n2"}`

removing the need to explicitly name the edge, and removing the arrays needed for sources and targets.  Of course if you *need* multiples sources and or targets, you can still use the longer form.  In one step further,

`["one","two"]`

we remove the need for the object and replacing it with a much simpler array of two strings.

Here's how the same description would look in HDElk

```js
var graph = {
  id: "root",
  children: [
    { id: "n1" },
    { id: "n2" },
    { id: "n3" }
  ],
  edges: [
    ["n1","n2" ],
    ["n1","n3" ]
  ]
}
```

And here it is rendered by HDElk

<div id="improved"></div>

<script type="text/javascript">

var graph = {
  id: "root",
  children: [
    { id: "n1" },
    { id: "n2" },
    { id: "n3" }
  ],
  edges: [
    ["n1","n2" ],
    ["n1","n3" ]
  ]
}

    hdelk.layout( graph, "improved" );
</script>


Roughly what happens when you submit a graph to HDElk is shown below:

<div id="hdelk_diagram"></div>

<script type="text/javascript">

    const hdelk_graph = {
        id: "HDElk Flow", label:"",
        children: [
            { id: "diagram", highlight:2, type:"JSON" },
            { id: "HDElk", highlight:1, label:"", height:80, inPorts:[ "layout()" ], outPorts:[{id:"svg",label:" "}  ],
                children: [
                    { id: "transform()", width:90, type:"JavaScript" },
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
            { id: "webpage", highlight:4, type:"HTML", ports: [ "<div>" ] }
        ],
        edges: [ ["diagram","HDElk.layout()"], ["HDElk.svg","webpage.<div>"] ]
    }

    hdelk.layout( hdelk_graph, "hdelk_diagram" );
</script>

- The diagram is described in JSON, and passed to HDElk.layout() along with a `<div>` id.
- HDElk then calls `transform()` to convert the compact HDElk description into the format Elk.js can use.
- Elk.js does its magic, adding dimensions and locations to the diagram description and returning this back to HDElk.
- `HDElk.diagram()` recursively operates on the post-Elk diagram description creating the appearance of the diagram.
- It calls SVG.JS to help generate the SVG output.
- HDElk's last act is to insert the SVG into the appropriate host page's `<div>`.

The two main functions that do HDElk work are `transform()` and `diagram()` both are short, simple and live in `hdelk.js`.  There is no language translation step, no bundler or publisher.  The idea is that anyone who uses the project should just be able to reach into these functions and modify them if they wish.

## Future Work

Enhancements

- **Add a live editor** Create a live editor for experimentation
- **Add a gallery** Create page with a few examples
- **Push Error Messages Into the Div** When there is a problem, make sure error messages are visible
- **Allow bus shorthand in Edge Spec** If there is an integer after the sources and targets let that be the `bus` value
- **Create a Style system** There is only one "style", any others are the "find the place in the code and change it" kind
- **Add instructions for use with NodeJS** So far this is a browser focused effort.
- **Add more highlight colors** Orange and Purple!

Bugs

- **Elk Node Label Bug** There seems to be a bug when labels are not centered.  The space allowed is made twice as big as it should be.  Leaf nodes in HDElk have centered labels so this is OK, but parent nodes do reserve too label space since the labels are H_CENTER, V_TOP
- **Elk Self Connection Label Bug** Labels on edges connecting two ports on the same node do not appear.
- **Enable Low Level Drawing** Since all the code is right there, it would be easy to call into it to create manual diagrams - i.e. without Elk.  This could be helpful when trying to do something different.
- **Look into why Elk pulls sw.js fairly regularly** Does this only happen locally?

Please feel free to create Issues and Pull Requests.