export interface TableChannels {
  name: Channels;
  sdgs: SdgTopic[];
  total_duration: number;
  tagged_duration: number;
  maxTotalDuration: number;
  filteredTaggedDuration?: number;
  programs?: number; // tbd check
}