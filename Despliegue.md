# Tfg_Dragones-Mazmorras
Trabajo de fin de curso de Javier González y Daniel González !!
tfg-dragones-y-mazmorras.vercel.app

# Despliegue del Backend de la aplicacion Tfg_DragonesYMazmorras

1. Cambios en el proyecto antes del proceso de despliegue en render
   El despliegue lo realizamos en la plataforma de render cloud ya que es una plataforma de despliegue en la nube con un servicio estable y de buena reputación entre proyectos de tamaño pequeño y medio.

Para el despliegue tuvimos que mudar la base de datos de MySql a PostgreSql ya que PostgrteSql es la base de datos open source con mejor apoyo por estas platgaformas de despliegue gratuito

Para el Pom tuvimos que hacer una adición que fue la dependencia de postgre para poder utilizar:

```
<dependency>
    <groupId>org.postgresql</groupId>
    <artifactId>postgresql</artifactId>
    <scope>runtime</scope>
</dependency>
```

Para el despliegue también se tuvieron que hacer 2 properties, el application.properties de la aplicación en local que es el que soporta H2 (Hibernate), para trabajar en memoria local, y un application-production.properties que es el que va a hacer de enlace con el RenderCloud. Este es, por así decirlo, el perfil que utilizará Render para desplegar la aplicación y no el perfil local que trabaja con Hibernate.

El perfil de application-production.properties tenía el siguiente contenido, que se dividía en unas variables que se agregan en el mismo entorno de Render Cloud (es decir, que parametrizamos el acceso a la base de datos mediante variables de entorno). Estas variables son, por así decirlo, las contraseñas que dan paso a la URL de la base de datos, el username y la contraseña. Están ligadas a Render Cloud como variables:

```
spring.datasource.url=${DATABASE_URL}
spring.datasource.username=${DATABASE_USER}
spring.datasource.password=${DATABASE_PASSWORD}
spring.datasource.driver-class-name=org.postgresql.Driver
```

También establecimos otra variable para el puerto 8080 que utilizamos:

```
server.port=${PORT:8080}
```

Además de eso, dejamos las anotaciones de H2 Console para que éste sepa que en el perfil principal se trabaja con base de datos en memoria de Hibernate, pero en este perfil production están desactivados los Hibernate.

2. Dockerfile
se utilizó para el despliegue un Dockerfile ya que Render no tiene soporte para Java para el despliegue directo:

```
FROM maven:3.9.6-eclipse-temurin-21 as build
WORKDIR /app
COPY . .
RUN mvn clean package -DskipTests

FROM eclipse-temurin:21-jre
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
```

Tuvimos que agregar también un .dockerignore para que no se pisen con el despliegue, como el target, los archivos .git, .gitignore, el README.md y el mismo docker.ignore.

3. Despliegue en Render
3.1. Subida del proyecto a GitHub

Se configuró el repositorio en GitHub como fuente de despliegue automático desde Render.

3.2. Configuración del Web Service en Render
* Tipo de servicio: Web Service (Docker).

* Rama seleccionada: mergePrueba.

3.3. Creación de la base de datos PostgreSQL gestionada por Render
Nombre de la base de datos: dungeonsdragons

* Nombre de usuario: javigonza97

* Contraseña: generada automáticamente por Render.

* Versión PostgreSQL: 16

* Región: Frankfurt (EU Central)

* Datadog Region: EU1 (por requerimiento de Render)

3.4. Configuración de variables de entorno en Render
Se extrajeron los valores de conexión proporcionados por Render. Se transformó el DATABASE_URL a formato JDBC:

```
DATABASE_URL: jdbs:postgresql://dpg-d0sft8adbo4c73feslog-a.frankfurt-postgres.render.com:5432/dungeonsdragons
DATABASE_USER: javigonza97
DATABASE_PASSWORD: (la contraseña que usamos para la base de datos)
SPRING_PROFILES_ACTIVE: production
```

4. Validación del despliegue
Una vez completado el despliegue:

