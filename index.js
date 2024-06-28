import fs from "fs";
import { marked } from "marked";
const init = async (sourceDir) => {
  let blogItems = []
  const directory = fs.readdirSync(sourceDir)
  await directory.forEach(async (filenameExt) => {
    if (filenameExt.endsWith(".md") && filenameExt !== "index.md") {
      console.log("---", filenameExt);
      const [title, data, file, createdDate, modifiedDate] = await getMdMetadata(filenameExt);
      blogItems.push({ title, file, filenameExt, createdDate, modifiedDate, data });
    }
    // await organiseImage(item, sourceDir);
  });

  // Sort blog items by created date - newest first
  const sortedBlogItems = blogItems.sort((a, b) => {
    return (new Date(b.createdDate) - new Date(a.createdDate));
  }).reverse();

  console.log("blogItems", sortedBlogItems);

  const blogIndex = createIndexMd(sortedBlogItems);
  const sitemapBlog = createSitemapBlog(sortedBlogItems);
  // TODO
  // escrever para ficheiro md -> md data c/ metadata -> html. https://github.com/zuedev/markdown-to-html-via-template/blob/main/src/index.js 
  // 

  writeBlogItemsToHtml(sortedBlogItems);
};

const getMdMetadata = async (item) => {
  // Get file stats synchronously
  const stats = fs.statSync(`./blog-builder/${item}`);

  // Access mtime (last modified time)
  const formatter = new Intl.DateTimeFormat('en-GB', {
    dateStyle: 'full',
    timeStyle: 'long',
    timeZone: 'Europe/Madrid',
  })
  const modifiedDate = formatter.format(stats.mtime);
  const createdDate = formatter.format(stats.birthtime);
  // const modifiedDate = (stats.mtime);
  // const createdDate = (stats.birthtime);

  console.log(`File was last modified on: ${modifiedDate}`);
  console.log(`File was created on: ${createdDate}`);
  console.log("stats", stats);
  let data = fs.readFileSync(`./blog-builder/${item}`, "utf8");
  data = data.concat(`\n\n--- created at: ${createdDate} \n\n`);
  data = data.concat(`\n\n--- modifiedDate at: ${modifiedDate} \n\n`);
  console.log("data", data);

  const title = data.match(/^# (.*)$/m)[1];
  console.log("title", title);
  const file = item.replace(".md", "");
  // console.log("makre--------", markdownify(data))
  return [title, data, file, createdDate, modifiedDate];
}

const createIndexMd = (blogItems) => {
  const indexData = "# Blog Index\n\n"
  const indexDataItems = blogItems.map((item) => {
    return `* [${item.title}](./${item.filenameExt}) - created at: ${item.createdDate} - modified at: ${item.modifiedDate}`;
  }).join("\n");
  console.log("indexData", indexData);
  const template = fs.readFileSync('./blog-builder/templates/template.html', "utf8");

  writeMdToHtmlFile(indexData.concat(indexDataItems), 'index', template)
}

const createSitemapBlog = (blogItems) => {
  const sitemapDataHeader = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">`
  const sitemapFooter = `</urlset>`

  const sitemapData = blogItems.map((item) => {
    console.log("item", item);
    return `<url><loc>https://www.tiago.tf/blog/${item.file}.html</loc><lastmod>${item.modifiedDate}</lastmod></url>`;
  }).join("\n");

  fs.writeFileSync("./blog/sitemap.xml", sitemapDataHeader.concat(sitemapData).concat(sitemapFooter));
}

const writeBlogItemsToHtml = (blogItems) => {
  console.log("writeBlogItemsToHtml", blogItems.length)
  const template = fs.readFileSync('./blog-builder/templates/template.html', "utf8");
  return blogItems.forEach((blogItem) => {
    writeMdToHtmlFile(blogItem.data, blogItem.file, template)
  });


}


const writeMdToHtmlFile = (mdData, filename, template) => {
  let output = template.replace("{{markdown}}", markdownify(mdData));
  output = output.replace(/href="(.*)\.md"/g, 'href="$1.html"');
  fs.writeFileSync(`./blog/${filename}.html`, output);
}


function markdownify(content) {
  marked.use({
    gfm: true, // GitHub Flavored Markdown
    breaks: false, // add <br> on single line breaks (GFM)
  });

  return marked.parse(content);
}

// const dir = process.argv.slice(2);
// console.log("dir", dir)
// if (dir.length < 1) {
//   throw new Error("needs to define a path to organise")
// }
init('./blog-builder');
