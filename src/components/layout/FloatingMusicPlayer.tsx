import { useCallback, useEffect, useRef, useState, type FormEvent } from 'react'
import { ChevronDown, ChevronUp, Pause, Play, Volume2, VolumeX } from 'lucide-react'
import { buildYouTubeEmbedUrl, parseYouTubeVideoId } from '@/lib/youtube'
import { cn } from '@/lib/utils'

const DEFAULT_VIDEO_ID = 'MX-iaTDEyGI'
/** Delay após montar/trocar o iframe antes de enviar comandos via postMessage. */
const START_DELAY_MS = 800
const INVALID_URL_MESSAGE = 'Use um link do YouTube (watch, youtu.be ou shorts).'

const STORAGE = {
  videoId: 'hx_bg_video_id',
  volume: 'hx_bg_volume',
  playing: 'hx_bg_playing',
  muted: 'hx_bg_muted',
} as const

function readStorage(key: string): string | null {
  try {
    return window.localStorage.getItem(key)
  } catch {
    return null
  }
}

function writeStorage(key: string, value: string): void {
  try {
    window.localStorage.setItem(key, value)
  } catch {
    // armazenamento indisponível — apenas segue sem persistir
  }
}

function readInitialVideoId(): string {
  return parseYouTubeVideoId(readStorage(STORAGE.videoId)) ?? DEFAULT_VIDEO_ID
}

function readInitialVolume(): number {
  const raw = readStorage(STORAGE.volume)
  if (raw === null) return 70
  const parsed = Number(raw)
  if (!Number.isFinite(parsed)) return 70
  return Math.min(100, Math.max(0, Math.round(parsed)))
}

function readInitialMuted(): boolean {
  return readStorage(STORAGE.muted) === 'true'
}

function readInitialPlaying(): boolean {
  return readStorage(STORAGE.playing) === 'true'
}

const controlButtonClass =
  'grid place-items-center rounded-full border border-border bg-surface-strong text-sidebar-foreground/70 shadow-lg transition hover:border-sidebar-highlight/50 hover:text-sidebar-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring/70'

/**
 * Player de música de fundo flutuante (canto inferior direito).
 *
 * - O iframe **nunca é desmontado** depois de iniciado: quando recolhido, o
 *   container sai da tela (1×1px, off-screen, opaco) e o áudio continua.
 * - Comandos via `postMessage` (`enablejsapi=1`): playVideo, pauseVideo,
 *   setVolume, mute/unMute.
 * - Persistência em localStorage: hx_bg_video_id, hx_bg_volume, hx_bg_playing
 *   e hx_bg_muted (compat).
 */
