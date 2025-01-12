const request = require("supertest");
const app = require("../index"); 

describe("Operaciones CRUD de cafes", () => {
  it('debería devolver un código de estado 200 y un arreglo con al menos un objeto en GET /cafes', async () => {
    const response = await request(app).get('/cafes');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
  });

  it('debería devolver un código de estado 404 al intentar eliminar un café con un id que no existe', async () => {
    const nonExistentId = 999; 
    const response = await request(app) 
       .delete(`/cafes/${nonExistentId}`)
       .set('Authorization', 'Bearer token');
    expect(response.status).toBe(404);
     // Realiza una nueva solicitud GET para obtener los cafés restantes
    const getResponse = await request(app)
        .get('/cafes')
        .set('Authorization', 'Bearer token');
    const cafesRestantes = getResponse.body;
    const ids = cafesRestantes.map(c => c.id);
    expect(ids).not.toContain(nonExistentId);
 });
  it('debería agregar un nuevo café y devolver un código de estado 201 en POST /cafes', async () => {
    const nuevoCafe = { id: 5, nombre: 'Café Mocha' }; 
    const response = await request(app)
      .post('/cafes')
      .send(nuevoCafe)
      .set('Content-Type', 'application/json');
    expect(response.status).toBe(201);
    expect(response.body).toContainEqual(nuevoCafe);
  });

  it('debería devolver un código de estado 400 si el id del parámetro es diferente al id del payload en PUT /cafes/:id', async () => {
    const cafeActualizado = { id: 6, nombre: 'Café Latte' }; 
    const response = await request(app)
      .put('/cafes/5') 
      .send(cafeActualizado)
      .set('Content-Type', 'application/json');
    expect(response.status).toBe(400);
    expect(response.body.message).toBe('El id del parámetro no coincide con el id del café recibido');
  });
});
