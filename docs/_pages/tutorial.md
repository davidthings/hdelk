---
layout: single
permalink : /tutorial
toc: true
toc_label: Contents
toc_sticky: true
header:
  title: Tutorial
  overlay_image: /assets/images/banner.svg
---

# Tutorial

## Preliminaries

Three javascript files must be included for HDElk to work.  Somewhere on your HTML page the following has to appear.

```js
<script src="js/elk.bundled.js"></script>
<script src="js/svg.min.js"></script>
<script src="js/hdelk.js"></script>
```

Next, and for every diagram there will be a `<div>`, uniquely identified.

Finally there will be a `<script>` tag containing the diagram description and the call into HDElk which will make it appear as an SVG if all goes well.


See [Installation]({{site.baseurl}}/installation) for more information

## A Node

What is the most simple thing we can draw?

<div id="adding_a_node"></div>

<script type="text/javascript">

    var graph = {
        children:[
            { id:"C1" }
        ]
    }

    hdelk.layout( graph, "adding_a_node" );
</script>

One node!  Here's the code that created it

```js
<div id="adding_a_node"></div>

<script type="text/javascript">

    var graph = {
        children:[
            { id:"C1" }
        ]
    }

    hdelk.layout( graph, "adding_a_node" );
</script>
```

The `<script>` tag holds the description of the diagram and the call to HDElk to render it.  The `<div>` tag shows where the diagram is going to be placed.

Leaving the `id` out results in an error - every node needs an Id.

Sub nodes can be added to any node.  They are described in an array `children`.  And then there is recursion!  Each child is exactly the format of the first.

## Adding Ports

Nodes connect to each other with Edges and can optionally connect via Ports

<div id="adding_ports"></div>

<script type="text/javascript">

    var graph = {
        children:[
            { id:"C1", ports:[ "In", "Out" ] }
        ]
    }

    hdelk.layout( graph, "adding_ports" );
</script>

Here's the code, (just the Javascript object this time, a `<script>` tag and `<div>` are required for each unique diagram)

```js
var graph = {
    children:[
        { id:"C1", ports:[ "In", "Out" ] }
    ]
}
```

Ports added this way get added to the left of the Node they are owned by.  When they are connected they may move around.

Ports may also be added to a particular side:

<div id="adding_sided_ports"></div>

<script type="text/javascript">

    var graph = {
        children:[
            { id:"C1", inPorts:[ "In" ], outPorts:[ "Out" ] }
        ]
    }

    hdelk.layout( graph, "adding_sided_ports" );
</script>

```js
var graph = {
    children:[
        { id:"C1", inPorts:[ "In" ],outPorts:[ "Out" ] }
    ]
}
```
In code this is done just by adding to inPorts or outPorts.  Ports added to `inPorts` or `outPorts` will stay on their correct side.

Use the `inPorts` and `outPorts` whenever the layout engine needs a bit of a nudge to get it right.

## Adding Parameters

Nodes may get a different kind of port, called a `parameter`.

<div id="adding_parameters"></div>

<script type="text/javascript">

    var graph = {
        children:[
            { id:"C1", parameters:["Size"], inPorts:[ "In" ], outPorts:[ "Out" ] }
        ]
    }

    hdelk.layout( graph, "adding_parameters" );
</script>

Parameters are just ports that appear on the top side of the node.

```js
var graph = {
    children:[
        { id:"C1", parameters:["Size"], inPorts:[ "In" ], outPorts:[ "Out" ] }
    ]
}
```


## Adding more Nodes and Ports

What about more nodes?

<div id="more_ports"></div>

<script type="text/javascript">

    var graph = {
        children:[
            { id:"C1", parameters:["Size"], inPorts:[ "In" ], outPorts:[ "Out" ] },
            { id:"C2", inPorts:[ "In" ], outPorts:[ { id:"O", label:"Output" } ]  },
            { id:"C3" }
        ]
    }

    hdelk.layout( graph, "more_ports" );
</script>

Nodes and ports get added to the diagram with different sizes and shapes being accommodated.

Here's the code

```js
var graph = {
    children:[
        { id:"C1", parameters:["Size"], inPorts:[ "In" ], outPorts:[ "Out" ] },
        { id:"C2", inPorts:[ "In" ], outPorts:[ { id:"O", label:"Output" } ] },
        { id:"C3" }
    ]
}
```
Note that we can create a `label` member if we ever want to override the Id.  Here the label `Output`, a longer form of the port name, is used.

