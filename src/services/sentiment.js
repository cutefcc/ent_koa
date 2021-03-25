import request from 'utils/request'

// 关键词列表
export function fetchSentimentList(payload) {
  return request('/bizjobs/company/manage/opinion_words_list', {
    query: {
      ...payload,
      channel: 'www',
      version: '4.0.0',
    },
  })
}

// 关键词搜索
export function fetchSentimentData(payload) {
  return request('/bizjobs/company/manage/opinion_words_search', {
    query: {
      ...payload,
      channel: 'www',
      version: '4.0.0',
    },
  })
}

// 关键词评论搜索
export function fetchSentimentComment(payload) {
  return request('/bizjobs/company/manage/opinion_comment_search', {
    query: {
      ...payload,
      channel: 'www',
      version: '4.0.0',
    },
  })
}

// 增加关键词
export function addSentimentWord(payload) {
  return request('/bizjobs/company/manage/opinion_words_add', {
    query: {
      ...payload,
      channel: 'www',
      version: '4.0.0',
    },
  })
}

// 删除关键词
export function deleteSentimentWord(payload) {
  return request('/bizjobs/company/manage/opinion_words_delete', {
    query: {
      ...payload,
      channel: 'www',
      version: '4.0.0',
    },
  })
}
