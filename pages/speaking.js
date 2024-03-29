import Layout, { siteTitle } from "../components/layout";
import { getSortedTalksData } from "../lib/talks";
import Head from "next/head";
import Date from "../components/date";
import utilStyles from "../styles/utils.module.css";
import Link from "next/link";

export default function Speaking({ allTalksData }) {
  return (
    <Layout>
      <Head>
        <title>{siteTitle} :: speaking</title>
      </Head>
      <section className={`${utilStyles.headingMd} ${utilStyles.padding1px}`}>
        <h2 className={utilStyles.headingLg}>Talks</h2>
        <ul className={utilStyles.list}>
          {allTalksData.map(
            ({
              id,
              date,
              eventName,
              title,
              eventLink,
              eventSessionLink,
              recordingLink,
              slidesLink,
            }) => (
              <li className={utilStyles.listItem} key={id}>
                <small className={utilStyles.lightText}>
                  <Date dateString={date} />-{" "}
                  <Link href={eventLink}>{eventName}</Link>
                </small>
                <br />
                <Link href={eventSessionLink}>
                  <a>{title}</a>
                </Link>
                <br />
                <small>
                  <Link href={recordingLink}>
                    <a>video</a>
                  </Link>{" "}
                  -{" "}
                  <Link href={slidesLink}>
                    <a>slides</a>
                  </Link>
                </small>
              </li>
            ),
          )}
        </ul>
      </section>
    </Layout>
  );
}

export async function getStaticProps({ params }) {
  const allTalksData = getSortedTalksData();
  return {
    props: {
      allTalksData,
    },
  };
}
