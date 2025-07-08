````markdown
# Spelling Bee

Aplicación web para practicar ortografía en inglés (niveles A2 y B1), con ejemplos de uso y definiciones.

---

## 📋 Tabla de contenidos

- [Descripción](#descripción)  
- [Características](#características)  
- [Tecnologías](#tecnologías)  
- [Prerequisitos](#prerequisitos)  
- [Instalación](#instalación)  
  - [Backend](#backend)  
  - [Frontend](#frontend)  
- [Estructura de carpetas](#estructura-de-carpetas)  
- [Uso](#uso)  
- [Contribuir](#contribuir)  
- [Licencia](#licencia)  
- [Contacto](#contacto)  

---

## 📝 Descripción

Spelling Bee es una pequeña aplicación en la que el usuario selecciona un nivel (A2 o B1), obtiene una palabra aleatoria en inglés y puede ver su definición y un ejemplo de uso. Ideal para practicar vocabulario y ortografía de forma dinámica.

---

## ✨ Características

- Selección de nivel de dificultad: **A2** o **B1**.  
- Generación aleatoria de palabras sin repetir durante la sesión.  
- Visualización de definición y ejemplo de uso.  
- Interfaz intuitiva y responsive.  

---

## 🛠 Tecnologías

- **Frontend**: React, Axios  
- **Backend**: Node.js, Express, MySQL  
- **Base de datos**: MySQL (vista `spelling_all`)  
- **CORS**: Para permitir comunicación entre frontend y backend  

---

## ⚙️ Prerequisitos

- **Node.js** v14+  
- **npm** o **yarn**  
- **MySQL** (con las tablas `a2spelling` y `b1spelling` creadas)  

---

## 🚀 Instalación

Clona el repositorio y ponlo en marcha localmente:

```bash
git clone https://github.com/Edwin75206/spelling.git
cd spelling
````

### Backend

1. **Crear la vista en MySQL**
   Antes de arrancar el servidor, importa o ejecuta esta vista para unificar ambas tablas:

   ```sql
   CREATE OR REPLACE VIEW db_spelling.spelling_all AS
   SELECT 'A2' AS level, Num AS id, WORD AS word,
          DEFINITION AS definition, EXAMPLE AS example
     FROM a2spelling
   UNION ALL
   SELECT 'B1' AS level, Num AS id, WORD AS word,
          DEFINITION AS definition, EXAMPLE AS example
     FROM b1spelling;
   ```
2. **Instalar dependencias**

   ```bash
   npm install express mysql2 cors
   ```
3. **Configurar la conexión**
   Edita `index.js` (o `server.js`) y ajusta tus credenciales MySQL si es necesario:

   ```js
   const pool = mysql.createPool({
     host: 'localhost',
     port: 3307,           // o el puerto donde esté tu MySQL
     user: 'root',
     password: 'Pancho123',
     database: 'db_spelling',
     connectionLimit: 10
   });
   ```
4. **Iniciar el servidor**

   ```bash
   node index.js
   ```

   Quedará escuchando en `http://localhost:4000/api`.

### Frontend

1. **Entrar al directorio del cliente**

   ```bash
   cd spelling-bee
   ```
2. **Instalar dependencias**

   ```bash
   npm install
   ```
3. **Configurar la URL base**
   En `src/services/api.js`, asegúrate de que `baseURL` apunte a tu backend:

   ```js
   const API = axios.create({ baseURL: 'http://localhost:4000/api' });
   ```
4. **Iniciar la aplicación**

   ```bash
   npm start
   ```

   Se abrirá en `http://localhost:3000`.

---

## 🗂 Estructura de carpetas

```
spelling/
├── index.js             # Servidor Express + configuración MySQL
├── package.json         # Dependencias backend
├── spelling-bee/        # Cliente React
│   ├── public/
│   └── src/
│       ├── App.jsx
│       ├── index.js
│       ├── index.css
│       ├── services/
│       │   └── api.js
│       └── ...otros estilos e imágenes
└── README.md            # Este documento
```

---

## 🎯 Uso

1. Elige el nivel de práctica: **A2** o **B1**.
2. Pulsa **“Nueva palabra”** para obtener un término aleatorio.
3. Haz clic en **“Ejemplo”** o **“Definición”** para ver más detalles.
4. Vuelve al menú principal con el botón **← Volver**.

---

## 🤝 Contribuir

1. Haz un fork de este repositorio.
2. Crea una rama con tu feature (`git checkout -b feature/nombre`).
3. Realiza tus cambios y haz commit (`git commit -m 'Añade nueva funcionalidad'`).
4. Haz push a tu rama (`git push origin feature/nombre`).
5. Abre un Pull Request describiendo tus cambios.

---

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Consulta el archivo [LICENSE](LICENSE) para más detalles.

---

## 📬 Contacto

Para dudas o sugerencias, abre un [issue](https://github.com/Edwin75206/spelling/issues) o contáctame en mi perfil de GitHub.

```
```
