import { photoData } from "./photos-builder/photo-data.js";
import fs from "fs"

const template = fs.readFileSync('./photos-builder/templates/template.html', "utf8");
const listTemplate = fs.readFileSync('./photos-builder/templates/template-list.html', "utf8");

const photoTemplate = (src, caption, alt) => `<section class='myphoto'>
    <figure>
      <img loading=lazy src="../${src}" alt="${alt}">
      <figcaption>${caption}</figcaption>
    </figure>
  </section>`

const photoListItemTemplate = (src, caption, alt, name) => `
    <a href="./${name}.html" class="photo-card">
        
    <div>
            <img loading=lazy src="../${src}" alt="${alt}">
        
    </div>
    </a>`

const writePhotoItemHtmlFile = (item) => {
    const photoItemHtml = photoTemplate(item.src, item.caption, item.alt)
    let output = template.replace("{{photo}}", photoItemHtml);
    fs.writeFileSync(`./photos/${item.name}.html`, output);
}

const writePhotoListHtmlFile = () => {
    const photoList = photoData.map((item) => {
       return photoListItemTemplate(item.src, item.caption, item.alt, item.name) 
    }).join("")
    let output = listTemplate.replace("{{list}}", photoList);
    fs.writeFileSync(`./photos/index.html`, output);
}


// main 
// creates all the item html pages
photoData.forEach((item) => {
    writePhotoItemHtmlFile(item)
})

writePhotoListHtmlFile()