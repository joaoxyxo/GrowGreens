/** Gera um cartão de imagem (canvas) para partilhar uma conquista. */
export async function buildAchievementCard(opts: {
  title: string
  subtitle: string
  emoji: string
}): Promise<Blob | null> {
  const W = 1080
  const H = 1080
  const canvas = document.createElement('canvas')
  canvas.width = W
  canvas.height = H
  const ctx = canvas.getContext('2d')
  if (!ctx) return null

  // Fundo gradiente verde
  const g = ctx.createLinearGradient(0, 0, W, H)
  g.addColorStop(0, '#3FA34D')
  g.addColorStop(1, '#246B2F')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, W, H)

  // Emoji grande
  ctx.font = '320px serif'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(opts.emoji, W / 2, H / 2 - 120)

  // Título
  ctx.fillStyle = '#ffffff'
  ctx.font = 'bold 84px sans-serif'
  wrapText(ctx, opts.title, W / 2, H / 2 + 140, W - 160, 96)

  // Subtítulo
  ctx.font = '44px sans-serif'
  ctx.fillStyle = 'rgba(255,255,255,0.9)'
  ctx.fillText(opts.subtitle, W / 2, H - 200)

  // Marca
  ctx.font = 'bold 40px sans-serif'
  ctx.fillStyle = 'rgba(255,255,255,0.8)'
  ctx.fillText('🌱 GrowGreens', W / 2, H - 110)

  return new Promise((resolve) => canvas.toBlob(resolve, 'image/png'))
}

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number,
) {
  const words = text.split(' ')
  let line = ''
  const lines: string[] = []
  for (const w of words) {
    const test = line + w + ' '
    if (ctx.measureText(test).width > maxWidth && line) {
      lines.push(line.trim())
      line = w + ' '
    } else {
      line = test
    }
  }
  lines.push(line.trim())
  const startY = y - ((lines.length - 1) * lineHeight) / 2
  lines.forEach((l, i) => ctx.fillText(l, x, startY + i * lineHeight))
}

/** Tenta partilhar (Web Share API com ficheiro); senão faz download. */
export async function shareOrDownload(blob: Blob, filename: string, text: string) {
  const file = new File([blob], filename, { type: 'image/png' })
  const nav = navigator as Navigator & { canShare?: (d: unknown) => boolean }
  if (nav.share && nav.canShare && nav.canShare({ files: [file] })) {
    try {
      await nav.share({ files: [file], text })
      return
    } catch {
      /* utilizador cancelou — cai para download */
    }
  }
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}
