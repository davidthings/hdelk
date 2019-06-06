
var hdelk = (function(){

    /**
     * HDElkJS Style Section
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
    //var edge_highlight_color = ['#666', '#4bf','#F66', '#ED0', '#7e0']; // light edges
    var edge_highlight_width = 2;
    var edge_bus_width = 6;
    var edge_bus_color = '#AAA';
    var edge_bus_highlight_color = [ '#444', '#06d', '#C00', '#980', '#590' ];
   // var edge_bus_highlight_color = ['#666', '#4bf', '#F66', '#ED0', '#7e0']; // light edges
    var edge_bus_highlight_width = 6;

    /**
     * Creates an SVG diagram from a JSON description.
     * @param {object} graph
     * @param {string} divname
     */
    var layout = function( graph, divname  ) {
        const elk = new ELK({
          })

        transformNode( graph );

        elk.layout(graph)
            .then(function(g) {
                var dp = document.getElementById( divname + "_preprocessed" );
                if ( dp )
                    dp.innerHTML = "<pre style='font-size:10px'>" + JSON.stringify(graph, null, " ") + "</pre>";

                var d = document.getElementById( divname + "_elk" );
                if ( d )
                    d.innerHTML = "<pre style='font-size:8px'>" + JSON.stringify(g, null, " ") + "</pre>";

                diagram( divname, g );
            })
    }

    /**
     * Takes the child object and recursively transforms sub-objects into a form that Elk.JS can use
     * @param {object} child present child node under consideration
     */
    var transformNode = function( child ) {

        if ( child.port ) {
            if ( !child.height )
                child.height = node_port_height;
                if ( child.ports )
                    child.height += ( child.ports.length - 1 ) * port_height;
            if ( !child.label && child.label != "" )
                child.label = child.id;
            if ( !child.width ) {
                child.width = child.label.length * ( 3 * node_port_height / 4 ) / 2;
                if ( child.width == 0 )
                   child.width = 6;
            }
            if ( !child.color )
                child.color = (child.highlight ) ? port_highlight_fill_color[ child.highlight -1 ]: node_port_fill_color;
        }

        if ( !child.color && child.highlight ) {
            child.color = node_highlight_fill_color[ child.highlight - 1 ];
        }

        if ( !child.width )
            child.width = node_width;
        if ( !child.height )
            child.height = node_height;

        var ports = child.ports;
        if ( ports ) {
            ports.forEach( function( item, index, ports ){
                if ( typeof( item ) == "string" ) {
                    item = { id:item }
                    ports[ index ] = item;
                }
                if ( !item.id.includes(".") ) {
                    if ( !item.label )
                        item.label = item.id;
                    item.id = child.id + "." + item.id;
                }
                if ( !item.label )
                    item.label = item.id;

                if ( !item.width )
                    item.width = item.label.length * port_height / 2;
                if ( !item.height )
                    item.height = port_height;
            } )
        }

        var edges = child.edges;
        if ( edges ) {
            edges.forEach( function( item, index, edges ) {
                if ( Array.isArray( item ) ) {
                    var newItem = {  }
                    edges[ index ] = newItem;
                    newItem.sources = [ item[ 0 ] ];
                    newItem.targets = [ item[ 1 ] ];
                    if ( item[ 2 ] )
                        newItem.bus = 1;
                    item = newItem;
                }
                if ( !item.id )
                    item.id = child.id + "E" + index;
                if ( !item.sources && item.source )
                    item.sources = [ item.source ];
                if ( !item.targets && item.target )
                    item.targets = [ item.target ];
                if ( ( !item.sources || !item.targets ) && item.route ) {
                    item.sources = [ item.route[ 0 ] ];
                    item.targets = [ item.route[ 1 ] ];
                }
            } );
        }

        var children = child.children;
        if ( children ) {
            children.forEach( function( item, index ) {
                transformNode( item  );
            } );
        }
    }

    /**
     * Takes the output from ElkJS, renders it into SVG using SVG.js and returns the result
     * @param {string} div_id
     * @param {elkObject} diagram_layout
     * @returns {string} svg
     */
    var diagram = function( div_id, diagram_layout ) {
        var draw = SVG(div_id).size( diagram_layout.width, diagram_layout.height );

        node( draw, diagram_layout, 0, 0 );
    }

    var node = function( draw, child, offsetX, offsetY ) {
        var group = draw.group();

        var childColor;
        if ( child.color )
            childColor = child.color;
        else
            childColor = node_fill_color;

        var portColor = child.highlight ? port_highlight_fill_color[ child.highlight - 1 ] : port_fill_color;

        node_body( group, child.id, child.x + offsetX, child.y + offsetY, child.width, child.height, childColor, child.highlight, portColor );

        var nameSize;
        var nameColor;
        if ( child.port ) {
            nameSize = 2 * node_port_height/3 + "px";
            nameColor = node_port_name_text_color;
        }
        else {
            nameSize = node_name_font_size;
            nameColor = ( child.highlight ) ? node_highlight_name_text_color[ child.highlight - 1 ] : node_name_text_color;
        }

        var name = ( child.label || child.label == "" ) ? child.label : child.id;
        var nodeNameText = group.text(name).style("font-size:"+nameSize).fill({color:nameColor});
        if ( child.port ) {
            var portTextWidth = nodeNameText.node.getComputedTextLength();
            nodeNameText.move(offsetX + child.x+(child.width-portTextWidth)/2, offsetY + child.y + ( child.height-node_port_height) / 2 + 2);

        } else {
            nodeNameText.move(offsetX + child.x + 2, offsetY + child.y + 2 );
        }

        if ( child.type ) {
            var nodeTypeText = group.text(child.type).style("font-size:"+node_type_font_size).fill({color:node_type_text_color});
            nodeTypeText.move(offsetX + child.x + 2, offsetY + child.y + 16 + 4 );
        }

        var edges = child.edges;
        if ( edges ) {
            edges.forEach( function( item, index ) {
                edge( group, item, offsetX + child.x, offsetY + child.y );
            } );
        }

        var children = child.children;
        if ( children ) {
            children.forEach( function( item, index ) {
                node( group, item, child.x + offsetX, child.y + offsetY  );
            } );
        }

        var ports = child.ports;
        if ( ports ) {
            ports.forEach( function( item, index ){
                group.rect( item.width, item.height ).attr({ fill:portColor }).move(offsetX + child.x+item.x, offsetY + child.y+item.y );
                var portText;
                if ( item.label)
                    portText = item.label;
                else
                    portText = item.id;
                var portTextItem = group.text(portText).style("font-size:"+2 * item.height/3+"px").fill({color:port_text_color});
                var portTextWidth = portTextItem.node.getComputedTextLength();
                portTextItem.move(offsetX + child.x+item.x+(item.width-portTextWidth)/2, offsetY + child.y+item.y + 2);
            } )
        }

        return group;
    }

    var node_body = function( draw, name, x, y, width, height, color, highlight, stroke_color ) {
        var group = draw.group();
        var strokeWidth = highlight ? node_highlight_stroke_width : node_stroke_width;
        group.rect(width, height).attr({ fill:color, 'stroke-width': node_stroke_width, stroke:stroke_color }).stroke({width:strokeWidth}).move(x,y);
        return group;
    }

    var edge = function( draw, edge, offsetX, offsetY ) {
        var group = draw.group();

        var sections = edge.sections;

        var width = ( edge.bus ) ? ( edge.highlight ?  edge_bus_highlight_width : edge_bus_width ) : ( edge.highlight ? edge_highlight_width : edge_width );
        var color = ( edge.bus ) ? ( edge.highlight ? edge_bus_highlight_color[ edge.highlight - 1] : edge_bus_color ): ( edge.highlight ? edge_highlight_color[ edge.highlight - 1] : edge_color );

        if ( sections ) {
            sections.forEach( function( item, index ) {
                var startPoint = item.startPoint;
                var endPoint = item.endPoint;

                var bendPoints = item.bendPoints;

                if ( bendPoints == null ) {
                    group.line( offsetX + startPoint.x, offsetY + startPoint.y, offsetX + endPoint.x, offsetY + endPoint.y ).stroke( { color:color, width:width });
                } else {
                    var segments = [];
                    segments.push( [ offsetX + startPoint.x, offsetY + startPoint.y ] );
                    bendPoints.forEach( function( item ) {
                        segments.push( [ offsetX + item.x, offsetY + item.y ] );
                    } );
                    segments.push( [ offsetX + endPoint.x, offsetY + endPoint.y ] );
                    group.polyline( segments ).fill('none').stroke( { color:color, width:width } );
                }

                var terminatorWidth_2 = width;
                if ( terminatorWidth_2 < 3 ) terminatorWidth_2 = 3;
                group.rect( terminatorWidth_2 * 2, terminatorWidth_2 * 2).attr({ fill:color }).move(offsetX + endPoint.x - terminatorWidth_2, offsetY + endPoint.y - terminatorWidth_2 );

            } );
        }

    }
    return {
        layout: layout
    };
})();

