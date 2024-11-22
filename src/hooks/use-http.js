import { useCallback, useEffect, useState } from "react";
import { URL } from "../helpers/helpers";

const useHttp = (query, endpoint, toFetch = true, reFetch) => {
  const [isError, setIsError] = useState(null);
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch(URL, {
        method: "POST",
        body: JSON.stringify(query),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const fetchedData = await res.json();
      if (!res.ok || fetchedData.errors) {
        throw new Error(fetchedData.errors.at(0).message);
      }
      const {
        data: { [endpoint]: actualData },
      } = fetchedData;
      setData(actualData);
      setIsError(null);
    } catch (err) {
      setIsError(err.message);
      setData(null);
    }
    setIsLoading(false);
    // It's weird how it works.
  }, [reFetch]);
  useEffect(() => {
    toFetch && fetchData();
  }, [fetchData]);
  if (!toFetch) return [];
  return [data, isError, isLoading];
};
export default useHttp;
