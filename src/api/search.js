import request from '@/utils/request'

export const getSuggestion = keyword => {
  return request({
    method: 'GET',
    url: '/app/v1_0/suggestion',
    params: {
      q: keyword
    }
  })
}
