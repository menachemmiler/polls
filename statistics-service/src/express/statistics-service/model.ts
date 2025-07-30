import mongoose from "mongoose";
import { config } from "../../config/index";
import { QuestionType, IStatisticsDocument } from "./interface";

const optionAnswerCountSchema = new mongoose.Schema(
  {
    _id: { type: String, required: false }, 
    option: { type: String, required: true },
    count: { type: Number, default: 0 },
  },
  { _id: true } 
);

const questionStatSchema = new mongoose.Schema(
  {
    questionId: { type: String, required: true },
    questionType: {
      type: String,
      enum: Object.values(QuestionType),
    },
    totalAnswers: { type: Number, default: 0 },
    optionAnswerCounts: [optionAnswerCountSchema],
  },
  { _id: false } 
);

const statisticsSchema = new mongoose.Schema<IStatisticsDocument>(
  {
    pollId: { type: String, required: true, unique: true },
    questionStats: [questionStatSchema],
  },
  { timestamps: true }
);

export const StatisticsModel = mongoose.model<IStatisticsDocument>(
  config.mongo.statisticsCollectionName,
  statisticsSchema
);
