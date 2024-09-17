export interface TableChannels {
  name: Channels;
  sdgs: SdgTopic[];
  total_duration: number;
  tagged_duration: number;
  maxTotalDuration: number;
  filteredTaggedDuration?: number;
  programs?: number;
  basePrograms?: number; // tbd check
}

export interface TablePrograms {
  canal: Channels;
  name: string;
  sdgs: SdgTopic[];
  total_duration: number;
  tagged_duration: number;
  maxTotalDuration: number;
  filteredTaggedDuration?: number;
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
  duration: number;
  occurrences: number;
  goals: StatsGoal[];
  allSdgDuration: number;
}


export interface TableGoals {
  goal: string;
  parentSdg: SdgTopic;
  duration: number;
  occurrences: number;
  parentSdgDuration: number;
  maxParentSdgDuration: number;
}