The simple string form of port, is expanded into an object.

```js
{ ... outPorts:[ "Out" ] ... }
```

becomes

```js
{ ... outPorts:[ { id:"O", label:"Output" } ] ... }
```

Now internally the port can be refered to as "O" while the larger "Output" is the thing users will see.

Each child in the `Children` structure is formed identically and should have a unique name.  Watch for correct comma use.  Leaving them off is easy to do and causes parsing errors!

The layout engine organizes the new components into a simple grid taking into account the sizes of everything.

## Connecting Nodes and Ports together

Connecting nodes together is pretty easy

<div id="connecting_nodes"></div>

<script type="text/javascript">

    var graph = {
        children:[
            { id:"C1", parameters:["Size"], inPorts:[ "In" ], outPorts:[ "Out" ] },
            { id:"C2", inPorts:[ "In" ], outPorts:[ "Out" ] },
            { id:"C3" }
        ],
        edges:[
            ["C1.Out","C2.In"]
        ]
    }

    hdelk.layout( graph, "connecting_nodes" );
</script>

Things move around a little as the appropriate ports are connected.  To help with orientation, there is a tiny mark on the the edge itself indicating the target.

```js
var graph = {
    children:[
        { id:"C1", parameters:["Size"], inPorts:[ "In" ], outPorts:[ "Out" ] },
        { id:"C2", inPorts:[ "In" ], outPorts:[ "Out" ]  },
        { id:"C3" }
    ],
    edges:[
        ["C1.Out","C2.In"]
    ]
}
```

Edges are held by a new array member of the node, `edges`.  Each edge is a simple array of `source` and `target`, where these are just port names or `child.port` names.

As edges are specified, additional constraints are made by the layout engine on where things need to be.

<div id="connecting_more_nodes"></div>

<script type="text/javascript">

    var graph = {
        children:[
            { id:"C1", parameters:["Size"], inPorts:[ "In" ], outPorts:[ "Out" ] },
            { id:"C2", inPorts:[ "In" ], outPorts:[ "Out" ] },
            { id:"C3" }
        ],
        edges:[
            ["C1.Out","C2.In"],
            ["C2.Out","C3"]
        ]
    }

    hdelk.layout( graph, "connecting_more_nodes" );
</script>

Note also that there is no requirement that edges connect to ports.  They can connect directly to the node itself.

Here's the code

```js
var graph = {
    children:[
        { id:"C1", parameters:["Size"], inPorts:[ "In" ], outPorts:[ "Out" ] },
        { id:"C2", inPorts:[ "In" ], outPorts:[ "Out" ] },
        { id:"C3" }
    ],
    edges:[
        ["C1.Out","C2.In"],
        ["C2.Out","C3"]
    ]
}
```

For example, in the block above, the fragment

```js
   ["C2.Out","C3"]
```

Just says connect `C2.Out` to anywhere on `C3`

Extra edges are just extra sub-arrays in the edges array.  Watch for correct comma use here too.

## Sub Nodes

Adding child nodes is easy - in fact we've already done it.  Each child can have children of its own.

<div id="sub_nodes"></div>

<script type="text/javascript">

    var graph = {
        children:[
            { id:"C1", parameters:["Size"], inPorts:[ "In" ], outPorts:[ "Out" ] },
            { id:"C2", inPorts:[ "In" ], outPorts:[ "Out" ],
                children:[
                    { id:"GC1", inPorts:[ "In" ], outPorts:[ "Out" ] },
                    { id:"GC2", inPorts:[ "In" ], outPorts:[ "Out" ] }
                ]
            },
            { id:"C3" }
        ],
        edges:[
            ["C1.Out","C2.In"],
            ["C2.Out","C3"]
        ]
    }

    hdelk.layout( graph, "sub_nodes" );
</script>

The layout engine just lays the new nodes out, expanding ancestor nodes where necessary, re-routing paths etc.

```js
var graph = {
    children:[
        { id:"C1", parameters:["Size"], inPorts:[ "In" ], outPorts:[ "Out" ] },
        { id:"C2", ports:[ "In", "Output" ],
            children:[
                { id:"GC1", inPorts:[ "In" ], outPorts:[ "Out" ] },
                { id:"GC2", inPorts:[ "In" ], outPorts:[ "Out" ] }
            ]
        },
        { id:"C3" }
    ],
    edges:[
        ["C1.Out","C2.In"],
        ["C2.Out","C3"]
    ]
}
```

