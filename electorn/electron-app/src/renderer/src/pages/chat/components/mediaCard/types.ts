export enum MediaType {
  IMAGE,
  FILE,
  AUDIO,
  VIDEO
}

export interface MediaTypeInfo {
  type: MediaType
  url: string
  name: string
  size: number
}
