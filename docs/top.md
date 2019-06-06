---
layout: home
permalink : /
header:
  overlay_image: /assets/images/banner.svg
---


HDElk is a web-based HDL diagramming tool.  It was designed to permit the easy visual representation of Verilog or VHDL (generically HDL's, Hardware Description Languages) in web pages by creation of simple javascript specification objects.

What follows is an overview of the project, but if you're eager to get in to the details, here are the quick links.

- [Installation](/installation/)
- [Tutorial](/tutorial/)

## Motivation

There are many many diagramming solutions, so why HDElk?  Mostly because the other solutions use an online editor and to varying degrees are WYSIWYG. This means it is sometimes hard to control the look and feel of a diagram, and it can also be quite hard to maintain (for example, change the name of something, change the size of all nodes, etc.).  The great project [WaveDrom](https://wavedrom.com/) shows the way: let the user describe the diagram in JSON, then just render it.  What does WaveDrom do?

![](/assets/images/wavedrom.png)

Here you can see the JSON describing the waveform and the resulting output.  This is very convenient, it can be modified easily, customized and so on.

Back to rendering HDL, it should be noted that a much more sophisticated tool than HDElk exists, called [netlistsvg](https://github.com/nturley/netlistsvg).  This tool takes actual output from the incredible open source synthesizer, [Yosys](https://github.com/cliffordwolf/yosys) and renders the actual logic.

![](/assets/images/netlistsvg.svg)

This is an SVG sample from the home page.  Clearly if you want real diagrams generated from actual code, NetListSVG is the project to look into.  NetListSVG uses [Elk.JS](https://github.com/OpenKieler/elkjs) for its layout, and was an inspiration for the present project.

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

And here's the code that created it

```js
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
While this is very far from Verilog or VHDL, you can see that the structure is set out in relatively simple JSON, with no hints as to how it should appear.  ElkJS (nee Elk) does all the layout work automatically for us.

`children` is an array of nodes, which may have ports and may describe other things that modify the node's appearance or behavior, like labels, highlighting and so on.

`edges` is an array of connections between child nodes, where each edge describes its start and end point, whether it's a bus or not and whether it is highlighted.

For completeness, somewhere the following library files need to be loaded

```js
<script src="/assets/js/elk.bundled.js"></script>
<script src="/assets/js/svg.js"></script>
<script src="/assets/js/hdelk.js"></script>
```

## How it Works

The system is based around [ElkJS](https://github.com/OpenKieler/elkjs), a Javascript translation of [Elk](https://www.eclipse.org/elk/), the Eclipse Layout Kernel.  This codebase takes textual specifications of a graph of nodes and edges and arranges them into something that can be displayed on a 2D screen.  That is where ElkJs ends, with a JavaScript object with added locations and sizes.  From there something has to render the objects, adding styles, etc.  This is what HDElk does, with the help of [SVG.js](https://svgjs.com/), a small library that makes generating SVG trivial.

ElkJS uses a rather verbose form of description, requiring node sizes, describing edges in a rather verbose form, etc.,

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

This snippet is from the ElkJS home page, illustrating how it can be a little long winded.  Ports are not even presented there.  They are another large structure.

To get around the lengthy input files, HDElk provides a simple preprocessor that takes a simplified form of diagram description and outputs what is required for ElkJS to run.

As an example, you can see above, ElkJS needs an edge between `n1` and `n2`, to look like this:

`{id:"e1", sources:["n1"], targets:["n1"]}`

This is a great general structure, flexible, and fine for machine generation, but less than ideal for hand coding.  The HDElk preprocessor internally, lets us shrink it to:

`{source:"n1", target:"n2"}`

removing the need to explicitly name the edge, and removing the arrays needed for sources and targets.  Of course if you *need* multiples sources and or targets, you can still use the longer form.  In one step further,

`["one","two"]`

we remove the need for the object and replacing it with a much simpler array of two strings.

So the picture of what happens when you submit a graph to HDElk is shown (roughly) below:

<div id="hdelk_diagram"></div>

<script type="text/javascript">

    const hdelk_graph = {
        id: "HDElk FLOW",
        children: [
            { id: "diagram", highlight:2, type:"JSON" },
            { id: "HDElk", highlight:1, label:"", height:80, ports: [ "layout()", "svg"  ],
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
            { id: "webpage", highlight:4, type:"HTML", ports: [ "div" ] }
        ],
        edges: [ ["diagram","HDElk.layout()"], ["HDElk.svg","webpage.div"] ]
    }

    hdelk.layout( hdelk_graph, "hdelk_diagram" );
</script>

HDElk uses Elk.js to do layout, and SVG.JS to generate the output.  The two main functions that do HDElk work are `transform()` and `diagram()` both are short, simple and live in HDElk.  The idea is that anyone who uses it should just be able to reach into these functions and modify them to their liking.

## Future Work

There are a number of areas that could use improvement

- **Fix Node Label Handling** Node label handling is clumsy.  It is easy to get a node that is too narrow to accomodate the title, and labels can get covered up
- **Fix Node Layout**  Layout can sometimes be not as pretty as might be hoped for.
- **Explore Layout Options** The [many many options](https://www.eclipse.org/elk/reference/options.html) ElkJS provides are completely unused.  Luckily, the defaults are pretty good, but surely we can do better.
- **Create a Style system** There is only one "style", any others are the "find the place in the code and change it" kind
- **Make Proper Use of Labels** Labels are a first class Elk object, but they're not really used here.

Please feel free to create Issues and Pull Requests.