Let's do a little more connecting.

<div id="connecting_sub_nodes"></div>

<script type="text/javascript">

    var graph = {
        children:[
            { id:"C1", parameters:["Size"], inPorts:[ "In" ], outPorts:[ "Out" ] },
            { id:"C2", inPorts:[ "In" ], outPorts:[ "Out" ],
                children:[
                    { id:"GC1", inPorts:[ "In" ], outPorts:[ "Out" ] },
                    { id:"GC2", inPorts:[ "In" ], outPorts:[ "Out" ] }
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
            ["C1.Out","C2.In"],
            ["C2.Out","C3"]
        ]
    }

    hdelk.layout( graph, "connecting_sub_nodes" );
</script>

More connections modify the layout, but everything is kept in order.

```js
var graph = {
    children:[
        { id:"C1", parameters:["Size"], inPorts:[ "In" ], outPorts:[ "Out" ] },
        { id:"C2",  inPorts:[ "In" ], outPorts:[ "Out" ],
            children:[
                { id:"GC1", inPorts:[ "In" ], outPorts:[ "Out" ] },
                { id:"GC2", inPorts:[ "In" ], outPorts:[ "Out" ] }
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
        ["C1.Out","C2.In"],
        ["C2.Out","C3"]
    ]
}
```

## Internal Ports

Sometimes, especially on the outermost node, it is helpful to have internal ports.

<div id="internal_ports"></div>

<script type="text/javascript">

    var graph = {
        children:[
            { id:"ExtIn", port:1 },
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
            { id:"C3" },
            { id:"ExtOut", port:1 },
        ],
        edges:[
            ["C1.Out","C2.In"],
            ["C2.Out","C3"]
        ]
    }

    hdelk.layout( graph, "internal_ports" );
</script>

Here we've added `ExtIn` and `ExtOut`.  Until they are connected they just fit in where they can.

```js
var graph = {
    children:[
        { id:"ExtIn", port:1 },
        { id:"C1", parameters:["Size"], inPorts:[ "In" ], outPorts:[ "Out" ] },
        { id:"C2", inPorts:[ "In" ], outPorts:[ "Out" ],
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
        { id:"C3" },
        { id:"ExtOut", port:1 },
    ],
    edges:[
        ["C1.Out","C2.In"],
        ["C2.Out","C3"]
    ]
}
```

Internal Ports are defined just like children nodes, except to help with rendering, they are marked with an identifying member - `port:1`.  These internal ports may also have their own ports which is useful when illustrating the packing and unpacking of complex connections.

Let's connect them up.

<div id="connecting_internal_ports"></div>

<script type="text/javascript">

    var graph = {
        children:[
            { id:"ExtIn", port:1 },
            { id:"C1", parameters:["Size"], inPorts:[ "In" ], outPorts:[ "Out" ] },
            { id:"C2", inPorts:[ "In" ], outPorts:[ "Out" ],
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
            { id:"C3" },
            { id:"ExtOut", port:1 },
        ],
        edges:[
            ["ExtIn","C1.In"],
            ["C1.Out","C2.In"],
            ["C2.Out","C3"],
            ["C3","ExtOut"],
        ]
    }

    hdelk.layout( graph, "connecting_internal_ports" );
</script>

Everthing falls nicely into place.  Everyone should take a moment to reflect on how great this is.  Layout is very hard.

```js
    var graph = {
        children:[
            { id:"ExtIn", port:1 },
            { id:"C1", parameters:["Size"], inPorts:[ "In" ], outPorts:[ "Out" ] },
            { id:"C2", ports:[ inPorts:[ "In" ], outPorts:[ "Out" ],
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
            { id:"C3" },
            { id:"ExtOut", port:1 },
        ],
        edges:[
            ["ExtIn","C1.In"],
            ["C1.Out","C2.In"],
            ["C2.Out","C3"],
            ["C3","ExtOut"],
        ]
    }
```

## Constants

Occasionally, it is important to show constants.

<div id="add_constant"></div>

<script type="text/javascript">

    var graph = {
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
            ["C1.Out","C2.In"],
            ["C2.Out","C3"]
        ]
    }

    hdelk.layout( graph, "add_constant" );
</script>

Until they are connected they just fit in where they can.

```js
var graph = {
    children:[
        { id:"ExtIn", port:1 },
        { id:"C1", parameters:["Size"], inPorts:[ "In" ], outPorts:[ "Out" ] },
        { id:"C2", inPorts:[ "In" ], outPorts:[ "Out" ],
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
        { id:"C3" },
        { id:"ExtOut", port:1 },
    ],
    edges:[
        ["C1.Out","C2.In"],
        ["C2.Out","C3"]
    ]
}
```

They are defined just like internal nodes, except they are marked `constant:1`.  Constants may also have their own ports which may be useful when dealing with parts of constants.

Let's connect them up.

<div id="connecting_constants"></div>

<script type="text/javascript">

    var graph = {
        children:[
            { id:"5", constant:1 },
            { id:"C1", parameters:["Size"], inPorts:[ "In" ], outPorts:[ "Out" ] },
            { id:"C2", inPorts:[ "In" ], outPorts:[ "Out" ],
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
            ["5","C1.Size"],
            ["C1.Out","C2.In"],
            ["C2.Out","C3"]
        ]
    }

    hdelk.layout( graph, "connecting_constants" );
</script>

`C1`'s parameter `size` is now clearly set to `5`.

```js
    var graph = {
        children:[
            { id:"ExtIn", port:1 },
            { id:"C1", parameters:["Size"], inPorts:[ "In" ], outPorts:[ "Out" ] },
            { id:"C2", ports:[ inPorts:[ "In" ], outPorts:[ "Out" ],
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
            { id:"C3" },
            { id:"ExtOut", port:1 },
        ],
        edges:[
            ["5","C1.Size"],
            ["C1.Out","C2.In"],
            ["C2.Out","C3"],
        ]
    }
```


## Highlighting

Often it's handy to be able to emphasize or highlight parts of a diagram.  Returning to one of our simpler diagrams above, let's see how highlighting looks.

The easiest thing to do is to just specify a background color.

<div id="add_highlighting_color"></div>

<script type="text/javascript">

    var graph = {
        color:"#EEE",
        children:[
            { id:"C1", parameters:["Size"], inPorts:[ "In" ], outPorts:[ "Out" ] },
            { id:"C2", ports:[ "In", "Out" ] },
            { id:"C3" }
        ],
        edges:[
            ["C1.Out","C2.In"],
            ["C2.Out","C3"]
        ]
    }

    hdelk.layout( graph, "add_highlighting_color" );
</script>

The backround is now a light gray.  This can be very useful to create contrasts.

```js
var graph = {
    color:"#EEE",
    children:[
        { id:"C1", parameters:["Size"], inPorts:[ "In" ], outPorts:[ "Out" ] },
        { id:"C2", ports:[ "In", "Out" ] },
        { id:"C3" }
    ],
    edges:[
        ["C1.Out","C2.In"],
        ["C2.Out","C3"]
    ]
}
```

The `color` member can be set on any node, but be careful with color choices.  It's easy to make child nodes, edges and labels disappear with the wrong colors.  Just use HTML / CSS style colors as the parameter.

More conveniently, and more interestingly, another way to highlight nodes is with the highlight flag.

<div id="add_highlighting"></div>

<script type="text/javascript">

    var graph = {
        color:"#EEE",
        children:[
            { id:"C1", parameters:["Size"], inPorts:[ "In" ], outPorts:[ "Out" ] },
            { id:"C2", highlight:1, ports:[ "In", "Out" ] },
            { id:"C3" }
        ],
        edges:[
            ["C1.Out","C2.In"],
            ["C2.Out","C3"]
        ]
    }

    hdelk.layout( graph, "add_highlighting" );
</script>

The highlight flag alters the appearance of a node or edge, changing colors, line widths, etc.

```js
var graph = {
    color:"#EEE",
    children:[
        { id:"C1", parameters:["Size"], inPorts:[ "In" ], outPorts:[ "Out" ] },
        { id:"C2", highlight:1, ports:[ "In", "Out" ] },
        { id:"C3" }
    ],
    edges:[
        ["C1.Out","C2.In"],
        ["C2.Out","C3"]
    ]
}
```

See the `highlight` member is assigned a number.  Setting different highlight numbers causes different highlight schemes to be used.  There are currently 6.

<div id="add_more_highlighting"></div>

<script type="text/javascript">

    var graph = {
        color:"#EEE",
        children:[
            { id:"C1", parameters:["Size"], inPorts:[ "In" ], outPorts:[ "Out" ], highlight:2 },
            { id:"C2", highlight:1, ports:[ "In", "Out" ] },
            { id:"C3", highlight:3,  }
        ],
        edges:[
            ["C1.Out","C2.In"],
            ["C2.Out","C3"]
        ]
    }

    hdelk.layout( graph, "add_more_highlighting" );
</script>

The highlight flag alters the appearance of a node or edge, changing colors, line widths, etc.

```js
var graph = {
    color:"#EEE",
    children:[
        { id:"C1", highlight:2, ports:[ "In", "Out" ] },
        { id:"C2", highlight:1, ports:[ "In", "Out" ] },
        { id:"C3", highlight:3,  }
    ],
    edges:[
        ["C1.Out","C2.In"],
        ["C2.Out","C3"]
    ]
}
```

There is another feature tucked away in there.  Setting `highlight` to `0` causes the item to be dimmed.  This can be useful when drawing attention to a particular node.

<div id="add_dim"></div>

<script type="text/javascript">

    var graph = {
        color:"#EEE",
        children:[
            { id:"C1", parameters:["Size"], inPorts:[ "In" ], outPorts:[ "Out" ], highlight:0 },
            { id:"C2", ports:[ "In", "Out" ] },
            { id:"C3", highlight:0,  }
        ],
        edges:[
            ["C1.Out","C2.In"],
            ["C2.Out","C3"]
        ]
    }

    hdelk.layout( graph, "add_dim" );
</script>

As with the other highlights, the dim value effects everything about the item's appearance.

```js
var graph = {
    color:"#EEE",
    children:[
        { id:"C1", parameters:["Size"], inPorts:[ "In" ], outPorts:[ "Out" ], highlight:0 },
        { id:"C2", ports:[ "In", "Out" ] },
        { id:"C3", highlight:0,  }
    ],
    edges:[
        ["C1.Out","C2.In"],
        ["C2.Out","C3"]
    ]
}
```

## Edge Properties

Edges can be marked as being complex by adding the property `bus:1` to the edge specification.  But there is a problem.  We've been using the super compact edge spec.

``` js
["source","target"]
```

which is not very friendly toward new properties.  Therefore you can also specify edges in a longer form which is better suited to adding attributes.

``` js
{ route:["source","target"], bus:1 }
```

<div id="edge_properties"></div>

<script type="text/javascript">

    var graph = {
        color:"#EEE",
        children:[
            { id:"C1", highlight:2, ports:[ "In", "Out" ] },
            { id:"C2", highlight:1, ports:[ "In", "Out" ] },
            { id:"C3", highlight:3,  }
        ],
        edges:[
            { route:["C1.Out","C2.In"], bus:1 },
            ["C2.Out","C3"]
        ]
    }

    hdelk.layout( graph, "edge_properties" );
</script>

There is now a larger line connecting `C1` and `C2`.

```js
var graph = {
    color:"#EEE",
    children:[
        { id:"C1", highlight:2, ports:[ "In", "Out" ] },
        { id:"C2", highlight:1, ports:[ "In", "Out" ] },
        { id:"C3", highlight:3,  }
    ],
    edges:[
        { route:["C1.Out","C2.In"], bus:1 },
        ["C2.Out","C3"]
    ]
}
```

Any edge with property `bus:1` will be drawn wider.

With the expanded edge format, we can also highlight connections.

<div id="edge_highlights"></div>

<script type="text/javascript">

    var graph = {
        color:"#EEE",
        children:[
            { id:"C1", highlight:2, ports:[ "In", "Out" ] },
            { id:"C2", highlight:1, ports:[ "In", "Out" ] },
            { id:"C3", highlight:3,  }
        ],
        edges:[
            { route:["C1.Out","C2.In"], bus:1, highlight:2 },
            ["C2.Out","C3"]
        ]
    }

    hdelk.layout( graph, "edge_highlights" );
</script>

The same principle applies to highlights here.  Use a small integer to get the color you want.  Use `0` to dim the edge.

```js
var graph = {
    color:"#EEE",
    children:[
        { id:"C1", highlight:2, ports:[ "In", "Out" ] },
        { id:"C2", highlight:1, ports:[ "In", "Out" ] },
        { id:"C3", highlight:3,  }
    ],
    edges:[
        { route:["C1.Out","C2.In"], bus:1, highlight:2 },
        ["C2.Out","C3"]
    ]
}
```

## Edge Labels

It is very handy to be able to label edges as well as nodes and ports.  The magic of the Elk layout engine is that we get that for free.

<div id="edge_labels"></div>

<script type="text/javascript">

    var graph = {
        color:"#EEE",
        children:[
            { id:"C1", highlight:2, ports:[ "In", "Out" ] },
            { id:"C2", highlight:1, ports:[ "In", "Out" ] },
            { id:"C3", highlight:3,  }
        ],
        edges:[
            { route:["C1.Out","C2.In"], label:"Path1", bus:1, highlight:2 },
            ["C2.Out","C3", "Path2"]
        ]
    }

    hdelk.layout( graph, "edge_labels" );
</script>


```js
var graph = {
    color:"#EEE",
    children:[
        { id:"C1", highlight:2, ports:[ "In", "Out" ] },
        { id:"C2", highlight:1, ports:[ "In", "Out" ] },
        { id:"C3", highlight:3,  }
    ],
    edges:[
        { route:["C1.Out","C2.In"], label:"Path1", bus:1, highlight:2 },
        ["C2.Out","C3", "Path2"]
    ]
}
```

Note that we add a `label` member to the expanded edge spec, or just add another string to the compact form.


## Node Type

A name sometimes isn't enough information on a node, so there is a mechanism to add node type.

<div id="node_type"></div>

<script type="text/javascript">

    var graph = {
        color:"#EEE",
        children:[
            { id:"C1", type:"TypeA", ports:[ "In", "Out" ] },
            { id:"C2", type:"TypeB", ports:[ "In", "Out" ] },
            { id:"C3", type:"TypeC",   }
        ],
        edges:[
            { route:["C1.Out","C2.In"], label:"Path1", bus:1 },
            ["C2.Out","C3", "Path2"]
        ]
    }

    hdelk.layout( graph, "node_type" );
</script>

The type is drawn in a smaller font size with a less emphatic color.

```js
var graph = {
    color:"#EEE",
    children:[
        { id:"C1", type:"TypeA", ports:[ "In", "Out" ] },
        { id:"C2", type:"TypeB", ports:[ "In", "Out" ] },
        { id:"C3", type:"TypeC",   }
    ],
    edges:[
        { route:["C1.Out","C2.In"], label:"Path1", bus:1 },
        ["C2.Out","C3", "Path2"]
    ]
}
```

## Modifying the Look and Feel

That's pretty much it for HDElk features.

Since there is no elaborate build or deployment system in HDElk, tweaking the code to get something you want is feasible.  Changes can be seen immediately.  Code can be debugged.

The simplest way to adjust the appearance of a diagram is to alter the appearance variables.  It is easy to make a mess, so do it gradually.

Here's a sample of some of the variables from hdelk.js

```js
    /**
     * HDElk Style Section
     */

    var node_width = 75;
    var node_height = 75;

    var node_highlight_fill_color = ['#DDD', '#4bF','#F88', '#FE6','#7e0'];
    var node_fill_color = '#FFF';
    var node_stroke_color = '#666';
    var node_highlight_stroke_width = 2;
    var node_stroke_width = 1;
    var node_name_text_color = '#666';
    var node_highlight_name_text_color = [ '#222', '#46C', '#922', '#A90', '#350' ];
    var node_name_font_size = '16px';
    var node_type_text_color = '#666';
    var node_type_font_size = '12px';

    var node_port_height = 22;
    var node_port_name_text_color = '#FFF';
    var node_port_fill_color = '#777';

    var port_height = 18;
    var port_fill_color = '#777';
    var port_text_color = '#FFF';
    var port_highlight_fill_color = [ '#444', '#06d', '#C00', '#980', '#590' ];

    var edge_width = 1;
    var edge_color = '#888';
    var edge_highlight_color = [ '#444', '#06d', '#C00', '#980', '#590' ];
    var edge_highlight_width = 2;
    var edge_bus_width = 6;
    var edge_bus_color = '#AAA';
    var edge_bus_highlight_color = [ '#444', '#06d', '#C00', '#980', '#590' ];
    var edge_bus_highlight_width = 6;
```

Deeper changes to how the diagrams are specified are most likely to be made to the recursive `hdelk.transform( )` function.  In here is where the edge shortcuts are implemented, for example.  It iterates over all the node members making changes and additions where necessary.  More fancy layout options for Elk can be inserted here too.

Appearance changes can be made in the `hdelk.diagram( )` function.  It takes the output of ELk, and generates a chunk of SVG text.  Here is where most of the styling is done.

## Error Fixing

Common errors are not getting the labels right in edge specifications, and missing commas in lists of edges or components.  Of course brace and parenthesis mismatches are their usual hell.



## Extra Diagrams

Here are three final diagrams, illustrating all of the above JSON specification techniques.

This first monster is especially interesting because of its use of a complex internal port and also a variety of different edge and port specification styles.

<div id="diagram"></div>

<script>
    var dg = {
        color:"#F7F7F7",
        children: [
            { id: "input", port:1 },
            { id: "node_one", ports: ["in", {id:"p1",label:"Loop"},"p2"] },
            { id: "n2", label: "n_2", type:"output", ports: ["p1", "p2", {id:"p3",label:"Long Label"},"p4"] },
            { id: "n3", type:"pipe",  ports: ["p1","p2", "p3"], parameters:[ "Param1", "Param2", "Param3"] },
            { id: "n4", type:"pipeA", highlight:0, ports: ["p1","p2"]  },
            { id: "n5", type:"pipeB", highlight:0, ports: ["p1","p2","p3"]  },
            { id: "n6", type:"pipeC", highlight:0, ports: ["p1","p2","p3","p4"]  },
            { id: "n7",
                highlight:1,
                inPorts: ["p1", "pIn"], outPorts:["p2"],
                children: [
                    { id: "pIn", highlight:1, label:"", port:1, inPorts: ["pIn"], outPorts:["Data","Valid","Ready"] },
                    { id: "c1", highlight:5, type:"compA", inPorts: ["Data", "Valid", "Ready"], outPorts:[{id:"p1",label:"Loop"},"p2","p3"] },
                    { id: "c2", highlight:3, type:"compB", ports: ["p1","p2","p3"] },
                    { id: "c3", highlight:4, type:"compC", ports: ["p1","p2","p3","p4"] },
                    { id: "c4", highlight:2, type:"Bigger Module",
                        parameters:["Prop1","Prop2", "Prop3", "Prop4"],
                        inPorts: ["clock","reset","p1","X","Y","Z"],
                        outPorts:["p2","P","Q","R"] }
                ],
                edges: [
                    { sources:["c1.p2"], targets:["c2.p1"], bus:1, highlight:5 },
                    { source:"n7.p1", target:"c1.p1" },
                    { route:[ "c2.p2", "c4.p1" ], bus:1, highlight:3 },
                    { route:[ "c4.p2", "n7.p2" ], bus:1, highlight:2, label:"result" },
                    { route:["c1.p3","c3.p3"], highlight:5, label:"to yellow"  },
                    { route:[ "c3.p4", "c2.p3" ], bus:1, highlight:4 },
                    { route:[ "c3.p1", "c3.p2"], highlight:4 },
                    [ "pIn.Valid", "c1.Valid", "valid" ],
                    [ "pIn.Data", "c1.Data", "data" ],
                    //[ "pIn.Ready", "c1.Ready", "ready" ],
                    [ "c1.Ready", "pIn.Ready", "ready" ],
                    [ "n7.pIn", "pIn.pIn", "pIn"  ]
                ]
            }
        ],
        edges: [
            ["input","node_one.in"],
            {source:"node_one.p1", target:"n2.p1", bus:1, label:"long bus" },
            {source:"node_one.p2", target:"n3.p1" },
            {route:["n3.p2", "n4.p1"], highlight:0, label:"optional" },
            {route:["n4.p2", "n5.p1"], highlight:0 },
            {route:["n5.p2", "n6.p1"], highlight:0 },
            {route:["n5.p3", "n6.p3"], bus:1, highlight:0 },
            {route:["n6.p2", "n2.p2" ], highlight:0 },
            {route:["n6.p4", "n2.p4" ], bus:1, highlight:0},
            ["n3.p2", "n7.p1" ],
            ["n7.p2", "n2.p3" ],
            ["n3.p3", "n7.pIn" ]
        ]
    }

    hdelk.layout( dg, "diagram" );
</script>

Note the `n7` internal port `pIn`, which has its own sub-ports.

Note also that the label on the edge that connects a port on `c3` back to itself is not working.  This is a bug with Elk.

``` js
    var dg = {
        color:"#F7F7F7",
        children: [
            { id: "input", port:1 },
            { id: "node_one", ports: ["in", {id:"p1",label:"Loop"},"p2"] },
            { id: "n2", label: "n_2", type:"output", ports: ["p1", "p2", {id:"p3",label:"Long Label"},"p4"] },
            { id: "n3", type:"pipe",  ports: ["p1","p2", "p3"], parameters:[ "Param1", "Param2", "Param3"] },
            { id: "n4", type:"pipeA", highlight:0, ports: ["p1","p2"]  },
            { id: "n5", type:"pipeB", highlight:0, ports: ["p1","p2","p3"]  },
            { id: "n6", type:"pipeC", highlight:0, ports: ["p1","p2","p3","p4"]  },
            { id: "n7",
                highlight:1,
                inPorts: ["p1", "pIn"], outPorts:["p2"],
                children: [
                    { id: "pIn", highlight:1, label:"", port:1, inPorts: ["pIn"], outPorts:["Data","Valid","Ready"] },
                    { id: "c1", highlight:5, type:"compA", inPorts: ["Data", "Valid", "Ready"], outPorts:[{id:"p1",label:"Loop"},"p2","p3"] },
                    { id: "c2", highlight:3, type:"compB", ports: ["p1","p2","p3"] },
                    { id: "c3", highlight:4, type:"compC", ports: ["p1","p2","p3","p4"] },
                    { id: "c4", highlight:2, type:"compD", ports: ["p1","p2"] }
                ],
                edges: [
                    { sources:["c1.p2"], targets:["c2.p1"], bus:1, highlight:5 },
                    { source:"n7.p1", target:"c1.p1" },
                    { route:[ "c2.p2", "c4.p1" ], bus:1, highlight:3 },
                    { route:[ "c4.p2", "n7.p2" ], bus:1, highlight:2, label:"result" },
                    { route:["c1.p3","c3.p3"], highlight:5, label:"to yellow"  },
                    { route:[ "c3.p4", "c2.p3" ], bus:1, highlight:4 },
                    { route:[ "c3.p1", "c3.p2"], highlight:4 },
                    [ "pIn.Valid", "c1.Valid", "valid" ],
                    [ "pIn.Data", "c1.Data", "data" ],
                    //[ "pIn.Ready", "c1.Ready", "ready" ],
                    [ "c1.Ready", "pIn.Ready", "ready" ],
                    [ "n7.pIn", "pIn.pIn", "pIn"  ]
                ]
            }
        ],
        edges: [
            ["input","node_one.in"],
            {source:"node_one.p1", target:"n2.p1", bus:1, label:"long bus" },
            {source:"node_one.p2", target:"n3.p1" },
            {route:["n3.p2", "n4.p1"], highlight:0, label:"optional" },
            {route:["n4.p2", "n5.p1"], highlight:0 },
            {route:["n5.p2", "n6.p1"], highlight:0 },
            {route:["n5.p3", "n6.p3"], bus:1, highlight:0 },
            {route:["n6.p2", "n2.p2" ], highlight:0 },
            {route:["n6.p4", "n2.p4" ], bus:1, highlight:0},
            ["n3.p2", "n7.p1" ],
            ["n7.p2", "n2.p3" ],
            ["n3.p3", "n7.pIn" ]
        ]
    }

    hdelk.layout( dg, "diagram" );
```

The `main` and `n7` nodes also have just about every different kind of edge specification.

The "How it Works" diagram shows non-HDL use of HDElk.  One could argue that it is not perfectly suited to documenting conventional code!

<div id="HDElk_diagram"></div>

<script type="text/javascript">

    const HDElk_graph = {
        children: [
            { id: "diagram", highlight:2, type:"JSON" },
            { id: "HDElk", highlight:1, label:"", height:80, inPorts: [ "layout()" ], outPorts:[ { id:"svg", label:" " }  ],
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

    hdelk.layout( HDElk_graph, "HDElk_diagram" );
</script>

``` js
const HDElk_graph = {
    children: [
        { id: "diagram", highlight:2, type:"JSON" },
        { id: "HDElk", highlight:1, label:"", height:80, ports: [ "layout()", { id:"svg", label:" " }  ],
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
```

Finally, here's the diagram that appears as the banner on this site, illustrating different background colors and highlighting.

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


``` js
var title_graph = {
    color: "#555",
    children: [
        { id: "in", port: 1, highlight:1 },
        { id: "one", color: "#999", ports: ["in", "out"] },
        { id: "two", color: "#999", ports: ["in", "out"] },
        { id: "three", color: "#999", ports: ["in", "out"] },
        { id: "four", ports: ["in", "out"],
            color: "#666",
            ports: ["in", "out"],
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
```
