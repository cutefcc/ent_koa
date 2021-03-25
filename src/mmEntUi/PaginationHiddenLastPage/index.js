import React, { useState, useEffect } from 'react'
import Icon from './../Icon'
import styles from './index.less'

export default function PaginationHiddenLastPage(props) {
  const {
    onChange = () => {},
    current,
    defaultCurrent = 1,
    pageSize: size = 20,
    total = 0,
  } = props
  const [page, setPage] = useState(current || defaultCurrent)
  const [maxPage, setMaxpage] = useState(Math.ceil(total / size))
  const [maxPageNum] = useState(10)

  useEffect(() => {
    setMaxpage(Math.ceil(total / size))
    setPage(current)
  }, [total, current])

  const range = (start, end, step) =>
    Array.from({ length: (end - start) / step + 1 }, (_, i) => start + i * step)

  const handlePageChange = (currPage) => {
    setPage(currPage)
    onChange(currPage, size)
  }

  const renderPreOrNext = (type) => {
    const cn = type === 'pre' ? styles.prePage : styles.nextPage
    const limit = type === 'pre' ? page <= 1 : page >= maxPage
    const pageChange = type === 'pre' ? page - 1 : page + 1
    return (
      <div
        className={`${cn} ${limit ? styles.disabled : ''}`}
        onClick={() => {
          if (limit) return
          handlePageChange(pageChange)
        }}
      >
        <Icon type="icon_arrow_down" />
      </div>
    )
  }

  const renderItem = () => {
    let start = page <= 6 ? 1 : page - 5
    let end =
      start + maxPageNum - 1 > maxPage ? maxPage : start + maxPageNum - 1
    if (start >= maxPage - maxPageNum + 1) {
      start = maxPage - maxPageNum + 1
      end = maxPage
    }
    start = start <= 0 ? 1 : start
    return range(start, end, 1).map((item) => (
      <div
        key={item}
        className={
          item === page
            ? `${styles.current} ${styles.pagesItem}`
            : `${styles.pagesItem}`
        }
        onClick={() => {
          handlePageChange(item)
        }}
      >
        {item}
      </div>
    ))
  }

  return (
    <div className={styles.paginationCon}>
      {renderPreOrNext('pre')}
      {renderItem()}
      {renderPreOrNext('next')}
    </div>
  )
}
