import { Request, Response, NextFunction } from 'express';
import { PermissionsService } from '../../../express/permissions/service';
import { PermissionType } from '../../../express/permissions/interface';

export function checkPermission(required: PermissionType) {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const pollId = req.params.pollId || req.body.pollId || req.body._id;

            const genesisId = req.user?.genesisId;

            if (!pollId || !genesisId) {
                return res.status(400).json({ error: 'Missing pollId or userId' });
            }

            const allowed = await PermissionsService.getPollUserPermission(pollId, genesisId, required);

            if (!allowed) {
                return res.status(403).json({ error: 'Permission denied' });
            }

            return next();
        } catch (err) {
            return next(err);
        }
    };
}
