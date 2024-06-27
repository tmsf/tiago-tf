#!/bin/bash

# Directory to search for .md files
DIR="blog-builder"

# Find all .md files in the specified directory and its subdirectories
find "$DIR" -type f -name "*.md" | while read -r file; do
  # Run the npx command on each .md file
  filename=$(basename -- "$file")
  name="${filename%.md}"
  npx markdown-to-html-via-template --input-file ./"$file" --output-file ./blog/"$name".html --template-file ./blog-builder/template.html --insert-title 
done
