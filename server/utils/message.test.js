const expect = require('expect');

var {generateMessage} = require('./message');

describe('generateMessage()', () => {
  it('should generate correct message object', () => {
    // var from = 'Jen';
    // var text = 'abc123';
    // var message = generateMessage(from, text);

    var response = generateMessage('Admin', 'text');

    expect(response.from).toBe('Admin');
    expect(response.text).toBe('text');
    expect(response.createdAt).toBeA('number');
  });
});
