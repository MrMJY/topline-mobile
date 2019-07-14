import request from '@/utils/request'

export const getChannels = () => {
  return request({
    method: 'GET',
    url: '/app/v1_0/user/channels'
  })
}

export const getAllChannels = () => {
  return request({
    method: 'GET',
    url: '/app/v1_0/channels'
  })
}

export const resetAllChannels = (channels) => {
  return request({
    method: 'PUT',
    url: '/app/v1_0/user/channels',
    data: channels
  })
}
