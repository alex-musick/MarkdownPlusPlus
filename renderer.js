//begin rendering functions

function render_heading(heading, previous, banner=false) {
    var htmlContent = ""
    if (banner == true)
    {
        htmlContent += '<div class="banner">'
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