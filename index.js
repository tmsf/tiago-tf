import fs from "fs";
import { marked } from "marked";
const init = async (sourceDir) => {
  let blogItems = []
  const directory = fs.readdirSync(sourceDir)
  await directory.forEach(async (filenameExt) => {
    if (filenameExt.endsWith(".md") && filenameExt !== "index.md") {
      // console.log("---", filenameExt);
      const [title, data, file, createdDate, modifiedDate, stats] = await getMdMetadata(filenameExt);
      blogItems.push({ title, file, filenameExt, createdDate, modifiedDate, data, stats });
    }
    // await organiseImage(item, sourceDir);
  });

  // Sort blog items by created date - newest first
  const sortedBlogItems = blogItems.sort((a, b) => {
    return (new Date(b.stats.birthtime) - new Date(a.stats.birthtime));
  })//.reverse();

  // console.log("blogItems", sortedBlogItems);

  const blogIndex = createIndexMd(sortedBlogItems);
  const sitemapBlog = createSitemapBlog(sortedBlogItems);
  // TODO
  // escrever para ficheiro md -> md data c/ metadata -> html. https://github.com/zuedev/markdown-to-html-via-template/blob/main/src/index.js 
  // 

  writeBlogItemsToHtml(sortedBlogItems);
  createRss(sortedBlogItems);
};

const formatter = new Intl.DateTimeFormat('en-GB', {
  dateStyle: 'short',
  timeStyle: 'long',
  timeZone: 'Europe/Madrid',
})

const getMdMetadata = async (item) => {
  // Get file stats synchronously
  const stats = fs.statSync(`./blog-builder/${item}`);

  // Access mtime (last modified time)
  
  // const modifiedDate = formatter.format(stats.mtime);
  // const createdDate = formatter.format(stats.birthtime);
  const modifiedDate = (stats.mtime);
  const createdDate = (stats.birthtime);

  // console.log(`File was last modified on: ${modifiedDate}`);
  // console.log(`File was created on: ${createdDate}`);
  // console.log("stats", stats);
  let data = fs.readFileSync(`./blog-builder/${item}`, "utf8");
  data = data.concat(`#### _______ \n \n\n\n originally published: ${formatter.format(createdDate)}\n`);
  data = data.concat(`\n last updated: ${formatter.format(modifiedDate)} \n\n`);
  // console.log("data", data);

  const title = data.match(/^# (.*)$/m)[1];
  // console.log("title", title);
  const file = item.replace(".md", "");
  // console.log("makre--------", markdownify(data))
  return [title, data, file, createdDate, modifiedDate, stats];
}

const createIndexMd = (blogItems) => {
  const indexData = ""
  const indexDataItems = blogItems.map((item) => {
    return `## [${item.title}](./${item.filenameExt})
###### published: ${formatter.format(item.createdDate)}
`;
  }).join("\n");
  // console.log("indexData", indexData);
  const template = fs.readFileSync('./blog-builder/templates/template.html', "utf8");

  writeMdToHtmlFile(indexData.concat(indexDataItems), 'index', template)
}

const createSitemapBlog = (blogItems) => {
  const sitemapDataHeader = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">`
  const sitemapFooter = `</urlset>`

  const rssItems = blogItems.map((item) => {
    // console.log("item", item);
    return `<url><loc>https://www.tiago.tf/thoughts/${item.file}.html</loc><lastmod>${item.modifiedDate.toISOString()}</lastmod></url>`;
  }).join("\n");

  fs.writeFileSync("./thoughts/sitemap.xml", sitemapDataHeader.concat(rssItems).concat(sitemapFooter));
}

const createRss = (blogItems) => {
  const sitemapDataHeader = `<?xml version="1.0" encoding="UTF-8" ?><rss version="2.0"><channel>`
  const sitemapFooter = `</channel></rss>`

  const headerData = `<title>Tiago Fernandes - thoughts</title>
        <link>http://www.tiago.tf/thoughts</link>
        <description>Tiago Fernandes - thoughts</description>
        <language>en-gb</language>
        <lastBuildDate>${new Date().toISOString()}</lastBuildDate>`


  const sitemapData = blogItems.map((item) => {
    // console.log("item", item);
    return `<item>
            <title>${item.title}</title>
            <link>http://www.tiago.tf/thoughts/${item.file}</link>
            <description>This is the description for the first article.</description>
            <author>Tiago Fernandes</author>
            <pubDate>${item.createdDate.toISOString()}</pubDate>
            <guid>http://www.tiago.tf/thoughts/${item.file}</guid>
        </item>`;
  }).join("\n");

  fs.writeFileSync("./thoughts/rss.xml", sitemapDataHeader.concat(headerData).concat(sitemapData).concat(sitemapFooter));
}

const writeBlogItemsToHtml = (blogItems) => {
  // console.log("writeBlogItemsToHtml", blogItems.length)
  const template = fs.readFileSync('./blog-builder/templates/template.html', "utf8");
  return blogItems.forEach((blogItem) => {
    writeMdToHtmlFile(blogItem.data, blogItem.file, template)
  });
}


const writeMdToHtmlFile = (mdData, filename, template) => {
  let output = template.replace("{{markdown}}", markdownify(mdData));
  output = output.replace(/href="(.*)\.md"/g, 'href="$1.html"');
  fs.writeFileSync(`./thoughts/${filename}.html`, output);
}

function markdownify(content) {
  marked.use({
    gfm: true, // GitHub Flavored Markdown
    breaks: false, // add <br> on single line breaks (GFM)
  });

  return marked.parse(content);
}

init('./blog-builder');