* La aplicación inició correctamente y ninguno de los logs dio errores o avisos.

* Hibernate realizó operaciones sobre la base de datos sin errores.

* Realizamos pruebas en Postman con algunos endpoints con el despliegue ya activo y funcionaron correctamente.

4.1. Proceso de autenticación probado
El primer login con Postman que hicimos fue:

```
POST https://tfg-dragonesymazmorras.onrender.com/auth/login
```

y este nos devolvió correctamente el usuario en formato JSON:

```
{
  "username": "adminUser",
  "password": "AdminPass123"
}
```

Además, obtuvimos el token del JWT para hacer las distintas pruebas de los demás endpoints, el cual teníamos que agregar en el header:

```
Authorization: Bearer <JWT Token>
```

5. Suspensión y gestión de la instancia en Render
   Para detener el servicio y evitar consumo innecesario de recursos:

* Desde el panel de Settings se utilizó la opción Suspend Service.

* Render requiere confirmación mediante la sentencia:

```
sudo suspend web service Tfg_DragonesYMazmorras
```

Posteriormente, para reactivar el servicio, se dispone de la opción Resume Web Service y así volvemos a tener el despliegue activo.

6. Conclusiones
   El proceso de despliegue fue un poco complicado, pero con las adaptaciones que hicimos en el pom.xml y en la creación de dos distintos properties, con la ayuda de la documentación de la página oficial de Render (https://render.com/docs), los conocimientos que adquirimos en despliegues de aplicaciones web y el tutorial de YouTube (https://www.youtube.com/watch?v=g4kQ3ELo49Y), fue muy útil para el despliegue.

También la experiencia que tuvimos con Postman durante el curso y el proyecto que fuimos utilizando en local nos ayudó a hacer las pruebas que nos confirmaron que el despliegue era correcto.

# Despliegue del Frontend de la aplicacion Tfg_DragonesYMazmorras

# TFG - Dragones y Mazmorras - Frontend

Este es el **frontend** del TFG “Dragones y Mazmorras”, una app para crear, editar y gestionar personajes de D&D.

- **Frontend:** HTML, CSS y JS (Bootstrap).  
- **Desplegado en:** [https://tfg-dragones-y-mazmorras.vercel.app](https://tfg-dragones-y-mazmorras.vercel.app)  
- **Backend:** Spring Boot, desplegado en Render.

---

## 🚀 Deploy en Vercel

El frontend está desplegado como proyecto estático en Vercel.  
**¡No hace falta configuración especial!**

### Pasos seguidos:

1. **Código subido a GitHub.**
2. **Nuevo proyecto en [Vercel](https://vercel.com/):**
   - Importa el repo desde GitHub.
   - Selecciona framework `Other` o `Static`.
   - Vercel detecta el `index.html` y lo publica como estático.
3. **La web se sirve en:**  
tfg-dragones-y-mazmorras.vercel.app
4. **No se requieren variables de entorno**, la URL del backend se gestiona en el JS.

---

## 🌐 Configuración de backend

En `/js/config.js` la URL del backend se selecciona automáticamente:

```js
export const API_BASE_URL =
  location.hostname === "localhost"
    ? "http://192.168.1.17:8080"
    : "https://tfg-dragonesymazmorras.onrender.com";

    Desarrollo local: usa el backend local.

Producción (Vercel): usa el backend de Render.

Autenticación
Autenticación vía JWT.

El token se guarda en localStorage y se incluye en cada petición protegida.

Logout limpia el token y redirige a login.

Código relevante
/js/api.js: Gestión de peticiones a la API.

/js/auth.js: Login, logout, y protección de páginas.

/js/config.js: Selección dinámica de backend.

Consideraciones
El backend debe permitir CORS desde el dominio de Vercel.

Todo el frontend funciona sobre HTTPS.

Si despliegas cambios, Vercel actualiza automáticamente tu web.

Prueba online
Accede directamente aquí:
tfg-dragones-y-mazmorras.vercel.app
