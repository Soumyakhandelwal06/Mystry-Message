const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../server");
const User = require("../models/User");

describe("Authentication Endpoints", () => {
  beforeAll(async () => {
    // Connect to test database
    await mongoose.connect(process.env.MONGODB_TEST_URI);
  });

  afterAll(async () => {
    // Clean up and close database connection
    await User.deleteMany({});
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    // Clean up before each test
    await User.deleteMany({});
  });

  describe("POST /api/auth/signup", () => {
    it("should create a new user and send OTP", async () => {
      const userData = {
        email: "test@example.com",
        phone: "+1234567890",
        password: "Test123!",
      };

      const response = await request(app)
        .post("/api/auth/signup")
        .send(userData)
        .expect(201);

      expect(response.body.message).toContain("User created successfully");
      expect(response.body.userId).toBeDefined();

      // Verify user was created in database
      const user = await User.findById(response.body.userId);
      expect(user.email).toBe(userData.email);
      expect(user.isVerified).toBe(false);
    });

    it("should return error for duplicate email", async () => {
      const userData = {
        email: "test@example.com",
        phone: "+1234567890",
        password: "Test123!",
      };

      // Create first user
      await request(app).post("/api/auth/signup").send(userData).expect(201);

      // Try to create duplicate
      const response = await request(app)
        .post("/api/auth/signup")
        .send(userData)
        .expect(400);

      expect(response.body.message).toContain("already exists");
    });
  });

  describe("POST /api/auth/login", () => {
    it("should login with valid credentials", async () => {
      // Create and verify user first
      const user = new User({
        email: "test@example.com",
        phone: "+1234567890",
        password: "Test123!",
        isVerified: true,
      });
      await user.save();

      const response = await request(app)
        .post("/api/auth/login")
        .send({
          email: "test@example.com",
          password: "Test123!",
        })
        .expect(200);

      expect(response.body.message).toBe("Login successful");
      expect(response.body.token).toBeDefined();
      expect(response.body.user.email).toBe("test@example.com");
    });

    it("should return error for invalid credentials", async () => {
      const response = await request(app)
        .post("/api/auth/login")
        .send({
          email: "test@example.com",
          password: "wrongpassword",
        })
        .expect(400);

      expect(response.body.message).toBe("Invalid credentials");
    });
  });
});
