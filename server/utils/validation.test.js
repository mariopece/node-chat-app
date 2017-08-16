const expect = require('expect');

const {isRealString} = require('./validation')

describe('isRealString()', () => {
  it('should reject non-string values like numbers or object', () => {
    var number = 1
    var output = isRealString(number);

    expect(output).toBe(false);
  });

  it('should reject string with only spaces', () => {
    var space = "   "
    var output = isRealString(space);

    expect(output).toBe(false);
  });

  it('should allow string with non-space characters', () => {
    var text = "  test   "
    var output = isRealString(text);

    expect(output).toBe(true);
  });
});
