import mongoose, { Schema } from 'mongoose';
import { config } from '../../config';
import { PollDocument, PollSectionDocument } from './interface';


const PollSectionSchema = new mongoose.Schema<PollSectionDocument>(
  {
    title: { type: String },
    description: { type: String },
    questions: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'questions',
      default: [],
    }],
  },
  {
    timestamps: false,
    versionKey: false,
  }
);


const defaultSection = () => [{
  questions: []
}];


const PollSchema = new Schema<PollDocument>(
  {
    name: { type: String, default: "Untitled From" },
    title: { type: String, default: "Untitled From" },
    description: { type: String },
    isAnonymous: { type: Boolean },
    createdBy: { type: String, required: true },
    startAt: { type: Date },
    endAt: { type: Date },
    sections: {
      type: [PollSectionSchema],
      default: defaultSection,
    },
    design: {
      type: {
        header: {
          fontSize: { type: Number },
          fontFamily: { type: String },
        },
        questions: {
          fontSize: { type: Number },
          fontFamily: { type: String },
        },
        text: {
          fontSize: { type: Number },
          fontFamily: { type: String },
        },
        color: { type: String },
        backgroundColor: { type: String },
      },
      default: () => ({
        header: {
          fontSize: 20,
          fontFamily: "Arial",
        },
        questions: {
          fontSize: 18,
          fontFamily: "Arial",
        },
        text: {
          fontSize: 14,
          fontFamily: "Arial",
        },
        color: "#9333ea",
        backgroundColor: "#f0ebf7",
      }),
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);


export const PollModel = mongoose.model<PollDocument>(config.mongo.pollsCollectionName, PollSchema);
