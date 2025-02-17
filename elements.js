class Heading {
    id = 0
    level = 1
    content = "" //text content goes here
}

class Paragraph {
    id = 0
    content = "" //text goes here
    lineBreak = true
    bold = false
    italics = false
    underline = false
    strikethrough = false
    alignment = "left" //left, center, right
    font = "default" //ignore for now, use if we extend markdown to support fonts
    children = [] //If paragraph has child paragraphs, put them here in their parent
}

class ListItem extends Paragraph {
    id = 0
    hasLabel = true //if false, render as a normal paragraph while preserving list continuity
    childItems = [] //If there's sub-items in the list, put them here in their parent as ListItems.
    // Do NOT use the native Paragraph.children attribute for list items unless you're using hasLabel = false and know what you're doing.
}

class BulletList {
    id = 0
    items = [] //list of ListItems goes here
    ordered = false
}

class CodeBlock {
    id = 0
    content = ""
    language = ""
}

class EmbeddedImage {
    id = 0
    location = "" //local link or hyperlink goes here
    alt_text = "" //image description goes here, not rendered but included in html for semantic/accessibility reasons
}

class Divider {
    id = 0
    style = "normal" //This should be left alone for now but can be used to extend markdown syntax later if we choose
}

class HyperLink {
    id = 0
    isImage = false //if true, treat the "text" attribute as a link to an image to embed instead of text to render
    text = ""
    destination = "" //URL or file that the link will point to
}

//THE CLASSES BELOW THIS POINT SHOULD BE IGNORED FOR NOW!
//They are not native markdown features, but I'm putting them in so we can possibly add support for them later

class RawHtml {
    id = 0
    content = ""
}

class Menu {
    id = 0
    items = [] //List of hyperlinks
    style = "horizontal" //we can make a few site menu templates
}

class Footer {
    id = 0
    content = [] //list of paragraphs
    color = "blue" //again, just an idea
    size = "small" //probably would affect the height of the footer
}
