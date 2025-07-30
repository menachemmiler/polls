import mongoose from 'mongoose';
import { config } from '../../config/index';
import { IAnswerDocument, IResponseDocument } from './interface';
import { QuestionType } from '../../enums/questionType';

const AnswerSchema = new mongoose.Schema<IAnswerDocument>(
    {
        questionId: {
            type: String,
            required: true,
        },
        questionType: {
            type: String,
            enum: Object.values(QuestionType),
            required: true,
        },
        answer: {
            type: [String],
            required: true,
        },
    },
    { _id: false },
);

const ResponseSchema = new mongoose.Schema<IResponseDocument>(
    {
        respondentId: {
            type: String,
            required: true,
        },
        // @ts-expect-error mongoose cannot convert Object id to string
        pollId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'Poll',
        },
        answers: {
            type: [AnswerSchema],
            required: false,
        },
        submittedAt: {
            type: Date,
            default: Date.now,
        },
    },
    {
        versionKey: false,
        timestamps: true,
    },
);
ResponseSchema.index({ respondentId: 1, pollId: 1 }, { unique: true });

export const ResponseModel = mongoose.model<IResponseDocument>(config.mongo.responsesCollectionName, ResponseSchema);
