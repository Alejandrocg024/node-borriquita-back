import request, { Response } from 'supertest';
import { testServer } from '../../test-server';
import { EventModel, MongoDatabase, PaysModel, UserModel } from '../../../src/data';
import { envs, JwtAdapter } from '../../../src/config';
import mongoose from 'mongoose';

interface Pay {
    user: string;
    concept: string;
    quantity: number;
    startDate: Date;
    finishDate: Date;
    state: string;
    paymentDate?: Date;
    userPayer?: string;
}

let testUser1: any;
let testPay1: Pay;
let testPay2: Pay;
let token: any;

describe('Prueba sobre la API de pagos', () => {

    beforeAll(async () => {
        await testServer.start();
        await MongoDatabase.connect({
            mongoUrl: envs.MONGO_URL,
            dbName: envs.MONGO_DB_NAME,
        });
        await mongoose.connection.db?.dropDatabase();

        testUser1 = await UserModel.create({
            dni: "87654321B",
            name: "Jane",
            lastname: "Smith",
            password: "securePass456",
            birthDate: new Date("1985-08-20"),
            email: "jane.smith@example.com",
            emailValidated: false,
            admissionDate: new Date(),
            role: "ADMIN_ROLE"
        });

        testPay1 = {
            user: testUser1.id,
            concept: "Pago 1",
            quantity: 100,
            startDate: new Date("2024-04-01T09:00:00.000Z"),
            finishDate: new Date("2024-04-01T17:00:00.000Z"),
            state: "PENDING"
        };

        testPay2 = {
            user: testUser1.id,
            concept: "Pago 2",
            quantity: 120,
            startDate: new Date("2024-06-01T09:00:00.000Z"),
            finishDate: new Date("2024-06-01T17:00:00.000Z"),
            state: "PAID",
            paymentDate: new Date()
        };

        token = await JwtAdapter.generateToken({ id: testUser1.id }, '10m');
    });

    beforeEach(async () => {
        await PaysModel.deleteMany();
    });

    afterAll(async () => {
        await PaysModel.deleteMany();
        await UserModel.deleteMany();

        testServer.close();
        await MongoDatabase.disconnect();
    });

    test('GET /api/pay', async () => {
        // Arrange  
        await PaysModel.create(testPay1);
        await PaysModel.create(testPay2);

        // Act
        const { body } = await request(testServer.app)
            .get('/api/pay')
            .expect(200);

        // Assert
        expect(body).toBeInstanceOf(Object);
        expect(body.pays).toBeInstanceOf(Array);
        expect(body.pays.length).toBe(2);

        expect(body.pays[0]).toBeInstanceOf(Object);
        expect(body.pays[0].concept).toBe(testPay1.concept);
        expect(body.pays[0].payMethod).toBeUndefined();

        expect(body.pays[1]).toBeInstanceOf(Object);
        expect(body.pays[1].concept).toBe(testPay2.concept);
    });

    test('GET /api/pay/:id', async () => {
        // Arrange
        const pay = await PaysModel.create(testPay1);

        // Act
        const { body } = await request(testServer.app)
            .get(`/api/pay/${pay.id}`)
            .expect(200);

        // Assert
        expect(body).toEqual(expect.objectContaining({
            concept: testPay1.concept,
            quantity: testPay1.quantity,
            startDate: testPay1.startDate.toISOString(),
            finishDate: testPay1.finishDate.toISOString(),
            state: testPay1.state
        }));
    });

    test('GET-404 /api/pay/:id', async () => {
        // Arrange
        const payId = new mongoose.Types.ObjectId();

        // Act
        const { body } = await request(testServer.app)
            .get(`/api/pay/${payId}`)
            .expect(404);

        // Assert
        expect(body).toEqual({ error: `Pago no encontrado` });
    });

    test('POST /api/pay', async () => {
        // Arrange
        testPay1 = {
            userPayer: testUser1.id,
            ...testPay1
        }
        // Act
        const { body } = await request(testServer.app)
            .post('/api/pay')
            .set('Authorization', `Bearer ${token}`)
            .send(testPay1)
            .expect(201);


        // Assert
        expect(body).toEqual(expect.objectContaining({
            concept: testPay1.concept,
            quantity: testPay1.quantity,
            startDate: testPay1.startDate.toISOString(),
            finishDate: testPay1.finishDate.toISOString(),
            state: testPay1.state
        }));
    });

    test('DELETE /api/pay/:id', async () => {
        // Arrange
        const pay = await PaysModel.create(testPay1);

        // Act
        await request(testServer.app)
            .delete(`/api/pay/${pay.id}`)
            .set('Authorization', `Bearer ${token}`)
            .expect(200);

        // Assert
    });

    test('DELETE-404 /api/pay/:id', async () => {
        // Arrange
        const payId = new mongoose.Types.ObjectId();

        // Act
        const { body } = await request(testServer.app)
            .delete(`/api/pay/${payId}`)
            .set('Authorization', `Bearer ${token}`)
            .expect(404);

        // Assert
            expect(body).toEqual({ error: `Pago no encontrado` });
    });
});