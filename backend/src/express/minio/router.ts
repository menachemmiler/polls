import { Router } from 'express';
import multer from 'multer';
import { wrapController, validateRequest } from '../../utils/express/wrappers';
import { getFileRequestSchema, uploadFileRequestSchema } from './validations';
import { MinioController } from './controller';

export const minioRouter = Router();
const upload = multer({ dest: 'uploads/' });

minioRouter.post(
  '/',
  upload.single('file'),
  validateRequest(uploadFileRequestSchema),
  wrapController(MinioController.uploadFile)
);

minioRouter.get(
  '/:fileName',
  validateRequest(getFileRequestSchema),
  wrapController(MinioController.getFile)
);
