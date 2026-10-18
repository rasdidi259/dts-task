/**
 * author       : Applicant
 * date         : 30/03/2026
 * decription   : Unit tests for task model validation using Jest. Tests include:
 *               - Title length validation (must be at least 5 characters)
 *               - Status validation (must be one of 'pending', 'in_progress', 'completed')
 *               - Valid task scenario (should pass without errors) 
 */

const { validate } = require('../../model/task'); // adjust path

describe('validateTask', () => {
  it('should return error if title is less than 5 characters', () => {
    const task = { title: '1234' };
    const result = validate(task);
    expect(result.error.details[0].message).toContain('length must be at least 5 characters');
  });

  it('should return error if status is invalid', () => {
    const task = { title: 'Valid Title', status: 'wrong-status' };
    const result = validate(task);
    expect(result.error.details[0].message).toContain('must be one of [pending, in_progress, completed]');
  });

  it('should return no error for a valid task', () => {
    const task = { title: 'Finish Homework', status: 'pending' };
    const result = validate(task);
    expect(result.value).toEqual(task);
  });
});
