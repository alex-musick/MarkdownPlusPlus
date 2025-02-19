import fs from 'fs';
import  MarkdownInterpreter  from './interpreter.js';

const interpreter = new MarkdownInterpreter();

// Read the markdown file

// Parse the markdown into elements
const elements = interpreter.readMarkdown();

console.log(elements);