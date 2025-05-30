# ---- ETAPA DE BUILD ----
FROM maven:3.9-eclipse-temurin-21 AS build
WORKDIR /app

# Copiamos sólo pom.xml para cachear dependencias
COPY pom.xml .
# Resolvemos dependencias (sin compilar aún tu código)
RUN mvn dependency:go-offline -B

# Copiamos el resto y empaquetamos
COPY src ./src
RUN mvn clean package -DskipTests -B

# ---- ETAPA DE RUNTIME ----
FROM eclipse-temurin:21-jre-jammy
WORKDIR /app

# Copiamos el JAR generado
COPY --from=build /app/target/DungeonsYDragonsV1-0.0.1-SNAPSHOT.jar app.jar

# Exponemos el puerto que Spring boot lee de $PORT o usa 8080 por defecto
EXPOSE 8080

ENTRYPOINT ["java","-jar","app.jar"]
