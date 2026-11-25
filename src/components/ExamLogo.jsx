import { useEffect, useState } from 'react'
import { Box, Typography } from '@mui/material'
import { Building2, GraduationCap } from 'lucide-react'

const logos = [
  {
    matches: /\bssc\b|staff selection/i,
    src: '/exam-logos/ssc.jpg',
    alt: 'Staff Selection Commission logo',
    fallback: 'SSC',
  },
  {
    matches: /\bibps\b|bank/i,
    src: '/exam-logos/ibps.png',
    alt: 'Institute of Banking Personnel Selection logo',
    fallback: 'IBPS',
  },
  {
    matches: /\bupsc\b|civil services/i,
    src: '/exam-logos/upsc.jpg',
    alt: 'Union Public Service Commission logo',
    fallback: 'UPSC',
  },
  {
    matches: /\bnta\b|teaching|ctet|ugc net/i,
    src: '/exam-logos/nta.png',
    alt: 'National Testing Agency logo',
    fallback: 'NTA',
  },
  {
    matches: /\brrb\b|railway/i,
    src: '/exam-logos/railways.svg',
    alt: 'Indian Railways wordmark',
    fallback: 'IR',
  },
]

export default function ExamLogo({ name = '', size = 36 }) {
  const label = typeof name === 'string' ? name : name?.name ?? name?.examination ?? ''
  const logo = logos.find(({ matches }) => matches.test(label))
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    setFailed(false)
  }, [logo?.src])

  return (
    <Box
      sx={{
        width: size,
        height: size,
        flex: `0 0 ${size}px`,
        display: 'grid',
        placeItems: 'center',
        overflow: 'hidden',
        bgcolor: '#fff',
        border: '1px solid #e8edf5',
      }}
      aria-label={label ? `${label} exam logo` : 'Exam logo'}
    >
      {logo && !failed ? (
        <Box
          component="img"
          src={logo.src}
          alt={logo.alt}
          loading="lazy"
          onError={() => setFailed(true)}
          sx={{ width: '100%', height: '100%', p: 0.25, objectFit: 'contain' }}
        />
      ) : logo ? (
        <Typography variant="caption" sx={{ color: '#0b5cff', fontWeight: 900, fontSize: Math.min(12, size / 3) }}>
          {logo.fallback}
        </Typography>
      ) : /osssc|ossc|state|odisha|government/i.test(label) ? (
        <Building2 size={Math.min(22, size * 0.62)} color="#0b5cff" aria-hidden="true" />
      ) : (
        <GraduationCap size={Math.min(22, size * 0.62)} color="#0b5cff" aria-hidden="true" />
      )}
    </Box>
  )
}
