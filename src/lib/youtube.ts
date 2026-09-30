/**
 * Utilitários para o player de música de fundo (embed do YouTube).
 * Aceita os formatos mais comuns de link: watch?v=, youtu.be/, /shorts/ e /embed/.
 */
const VIDEO_ID_RE = /^[A-Za-z0-9_-]{11}$/

/**
 * Extrai o ID de um vídeo do YouTube a partir de um link (ou de um ID puro).
 * Retorna `null` quando o input não é um link válido do YouTube.
 */
export function parseYouTubeVideoId(input: string | null | undefined): string | null {
  const raw = (input ?? '').trim()
  if (!raw) return null
  if (VIDEO_ID_RE.test(raw)) return raw

  let url: URL
  try {
    url = new URL(/^[a-z][a-z0-9+.-]*:\/\//i.test(raw) ? raw : `https://${raw}`)
  } catch {
    return null
  }

  const host = url.hostname.replace(/^(www|m|music)\./, '')
  let candidate: string | null | undefined

  if (host === 'youtu.be') {
    candidate = url.pathname.split('/').filter(Boolean)[0]
  } else if (host === 'youtube.com' || host === 'youtube-nocookie.com') {
    const segments = url.pathname.split('/').filter(Boolean)
    if (segments[0] === 'watch') {
      candidate = url.searchParams.get('v')
    } else if (segments[0] === 'shorts' || segments[0] === 'embed' || segments[0] === 'live' || segments[0] === 'v') {
      candidate = segments[1]
    }
  }

  return candidate && VIDEO_ID_RE.test(candidate) ? candidate : null
}

/**
 * URL do embed com `enablejsapi=1` (necessário para postMessage) e loop
 * (`loop=1` + `playlist=<id>`), autoplay/mute para aceitar o primeiro play.
 */
export function buildYouTubeEmbedUrl(videoId: string): string {
  return `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&enablejsapi=1&controls=0&disablekb=1&fs=0&iv_load_policy=3&modestbranding=1&rel=0&loop=1&playlist=${videoId}`
}
