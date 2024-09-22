export interface TableChannels {
  name: Channels;
  sdgs: SdgTopic[];
  total_duration: number;
  tagged_duration: number;
  maxTotalDuration: number;
  queryDuration: number;
  programs: number;
  basePrograms?: number; // tbd check
  hasActiveFilters:boolean;
}

export interface TablePrograms {
  canal: Channels;
  name: string;
  sdgs: SdgTopic[];
  total_duration: number;
  tagged_duration: number;
  maxTotalDuration: number;
  queryDuration?: number;
  hasActiveFilters:boolean;
}

export interface TableTags {
  name: String;
  sdgs: SdgTopic[];
  total_occurrences: number;
  maxTotalOccurrences: number;
  filtered_occurrences: number;
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
}


export interface TableGoals {
  goal: string;
  parentSdg: SdgTopic;
  base_duration: number;
  query_duration: number;
  maxGoalDuration: number;
  hasActiveFilters: boolean;
}