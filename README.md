# 🛍️ Tienda Online API

---

## 🚀 ¿Cómo entrar y probar la API en producción?

Para hacerte la vida más fácil y que no tengas que configurar herramientas externas como Postman, hemos implementado y desplegado la documentación interactiva directamente en la nube. 

Puedes interactuar con los endpoints, ver la estructura de los datos y poblar la base de datos siguiendo este enlace:

🔗 **[Ver Documentación Interactiva en Swagger](https://tienda-online-8uhy.onrender.com/api)**

### 🛠️ Pasos rápidos para probar un Endpoint desde el navegador:
1. Entra al enlace de arriba de **Swagger**.
2. Selecciona cualquier ruta (por ejemplo, `POST /clientes` o `GET /orden-producto`).
3. Haz clic en el botón **`Try it out`** (Pruébalo) que aparece a la derecha.
4. Si es un `POST`, edita el JSON con los datos que quieras registrar.
5. Presiona el botón azul grande de **`Execute`** (Ejecutar).
6. ¡Listo! Abajo verás la respuesta en tiempo real directo desde nuestra base de datos en la nube.

*Nota: Si necesitas la ruta base limpia de la API para conectarla con una aplicación frontend o móvil, la URL principal es: `https://tienda-online-8uhy.onrender.com`*

---

## 📦 Arquitectura del Proyecto (Despliegue con Docker)

El proyecto incluye archivos de configuración clave para su distribución:
*   **`Dockerfile`**: Configura una construcción multi-etapa (*multi-stage build*) optimizada para producción, encargándose de instalar las dependencias, compilar el código de NestJS y levantar el servidor de Node.js en un contenedor aislado.
*   **`Variables de Entorno`**: Toda la configuración sensible (credenciales de la base de datos, host de producción y puertos) está completamente parametrizada para asegurar la portabilidad del contenedor.

---
Hecho con con dedicación por Melina 💻✨
