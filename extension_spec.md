# Markdown++ Extension Syntax

## Menus

Menus are defined across multiple lines. They contain only hyperlinks or paragraphs and are preceded and followed by a line containing only a single caret. Menus can only come at the start or end of the file.

For example:

```
^
My Website
[Home](example.com/home)
[Products](example.com/products)
[About](example.com/about)
^
```

## Banner

If the first line of the markdown file is a top-level heading or a menu, it will be rendered as a banner.
If you want to bypass this feature, you may simply add an empty line to the beginning of your file.

## Footers

If the final line of the markdown file is a top-level heading or a menu, it will be rendered as a footer.
If you wish to populate your footer with multiple elements, you may precede it a line containing only a single @ symbol.
Everything in the file under the @ symbol will be part of the footer.

For example:

```
@
Copyright (C) Example 2025
^
[Contact us](example.com/contact)
[Legal](example.com/legal)
^
```

The end of the file marks the end of the footer, so you do not need to add another @ symbol after it.

## Raw HTML

If the Markdown++ Syntax is too limiting or you need extra functionality, you may insert your own HTML code.
Lines beginning with a % sign will be interpreted as HTML:

```
%<iframe src="example.com/iframe" title="Example iframe"></iframe>
```

If you need multiple consecutive lines to contain HTML, then precede and follow the lines with a single % symbol:

```
%
<p>This is an example of multi-line html.</p>
<p>You can insert as many lines as you need and use any HTML syntax supported by the target browser.</p>
%
```