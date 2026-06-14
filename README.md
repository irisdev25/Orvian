<div align="center">

![Orvian Banner - Productividad Premium](file:///C:/Users/Iris%20Laya/.gemini/antigravity/brain/79f1c91a-3bed-4d80-a34f-04d40c5f9cb9/orvian_banner_1781465065729.png)

# 🌌 ORVIAN
### *Tu Suite de Productividad de Siguiente Generación*

[![Node.js](https://img.shields.io/badge/Node.js-V14+-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-13+-336791?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Express](https://img.shields.io/badge/Express-4.x-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![EJS](https://img.shields.io/badge/Frontend-EJS%20%2B%20JS-B03060?style=for-the-badge&logo=javascript&logoColor=white)]()

---

**Orvian** es una plataforma de gestión personal diseñada para quienes buscan eficiencia sin sacrificar el estilo. Con una estética *premium* basada en glassmorphism y una interfaz intuitiva, Orvian transforma la gestión de tareas en una experiencia visualmente cautivadora.

</div>

## ✨ Características Principales

🚀 **Gestión de Tareas Inteligente**
- CRUD completo con una interfaz fluida.
- Priorización de tareas y estados dinámicos.

📋 **Tablero Kanban Interactivo**
- Organización visual mediante drag-and-drop para mover tareas entre estados.

📊 **Dashboard de Productividad**
- Visualización de progreso diario y semanal con gráficos dinámicos (Chart.js).
- Análisis de categorías para identificar en qué inviertes tu tiempo.

🌗 **Diseño Premium Adaptable**
- Modo oscuro y claro con transiciones suaves.
- Estética moderna con efectos de cristal (glassmorphism).

🔒 **Seguridad de Nivel Profesional**
- Autenticación robusta mediante **JWT** y **Bcrypt**.
- Manejo seguro de sesiones mediante Cookies.

🔔 **Sistema de Notificaciones**
- Alertas en tiempo real sobre vencimientos y actualizaciones de tareas.

---

## 🛠️ Stack Tecnológico

| Área | Tecnologías |
| :--- | :--- |
| **Backend** | ![Node.js](https://img.shields.io/badge/-Node.js-339933?style=flat-square&logo=node.js&logoColor=white) ![Express](https://img.shields.io/badge/-Express-000000?style=flat-square&logo=express&logoColor=white) |
| **Base de Datos** | ![PostgreSQL](https://img.shields.io/badge/-PostgreSQL-336791?style=flat-square&logo=postgresql&logoColor=white) |
| **Frontend** | ![EJS](https://img.shields.io/badge/-EJS-B03060?style=flat-square&logo=ejs&logoColor=white) ![JS](https://img.shields.io/badge/-JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black) ![CSS](https://img.shields.io/badge/-CSS3-1572B6?style=flat-square&logo=css3&logoColor=white) |
| **Gráficos** | ![Chart.js](https://img.shields.io/badge/-Chart.js-FF6384?style=flat-square&logo=chartdotjs&logoColor=white) |

---

## 🚀 Instalación y Configuración

### 1. Clonar y Preparar
```bash
git clone https://github.com/tu-usuario/orvian.git
cd orvian
npm install
```

### 2. Configuración de Base de Datos
Crea una base de datos en PostgreSQL y ejecuta el script de inicialización:
- El archivo SQL se encuentra en: `Backend/database/init.sql`

### 3. Variables de Entorno
Crea un archivo `.env` en la carpeta `Backend/` con los siguientes campos:
```env
PORT=3000
DB_USER=tu_usuario
DB_HOST=localhost
DB_NAME=orvian_db
DB_PASSWORD=tu_contraseña
DB_PORT=5432
JWT_SECRET=tu_secreto_super_seguro
```

### 4. Lanzar Aplicación
```bash
npm run dev
```
La aplicación estará disponible en `http://localhost:3000`.

---

## 🏗️ Arquitectura del Proyecto

El proyecto sigue el patrón **MVC (Modelo-Vista-Controlador)** para garantizar escalabilidad y mantenimiento:

- **/Backend**: Lógica del servidor, modelos de datos y API.
- **/Frontend**: Vistas EJS, estilos globales y lógica de cliente.
- **/public**: Activos estáticos (imágenes, iconos, scripts minificados).

---

## 📄 Licencia

Este proyecto fue desarrollado por **Iris Laya** para uso personal y demostración técnica. Todos los derechos reservados.

---

<div align="center">
Desarrollado con ❤️ por [Iris.dev]
</div>
