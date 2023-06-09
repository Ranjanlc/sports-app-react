import { useCallback, useEffect, useState } from 'react';
import { URL } from '../helpers/helpers';

const useHttp = (query, endpoint, toFetch = true, reFetch) => {
  const [isError, setIsError] = useState(null);
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  console.log(toFetch, reFetch, data);
  const fetchData = useCallback(async () => {
    console.log('fetch bhachaina ra sathi?');
    setIsLoading(true);
    try {
      const res = await fetch(URL, {
        method: 'POST',
        body: JSON.stringify(query),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const fetchedData = await res.json();
      if (!res.ok || fetchedData.errors) {
        throw new Error(fetchedData.errors.at(0).message);
      }
      const {
        data: { [endpoint]: actualData },
      } = fetchedData;
      console.log(actualData);
      setData(actualData);
    } catch (err) {
      setIsError(err.message);
    }
    setIsLoading(false);
  }, [reFetch]);
  useEffect(() => {
    console.log('execute bhako??');
    toFetch && fetchData();
  }, [fetchData]);
  if (!toFetch) return [];
  return [data, isError, isLoading];
};
export default useHttp;
