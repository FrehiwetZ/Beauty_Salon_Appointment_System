import { Router, Request, Response, NextFunction } from 'express';
import path from 'path';
import { authMiddleware } from '../middleware/auth.middleware';
import { uploadToR2 } from '../services/r2.service';
import { sendSuccess, sendError } from '../utils/response';

const router = Router();

const ALLOWED_EXTENSIONS = ['.png', '.jpg', '.jpeg', '.webp', '.gif', '.svg', '.bmp', '.ico'];

router.post('/', authMiddleware, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { fileName, fileData, folder } = req.body;
    if (!fileName || !fileData) {
      return sendError(res, 400, 'fileName and fileData (base64) are required');
    }

    const ext = (path.extname(fileName) || '').toLowerCase();
    if (ext && !ALLOWED_EXTENSIONS.includes(ext)) {
      return sendError(res, 400, `Invalid file type. Allowed extensions: ${ALLOWED_EXTENSIONS.join(', ')}`);
    }

    // Strip metadata prefix if present (e.g., "data:image/png;base64,")
    const base64Data = fileData.replace(/^data:image\/[a-zA-Z0-9.+-]+;base64,/, '');
    const buffer = Buffer.from(base64Data, 'base64');

    // Max file size: 15MB
    if (buffer.length > 15 * 1024 * 1024) {
      return sendError(res, 400, 'File size exceeds maximum limit of 15MB');
    }

    const uploadResult = await uploadToR2(buffer, fileName, folder || 'uploads');

    return sendSuccess(res, 200, 'File uploaded successfully to Cloudflare R2', {
      url: uploadResult.url,
      key: uploadResult.key,
      size: uploadResult.size,
      contentType: uploadResult.contentType
    });
  } catch (error: any) {
    console.error('Error uploading file to Cloudflare R2:', error);
    return sendError(res, 500, error.message || 'Failed to upload image to Cloudflare R2');
  }
});

export default router;
