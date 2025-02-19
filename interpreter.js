//This file will contain the code that reads the markdown file, and converts it to a list of element objects.
// Simple markdown interpreter that converts text to element objects
import { Heading, Paragraph, ListItem, BulletList, CodeBlock, EmbeddedImage } from './elements';
class MarkdownInterpreter {
      constructor() {
          this.elementId = 0;  // Keep track of element IDs
      }
  
      // Main function to read markdown text
      readMarkdown(text) {
          let elements = [];  // Store all our elements here
          let lines = text.split('\n');  // Split text into lines
  
          for(let line of lines) {
              if(line.trim() === '') {
                  continue;
              }
  
              // Check what kind of line it is and create right element needed
              if(line.startsWith('#')) {
                  elements.push(this.makeHeading(line));
              }
              else if(line.startsWith('- ')) {
                  elements.push(this.makeListItem(line));
              }
              else if(line.startsWith('```')) {
                  elements.push(this.makeCodeBlock(line));
              }
              else {
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
          while(line[count] === '#') {
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
          paragraph.content = line.trim();
          
          // Check if text has bold or italic
          if(line.includes('**')) {
              paragraph.bold = true;
          }
          if(line.includes('*')) {
              paragraph.italics = true;
          }
          
          return paragraph;
      }
  
      // Create a list item
      makeListItem(line) {
          let list = new BulletList();
          list.id = ++this.elementId;
          
          let item = new ListItem();
          item.id = ++this.elementId;
          item.content = line.slice(2).trim();  // Remove "- " from start
          
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
        image.location = line.slice(2).trim();  // Remove "![" from start
        return image;
      }

}