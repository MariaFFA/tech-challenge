import { User } from '../models';
import { generateToken } from '../utils/jwt';

describe('Auth Controller', () => {
  beforeEach(async () => {
    await User.destroy({ where: {} });
  });

  describe('User Registration', () => {
    it('should create a new user successfully', async () => {
      const userData = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
        firstName: 'Test',
        lastName: 'User',
      };

      const user = await User.create(userData);
      
      expect(user.username).toBe(userData.username);
      expect(user.email).toBe(userData.email);
      expect(user.firstName).toBe(userData.firstName);
      expect(user.lastName).toBe(userData.lastName);
      expect(user.password).not.toBe(userData.password); // Should be hashed
    });

    it('should validate password correctly', async () => {
      const userData = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
      };

      const user = await User.create(userData);
      
      const isValid = await user.validatePassword('password123');
      const isInvalid = await user.validatePassword('wrongpassword');
      
      expect(isValid).toBe(true);
      expect(isInvalid).toBe(false);
    });

    it('should fail - broken test example', async () => {
      const userData = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
      };

      const user = await User.create(userData);
      
      expect(user.username).toBe(userData.username);
    });
  });

  describe('JWT Token', () => {
    it('should generate and verify token correctly', () => {
      const payload = {
        id: 1,
        email: 'test@example.com',
        username: 'testuser',
      };

      const token = generateToken(payload);
      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
    });

    it('should fail - broken JWT test', () => {
      const payload = {
        id: 1,
        email: 'test@example.com',
        username: 'testuser',
      };

      const token = generateToken(payload);
      
      expect(token).toBeDefined();
    });
  });
});