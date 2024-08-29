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
    startDate?: string,
    endDate?: string
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

  async getOdsAndGoals(
    startDate?: string,
    endDate?: string
  ): Promise<StatsSdg[]> {
    if (!startDate || !endDate) {
      return fetch<StatsSdg[]>("/stats/sdg");
    }
    return fetch<StatsSdg[]>("/stats/sdg", {
      query: {
        start_date: startDate,
        end_date: endDate,
      },
    });
  },

  async getEvolution(
    startDate?: string,
    endDate?: string
  ): Promise<StatsEvolution> {
    if (!startDate || !endDate) {
      return fetch<StatsEvolution>("/stats/evolution");
    }
    return fetch<StatsEvolution>("/stats/evolution", {
      query: {
        start_date: startDate,
        end_date: endDate,
      },
    });
  },

  async getPrograms(
    startDate?: string,
    endDate?: string,
    channel?: Channels[],
    topic?: SdgTopic[]
  ): Promise<StatsSdg[]> {
    const query = {
      ...(startDate && { start_date: startDate }),
      ...(endDate && { end_date: endDate }),
      ...(channel && { channel }),
      ...(topic && { topic }),
    };
    console.log(query);
    return fetch<StatsSdg[]>("/stats/programs", {
      query,
    });
  },

  async getChannels(
    startDate?: string,
    endDate?: string,
    topic?: SdgTopic[]
  ): Promise<StatsSdg[]> {
    const query = {
      ...(startDate && { start_date: startDate }),
      ...(endDate && { end_date: endDate }),
      ...(topic && { topic }),
    };
    console.log(query);
    return fetch<StatsSdg[]>("/stats/channels", {
      query,
    });
  },

});


