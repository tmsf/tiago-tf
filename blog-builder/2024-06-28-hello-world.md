# hello world

Oh boy, the amount of yak shaving that happened in order to get this note taking thingy up and running.

I wanted a simple, easy to create, edit, and delete posts within this static website. I didn't want no "smart" tools like jekyll, hugo, or anything like it. 

## solution I

I've started digging and found a simple "md to html" converters on github. 

I've found a simple transformer. Quite rudimentary that did the job. 

### Cool.

But then I realised that I wanted to have a simple way to duplicate the headers to match my current design. 

## solution II

Into github again, I've found another library that got the templating sorted. Little bash script. 

### Done. 

Hum.. I need an index page so I can see the post list.
Ok, if I list the files I can automated around the npx script within the bash script. 

### This is starting to look complicated...

## solution III

Let's add the index file.

## solution IV

Dates, I need to add creation dates.

## solution V

`sitemap.xml` of course! Ok the bash file is getting out of control. I rather do this in the JS territory where all of this feels familiar.

## solution VI

Let's lose some of the external libs, they're simpler to just rewrite in a new script. 
*RSS is also a cool feature don't forget to add it!*

## solution VII

Let's just use the same process as for the sitemap. we got it. 

### I got it I reached perfection.

 
#### who am I kidding?

Let's recap. I wanted just a simple blog where I could type a couple of thoughts, no hassles of external frameworks, or writting/duplicating boilerplate and html code all the time.

Where did I get to?

The script:

- ➕ A node script that has an external dependency only. Doesn't need a full framework to render a dozen html files.

- ➖ for having a dependency and a preprocess step

The blog requirements: 
  - automatic timestamps in the files
    - ➕ it looks cool, and its quite easy to get a professional look, it will be useful for sitemap, rss. 
    - ➖ spent too much time on it to look... like a timestamp.

- `sitemap.xml` 
  - ➕ it just worked with a simple iteration on files. 

- `rss.xml`
  - ➕ just copied sitemaps's and got it

#### Am I happy? 

Of course not. The current css is wonky. The script is a mess of names and functions that make sense to no one. And I'll definetely will do all possible things besides writing on it.


Oh and for now, I'm right there in the bottom right 👇 [Honestly Undefined]. 

<img src="https://rakhim.org/images/honestly-undefined/blogging.jpg" alt="https://rakhim.org/honestly-undefined/19/" width="400" margin="1em"/>

[Honestly Undefined]: https://rakhim.org/honestly-undefined/19/


See you soon.
