const userValidation = require('../user-validation');

test('ActorData must throw 401 state not found',async () => {
    const ctx = {
        throw: (status,message) => {
            ctx.status = status;
            ctx.message = message;
        }
    };
    let next_sucess = false;
    const next = async () => {
        expect(ctx.status).toBe(401);
        expect(ctx.message).toBe('State not found');
        next_sucess = true;
    }
    await userValidation(ctx,next);
    expect(next_sucess).toBe(true);
});

test('ActorData must throw 401 user data not found',async () => {
    const ctx = {
        state: {},
        throw: (status,message) => {
            ctx.status = status;
            ctx.message = message;
        }
    };
    let next_sucess = false;
    const next = async () => {
        expect(ctx.status).toBe(401);
        expect(ctx.message).toBe('User data not found');
        next_sucess = true;
    }
    await userValidation(ctx,next);
    expect(next_sucess).toBe(true);
});

test('ActorData must throw 401 user actor_id not found',async () => {
    const ctx = {
        state: { user: {}},
        throw: (status,message) => {
            ctx.status = status;
            ctx.message = message;
        }
    };
    let next_sucess = false;
    const next = async () => {
        expect(ctx.status).toBe(401);
        expect(ctx.message).toBe('Actor id not found');
        next_sucess = true;
    }
    await userValidation(ctx,next);
    expect(next_sucess).toBe(true);
});

test('ActorData must throw 401 user claims not found',async () => {
    const ctx = {
        state: { user: { actor_id: 'test_user' }},
        throw: (status,message) => {
            ctx.status = status;
            ctx.message = message;
        }
    };
    let next_sucess = false;
    const next = async () => {
        expect(ctx.status).toBe(401);
        expect(ctx.message).toBe('Invalid claims');
        next_sucess = true;
    }
    await userValidation(ctx,next);
    expect(next_sucess).toBe(true);
});

test('ActorData found',async () => {
    const ctx = {
        state: { user: { 
            actor_id: 'test_user',
            claims: ['test']
         }},
        throw: (status,message) => {
            ctx.status = status;
            ctx.message = message;
        }
    };
    let next_sucess = false;
    const next = async () => {
        expect(ctx.status).toBe(undefined);
        expect(ctx.message).toBe(undefined);
        expect(ctx.state.actor_data.actor_id).toBe('test_user');
        expect(ctx.state.actor_data.claims).toStrictEqual(['test']);
        next_sucess = true;
    }
    await userValidation(ctx,next);
    expect(next_sucess).toBe(true);
});