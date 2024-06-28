#!/bin/bash

# Directory to search for .md files
DIR="blog-builder"

# init the sitemap
cat ./$DIR/_sitemap_builder.xml > _blogsitemap.xml

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
  # echo "###### modified: $last_modified" >> temp.md
  # echo "###### created: $creation_date" >> temp.md

  # create sitemap entry
  # echo "<url><loc>https://www.tiago.tf/blog/$name.html</loc><lastmod>$last_modified</lastmod></url>" >> _blogsitemap.xml

  echo "Last modified: $last_modified, Creation date: $creation_date"
  npx markdown-to-html-via-template --input-file ./temp.md --output-file ./blog/"$name".html --template-file ./blog-builder/template.html --insert-title 
  rm temp.md
done


## sitemap

# close the sitemap
# echo "</urlset>" >> _blogsitemap.xml
# copy the sitemap to the blog directory
# cat _blogsitemap.xml > ./blog/sitemap.xml
# remove the temp sitemap file
# rm _blogsitemap.xml


