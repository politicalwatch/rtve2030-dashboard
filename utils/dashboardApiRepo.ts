import type { NitroFetchRequest, $Fetch } from "nitropack";
import type {
  StatsEvolutionStacked,
  Report,
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
    endDate?: string,
    programType?: 'r' | 't'
  ): Promise<StatsCounter> {
    const query = {
      ...(startDate && { start_date: startDate }),
      ...(endDate && { end_date: endDate }),
      ...(programType && { program_type: programType }),
    };
    return fetch<StatsCounter>("/stats/counters", { query });
  },

  async getOdsAndGoals(
    startDate?: string,
    endDate?: string,
    channel?: Channels[],
    program?: string[],
    programType?: 'r' | 't'
  ): Promise<StatsSdg[]> {
    const query = {
      ...(startDate && { start_date: startDate }),
      ...(endDate && { end_date: endDate }),
      ...(channel && { channel }),
      ...(program && { program }),
      ...(programType && { program_type: programType }),
    };
    return fetch<StatsSdg[]>("/stats/sdg", { query });
  },

  async getEvolution(
    startDate?: string,
    endDate?: string,
    programType?: 'r' | 't'
  ): Promise<StatsEvolution> {
    const query = {
      ...(startDate && { start_date: startDate }),
      ...(endDate && { end_date: endDate }),
      ...(programType && { program_type: programType }),
    };
    return fetch<StatsEvolution>("/stats/evolution", { query });
  },

  async getPrograms(
    startDate?: string,
    endDate?: string,
    channel?: Channels[],
    topic?: SdgTopic[],
    programType?: 'r' | 't'
  ): Promise<StatsPrograms[]> {
    const query = {
      ...(startDate && { start_date: startDate }),
      ...(endDate && { end_date: endDate }),
      ...(channel && { channel }),
      ...(topic && { topic }),
      ...(programType && { program_type: programType }),
    };
    return fetch<StatsPrograms[]>("/stats/programs", { query });
  },

  async getChannels(
    startDate?: string,
    endDate?: string,
    topic?: SdgTopic[],
    programType?: 'r' | 't'
  ): Promise<StatsChannel[]> {
    const query = {
      ...(startDate && { start_date: startDate }),
      ...(endDate && { end_date: endDate }),
      ...(topic && { topic }),
      ...(programType && { program_type: programType }),
    };
    return fetch<StatsChannel[]>("/stats/channels", { query });
  },
  async getTags(
    startDate?: string,
    endDate?: string,
    topic?: SdgTopic[],
    channel?: Channels[],
    program?: string[],
    programType?: 'r' | 't'
  ): Promise<StatsTags[]> {
    const query = {
      ...(startDate && { start_date: startDate }),
      ...(endDate && { end_date: endDate }),
      ...(topic && { topic }),
      ...(channel && { channel }),
      ...(program && { program }),
      ...(programType && { program_type: programType }),
    };
    return fetch<StatsTags[]>("/stats/tags", { query });
  },
  async getEvolutionStacked(
    startDate?: string,
    endDate?: string,
    topic?: SdgTopic[],
    channel?: Channels[],
    program?: string[],
    programType?: 'r' | 't'
  ): Promise<StatsEvolutionStacked> {
    const query = {
      ...(startDate && { start_date: startDate }),
      ...(endDate && { end_date: endDate }),
      ...(topic && { topic }),
      ...(channel && { channel }),
      ...(program && { program }),
      ...(programType && { program_type: programType }),
    };
    return fetch<StatsEvolutionStacked>("/stats/evolution-stacked", { query });
  },
  async getReportData(startDate?: string, endDate?: string): Promise<any> {
    const query = {
      ...(startDate && { start_date: startDate }),
      ...(endDate && { end_date: endDate }),
    };
    return fetch<Report>("/reports", {
      query,
    });
  },
  async getReportSdgCompare(year: string): Promise<any> {
    return fetch<Report>("/reports/sdg-year-compare", {
      query: {
        year: year,
      },
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
