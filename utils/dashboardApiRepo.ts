import type { NitroFetchRequest, $Fetch } from "nitropack";
type User = {
  id: number;
  name: string;
};

interface Stat  {
  channel: string;
  goal: string;
  occurrences: number;
  percentage_tagged: number;
  program: string;
  sdg: string;
  tag: string;
  tagged_time: number;
  total_time: number;
  _id: number;
}

// repository pattern in nuxt 3:
//www.youtube.com/watch?v=jXH8Tr-exhI
// this function receives an instance of Fetch customized with, login, headers etc
// and returns an object with typed methods that can be used to fetch data
export const dashboardApiRepo = <T>(fetch: $Fetch<T, NitroFetchRequest>) => ({
  async getStat(): Promise<Stat[]> {
    return fetch<Stat[]>("/stats");
  },
});
