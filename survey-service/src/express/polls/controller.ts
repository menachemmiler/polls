import { Response } from 'express';
import { TypedRequest } from '../../utils/zod';
import { PollsManager } from './manager';
import { addQuestionRequestSchema, addSectionRequestSchema, copySectionRequestSchema, createOneRequestSchema, deleteOneRequestSchema, deleteQuestionRequestSchema, deleteSectionRequestSchema, getAllByQueryRequestSchema, getAllRequestSchema, getOneByIdRequestSchema, reorderQuestionRequestSchema, reorderSectionsRequestSchema, updateOneRequestSchema, updateSectionRequestSchema } from './validations';


export class PollsController {
    static getAllByQuery = async (req: TypedRequest<typeof getAllByQueryRequestSchema>, res: Response) => {
        res.json(await PollsManager.getAllByIds(req.query.pollIds!));
    };

    static getAll = async (_req: TypedRequest<typeof getAllRequestSchema>, res: Response) => {
        res.json(await PollsManager.getAll());
    };

    static getOneById = async (req: TypedRequest<typeof getOneByIdRequestSchema>, res: Response) => {
        res.json(await PollsManager.getOneById(req.params.id, req.query.popolate));
    };

    static createOne = async (req: TypedRequest<typeof createOneRequestSchema>, res: Response) => {
        res.json(await PollsManager.createOne(req.body));
    };

    static updateOne = async (req: TypedRequest<typeof updateOneRequestSchema>, res: Response) => {
        res.json(await PollsManager.updateOne(req.params.id, req.body));
    };

    static updateSections = async (req: TypedRequest<typeof updateSectionRequestSchema>, res: Response) => {
        res.json(await PollsManager.updateSections(req.params.id, req.params.sectionId, req.body));
    };

    static deleteOne = async (req: TypedRequest<typeof deleteOneRequestSchema>, res: Response) => {
        res.json(await PollsManager.deleteOne(req.params.id));
    };

    static updateAddQuestion = async (req: TypedRequest<typeof addQuestionRequestSchema>, res: Response) => {
        res.json(await PollsManager.updateAddQuestion(req.body));
    };
    static reorderQuestion = async (req: TypedRequest<typeof reorderQuestionRequestSchema>, res: Response) => {
        res.json(await PollsManager.reorderQuestion(req.params.pollId, req.query));
    };

    static reorderSection = async (req: TypedRequest<typeof reorderSectionsRequestSchema>, res: Response) => {
        res.json(await PollsManager.reorderSections(req.params.pollId, req.query));
    };

    static copySection = async (req: TypedRequest<typeof copySectionRequestSchema>, res: Response) =>{
    res.json(await PollsManager.copySection(req.params.pollId, req.params.sectionId));
};

    static deleteQuestion = async (req: TypedRequest<typeof deleteQuestionRequestSchema>, res: Response) => {
        res.json(await PollsManager.deleteQuestion(req.body));
    };

    static addSection = async (req: TypedRequest<typeof addSectionRequestSchema>, res: Response) => {
        res.json(await PollsManager.addSection(req.params.pollId));
    };
    static deleteSection = async (req: TypedRequest<typeof deleteSectionRequestSchema>, res: Response) => {
        res.json(await PollsManager.deleteSection(req.params.pollId, req.params.sectionId));
    };

}
