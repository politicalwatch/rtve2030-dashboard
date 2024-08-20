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
  },

  async getStatsCounter(
    startDate?: RawDateString,
    endDate?: RawDateString
  ): Promise<StatsCounter> {
    if (!startDate || !endDate) {
      return fetch<StatsCounter>("/stats/counters");
    }
    return fetch<StatsCounter>("/stats/counters", {
      query: {
        start_date: startDate,
        end_date: endDate,
      },
    });
  },

  async getEvolution(
    startDate?: RawDateString,
    endDate?: RawDateString
  ): Promise<statsEvolution> {
    if (!startDate || !endDate) {
      return fetch<statsEvolution>("/stats/evolution");
    }
    return fetch<statsEvolution>("/stats/evolution", {
      query: {
        start_date: startDate,
        end_date: endDate,
      },
    });
  },
});


