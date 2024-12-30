import { photoData } from "./photos-builder/photo-data.js";
import fs from "fs"

const template = fs.readFileSync('./photos-builder/templates/template.html', "utf8");
const listTemplate = fs.readFileSync('./photos-builder/templates/template-list.html', "utf8");

const photoTemplate = (src, caption, alt) => `<section class='myphoto'>
    <figure>
      <img loading=lazy src="../assets/photos/${src}" alt="${alt}">
      <figcaption>${caption}</figcaption>
    </figure>
  </section>`

/**
 * mobile photos are 600px height as pattern
 * 
 * @param {*} src 
 * @param {*} caption 
 * @param {*} alt 
 * @param {*} name 
 * @returns 
 */
const photoListItemTemplate = (src, caption, alt, name) => `
    <a href="./${name}.html" class="photo-card">
            <img loading=lazy src="../assets/photos/m/${src}" alt="${alt}">
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