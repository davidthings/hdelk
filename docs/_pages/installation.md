---
layout: single
permalink : /installation
header:
  title: Installation
  overlay_image: /assets/images/banner.svg
---

# Installation

Grab the three js files.  They are all in the [repository](https://github.com/davidthings/hdelk).

**elk.bundled.js**

**svg.min.js**

**hdelk.js**

Put them in a **js** folder as appropriate

Insert the following into an HTML file.

```js
<div id="simple_diagram"></div>

<script src="/js/elk.bundled.js"></script>
<script src="/js/svg.min.js"></script>
<script src="/js/hdelk.js"></script>

<script type="text/javascript">

    var simple_graph = {
        id: "",
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

Browse to it.

See the [example.html]({{site.baseurl}}/example.html) which is about as bare bones as it can be.




