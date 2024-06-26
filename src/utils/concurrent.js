// @input urls, maxConcurrent, maxDelay
const concurrent = (urls = [], maxConcurrent, maxDelay) =>
  new Promise(async (rsv, rej) => {
    setTimeout(() => {
      console.error("concurrent time out");
      rej("time out");
    }, maxDelay);

    const results = [];
    let pointer = 0;

    while (pointer <= urls.length) {
      const newURLs = urls.slice(pointer, pointer + maxConcurrent);
      try {
        const newPromises = await getFetches(newURLs);
        const newResults = await Promise.all(newPromises);
        results.push(...newResults);
      } catch (e) {
        return Error(e);
      }
      pointer += maxConcurrent;
    }

    rsv(results);
  });

async function getFetches(urls) {
  return urls.map(async (url) => {
    try {
      const result = await fetch(url).then((rsp) => rsp.json());
      return result;
    } catch (e) {
      console.error("fetch failed");
    }
  });
}

export default concurrent;
