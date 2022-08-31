import Row from "../model/Row";
import {
  QueryClient,
  useQuery,
  useQueryClient,
  UseQueryResult,
} from "react-query";
const ndjsonStream = require("can-ndjson-stream");

export const useElements = (): UseQueryResult<Row[], unknown> => {
  const queryClient = useQueryClient();
  const queryKey = "elements";
  return useQuery<Row[]>([queryKey], async ({ signal }) => {
    const response = await fetch("http://localhost:8080", {
      headers: {
        accept: "application/x-ndjson",
      },
      signal: signal,
    });
    const ndjson = ndjsonStream(response.body);
    const reader = ndjson.getReader();

    while (true) {
      const { done, value } = await reader.read();
      if (done) {
        break;
      }

      appendData(queryClient, queryKey, value);
    }
    reader.releaseLock();
    const data = queryClient.getQueryData<Row[]>([queryKey]);
    return Array.isArray(data) ? data : [];
  });
};

export const useElementsUpdate = (): UseQueryResult<Row[], unknown> => {
  const queryClient = useQueryClient();
  const queryKey = "elements_update";
  return useQuery<Row[]>([queryKey], async ({ signal }) => {
    const response = await fetch("http://localhost:8080", {
      headers: {
        accept: "application/x-ndjson",
      },
      signal: signal,
    });
    const ndjson = ndjsonStream(response.body);
    const reader = ndjson.getReader();

    while (true) {
      const { done, value } = await reader.read();
      if (done) {
        break;
      }

      // Update state
      updateData(queryClient, [queryKey], value, (r1, r2) => {
        return r1.seqNo === r2.seqNo;
      });
    }
    reader.releaseLock();
    const data = queryClient.getQueryData<Row[]>([queryKey]);
    return Array.isArray(data) ? data : [];
  });
};

export const useElementsUpdateCancel = (): UseQueryResult<Row[], unknown> => {
  const queryClient = useQueryClient();
  const queryKey = "elements_cancel";
  const queryCacheKey = queryKey + "_cache";

  return useQuery<Row[]>([queryKey], async ({ signal }) => {
    // Install cache
    const cachedData = queryClient.getQueryData<Row[]>([queryCacheKey]);
    queryClient.setQueryData([queryKey], () => {
      return cachedData;
    });

    // Fetch all elements
    const response = await fetch("http://localhost:8080", {
      headers: {
        accept: "application/x-ndjson",
      },
      signal: signal,
    });
    const ndjson = ndjsonStream(response.body);
    const reader = ndjson.getReader();

    while (true) {
      const { done, value } = await reader.read();
      if (done) {
        break;
      }

      // Update state
      updateData(queryClient, [queryKey, queryCacheKey], value, (r1, r2) => {
        return r1.seqNo === r2.seqNo;
      });
    }
    reader.releaseLock();
    const data = queryClient.getQueryData<Row[]>([queryKey]);
    return Array.isArray(data) ? data : [];
  });
};

const appendData = (queryClient: QueryClient, queryKey: string, data: Row) => {
  queryClient.setQueryData([queryKey], (oldData: Row[] | undefined) => {
    return Array.isArray(oldData) ? [...oldData, data] : [data];
  });
};

const updateData = (
  queryClient: QueryClient,
  queryKeys: string[],
  data: Row,
  identityFn: (r1: Row, r2: Row) => Boolean
) => {
  queryKeys.forEach((queryKey) => {
    queryClient.setQueryData([queryKey], (oldData: Row[] | undefined) => {
      if (!Array.isArray(oldData)) {
        // First element
        return [data];
      } else {
        const index = firstIndexMatches(oldData, data, identityFn);
        if (index === undefined) {
          // New element
          return [...oldData, data];
        } else {
          // Replace existing element
          oldData[index] = data;
          return oldData;
        }
      }
    });
  });
};

const updateData2 = (
  queryClient: QueryClient,
  queryKeys: string[],
  data: Row,
  identityFn: (r1: Row, r2: Row) => Boolean
) => {
  // TODO: Understand queryKeys, and setQueryData vs setQueriesData
  queryClient.setQueryData(queryKeys, (oldData: Row[] | undefined) => {
    if (!Array.isArray(oldData)) {
      // First element
      return [data];
    } else {
      const index = firstIndexMatches(oldData, data, identityFn);
      if (index === undefined) {
        // New element
        return [...oldData, data];
      } else {
        // Replace existing element
        oldData[index] = data;
        return oldData;
      }
    }
  });
};

const firstIndexMatches = (
  oldData: Row[],
  data: Row,
  identityFn: (r1: Row, r2: Row) => Boolean
): number | undefined => {
  for (let currentIndex = 0; currentIndex < oldData.length; currentIndex++) {
    const existingData = oldData[currentIndex];
    if (identityFn(existingData, data)) {
      return currentIndex;
    }
  }
  return undefined;
};
