//This file will contain the code that reads the markdown file, and converts it to a list of element objects.
// Simple markdown interpreter that converts text to element objects
import { Heading, Paragraph, ListItem, BulletList, CodeBlock, EmbeddedImage, Divider, HyperLink, RawHtml, Menu, Footer } from './elements';
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
        index++;  // Moves to next line
        
        // Collect lines until closing ``` is reached.
        while (index < lines.length && !lines[index].startsWith("```")) {
            code.content.push(lines[index]);
            index++;
        }
        
        code.content = code.content.join("\n"); // Convert array to string
        return { code, nextIndex: index }; // Return both the object and the new index
    }
    

      makeEmbeddedImage(line) {
        let image = new EmbeddedImage();
        image.id = ++this.elementId;
        image.location = line.slice(2).trim();  // Remove "![" from start
        return image;
      }
  }

  document.addEventListener("DOMContentLoaded", function () {
    const fileInput = document.getElementById("file-input");
    fileInput.addEventListener("change", handleFileUpload);
});

// // Handle file upload
// function handleFileUpload(event) {
//     const file = event.target.files[0];
//     if (!file) return;

//     const reader = new FileReader();
//     reader.onload = function (e) {
//         let markdownText = e.target.result;
//         let interpreter = new MarkdownInterpreter();
//         let elements = interpreter.readMarkdown(markdownText);
//         renderToHTML(elements);
//     };
//     reader.readAsText(file);
// }

// // Function to render interpreted elements into HTML
// function renderToHTML(elements) {
//     let container = document.getElementById("markdown-content");
//     container.innerHTML = ""; // Clear previous content

//     elements.forEach(element => {
//         let htmlElement = document.createElement(getTagForElement(element));
//         htmlElement.textContent = element.content;
//         container.appendChild(htmlElement);
//     });
// }

// // Helper function to map element types to HTML tags
// function getTagForElement(element) {
//     if (element instanceof Heading) return `h${element.level}`;
//     if (element instanceof Paragraph) return "p";
//     if (element instanceof BulletList) return "ul";
//     if (element instanceof ListItem) return "li";
//     if (element instanceof CodeBlock) return "pre"; 
//     return "div";  // Default container
// }
