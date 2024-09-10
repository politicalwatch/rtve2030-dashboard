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

export interface TableTags {
  name: String;
  sdgs: SdgTopic[];
  total_occurrences: number;
  maxTotalOccurrences: number;
  filtered_occurrences?: number;

}