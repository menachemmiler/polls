import mongoose from 'mongoose';
import { config } from '../../config.js';
import { QuestionDocument, QuestionType } from './interface.js';

const OptionSchema = new mongoose.Schema({
    option: {
        type: String,
        required: true,
    },
});

const QuestionSchema = new mongoose.Schema<QuestionDocument>(
    {
        title: {
            type: String,
        },
        description: {
            type: String,
        },
        type: {
            type: String,
            enum: Object.values(QuestionType),
            required: true,
        },
        options: {
            type: [OptionSchema],
            required: false,
        },
        isRequired: {
            type: Boolean,
            default: false,
        },
        scale: {
            type: Number,
        },
        relatedSectionIds: {
            type: [String],
        },
    },
    {
        versionKey: false,
        timestamps: true,
    },
);

export const QuestionsModel = mongoose.model<QuestionDocument>(config.mongo.questionsCollectionName, QuestionSchema);
