import type { NitroFetchRequest, $Fetch } from "nitropack";

// repository pattern in nuxt 3:
//www.youtube.com/watch?v=jXH8Tr-exhI
// this function receives an instance of Fetch customized with, login, headers etc
// and returns an object with typed methods that can be used to fetch data
export const dashboardApiRepo = <T>(fetch: $Fetch<T, NitroFetchRequest>) => ({
  async getStats(): Promise<Stat[]> {
    return fetch<Stat[]>("/stats");
  },
  async getGlobalStats(): Promise<any[]> {
    return fetch<any[]>("/stats/global");
  }
});


