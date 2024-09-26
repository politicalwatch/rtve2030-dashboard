import type { NitroFetchRequest, $Fetch } from "nitropack";
import type {
  StatsEvolutionStacked,
  AuthSession,
  AuthUser,
} from "~/types/apiTypes";

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
    endDate?: string,
    channel?: Channels[],
    program?: string[]
  ): Promise<StatsSdg[]> {
    const query = {
      ...(startDate && { start_date: startDate }),
      ...(endDate && { end_date: endDate }),
      ...(channel && { channel }),
      ...(program && { program }),
    };
    return fetch<StatsSdg[]>("/stats/sdg", {
      query,
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
  ): Promise<StatsPrograms[]> {
    const query = {
      ...(startDate && { start_date: startDate }),
      ...(endDate && { end_date: endDate }),
      ...(channel && { channel }),
      ...(topic && { topic }),
    };
    return fetch<StatsPrograms[]>("/stats/programs", {
      query,
    });
  },

  async getChannels(
    startDate?: string,
    endDate?: string,
    topic?: SdgTopic[]
  ): Promise<StatsChannel[]> {
    const query = {
      ...(startDate && { start_date: startDate }),
      ...(endDate && { end_date: endDate }),
      ...(topic && { topic }),
    };
    return fetch<StatsChannel[]>("/stats/channels", {
      query,
    });
  },
  async getTags(
    startDate?: string,
    endDate?: string,
    topic?: SdgTopic[],
    channel?: Channels[],
    program?: string[]
  ): Promise<StatsTags[]> {
    const query = {
      ...(startDate && { start_date: startDate }),
      ...(endDate && { end_date: endDate }),
      ...(topic && { topic }),
      ...(channel && { channel }),
      ...(program && { program }),
    };
    return fetch<StatsTags[]>("/stats/tags", {
      query,
    });
  },
  async getEvolutionStacked(
    startDate?: string,
    endDate?: string,
    topic?: SdgTopic[],
    channel?: Channels[],
    program?: string[]
  ): Promise<StatsEvolutionStacked> {
    const query = {
      ...(startDate && { start_date: startDate }),
      ...(endDate && { end_date: endDate }),
      ...(topic && { topic }),
      ...(channel && { channel }),
      ...(program && { program }),
    };
    return fetch<StatsEvolutionStacked>("/stats/evolution-stacked", {
      query,
    });
  },
  async getReportData(
    reportType: string,
    startDate?: string,
    endDate?: string
  ): Promise<any> {
    const query = {
      report_type: reportType,
      ...(startDate && { start_date: startDate }),
      ...(endDate && { end_date: endDate }),
    };
    return fetch<any>("/reports", {
      query,
    });
  },
  async getAuthToken(username: string, password: string): Promise<AuthSession> {
    return fetch<AuthSession>("/auth/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        username: username,
        password: password,
      }).toString(),
    });
  },
  async refreshAuthToken(token: string): Promise<AuthSession> {
    return fetch<AuthSession>("/auth/token/refresh", {
      method: "POST",
      body: JSON.stringify({ refresh_token: token }),
    });
  },
  async getCurrentUser(): Promise<AuthUser> {
    return fetch<AuthUser>("/user");
  },
});