export function FloatingMusicPlayer() {
  const [videoId, setVideoId] = useState(readInitialVideoId)
  const [urlInput, setUrlInput] = useState(() => `https://www.youtube.com/watch?v=${videoId}`)
  const [volume, setVolume] = useState(readInitialVolume)
  const [muted, setMuted] = useState(readInitialMuted)
  // `started` = iframe montado (fica true e nunca volta a false nesta sessão).
  const [started, setStarted] = useState(readInitialPlaying)
  const [playing, setPlaying] = useState(readInitialPlaying)
  const [expanded, setExpanded] = useState(false)
  const [urlError, setUrlError] = useState('')

  const iframeRef = useRef<HTMLIFrameElement | null>(null)
  const stateRef = useRef({ started, playing, muted, volume })
  stateRef.current = { started, playing, muted, volume }

  const post = useCallback((func: string, arg?: number) => {
    const target = iframeRef.current?.contentWindow
    if (!target) return
    const message = JSON.stringify({
      event: 'command',
      func,
      args: arg === undefined ? [] : [arg],
    })
    try {
      target.postMessage(message, '*')
    } catch {
      // iframe indisponível — ignora
    }
  }, [])

  // Ao montar (ou trocar) o iframe, aplica play/volume/mudo após o carregamento.
  useEffect(() => {
    if (!started) return
    const timer = window.setTimeout(() => {
      const current = stateRef.current
      if (!current.playing) return
      post('playVideo')
      if (current.muted) {
        post('mute')
      } else {
        post('unMute')
        post('setVolume', current.volume)
      }
    }, START_DELAY_MS)
    return () => window.clearTimeout(timer)
  }, [started, videoId, post])

  // Volume: persiste e manda setVolume imediatamente quando o slider muda.
  useEffect(() => {
    writeStorage(STORAGE.volume, String(volume))
    if (stateRef.current.started) post('setVolume', volume)
  }, [volume, post])

  const handleTogglePlay = () => {
    if (!started) {
      // Primeiro play: gesto do usuário (política de autoplay).
      setStarted(true)
      setPlaying(true)
      writeStorage(STORAGE.playing, 'true')
      return
    }
    const next = !playing
    setPlaying(next)
    writeStorage(STORAGE.playing, String(next))
    if (next) {
      post('playVideo')
      if (muted) {
        post('mute')
      } else {
        post('unMute')
        post('setVolume', volume)
      }
    } else {
      post('pauseVideo')
    }
  }

  const handleToggleMute = () => {
    const next = !muted
    setMuted(next)
    writeStorage(STORAGE.muted, String(next))
    if (next) {
      post('mute')
    } else {
      post('unMute')
      post('setVolume', volume)
    }
  }

  const handleSubmitUrl = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const nextId = parseYouTubeVideoId(urlInput)
    if (!nextId) {
      setUrlError(INVALID_URL_MESSAGE)
      return
    }
    setUrlError('')
    setUrlInput(`https://www.youtube.com/watch?v=${nextId}`)

    if (nextId === videoId) {
      if (started && playing) return
      if (!started) {
        setStarted(true)
      } else {
        post('playVideo')
        if (muted) {
          post('mute')
        } else {
          post('unMute')
          post('setVolume', volume)
        }
      }
      setPlaying(true)
      writeStorage(STORAGE.playing, 'true')
      return
    }

    // Troca de vídeo: novo src/key do iframe + autoplay com delay.
    setVideoId(nextId)
    writeStorage(STORAGE.videoId, nextId)
    setStarted(true)
    setPlaying(true)
    writeStorage(STORAGE.playing, 'true')
  }

  const playLabel = !started
    ? 'Tocar música de fundo'
    : playing
      ? 'Pausar música'
      : 'Retomar música'

  const expandLabel = expanded ? 'Recolher player de música' : 'Mostrar player de música'

  return (
    <div
      className="fixed bottom-5 right-5 z-[9999] flex flex-col items-end gap-2"
      role="group"
      aria-label="Player de música de fundo"
    >
      {/*
        Container do iframe: expandido vira a prévia 320×180; recolhido sai da
        tela (1×1px off-screen, opaco) mas permanece montado — o áudio não para.
      */}
      <div
        className={cn(
          expanded
            ? 'flex w-[344px] flex-col overflow-hidden rounded-xl border border-border bg-surface shadow-elevated backdrop-blur-md'
            : 'pointer-events-none fixed bottom-0 -right-[9999px] h-px w-px overflow-hidden opacity-0'
        )}
        aria-hidden={!expanded}
      >
        {started ? (
          <iframe
            key={videoId}
            ref={iframeRef}
            src={buildYouTubeEmbedUrl(videoId)}
            title="Player de música do YouTube"
            width={320}
            height={180}
            allow="autoplay; encrypted-media"
            className="pointer-events-none block h-[180px] w-[320px] border-0 bg-black"
          />
        ) : (
          <div className="grid h-[180px] w-[320px] place-items-center rounded-lg bg-sidebar-accent/50 px-6 text-center text-xs leading-5 text-sidebar-foreground/60">
            Clique em tocar para ouvir a música de fundo.
          </div>
        )}

        {expanded && (
          <div className="flex flex-col gap-3 p-3">
            <form onSubmit={handleSubmitUrl} className="flex items-center gap-2">
              <input
                type="text"
                value={urlInput}
                onChange={(event) => {
                  setUrlInput(event.target.value)
                  if (urlError) setUrlError('')
                }}
                placeholder="https://www.youtube.com/watch?v=..."
                aria-label="Link do vídeo do YouTube"
                className="hx-input h-10 min-w-0 flex-1 text-xs"
              />
              <button type="submit" className="hx-btn hx-btn-primary h-10 shrink-0 px-3 text-xs">
                Tocar
              </button>
            </form>

            {urlError && (
              <p role="alert" className="text-xs font-medium text-red-500 dark:text-red-400">
                {urlError}
              </p>
            )}

            <div className="flex items-center gap-3">
              <label
                htmlFor="hx-bg-volume"
                className="shrink-0 text-xs font-semibold text-sidebar-foreground/70"
              >
                Volume
              </label>
              <input
                id="hx-bg-volume"
                type="range"
                min={0}
                max={100}
                step={1}
                value={volume}
                onChange={(event) => setVolume(Number(event.target.value))}
                aria-label="Volume da música"
                className="hx-range min-w-0 flex-1"
              />
              <span className="w-7 shrink-0 text-right text-xs tabular-nums text-sidebar-foreground/70">
                {volume}%
              </span>
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center gap-2">
        {started && (
          <button
            type="button"
            onClick={handleToggleMute}
            title={muted ? 'Ativar som' : 'Desativar som'}
            aria-label={muted ? 'Ativar som' : 'Desativar som'}
            className={cn(controlButtonClass, 'h-10 w-10')}
          >
            {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
          </button>
        )}

        <button
          type="button"
          onClick={() => setExpanded((value) => !value)}
          aria-expanded={expanded}
          title={expandLabel}
          aria-label={expandLabel}
          className={cn(controlButtonClass, 'h-10 w-10')}
        >
          {expanded ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
        </button>
      </div>

      <button
        type="button"
        onClick={handleTogglePlay}
        title={playLabel}
        aria-label={playLabel}
        className={cn(
          controlButtonClass,
          'h-11 w-11',
          started && playing
            ? 'border-sidebar-highlight/40 text-sidebar-highlight'
            : 'text-sidebar-foreground'
        )}
      >
        {started && playing ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
      </button>
    </div>
  )
}
