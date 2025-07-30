import { Response } from 'express';
import { TypedRequest } from '../../utils/zod';
import { getFileRequestSchema, uploadFileRequestSchema } from './validations';
import { MinioManager } from './manager';

export class MinioController {
  static async uploadFile(
    req: TypedRequest<typeof uploadFileRequestSchema> & { file?: Express.Multer.File },
    res: Response
  ) {
    if (!req.file) throw new Error('Missing file');
    const { url } = await MinioManager.uploadFile(req.file);
    res.json({ url });
  }

  static async getFile(
    req: TypedRequest<typeof getFileRequestSchema>,
    res: Response
  ) {
    const { fileName } = req.params;
    const { stream, contentType } = await MinioManager.getFile(fileName);
    res.setHeader('Content-Type', contentType);
    stream.pipe(res);
  }
}
