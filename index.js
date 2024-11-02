import fs from "fs";
import { marked } from "marked";
const init = async (sourceDir) => {
  let blogItems = []
  const directory = fs.readdirSync(sourceDir)
  await directory.forEach(async (filenameExt) => {
    if (filenameExt.endsWith(".md") && filenameExt !== "index.md") {
      const [title, data, file, createdDate, modifiedDate, stats] = await getMdMetadata(filenameExt);
      blogItems.push({ title, file, filenameExt, createdDate, modifiedDate, data, stats });
    }
  });

  // Sort blog items by created date - newest first
  const sortedBlogItems = blogItems.sort((a, b) => {
    return (new Date(b.stats.birthtime) - new Date(a.stats.birthtime));
  })
  
  const blogIndex = createBlogIndexHtml(sortedBlogItems);
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
  const stats = fs.statSync(`./blog-builder/${item}`);
  const modifiedDate = (stats.mtime);
  const createdDate = (stats.birthtime);

  let data = fs.readFileSync(`./blog-builder/${item}`, "utf8");
  data = data.concat(`###### _______ \n ###### published: ${formatter.format(createdDate)}\n`);
  data = data.concat(`\n ###### updated: ${formatter.format(modifiedDate)} \n`);
  const title = data.match(/^# (.*)$/m)[1];
  const file = item.replace(".md", "");
  return [title, data, file, createdDate, modifiedDate, stats];
}

const createBlogIndexHtml = (blogItems) => {
  const indexData = ""
  const indexDataItems = blogItems.map((item) => {
    return `## [${item.title}](./${item.filenameExt})
###### published: ${formatter.format(item.createdDate)}
`;
  }).join("\n\n\n\n");
  const template = fs.readFileSync('./blog-builder/templates/template.html', "utf8");
  
  writeMdToHtmlFile(indexData.concat(indexDataItems), 'index', "thoughts", template)
}

const createSitemapBlog = (blogItems) => {
  const sitemapDataHeader = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">`
  const sitemapFooter = `</urlset>`

  const sitemapItems = blogItems.map((item) => {
    // console.log("item", item);
    return `<url><loc>https://www.tiago.tf/thoughts/${item.file}.html</loc><lastmod>${item.modifiedDate.toISOString()}</lastmod></url>`;
  }).join("\n");

  fs.writeFileSync("./thoughts/sitemap.xml", sitemapDataHeader.concat(sitemapItems).concat(sitemapFooter));
}

const createRss = (blogItems) => {
  const sitemapDataHeader = `<?xml version="1.0" encoding="UTF-8" ?><rss version="2.0"><channel>`
  const sitemapFooter = `</channel></rss>`

  const headerData = `<title>Tiago Fernandes - thoughts</title>
        <link>http://www.tiago.tf/thoughts</link>
        <description>Tiago Fernandes - thoughts</description>
        <language>en-gb</language>
        <lastBuildDate>${new Date().toISOString()}</lastBuildDate>`


  const rssItem = blogItems.map((item) => {
    // TODO create a description as a summary?
    return `<item>
            <title>${item.title}</title>
            <link>http://www.tiago.tf/thoughts/${item.file}</link>
            <description><![CDATA[${markdownify(item.data)}]]></description>
            <author>Tiago Fernandes</author>
            <pubDate>${item.createdDate.toISOString()}</pubDate>
            <guid>http://www.tiago.tf/thoughts/${item.file}</guid>
        </item>`;
  }).join("\n");

  fs.writeFileSync("./thoughts/index.xml", sitemapDataHeader.concat(headerData).concat(rssItem).concat(sitemapFooter));
}

const writeBlogItemsToHtml = (blogItems) => {
  // console.log("writeBlogItemsToHtml", blogItems.length)
  const template = fs.readFileSync('./blog-builder/templates/template.html', "utf8");
  return blogItems.forEach((blogItem) => {
    writeMdToHtmlFile(blogItem.data, blogItem.file, blogItem.title, template)
  });
}


const writeMdToHtmlFile = (mdData, filename, title, template) => {
  let output = template.replace("{{markdown}}", markdownify(mdData));
  output = output.replace("{{title}}", title);
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
