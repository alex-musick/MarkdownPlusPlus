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

class InlineCode{
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

//This file will contain the code that reads the markdown file, and converts it to a list of element objects.
// Simple markdown interpreter that converts text to element objects
// import {
//   Heading,
//   Paragraph,
//   ListItem,
//   BulletList,
//   CodeBlock,
//   EmbeddedImage,
//   Divider,
//   HyperLink,
//   RawHtml,
//   Menu,
//   Footer,
// } from "./elements.js";

async function readFile(filename)
{
    let fileContents = ""
    await fetch(filename)
        .then(response => response.text())
        .then(text => {fileContents = text})

    return fileContents
}

class MarkdownInterpreter {
  constructor() {
    this.elementId = 0; // Keep track of element IDs
  }

  // Main function to read markdown text
  async readMarkdown() {
    var markdownText = await readFile("./example.md")

    console.log(markdownText)
    let lines = markdownText.split("\n"); // Split text into lines
    let elements = []; // Store all our elements here

    for (let line of lines) {
      if (line.trim() === "") {
        continue;
      }

      // Checking what kind of line it is and create the right element
      if (line.startsWith("#")) {
        elements.push(this.makeHeading(line));
      } else if (line.startsWith("- ")) {
        elements.push(this.makeListItem(line));
      } else if (line.startsWith("1. ")) {
        elements.push(this.makeOrderedListItem(line));
      } else if (line.startsWith("```")) {
        elements.push(this.makeCodeBlock(line));
      } else if (line.startsWith("![")) {
        elements.push(this.makeEmbeddedImage(line));
      } else if (line.startsWith("[")) {
        elements.push(this.makeHyperLink(line));
      } else if (line.includes("`")) {
        elements.push(this.makeInlineCode(line));
      } else {
        elements.push(this.makeParagraph(line));
      }
    }

    return elements;
  }

  // Create a heading element
  makeHeading(line) {
    let heading = new Heading();
    heading.id = ++this.elementId;
    // Count # symbols to get heading level
    let count = 0;
    while (line[count] === "#") {
      count++;
    }
    heading.level = count;

    // Get the heading text
    heading.content = line.slice(count).trim();

    return heading;
  }

  // Create a paragraph element
  makeParagraph(line) {
    let paragraph = new Paragraph();
    paragraph.id = ++this.elementId;
    
    // Check if text has bold or italic
    
    if (line.includes("***")) {
      paragraph.bold = true;
      paragraph.italic = true;
      line = line.replace(/\*\*\*(.*?)\*\*\*/g, "$1");
    }
    else if (line.includes("**")) {
      paragraph.bold = true;
      line = line.replace(/\*\*(.*?)\*\*/g, "$1");
    }
    else if (line.includes("*")) {
      paragraph.italics = true;
      line = line.replace(/\*(.*?)\*/g, "$1");
    }
    else if (line.includes("_")) {
      paragraph.underline = true;
      line = line.replace(/_(.*?)_/g, "$1");
    }
    else if (line.includes("~~")) {
      paragraph.strikethrough = true;
      line = line.replace(/~~(.*?)~~/g, "$1");
    }
    paragraph.content = line.trim();
    
    return paragraph;
  }

  // Create a list item
  makeListItem(line) {
    let list = new BulletList();
    list.id = ++this.elementId;
    list.ordered = false;

    let item = new ListItem();
    item.id = ++this.elementId;
    item.content = line.slice(2).trim(); // Remove "- " from start

    list.items = [item];
    return list;
  }

  // Create an ordered list item
  makeOrderedListItem(line) {
    let list = new BulletList();
    list.id = ++this.elementId;
    list.ordered = true;

    let item = new ListItem();
    item.id = ++this.elementId;
    item.content = line.slice(3).trim(); // Remove "1. " from start

    list.items = [item];
    return list;
  }

  // Create a code block
  makeCodeBlock(lines, index) {
    let code = new CodeBlock();
    code.id = ++this.elementId;
    code.content = [];

    // Skips the starting "```"
    index++;

    // Collects lines until the closing "```" is reached
    while (index < lines.length && !lines[index].startsWith("```")) {
      code.content.push(lines[index]);
      index++;
    }

    // Skip the closing "```" if present
    if (index < lines.length) {
      index++;
    }

    // Convert array to string
    code.content = code.content.join("\n");
    return { code, nextIndex: index };
  }

  makeEmbeddedImage(line) {
    let image = new EmbeddedImage();
    image.id = ++this.elementId;
    image.location = line.slice(2).trim(); // Remove "![" from start
    return image;
  }
  makeHyperLink(line) {
    let link = new HyperLink();
    link.id = ++this.elementId;
    let text = line.match(/\[(.*?)\]/)[1];
    let url = line.match(/\((.*?)\)/)[1];
    link.text = text;
    link.destination = url;
    return link;
  }

