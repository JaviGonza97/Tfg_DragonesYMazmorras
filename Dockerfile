# ---- ETAPA DE BUILD ----
FROM maven:3.9-eclipse-temurin-21 AS build
WORKDIR /app

# Copiamos pom + mvnw para caché de dependencias
COPY pom.xml mvnw ./
COPY .mvn .mvn

RUN chmod +x mvnw && ./mvnw -B dependency:resolve

# Ahora el código y empaquetamos
COPY src src
RUN ./mvnw -B clean package -DskipTests

# ---- ETAPA DE RUNTIME ----
FROM eclipse-temurin:21-jre-jammy
WORKDIR /app

COPY --from=build /app/target/*.jar app.jar

EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
