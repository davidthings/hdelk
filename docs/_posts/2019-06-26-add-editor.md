---
layout: single
excerpt: "New editor permits interactive online diagram creation"
title: Added an Editor
header:
  title: Added an Editor
  overlay_image: /assets/images/banner.png
---

There is now an [Editor]({{site.baseurl}}/editor) so you can play with HDElk online.  This was built with three additional technologies - CodeMirror for editing, PermissiveJSON to allow very loose JSON to be entered and FileSaver.js to assist with getting the various artifacts saved.

## Code Mirror

![CodeMirror]({{ site.url }}{{ site.baseurl }}/assets/images/added_editor/code_mirror_logo.png)

Great in-browser syntax highlighting editor

[Main Site](https://codemirror.net/)

## ToloFramework Permissive JSON Parser

This NodeJS module takes pretty loose JSON and parses it as if it were typed correctly.

From the [Repo](https://raw.githubusercontent.com/tolokoban/toloframework-permissive-json)

>Permissive JSON:
>
```javascript
{ul
  // This comment will be ignored.
  class: [bright shadowed]
  [
    {li ["Happy birthday!"]}
    {li ["Mister president."]}
  ]
}
```
>The same object in strict JSON:
```javascript
{
  "0": "ul",
  "class": ["bright", "shadowed"],
  "1": [
    { "0": "li", "1": ["Happy birthday!"] },
    { "0": "li", "1": ["Mister president."] }
  ]
}
```

It lets you get away with murder.

Without PermissiveJSON, we'd need to be a lot more correct in the editor.  Or we'd need to do `Javascript.eval( )`'s

The code was adapted for use in the browser.

## FileSaver.js

Functions for saving small files from the browser

[Main Site](https://eligrey.com/blog/saving-generated-files-on-the-client-side/)

[GitHub](https://github.com/eligrey/FileSaver.js/)

