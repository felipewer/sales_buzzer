const events = require('events');
const { speak } = require('./speaker');

jest.mock('child_process');

const { spawn } = require('child_process');

describe('speak', () => {
  
  describe('input checking', () => {
    test('arguments are checked', () => {
      try {
        speak();
      } catch (error) {
        expect(error.message).toBe('Missing argument: speech');
      }
      try {
        speak('something');
      } catch (error) {
        expect(error.message).toBe('Missing argument: callback function');
      }
    })
  })

  describe('spawning subprocess', () => {

    let emitter = null;
    
    beforeEach(() => {
      emitter = new events.EventEmitter();
      spawn.mockImplementation(() => emitter);
    })
    
    afterEach(() => {
      spawn.mockClear();
    });
    

    test('spawns subprocess', done => {
      speak('some speech', error => {
        expect(spawn).toBeCalledWith('spd-say', [ 'some speech' ]);
        done();
      });
      emitter.emit('close', 0);
    })
    
    test('an error occurs', done => {
      speak('some speech', error => {
        expect(error.message).toEqual('mock error');
        done();
      });
      emitter.emit('error', new Error('mock error'));
    });
    
    test('closes with error code', done => {
      speak('new speech', error => {
        expect(error.message).toEqual('spd-say exited with code 1');
        done();
      });
      emitter.emit('close', 1);
    });
  })

});