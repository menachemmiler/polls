import { DocumentNotFoundError } from '../../utils/errors.js';
import { Question, QuestionDocument, QuestionType } from './interface.js';
import { QuestionsModel } from './model.js';

export class QuestionsManager {
    static getAll = async (): Promise<QuestionDocument[]> => {
        return QuestionsModel.find({}).lean();
    };

    static getByIds = async (ids: string[]): Promise<QuestionDocument[]> => {
        return QuestionsModel.find({ _id: { $in: ids } }).lean();
    };

    static createOne = async (question: Question): Promise<QuestionDocument> => {
        if (question.type === QuestionType.MULTIPLE_CHOICE || question.type === QuestionType.CHECKBOXES || question.type === QuestionType.DROPDOWN) {
            if (!question.options || question.options.length === 0) {
                throw new Error('Options are required for multiple choice questions');
            }
        }
        return QuestionsModel.create(question);
    };
    static updateOne = async (questionId: string, update: Partial<Question>): Promise<QuestionDocument> => {
        const updatePayload: any = { $set: update };
        const unsetFields: any = {};

        if (update.type) {
            const typesWithOptions = [QuestionType.MULTIPLE_CHOICE, QuestionType.CHECKBOXES, QuestionType.DROPDOWN];
            const typesWithScale = [QuestionType.LINEAR_SCALE];

            if (!typesWithOptions.includes(update.type)) {
                unsetFields.options = '';
            }

            if (!typesWithScale.includes(update.type)) {
                unsetFields.scale = '';
            }
        }

        if (Object.keys(unsetFields).length > 0) {
            updatePayload.$unset = unsetFields;
        }

        return QuestionsModel.findByIdAndUpdate(questionId, updatePayload, { new: true }).orFail(new DocumentNotFoundError(questionId)).lean().exec();
    };

    static deleteOne = async (questionId: string): Promise<QuestionDocument> => {
        return QuestionsModel.findByIdAndDelete(questionId).orFail(new DocumentNotFoundError(questionId)).lean().exec();
    };

    static deleteManyByIds = async (questionsIds: string[]) => {
        return QuestionsModel.deleteMany({ _id: { $in: questionsIds } })
            .lean()
            .exec();
    };
}
