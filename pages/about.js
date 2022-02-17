import Head from 'next/head'
import Layout, { siteTitle } from '../components/layout'
import utilStyles from '../styles/utils.module.css'
import { getSortedPostsData } from '../lib/posts'

export default function About({ allPostsData }) {
  return (
    <Layout>
      <Head>
        <title>{siteTitle} :: about</title>
      </Head>
      <section className={utilStyles.headingMd}>
        <p>Accelerating software development, one container at a time.</p>
      </section>

    </Layout>
  )
}

export async function getStaticProps() {
  const allPostsData = getSortedPostsData()
  return {
    props: {
      allPostsData
    }
  }
}