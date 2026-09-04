"use client";

import Cookies from "js-cookie";
import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import logo from "../../public/Nextract-logo.svg";
import productStillLife from "../../public/nextract-nordic-products.png";
import { createDemoSession } from "@/utils/showcaseStorage";
import styles from "./landingPage.module.css";

const selectedFields = ["name", "price", "image", "stock"];

const DataFilmPlayer = dynamic(() => import("./DataFilmPlayer"), {
  ssr: false,
  loading: () => (
    <div className={styles.filmFallback}>
      <Image src={productStillLife} alt="Nordic lamp, wool throw and oak box" fill priority sizes="61vw" />
    </div>
  ),
});

export default function LandingPage() {
  const router = useRouter();
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduceMotion(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  const openDemo = () => {
    const user = createDemoSession();
    Cookies.set("token", "showcase-token", { expires: 1 });
    Cookies.set("user", JSON.stringify(user), { expires: 1 });
    Cookies.set("userData", JSON.stringify(user), { expires: 1 });
    router.push("/dashboard");
  };

  return (
    <main className={styles.page} id="home">
      <a className={styles.skipLink} href="#content">Skip to content</a>

      <header className={styles.header}>
        <Link href="#home" className={styles.brand} aria-label="Nextract home">
          <Image src={logo} alt="Nextract" priority />
        </Link>
        <nav aria-label="Main navigation">
          <a href="#why">Why Nextract</a>
          <a href="#workflow">Workflow</a>
          <a href="#story">Story</a>
        </nav>
        <div className={styles.headerActions}>
          <Link href="/signup-login">Log in</Link>
          <button onClick={openDemo}>Open demo</button>
        </div>
      </header>

      <div id="content">
        <section className={styles.hero}>
          <div className={styles.heroCopy}>
            <p className={styles.productDefinition}>A visual product-feed editor for small merchants.</p>
            <h1>Your product<br />feed, edited.</h1>
            <p className={styles.heroLead}>
              Bring in supplier data. Remove the noise. Keep a clean catalog you can actually work with.
            </p>
            <button className={styles.mainAction} onClick={openDemo}>Edit a demo feed</button>
            <p className={styles.actionNote}>Uses sample products. No account needed.</p>
          </div>

          <div className={styles.filmWrap} aria-label="Animation showing raw product data becoming a clean catalog">
            <DataFilmPlayer reduceMotion={reduceMotion} />
            <p>Watch the feed lose what the shop does not need.</p>
          </div>
        </section>

        <div className={styles.fieldRail} aria-label="Fields retained by Nextract">
          <span>Keep</span>
          {selectedFields.map((field) => <strong key={field}>{field}</strong>)}
          <span>Leave the rest behind.</span>
        </div>

        <section className={styles.argument} id="why">
          <div className={styles.argumentTitle}>
            <span>47 fields arrive</span>
            <h2>Four may be all your storefront needs.</h2>
          </div>
          <div className={styles.argumentBody}>
            <p>Supplier feeds are built to carry everything. Your shop is not.</p>
            <p>Nextract exposes the structure in plain view, so a non-technical user can decide what survives the edit.</p>
          </div>
          <div className={styles.dataSheet}>
            <div className={styles.sheetHead}><span>Incoming field</span><span>Example value</span><span>Decision</span></div>
            <div className={styles.rejected}><span>supplier_reference</span><span>SE-4819-A</span><strong>Remove</strong></div>
            <div><span>name</span><span>Ceramic table lamp</span><strong>Keep</strong></div>
            <div className={styles.rejected}><span>warehouse_bin</span><span>B-14</span><strong>Remove</strong></div>
            <div><span>price</span><span>1 249 SEK</span><strong>Keep</strong></div>
            <div><span>stock</span><span>12</span><strong>Keep</strong></div>
          </div>
          <aside className={styles.marginNote}>The interface uses the product&apos;s own field names. Nothing is hidden behind technical language.</aside>
        </section>

        <section className={styles.workflow} id="workflow">
          <div className={styles.workflowIntro}>
            <p>One feed. Three decisions.</p>
            <h2>The shortest route from supplier data to product preview.</h2>
          </div>
          <ol>
            <li>
              <span>1</span>
              <div><h3>Bring the source</h3><p>Paste an API address or upload existing product data.</p></div>
              <small>API / JSON / CSV</small>
            </li>
            <li>
              <span>2</span>
              <div><h3>Make the edit</h3><p>Read the available fields and keep only the useful ones.</p></div>
              <small>Visual selection</small>
            </li>
            <li>
              <span>3</span>
              <div><h3>See the products</h3><p>Choose products, preview the result and export a simple HTML concept.</p></div>
              <small>Preview / export</small>
            </li>
          </ol>
          <button className={styles.textAction} onClick={openDemo}>Walk through the real interface</button>
        </section>

        <section className={styles.recognition} id="story">
          <div className={styles.place}>2</div>
          <div>
            <h2>Second place at Chas Challenge.</h2>
            <p>Nextract started as a first-year Chas Academy project. The prototype reached the final and finished second — proof that a difficult data problem can have a simple interface.</p>
          </div>
          <span className={styles.year}>Built in Stockholm<br />Showcase prototype</span>
        </section>

        <section className={styles.close}>
          <p>Start with Nextract&apos;s sample feed.</p>
          <h2>Decide what stays.</h2>
          <button onClick={openDemo}>Open the working demo</button>
        </section>
      </div>

      <footer className={styles.footer}>
        <Image src={logo} alt="Nextract" />
        <p>Product feeds without the friction.</p>
        <div><a href="#why">Why Nextract</a><a href="#workflow">Workflow</a><Link href="/signup-login">Log in</Link></div>
        <small>© {new Date().getFullYear()} Nextract</small>
      </footer>
    </main>
  );
}
