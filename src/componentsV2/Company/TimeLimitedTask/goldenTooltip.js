import React from 'react'

function GoldenToolTip({ title }) {
  return (
    <div
      style={{
        height: '28px',
        lineHeight: '28px',
        background: '#fff5e9',
        color: '#ca8918',
        fontSize: 12,
        padding: '0 15px',
        borderRadius: 5,
        position: 'relative',
        display: 'inline-block',
        marginLeft: 5,
      }}
    >
      {title}
      <div
        style={{
          position: 'absolute',
          left: -10,
          top: 9,
          border: '5px solid transparent',
          borderRight: '5px solid #fff5e9',
        }}
      />
    </div>
  )
}

export default GoldenToolTip
