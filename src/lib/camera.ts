import { Capacitor } from '@capacitor/core';
import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';

/**
 * Converte uma foto do Capacitor Camera para um File
 */
async function photoToFile(photo: Photo): Promise<File> {
  // Para native platforms, geralmente vem com path
  if (photo.path) {
    const response = await fetch(Capacitor.convertFileSrc(photo.path));
    const blob = await response.blob();
    // Determinar extensão baseado no formato ou no tipo do blob
    const ext = photo.format?.toLowerCase() || blob.type.split('/')[1] || 'jpeg';
    const filename = `photo_${Date.now()}.${ext}`;
    return new File([blob], filename, { type: blob.type || `image/${ext}` });
  }
  
  // Se veio como base64
  if (photo.base64String) {
    const format = photo.format?.toLowerCase() || 'jpeg';
    const byteCharacters = atob(photo.base64String);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: `image/${format}` });
    const filename = `photo_${Date.now()}.${format}`;
    return new File([blob], filename, { type: blob.type });
  }
  
  // Se veio como URL (web platform)
  if (photo.webPath) {
    const response = await fetch(photo.webPath);
    const blob = await response.blob();
    const format = photo.format?.toLowerCase() || 'jpeg';
    const filename = `photo_${Date.now()}.${format}`;
    return new File([blob], filename, { type: blob.type || `image/${format}` });
  }
  
  throw new Error('Formato de foto não suportado');
}

/**
 * Seleciona fotos da galeria ou câmera
 * @param maxPhotos Número máximo de fotos a selecionar
 * @param source Origem das fotos ('gallery' | 'camera')
 */
export async function pickPhotos(
  maxPhotos: number = 6,
  source: 'gallery' | 'camera' = 'gallery'
): Promise<File[]> {
  if (!Capacitor.isNativePlatform()) {
    // No browser, usa o input file padrão
    return new Promise((resolve, reject) => {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.multiple = true;
      input.onchange = (e) => {
        const target = e.target as HTMLInputElement;
        const files = Array.from(target.files || []);
        resolve(files.slice(0, maxPhotos));
      };
      input.oncancel = () => reject(new Error('Seleção cancelada'));
      input.click();
    });
  }

  // No mobile, usa o Capacitor Camera
  try {
    const photos: Photo[] = [];
    
    // O Capacitor Camera não suporta seleção múltipla nativamente
    // Vamos selecionar uma foto por vez até atingir o máximo
    let continueSelecting = true;
    
    while (photos.length < maxPhotos && continueSelecting) {
      try {
        const photo = await Camera.getPhoto({
          quality: 90,
          allowEditing: false,
          resultType: CameraResultType.Uri,
          source: source === 'gallery' ? CameraSource.Photos : CameraSource.Camera,
        });
        
        photos.push(photo);
        
        // Se já atingiu o máximo, para
        if (photos.length >= maxPhotos) {
          continueSelecting = false;
        } else {
          // Pergunta se quer adicionar mais (usando window.confirm que funciona no mobile)
          // Note: Em produção, pode-se usar um dialog customizado
          continueSelecting = window.confirm(
            `Foto ${photos.length} de até ${maxPhotos} selecionada.\n\nDeseja adicionar outra foto?`
          );
        }
      } catch (err: unknown) {
        const error = err as { message?: string };
        // Se cancelou, para o loop mas retorna as fotos já selecionadas
        if (error.message?.toLowerCase().includes('user cancelled') || 
            error.message?.toLowerCase().includes('cancel')) {
          continueSelecting = false;
          break;
        }
        throw err;
      }
    }
    
    if (photos.length === 0) {
      throw new Error('Seleção cancelada');
    }
    
    // Converte todas as fotos para File[]
    const files = await Promise.all(photos.map(photoToFile));
    return files;
  } catch (error: unknown) {
    const err = error as { message?: string };
    if (err.message?.toLowerCase().includes('cancel') || 
        err.message === 'Seleção cancelada') {
      throw new Error('Seleção cancelada');
    }
    throw error;
  }
}

/**
 * Seleciona uma única foto da galeria ou câmera
 */
export async function pickPhoto(source: 'gallery' | 'camera' = 'gallery'): Promise<File> {
  const files = await pickPhotos(1, source);
  return files[0];
}

