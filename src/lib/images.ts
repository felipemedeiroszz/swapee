/**
 * Utilitários para trabalhar com imagens do CDN
 */

/**
 * Constrói a URL completa de uma imagem do CDN
 * @param imageName Nome do arquivo da imagem (ex: "items-1761786123230-aeqkk9.webp") ou URL completa
 * @returns URL completa da imagem no CDN
 */
export function buildImageUrl(imageName: string | null | undefined): string {
  if (!imageName) {
    return '/placeholder.svg';
  }

  // Se já é uma URL completa, usar como está
  if (imageName.startsWith('http://') || imageName.startsWith('https://')) {
    return imageName;
  }

  // Construir URL completa usando o CDN
  // FORÇAR o valor padrão caso a variável não esteja disponível (problema comum no Vite)
  const CDN_URL = import.meta.env.VITE_CDN_URL || 'https://swapee-cdn.intranet-fca.com.br/swepee-uploads';
  
  // Log de debug para identificar problemas
  if (import.meta.env.DEV) {
    console.log('[images.ts] CDN_URL:', CDN_URL);
    console.log('[images.ts] import.meta.env.VITE_CDN_URL:', import.meta.env.VITE_CDN_URL);
    console.log('[images.ts] imageName recebido:', imageName);
  }
  
  // Validação e debug (desabilitar em produção)
  if (!CDN_URL || CDN_URL === 'undefined') {
    console.error('[images.ts] ERRO: VITE_CDN_URL não está definido! Usando fallback.');
    // Usar valor hardcoded como fallback absoluto
    const fallbackCdn = 'https://swapee-cdn.intranet-fca.com.br/swepee-uploads';
    const cleanBaseUrl = fallbackCdn.replace(/\/$/, '');
    const cleanImageName = imageName.replace(/^\//, '');
    return `${cleanBaseUrl}/${cleanImageName}`;
  }
  
  // Remover barras finais do CDN_URL e barras iniciais do nome para evitar duplicação
  const cleanBaseUrl = CDN_URL.replace(/\/$/, '');
  const cleanImageName = imageName.replace(/^\//, '');
  
  const fullUrl = `${cleanBaseUrl}/${cleanImageName}`;
  
  // Debug apenas em desenvolvimento
  if (import.meta.env.DEV) {
    console.log('[images.ts] URL final construída:', fullUrl);
  }
  
  return fullUrl;
}

/**
 * Constrói URLs para um array de imagens
 * @param imageNames Array de nomes de arquivos ou URLs completas
 * @returns Array de URLs completas, ou array com placeholder se vazio
 */
export function buildImageUrls(imageNames: (string | null | undefined)[] | null | undefined): string[] {
  if (!imageNames || imageNames.length === 0) {
    return ['/placeholder.svg'];
  }

  // Filtrar strings vazias e nulos, depois construir URLs
  const validImages = imageNames
    .filter((img): img is string => !!img && img.trim().length > 0)
    .map(buildImageUrl);

  // Se após filtrar não sobrou nenhuma imagem válida, retornar placeholder
  if (validImages.length === 0) {
    return ['/placeholder.svg'];
  }

  return validImages;
}

/**
 * URL da imagem padrão (placeholder)
 */
export const PLACEHOLDER_IMAGE = '/placeholder.svg';

