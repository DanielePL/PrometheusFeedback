const request = require('supertest');
const app = require('../server');

describe('API Health Check', () => {
  test('GET /api/health should return success', async () => {
    const response = await request(app)
      .get('/api/health')
      .expect(200);

    expect(response.body.success).toBe(true);
    expect(response.body.data.status).toBe('ok');
  });
});

describe('Questions API', () => {
  test('GET /api/questions should return questions', async () => {
    const response = await request(app)
      .get('/api/questions')
      .expect(200);

    expect(response.body.success).toBe(true);
    expect(Array.isArray(response.body.data)).toBe(true);
  });
});

describe('Feedback API', () => {
  let sessionId;

  test('POST /api/feedback/session should create session', async () => {
    const response = await request(app)
      .post('/api/feedback/session')
      .send({})
      .expect(201);

    expect(response.body.success).toBe(true);
    expect(response.body.data.sessionId).toBeDefined();
    sessionId = response.body.data.sessionId;
  });

  test('POST /api/feedback/response should accept valid response', async () => {
    // First get a question
    const questionsResponse = await request(app)
      .get('/api/questions')
      .expect(200);

    const questions = questionsResponse.body.data;
    if (questions.length === 0) {
      console.log('No questions available for testing');
      return;
    }

    const question = questions[0];

    const response = await request(app)
      .post('/api/feedback/response')
      .send({
        sessionId: sessionId,
        questionId: question.id,
        rating: 4,
        response: 'Test response'
      })
      .expect(201);

    expect(response.body.success).toBe(true);
  });
});
