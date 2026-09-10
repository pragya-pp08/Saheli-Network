import { post } from './api';

export async function uploadPhoto(file, target) {
  if (!file || !['image/jpeg','image/png','image/webp'].includes(file.type)) throw new Error('Please choose a JPEG, PNG or WebP photo.');
  if (file.size > 10 * 1024 * 1024) throw new Error('Please choose a photo smaller than 10 MB.');
  const bitmap = await createImageBitmap(file);
  try {
    const scale = Math.min(1, 480 / Math.max(bitmap.width, bitmap.height));
    const canvas = document.createElement('canvas');
    canvas.width = Math.max(1, Math.round(bitmap.width * scale));
    canvas.height = Math.max(1, Math.round(bitmap.height * scale));
    canvas.getContext('2d').drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    return await post('/profile/photo', {target, caption:file.name.replace(/\.[^.]+$/, '').slice(0,80), data:canvas.toDataURL('image/jpeg',0.65).split(',')[1]});
  } finally { bitmap.close(); }
}
