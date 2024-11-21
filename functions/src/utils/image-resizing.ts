import { Axios } from 'axios';
import * as sharp from 'sharp';

export async function generate(imageUrl: string, size: number) {
  const client = new Axios();
  const response = await client.get(imageUrl, { responseType: 'arraybuffer' });
  const buffer = Buffer.from(response.data, 'utf-8');
  return await sharp(buffer).resize({ width: size }).png().toBuffer();
}