  // Create inline code
  makeInlineCode(line) {
    let paragraph = new Paragraph();
    paragraph.id = ++this.elementId;
    paragraph.content = line.trim();
    paragraph.bold = false;
    paragraph.italics = false;
    paragraph.underline = false;
    paragraph.strikethrough = false;
    return paragraph;
  }
  toJSON(elements) {
    return JSON.stringify({ elements }, null, 2);
  }
}
//begin rendering functions

function render_heading(heading, previous, banner=false) {
  var htmlContent = ""
  if (banner == true)
  {
      htmlContent += '<div id="banner">'
  }
  htmlContent += `<h${heading.level}>`
  htmlContent += heading.content
  htmlContent += `h${heading.level}`
  if (banner == true)
      {
          htmlContent += '</div>'
      }
  previous.insertAdjacentHTML("beforeend", htmlContent)
  return
}

function render_paragraph(paragraph, previous, isChild = false) {
  var htmlContent = "<p>"

  //Open formatting
  if (paragraph.bold == true) {
      htmlContent += "<b>"
  }
  if (paragraph.italics == true) {
      htmlContent += "<i>"
  }
  if (paragraph.italics == true) {
      htmlContent += "<u>"
  }
  if (paragraph.strikethrough == true) {
      htmlContent += "<s>"
  }

  //Put the text in
  htmlContent += paragraph.content

  //Close the formatting
  if (paragraph.bold == true) {
      htmlContent += "</b>"
  }
  if (paragraph.italics == true) {
      htmlContent += "</i>"
  }
  if (paragraph.italics == true) {
      htmlContent += "</u>"
  }
  if (paragraph.strikethrough == true) {
      htmlContent += "</s>"
  }

  //Check for children and generate them
  if (paragraph.children.length != 0) {
      for (i = 0; i <= paragraph.children.length; i++) {
          htmlContent += render_paragraph(paragraph.children[i], null, true)
      }
  }

  //Close the paragraph
  htmlContent += "</p>"

  //Populate the element or return the element text, depending on whether this is a child paragraph
  if (isChild == false) {
      previous.insertAdjacentHTML("beforeend", htmlContent)
  }
  else {
      return htmlContent
  }

  return
}

function render_list (list, previous) {
  var htmlContent = ""
  if (list.ordered == true) {
      htmlContent += "<ol>"
  }
  else {
      htmlContent += "<ul>"
  }

  //generate all the list elements
  for (i = 0; i <= list.items.length; i++) {
      var listItem = list.items[i]

      if (listItem.hasLabel == true)
      {
          htmlContent += `<li>${listItem.content}</li>`
      }
      else //if hasLabel is false, render as <p> instead of <li>
      { 
          htmlContent += render_paragraph(listItem, null, true)
      }
  }

  //close the list
  if (list.ordered == true) {
      htmlContent += "</ol>"
  }
  else {
      htmlContent += "</ul>"
  }

  //render!
  previous.insertAdjacentHTML("beforeend", htmlContent)
  return
}

function render_codeblock(codeBlock, previous) {
  var htmlContent = '<p class="codeblock">'
  htmlContent += codeBlock.content
  htmlContent += "</p>"
  previous.insertAdjacentHTML("beforeend", htmlContent)
  return
}

function render_image(image, previous) {
  var htmlContent = `<img src="${image.location}" alt="${image.alt_text}">`
  previous.insertAdjacentHTML("beforeend", htmlContent)
  return
}

function render_divider(previous) {
  previous.insertAdjacentHTML("beforeend", "<hr>")
  return
}

function render_link(link, previous) {
  var htmlContent = `<a href="${link.destination}">`
  if (link.isImage = true) {
      htmlContent += `<img src="${link.text}">`
  }
  else {
      htmlContent += link.text
  }
  htmlContent += "</a>"

  previous.insertAdjacentHTML("beforeend", htmlContent)
  return
}

//Actual rendering procedure begins here

async function render_all() {
  const interpreter = new MarkdownInterpreter()
  const page = document.getElementById("MDPP_Anchor")
  var elements = await interpreter.readMarkdown()

  for (i = 0; i <= elements.length; i++)
      {
          var element = elements[i]
          if (i == 0 && element instanceof Heading) // If first line is a heading, make it the banner content
          {
              render_heading(element, page, true)
              continue
          }
      
          if (element instanceof Heading)
          {
              render_heading(element, page)
              continue
          }
      
          if (element instanceof ListItem) // Sanity check -- this should never happen
          {
              console.log("Warning: MDPP/Renderer: ListItem appeared in main element list. Probably a bug in interpreter. Skipping.")
              console.log(`Skipped element content: ${element.content}`)
              continue
          }
      
          if (element instanceof Paragraph)
          {
              render_paragraph(element, page)
              continue
          }
      
          if (element instanceof BulletList)
          {
              render_list(element, page)
              continue
          }
      
          if (element instanceof CodeBlock)
          {
              render_codeblock(element, page)
              continue
          }
      
          if (element instanceof EmbeddedImage)
          {
              render_image(element, page)
              continue
          }
      
          if (element instanceof Divider)
          {
              render_divider(page)
              continue
          }
      
          if (element instanceof HyperLink)
              {
                  render_link(element, page)
                  continue
              }
      
      }
}

render_all()