#!/bin/bash

# Directory to search for .md files
DIR="blog-builder"

cat _sitemap_builder.xml > _blogsitemap.xml

# Find all .md files in the specified directory and its subdirectories
find "$DIR" -type f -name "*.md" | while read -r file; do
  # Run the npx command on each .md file
  filename=$(basename -- "$file")
  name="${filename%.md}"

  # Get the last modified date of the file
  last_modified=$(mdls -name kMDItemFSContentChangeDate -raw "$file")
  
  # Get the creation date of the file
  creation_date=$(mdls -name kMDItemFSCreationDate -raw "$file")

  # add date timestamps to blog posts  
  cat $file > temp.md
  echo "###### modified: $last_modified" >> temp.md
  echo "###### created: $creation_date" >> temp.md

  # create sitemap entry
  echo "<url><loc>https://www.tiago.tf/blog/$name.html</loc><lastmod>$last_modified</lastmod></url>" >> _blogsitemap.xml

  echo "Last modified: $last_modified, Creation date: $creation_date"
  npx markdown-to-html-via-template --input-file ./temp.md --output-file ./blog/"$name".html --template-file ./blog-builder/template.html --insert-title 
  rm temp.md
done


echo "</urlset>" >> _blogsitemap.xml

cat _blogsitemap.xml > ./blog/sitemap.xml
rm _blogsitemap.xml

#   <url>
#     <loc>https://www.tiago.tf/</loc>
#     <lastmod>2024-02-19T00:00:00+00:00</lastmod>
#   </url>
#   <url>
#     <loc>https://www.tiago.tf/photos.html</loc>
#     <lastmod>2024-02-19T00:00:00+00:00</lastmod>
#   </url>
# </urlset>
