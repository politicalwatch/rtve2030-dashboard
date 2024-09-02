export interface TableChannels {
    name: Channels,
    sdgs: SdgTopic[],
    total_duration: number,
    tagged_duration: number,
    programs?: number // tbd check
}