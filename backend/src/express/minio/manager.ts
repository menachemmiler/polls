import fs from 'fs';
import path from 'path';
import { randomUUID } from 'crypto';
import { bucketName, minioClient } from '../../utils/express/minioClient';

export class MinioManager {
  static async uploadFile(file: Express.Multer.File): Promise<{ url: string }> {
    if (!file.mimetype.startsWith('image/') && !file.mimetype.startsWith('video/')) {
      throw new Error('Only images and videos are allowed');
    }

    const ext = path.extname(file.originalname);
    const objectName = `${Date.now()}-${randomUUID()}${ext}`;

    const exists = await minioClient.bucketExists(bucketName);
    if (!exists) await minioClient.makeBucket(bucketName);

    await minioClient.fPutObject(bucketName, objectName, file.path, {
      'Content-Type': file.mimetype,
    });

    fs.unlinkSync(file.path);

    const url = `http://localhost/api/upload/${objectName}`;
    return { url };
  }

  static async getFile(fileName: string): Promise<{ stream: NodeJS.ReadableStream; contentType: string }> {
    const extension = fileName.split('.').pop()?.toLowerCase() || '';
    const contentType =
      extension === 'mp4' ? 'video/mp4' :
      extension === 'mov' ? 'video/quicktime' :
      extension === 'jpg' || extension === 'jpeg' ? 'image/jpeg' :
      extension === 'png' ? 'image/png' :
      'application/octet-stream';

    const stream = await minioClient.getObject(bucketName, fileName);
    return { stream, contentType };
  }
}
