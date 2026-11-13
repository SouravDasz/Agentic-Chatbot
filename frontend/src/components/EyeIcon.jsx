function EyeIcon({ visible }) {
  return visible ? (
    <svg className="h-[18px] w-[18px] fill-none stroke-current stroke-[1.6] stroke-linecap-round stroke-linejoin-round" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M2.5 12s3.2-5 9.5-5 9.5 5 9.5 5-3.2 5-9.5 5-9.5-5-9.5-5Z" />
      <circle cx="12" cy="12" r="2.25" />
    </svg>
  ) : (
    <svg className="h-[18px] w-[18px] fill-none stroke-current stroke-[1.6] stroke-linecap-round stroke-linejoin-round" viewBox="0 0 24 24" aria-hidden="true">
      <path d="m3 3 18 18M10.6 6.99A10.7 10.7 0 0 1 12 7c6.3 0 9.5 5 9.5 5a16.7 16.7 0 0 1-3.08 3.46M6.23 6.24C3.9 7.65 2.5 12 2.5 12a16.8 16.8 0 0 0 5.14 4.42A10.2 10.2 0 0 0 12 17c.48 0 .94-.04 1.38-.1" />
      <path d="M9.88 9.88a3 3 0 0 0 4.24 4.24" />
    </svg>
  )
}

export default EyeIcon
