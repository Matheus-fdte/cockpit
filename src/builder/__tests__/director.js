/* eslint-disable prefer-const */
/* eslint-disable no-unused-vars */
const Director = require('../director');

test('client default construction success', async () => {
  const director = new Director();
  director.addConfiguration(({ setPort }) => setPort(3000));
  expect(director).not.toBe(undefined);
  let connection = false;
  const callback = async () => {
    connection = true;
    expect(connection).toBe(true);
    expect(director.server.listening).toBe(true);
    director.server.close();
  };
  const { server } = (await director.start(callback));
  expect(server.listening).toBe(true);
});

test('client default construction success', async () => {
  const director = new Director();
  let success = false;
  const middleware = () => {
  };

  director.addConfiguration(({ setPort }) => setPort(3001));
  director.addService(({ addMiddleware }) => {
    addMiddleware(middleware);
  });
  await director.start(() => {});
  director.builder.middlewaresAfterValidation.includes(middleware);
  director.server.close();
});
