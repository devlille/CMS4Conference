import { Storage } from '@google-cloud/storage';

export async function save(storage: Storage, c4hId: string, companyId: string, size: number, bufferImage: Buffer) {
  const path = `${c4hId}/partners/${companyId}/${size}.png`;
  await storage.bucket('conferences4hall').file(path).save(bufferImage, {
    public: true,
    predefinedAcl: 'publicRead'
  });
  return `https://storage.googleapis.com/conferences4hall/${path}`;
}
