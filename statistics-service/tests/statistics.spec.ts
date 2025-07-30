import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import mongoose from 'mongoose';
import request from 'supertest';
import { Express } from 'express';
import { Server } from '../src/express/server';
import { config } from '../src/config';
import { IStatistics, QuestionType } from '../src/express/statistics-service/interface';
import { StatisticsModel } from '../src/express/statistics-service/model';

const { mongo } = config;

let app: Express;

// Helper ליצירת סטטיסטיקה רעננה
function createExampleStatistics(): IStatistics {
    const pollId = new mongoose.Types.ObjectId().toHexString();
    const questionId1 = new mongoose.Types.ObjectId().toHexString();
    const questionId2 = new mongoose.Types.ObjectId().toHexString();
    const optionId1 = new mongoose.Types.ObjectId().toHexString();
    const optionId2 = new mongoose.Types.ObjectId().toHexString();

    return {
        pollId,
        questionStats: [
            {
                questionId: questionId1,
                questionType: QuestionType.MULTIPLE_CHOICE,
                totalAnswers: 0,
                optionAnswerCounts: [
                    { _id: optionId1, option: 'A', count: 0 },
                    { _id: optionId2, option: 'B', count: 0 },
                ],
            },
            {
                questionId: questionId2,
                questionType: QuestionType.PARAGRAPH,
                totalAnswers: 0,
                optionAnswerCounts: [],
            },
        ],
    };
}

describe('e2e statistics api testing', () => {
    beforeAll(async () => {
        await mongoose.connect(mongo.uri);
        app = Server.createExpressApp();
    }, 30000);

    afterAll(async () => {
        await mongoose.disconnect();
    });

    beforeEach(async () => {
        await StatisticsModel.deleteMany({});
    });

    it('should create a statistics document', async () => {
        const stats = createExampleStatistics();
        const res = await request(app).post('/api/statistics').send(stats).expect(200);

        expect(res.body.pollId).toBe(stats.pollId);
        expect(res.body.questionStats).toHaveLength(2);
    });

    it('should update statistics with a submission', async () => {
        const stats = createExampleStatistics();
        await request(app).post('/api/statistics').send(stats).expect(200);

        const sampleSubmission = {
            pollId: stats.pollId,
            answers: [
                {
                    questionId: stats.questionStats[0].questionId,
                    selectedOption: ['A'],
                },
                {
                    questionId: stats.questionStats[1].questionId,
                    selectedOption: ['This is my answer.'],
                },
            ],
        };

        const res = await request(app)
            .put(`/api/statistics/${stats.pollId}/statistics`)
            .send(sampleSubmission)
            .expect(200);

        const updatedQuestion = res.body.questionStats.find((q: any) => q.questionId === stats.questionStats[0].questionId);

        expect(updatedQuestion.totalAnswers).toBe(1);
        expect(updatedQuestion.optionAnswerCounts.find((o: any) => o.option === 'A')?.count).toBe(1);
    });

    it('should update only sent options and keep old ones', async () => {
        const pollId = new mongoose.Types.ObjectId().toHexString();
        const questionId = new mongoose.Types.ObjectId().toHexString();
        const optionId1 = new mongoose.Types.ObjectId().toHexString();
        const optionId2 = new mongoose.Types.ObjectId().toHexString();

        const exampleStatistics: IStatistics = {
            pollId,
            questionStats: [
                {
                    questionId,
                    questionType: QuestionType.MULTIPLE_CHOICE,
                    totalAnswers: 0,
                    optionAnswerCounts: [
                        { _id: optionId1, option: 'Option A', count: 0 },
                        { _id: optionId2, option: 'Option B', count: 0 },
                    ],
                },
            ],
        };

        await request(app).post('/api/statistics').send(exampleStatistics).expect(200);

        const optionId3 = new mongoose.Types.ObjectId().toHexString();
        const updateFormPayload = {
            questionId,
            questionType: QuestionType.CHECKBOXES,
            options: [
                { _id: optionId1, option: 'Option A Updated' },
                { _id: optionId3, option: 'Option C' },
            ],
        };

        const res = await request(app)
            .patch(`/api/statistics/${pollId}/form`)
            .send(updateFormPayload)
            .expect(200);

        const updatedQuestion = res.body.questionStats.find((q: any) => q.questionId === questionId);

        expect(updatedQuestion.optionAnswerCounts).toHaveLength(3);
        expect(updatedQuestion.optionAnswerCounts.find((o: any) => o._id === optionId1)?.option).toBe('Option A Updated');
        expect(updatedQuestion.optionAnswerCounts.find((o: any) => o._id === optionId2)?.option).toBe('Option B');
        expect(updatedQuestion.optionAnswerCounts.find((o: any) => o._id === optionId3)?.option).toBe('Option C');
    });

    it('should get statistics by pollId', async () => {
        const stats = createExampleStatistics();
        await request(app).post('/api/statistics').send(stats).expect(200);

        const res = await request(app).get(`/api/statistics/${stats.pollId}`).expect(200);

        expect(res.body.pollId || res.body[0]?.pollId).toBe(stats.pollId);
    });

    it('should delete a question from statistics', async () => {
        const stats = createExampleStatistics();
        await request(app).post('/api/statistics').send(stats).expect(200);

        const res = await request(app)
            .delete(`/api/statistics/${stats.pollId}/questions/${stats.questionStats[0].questionId}`)
            .expect(200);

        const statsRes = Array.isArray(res.body) ? res.body[0] : res.body;
        expect(statsRes).toBeDefined();
        expect(statsRes.questionStats).toHaveLength(1);
        expect(statsRes.questionStats[0].questionId).toBe(stats.questionStats[1].questionId);
    });

    it('should delete statistics by pollId', async () => {
        const stats = createExampleStatistics();
        await request(app).post('/api/statistics').send(stats).expect(200);
        await request(app).delete(`/api/statistics/${stats.pollId}`).expect(200);
        await request(app).get(`/api/statistics/${stats.pollId}`).expect(404);
    });
});
