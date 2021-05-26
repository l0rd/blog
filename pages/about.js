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
        <p>I am relentlessly typing, building, pushing and deploying.<br />
           I am a software engineer at the times of&nbsp;
           <del style={{ textDecorationColor: '#e62a05' }}>containers</del> k8s.
        </p>
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