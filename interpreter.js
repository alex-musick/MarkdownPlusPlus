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
