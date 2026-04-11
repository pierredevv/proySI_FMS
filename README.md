# 📦 Proyecto Final — SI1 (Sistemas de Información I)

> Sistema de información para la gestión académica, financiera, control de inventarios y seguridad estudiantil de la **Unidad Educativa Fausto Medrano Sandoval "A"**

> [!NOTE]
> Por el momento solo está implementada la **vista del administrador** con el dashboard principal.

---

## 📑 Tabla de Contenidos

- [Instalación](#-instalación)
- [Uso](#-uso)
- [Variables de Entorno](#-variables-de-entorno)
- [Pruebas](#-pruebas)
- [Contribuir](#-contribuir)
- [Licencia](#-licencia)
- [Contacto](#-contacto)

---

## 📥 Instalación

### 1. Clonar el repositorio

```bash
git clone <URL_DEL_REPOSITORIO>
cd <NOMBRE_DEL_PROYECTO>
```

### 2. Instalar dependencias

Puedes usar **npm** o **pnpm** (recomendado por ser más rápido):

```bash
# Opción A — con npm
npm install

# Opción B — con pnpm (instalar pnpm primero si no lo tienes)
npm install -g pnpm
pnpm install
```

---

## 🚀 Uso

Para correr el proyecto en modo desarrollo de forma local:

```bash
npm run dev
# o con pnpm:
pnpm dev
```

Abre tu navegador en `http://localhost:5173` (o el puerto que indique la terminal).

---

## 🌐 Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto con las variables necesarias:

```env
# Ejemplo
VITE_API_URL=http://localhost:3000
```

> Consulta `.env.example` para ver todas las variables requeridas.

---

## 🧪 Pruebas

```bash
npm run test
```

---

## 🤝 Contribuir

1. Haz un fork del repositorio
2. Crea una rama con tu feature: `git checkout -b feature/mi-feature`
3. Realiza tus cambios y haz commit: `git commit -m "feat: descripción"`
4. Sube la rama: `git push origin feature/mi-feature`
5. Abre un **Pull Request**

---

## 📄 Licencia

Este proyecto está bajo la licencia **MIT**. Consulta el archivo `LICENSE` para más detalles.

---

## 📬 Contacto

¿Dudas o sugerencias? Abre un issue o contáctanos directamente a través del repositorio.
