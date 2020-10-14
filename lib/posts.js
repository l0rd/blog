import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import remark from 'remark'
import remarkParse from 'remark-parse'
import doc from 'rehype-document'
import unified from 'unified'
import remarkRehype from 'remark-rehype'
import format from 'rehype-format'
import html from 'rehype-stringify'
import rehypePrism from '@mapbox/rehype-prism'
import Prism from 'prismjs'
import rehypeHighlight from 'rehype-highlight'

import refractor from "refractor/core";

import jsx from "refractor/lang/jsx";
import javascript from "refractor/lang/javascript";
import css from "refractor/lang/css";
import cssExtras from "refractor/lang/css-extras";
import jsExtras from "refractor/lang/js-extras";
import sql from "refractor/lang/sql";
import typescript from "refractor/lang/typescript";
import swift from "refractor/lang/swift";
import objectivec from "refractor/lang/objectivec";
import markdown from "refractor/lang/markdown";
import json from "refractor/lang/json";
import bash from 'refractor/lang/bash'

refractor.register(jsx);
refractor.register(json);
refractor.register(typescript);
refractor.register(javascript);
refractor.register(css);
refractor.register(cssExtras);
refractor.register(jsExtras);
refractor.register(sql);
refractor.register(swift);
refractor.register(objectivec);
refractor.register(markdown);

const postsDirectory = path.join(process.cwd(), 'posts')

export function getSortedPostsData() {
    // Get file names under /posts
    const fileNames = fs.readdirSync(postsDirectory)
    const allPostsData = fileNames.map(fileName => {
        // Remove ".md" from file name to get id
        const id = fileName.replace(/\.md$/, '')
        
        // Read markdown file as string
        const fullPath = path.join(postsDirectory, fileName)
        const fileContents = fs.readFileSync(fullPath, 'utf8')
        
        // Use gray-matter to parse the post metadata section
        const matterResult = matter(fileContents)
        
        // Combine the data with the id
        return {
            id,
            ...matterResult.data
        }
    })
    // Sort posts by date
    return allPostsData.sort((a, b) => {
        if (a.date < b.date) {
            return 1
        } else {
            return -1
        }
    })
}

export function getAllPostIds() {
    const fileNames = fs.readdirSync(postsDirectory)
    
    // Returns an array that looks like this:
    // [
        //   {
            //     params: {
                //       id: 'ssg-ssr'
                //     }
                //   },
                //   {
                    //     params: {
                        //       id: 'pre-rendering'
                        //     }
                        //   }
                        // ]
                        return fileNames.map(fileName => {
                            return {
                                params: {
                                    id: fileName.replace(/\.md$/, '')
                                }
                            }
                        })
                    }
                    
                    export async function getPostData(id) {
                        const fullPath = path.join(postsDirectory, `${id}.md`)
                        const fileContents = fs.readFileSync(fullPath, 'utf8')
                        
                        refractor.register(bash);
                        // Use gray-matter to parse the post metadata section
                        const matterResult = matter(fileContents)
                        
                        // Use remark to convert markdown into HTML string
                        const processedContent = await unified()
                        .use(remarkParse)
                        .use(remarkRehype)
                        .use(rehypePrism)
                        .use(html)
                        .process(matterResult.content)
                        const contentHtml = processedContent.toString()
                        
                        // Combine the data with the id and contentHtml
                        return {
                            id,
                            contentHtml,
                            ...matterResult.data
                        }
                    }