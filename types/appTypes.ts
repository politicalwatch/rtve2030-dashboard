export enum MediaType {
  TV = "tv",
  RADIO = "radio",
}
export interface TableChannels {
  name: Channels;
  sdgs: SdgTopic[];
  total_duration: number;
  tagged_duration: number;
  maxTotalDuration: number;
  queryDuration: number;
  programs: number;
  basePrograms?: number; // tbd check
  hasActiveFilters: boolean;
  showQueryDuration?: boolean;
}

export interface TablePrograms {
  canal: Channels;
  name: string;
  sdgs: SdgTopic[];
  total_duration: number;
  tagged_duration: number;
  maxTotalDuration: number;
  queryDuration?: number;
  hasActiveFilters: boolean;
}

export interface TableTags {
  name: String;
  sdgs: SdgTopic[];
  total_duration: number;
  maxTotalDuration: number;
  filtered_duration: number;
  hasActiveFilters: boolean;
}

export interface TableSdg {
  sdg: SdgTopic;
  base_duration: number;
  query_duration: number;
  maxBaseDuration: number;
  occurrences: number;
  queryGoals: StatsGoal[];
  baseGoals: StatsGoal[];
  hasActiveFilters: boolean;
  totalSdgDurationCalculatedBase: number;
  totalSdgDurationCalculatedQuery: number;
}

export interface TableGoals {
  goal: string;
  parentSdg: SdgTopic;
  base_duration: number;
  query_duration: number;
  maxGoalDuration: number;
  hasActiveFilters: boolean;
  totalSdgDurationCalculatedBase: number;
  totalSdgDurationCalculatedQuery: number;
}
