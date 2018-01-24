var env = process.env.NODE_ENV || "development";

if (env === "development") {
  process.env.MONGODB_URI = "mongodb://localhost:27017/TodoApp"
  process.env.PORT = 3333;
} else if (env === "test") {
  process.env.MONGODB_URI = "mongodb://localhost:27017/TestTodoApp"
  process.env.PORT = 3334;
}

