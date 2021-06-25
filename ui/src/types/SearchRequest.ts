export interface SearchRequest {
  page: number
  limit: number
  search_query?: string
  is_asc?: boolean
}
