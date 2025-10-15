# Backend Dockerfile
FROM maven:3.9-openjdk-17 AS build

WORKDIR /app
COPY pom.xml ./
COPY mvnw ./
COPY mvnw.cmd ./
COPY .mvn .mvn/

# Download dependencies
RUN mvn dependency:go-offline -B

# Copy source code and build
COPY src ./src
RUN mvn clean package -DskipTests

# Runtime stage
FROM openjdk:17-jdk-slim

WORKDIR /app

# Copy the built jar
COPY --from=build /app/target/*.jar app.jar

# Expose port
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:8080/actuator/health || exit 1

# Run the application
CMD ["java", "-jar", "app.jar"]