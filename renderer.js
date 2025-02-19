//This file will contain the code that will convert the list of element objects into functional HTML markup.

import { Heading, Paragraph, ListItem, BulletList, CodeBlock, EmbeddedImage } from './elements';

import MarkdownInterpeter from './interpreter.js';

const interpeter = new MarkdownInterpeter()

const page = getElementById("MDPP_Anchor")

var elements = [] //PLACEHOLDER!! Replace this with a call to the interpeter

for (i = 0; i <= elements.length; i++)
{
    var element = elements[i]
    if (i == 0 && element instanceof Heading) // If first line is a heading, make it the banner content
    {
        render_heading(element, page, true)
    }

    if (element instanceof ListItem) // Sanity check -- this should never happen
    {
        console.log("Warning: MDPP/Renderer: ListItem appeared in main element list.")
        continue
    }

    if (element instanceof Paragraph)
    {
        render_paragraph(element, page)
    }

}

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
    if (paragraph.children != []) {
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
        if (listItem.hasLabel == true) {
            htmlContent += `<li>${listItem.content}</li>`
        }
        else { //if hasLabel is false, render as <p> instead of <li>
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