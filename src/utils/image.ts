// Comprime uma imagem (File/Blob) para WebP, redimensionando até maxSize px no lado maior.
// Reduz drasticamente o espaço ocupado no IndexedDB. Degrada graciosamente se algo falhar.
// 1280px é suficiente para fotos de diário vistas no telemóvel e mantém o IndexedDB leve.
//
// Limite prático: a 1280px/WebP q0.72 uma foto típica fica ~80-250KB (raramente >300KB);
// devolve sempre o menor entre comprimido e original. Para um teto mais agressivo, baixar
// maxSize ou quality. (Nota: não testável em jsdom — sem canvas/createImageBitmap.)
export async function compressImage(file: Blob, maxSize = 1280, quality = 0.72): Promise<Blob> {
  try {
    const bitmap = await createImageBitmap(file)
    const scale = Math.min(1, maxSize / Math.max(bitmap.width, bitmap.height))
    const w = Math.round(bitmap.width * scale)
    const h = Math.round(bitmap.height * scale)
    const canvas = document.createElement('canvas')
    canvas.width = w
    canvas.height = h
    const ctx = canvas.getContext('2d')
    if (!ctx) return file
    ctx.drawImage(bitmap, 0, 0, w, h)
    bitmap.close?.()
    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, 'image/webp', quality),
    )
    // Só usa o comprimido se for realmente mais pequeno
    return blob && blob.size < file.size ? blob : file
  } catch {
    return file
  }
}
