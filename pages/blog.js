import Layout, { siteTitle } from "../components/layout";
import { getSortedPostsData } from "../lib/posts";
import Head from "next/head";
import Date from "../components/date";
import utilStyles from "../styles/utils.module.css";
import Link from "next/link";

export default function Posts({ allPostsData }) {
  return (
    <Layout>
      <Head>
        <title>{siteTitle} :: blog</title>
      </Head>
      <section className={`${utilStyles.headingMd} ${utilStyles.padding1px}`}>
        <h2 className={utilStyles.headingLg}>Blog Posts</h2>
        <ul className={utilStyles.list}>
          {allPostsData.map(({ id, date, title }) => (
            <li className={utilStyles.listItem} key={id}>
              <Link href="/posts/[id]" as={`/posts/${id}`}>
                {title}
              </Link>
              <br />
              <small className={utilStyles.lightText}>
                <Date dateString={date} />
              </small>
            </li>
          ))}
        </ul>
      </section>
    </Layout>
  );
}

// export async function getStaticPaths() {
//     const paths = getAllPostIds()
//     return {
//         paths,
//         fallback: false
//     }
// }

export async function getStaticProps() {
  const allPostsData = getSortedPostsData();
  return {
    props: {
      allPostsData,
    },
  };
}
