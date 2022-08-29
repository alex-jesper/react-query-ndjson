import Row from "../model/Row";
import { useQuery, useQueryClient, UseQueryResult } from "react-query";
const ndjsonStream = require("can-ndjson-stream");

export const useElements = (): UseQueryResult<Row[], unknown> => {
  const queryClient = useQueryClient();
  return useQuery<Row[]>(["elements"], async () => {
    const response = await fetch("http://localhost:8080", {
      headers: {
        accept: "application/x-ndjson",
      },
    });
    const ndjson = ndjsonStream(response.body)
    const reader = ndjson.getReader()

    while (true) {
      const { done, value } = await reader.read()
      if (done) {
        break;
      }

      // Update state
      queryClient.setQueryData(["elements"], (oldData: Row[] | undefined) => {
        return Array.isArray(oldData) ? [...oldData, value] : [value];
      });
    }
    reader.releaseLock();
    const data = queryClient.getQueryData<Row[]>(["elements"])

    return Array.isArray(data) ? data : [];
  });
};
