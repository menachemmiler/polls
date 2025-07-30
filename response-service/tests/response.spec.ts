import { Express } from 'express';
import mongoose from 'mongoose';
import request from 'supertest';
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { config } from '../src/config/index';
import { IResponse } from '../src/express/response/interface';
import { QuestionType } from '../src/enums/questionType';
import { Server } from '../src/express/server';

const { mongo } = config;
const fakeObjectId = '111111111111111111111111';

const removeAllCollections = async () => {
    const collections = Object.keys(mongoose.connection.collections);
    for (const name of collections) {
        const collection = mongoose.connection.collections[name];
        await collection.deleteMany({});
    }
};

const createExampleResponse = (): IResponse => ({
    respondentId: new mongoose.Types.ObjectId().toString(),
    pollId: new mongoose.Types.ObjectId().toString(),
    answers: [
        {
            questionId: 'questionId',
            questionType: QuestionType.DROPDOWN,
            answer: ['answer'],
        },
    ],
});

describe('e2e response api testing', () => {
    let app: Express;

    beforeAll(async () => {
        await mongoose.connect(mongo.uri);
        app = Server.createExpressApp();
    });

    afterAll(async () => {
        await mongoose.disconnect();
    });

    beforeEach(async () => {
        await removeAllCollections();
    });

    describe('/isAlive', () => {
        it('should return alive', async () => {
            const response = await request(app).get('/isAlive').expect(200);
            expect(response.text).toBe('alive');
        });
    });

    describe('/unknownRoute', () => {
        it('should return status code 404', async () => {
            await request(app).get('/unknownRoute').expect(404);
        });
    });

    describe('/api/response', () => {
        describe('GET /api/response', () => {
            it('should get all the responses', async () => {
                const responses: IResponse[] = [];

                for (let i = 0; i < 3; i++) {
                    const { body } = await request(app).post('/api/response').send(createExampleResponse()).expect(200);
                    responses.push(body);
                }

                const { body } = await request(app).get('/api/response').expect(200);
                expect(body).toEqual(expect.arrayContaining(responses));
                expect(body.length).toBe(3);
            });

            it('should get response with pagination', async () => {
                const responses: IResponse[] = [];

                for (let i = 0; i < 15; i++) {
                    const { body } = await request(app).post('/api/response').send(createExampleResponse()).expect(200);
                    responses.push(body);
                }

                const [{ body: body1 }, { body: body2 }, { body: body3 }] = await Promise.all([
                    request(app).get('/api/response').query({ limit: 5, step: 0 }).expect(200),
                    request(app).get('/api/response').query({ limit: 5, step: 1 }).expect(200),
                    request(app).get('/api/response').query({ limit: 5, step: 2 }).expect(200),
                ]);

                expect(body1.length).toBe(5);
                expect(body2.length).toBe(5);
                expect(body3.length).toBe(5);
            });

            it('should get an empty array', async () => {
                const { body } = await request(app).get('/api/response').query({ limit: 100 }).expect(200);
                expect(body).toEqual([]);
            });
        });

        describe('POST /api/response', () => {
            it('should create a new response', async () => {
                const payload = createExampleResponse();
                const { body } = await request(app).post('/api/response').send(payload).expect(200);

                expect(body.respondentId).toBe(payload.respondentId);
                expect(body.pollId).toBe(payload.pollId);
                expect(body.answers).toHaveLength(1);
                expect(body.answers![0].questionId).toBe(payload.answers![0].questionId);
                expect(body.answers[0].questionType).toBe(payload.answers![0].questionType);
                expect(body.answers[0].answer).toEqual(payload.answers![0].answer);
            });

            it('should return 400 for missing fields', async () => {
                await request(app).post('/api/response').send({}).expect(400);
            });
        });

        describe('PUT /api/response/:id', () => {
            it('should update respondentId of a response', async () => {
                const { body: created } = await request(app).post('/api/response').send(createExampleResponse()).expect(200);

                const updatedRespondentId = 'updated-id';

                const { body: updated } = await request(app)
                    .put(`/api/response/${created._id}`)
                    .send({ respondentId: updatedRespondentId })
                    .expect(200);

                expect(updated.respondentId).toBe(updatedRespondentId);
            });

            it('should return 404 for non-existing response', async () => {
                await request(app).put(`/api/response/${fakeObjectId}`).send(createExampleResponse()).expect(404);
            });
        });

        describe('DELETE /api/response/:id', () => {
            it('should delete a response', async () => {
                const { body: created } = await request(app).post('/api/response').send(createExampleResponse()).expect(200);

                await request(app).delete(`/api/response/${created._id}`).expect(200);
            });

            it('should return 404 for non-existing response', async () => {
                await request(app).delete(`/api/response/${fakeObjectId}`).expect(404);
            });
        });
    });
});
