import React from 'react'

export default function LotusLogo({ size = 18, className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Center petal */}
      <path
        d="M12 3 C12 3, 9 7, 9 11 C9 13.2 10.3 15 12 15 C13.7 15 15 13.2 15 11 C15 7 12 3 12 3Z"
        fill="#E91E8C"
        opacity="0.9"
      />
      {/* Left petal */}
      <path
        d="M12 14 C12 14, 7.5 11, 5 12.5 C3.5 13.5 3.5 15.5 5 16.5 C7 17.8 10 16.5 12 14Z"
        fill="#E91E8C"
        opacity="0.7"
      />
      {/* Right petal */}
      <path
        d="M12 14 C12 14, 16.5 11, 19 12.5 C20.5 13.5 20.5 15.5 19 16.5 C17 17.8 14 16.5 12 14Z"
        fill="#E91E8C"
        opacity="0.7"
      />
      {/* Stem */}
      <path
        d="M12 15 C12 15, 11.5 18, 10 20 C11 19.5 12 19 13 19.5 C11.5 18 12 15 12 15Z"
        fill="#E91E8C"
        opacity="0.5"
      />
      {/* Water line */}
      <path
        d="M8 20 Q12 18.5 16 20"
        stroke="#E91E8C"
        strokeWidth="1.2"
        strokeLinecap="round"
        fill="none"
        opacity="0.4"
      />
    </svg>
  )
}
