


export enum SdgTopic {
  ODS1 = "ODS 1 Fin de la pobreza",
  ODS2 = "ODS 2 Hambre cero",
  ODS3 = "ODS 3 Salud y bienestar",
  ODS4 = "ODS 4 Educación de calidad",
  ODS5 = "ODS 5 Igualdad de género",
  ODS6 = "ODS 6 Agua limpia y saneamiento",
  ODS7 = "ODS 7 Energía asequible y no contaminante",
  ODS8 = "ODS 8 Trabajo decente y crecimiento económico",
  ODS9 = "ODS 9 Industria, innovación e infraestructura",
  ODS10 = "ODS 10 Reducción de las desigualdades",
  ODS11 = "ODS 11 Ciudades y comunidades sostenibles",
  ODS12 = "ODS 12 Producción y consumo responsables",
  ODS13 = "ODS 13 Acción por el clima",
  ODS14 = "ODS 14 Vida submarina",
  ODS15 = "ODS 15 Vida de ecosistemas terrestres",
  ODS16 = "ODS 16 Paz, justicia e instituciones sólidas",
  ODS17 = "ODS 17 Alianzas para lograr los objetivos",
}   

export enum Channels{
    LA1 = "La 1",
    LA2 = "La 2",
    CLAN = "Clan TVE",
    C24H = "Canal 24H",
    TDP = "Teledeporte",
    PLAYZ = "PLAYZ"
}

// response from api /stats
export interface Stat {
  channel: Channels;
  goal: string;
  occurrences: number;
  percentage_tagged: number;
  program: string;
  sdg: string;
  tag: string;
  tagged_time: number;
  total_time: number;
  _id: number;
}

// global stats for the endpoint /stats/global
export  interface ByChannel {
  name: string;
  episodes_count: number;
  programs_count: number;
  total_duration: number;
  tagged_duration: number;
  percentage_tagged: number;
}

export interface SdgByChannel {
  topic: SdgTopic;
  duration: number;
  percentage: number;
  ocurrences: number;
}

export interface GlobalStats {
  global: {
    total_duration: number;
    tagged_duration: number;
    percentage_tagged: number;
  },
    by_channel: ByChannel[],
    by_sdg: SdgByChannel[]
}
export interface GlobalStatsResponse {
     date: string;
    id: number;
    stats: GlobalStats
}

/*
* return data form /stats/counter. Mainly used for global counters
* @remark all durations in miliseconds   
*/ 
export interface StatsCounter {
  total_duration: number;
  tagged_duration: number;
  programs_count: number;
  episodes_count: number;
}

export interface DateDuration {
    date: string,
    total_duration: number
}

export interface StatsEvolution {
    init: string,
    end: string,
    hoursPeriod: DateDuration[]
}

/** stats/sdg */
export interface StatsGoal {
  goal: string;
  duration: number;
  occurrences: number;
}
export interface StatsSdg {
  sdg: string;
  duration: number;
  occurrences: number;
  goals: StatsGoal[];
}

/** dates 
 * Reference: https://blog.logrocket.com/handling-date-strings-typescript/
*/
type oneToNine = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
type zeroToNine = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
/**
 * Years
 */
type YYYY = `19${zeroToNine}${zeroToNine}` | `20${zeroToNine}${zeroToNine}`;
/**
 * Months
 */
type MM = `0${oneToNine}` | `1${0 | 1 | 2}`;
/**
 * Days
 */
type DD = `${0}${oneToNine}` | `${1 | 2}${zeroToNine}` | `3${0 | 1}`;
/**
 * YYYYMMDD
 */
export type RawDateString = `${YYYY}-${MM}-${DD}`;