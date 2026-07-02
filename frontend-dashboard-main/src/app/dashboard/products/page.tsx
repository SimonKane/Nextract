"use client";

import ProductList from "@/components/productlist/ProductList";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import type { Product } from "@/components/productlist/ProductList";
import type { ShowcaseApi } from "@/utils/showcaseData";
import { getShowcaseApis } from "@/utils/showcaseStorage";
import styles from "./styles.module.css";

export default function Products() {
  const [finishedApis, setFinishedApis] = useState<Product[]>([]);
  const [selectedApi, setSelectedApi] = useState(0);
  const [data, setData] = useState<ShowcaseApi[]>([]);

  const serverURL = process.env.NEXT_PUBLIC_SERVER_URL;

  useEffect(() => {
    const userId = JSON.parse(Cookies.get("userData") || "{}").id;

    if (!serverURL) {
      const apis = getShowcaseApis();
      setData(apis);
      setFinishedApis(apis[selectedApi]?.items || []);
      return;
    }

    fetch(
      `${
        process.env.NEXT_PUBLIC_HTTP_PROTOCOL ? "http" : "https"
      }://${serverURL}/dashboard/users/finishedapis`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId }),
      }
    )
      .then((res) => {
        if (!res.ok) {
          throw new Error();
        }
        return res.json();
      })
      .then((data) => {
        setData(data);
        setFinishedApis(data[selectedApi].items);
      })

      .catch((err) => {
        console.log(err);
      });
  }, [selectedApi, serverURL]);

  return (
    <>
      <div className={styles.productsContainer}>
        <select
          name="select"
          id="select"
          className={styles.select}
          onChange={(e) =>
            setSelectedApi(+(e.target as HTMLSelectElement).value)
          }
        >
          {data.map((item: { APIname: string }, index) => (
            <option key={index} value={index}>
              {item.APIname}
            </option>
          ))}
        </select>
        <ProductList allProducts={finishedApis} />
      </div>
    </>
  );
}
