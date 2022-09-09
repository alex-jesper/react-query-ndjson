import Row from "../model/Row";
import { useQuery, useQueryClient, UseQueryResult } from "react-query";
const ndjsonStream = require("can-ndjson-stream");

export const useElements = (
  updater: (exisitingData: Row[] | undefined, newElement: Row) => Row[]
): UseQueryResult<Row[], unknown> => {
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

      // Update state
      queryClient.setQueryData([queryKey], (oldData: Row[] | undefined) => {
        return updater(oldData, value);
      });
    }
    reader.releaseLock();
    const data = queryClient.getQueryData<Row[]>([queryKey]);
    return Array.isArray(data) ? data : [];
  });
};

export const appendData = (
  exisitingData: Row[] | undefined,
  newElement: Row
) => {
  return Array.isArray(exisitingData)
    ? [...exisitingData, newElement]
    : [newElement];
};

export const updateData = (
  exisitingData: Row[] | undefined,
  newElement: Row
) => {
  if (!Array.isArray(exisitingData)) {
    // First element
    return [newElement];
  } else {
    const index = firstIndexMatches(
      exisitingData,
      newElement,
      rowSequenceNumberIdentity
    );
    if (index === undefined) {
      // New element
      return [...exisitingData, newElement];
    } else {
      // Replace existing element
      exisitingData[index] = newElement;
      return exisitingData;
    }
  }
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

const rowSequenceNumberIdentity = (r1: Row, r2: Row) => {
  return r1.seqNo === r2.seqNo;
};
