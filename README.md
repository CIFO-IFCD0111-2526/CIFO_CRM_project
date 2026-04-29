# CIFO CRM Project

Proyecto Final CIFO IFCD0111 2025/26 — CRM intern per a la gestió d'alumnat.

> Per al desplegament al PC servidor del centre amb Docker i GitHub Actions, vegeu **[DEPLOYMENT.md](DEPLOYMENT.md)**.

---

## 1. Setup inicial (solo la primera vez)

### Clonar el repositorio

```bash
git clone https://github.com/CIFO-IFCD0111-2526/CIFO_CRM_project.git
cd CIFO_CRM_project
```

### Configurar git (recomendado)

```bash
git config --global pull.rebase true
```

Esto hace que cada `git pull` recoloque tus commits encima de los cambios remotos,
en vez de crear merge commits innecesarios. El historial queda limpio y lineal.

### Instalar dependencias

```bash
cp .env.example .env
npm install
```

### Crear la base de datos

1. Abrir XAMPP y arrancar MySQL
2. No hace falta crear la BD manualmente — el servidor la crea automáticamente al arrancar

### Probar que funciona

```bash
npm run dev
```

Abrir http://localhost:3000 en el navegador. `Ctrl+C` para parar el servidor.

---

## 2. Ver tus tareas

1. Ir a: https://github.com/CIFO-IFCD0111-2526/CIFO_CRM_project/issues
2. Filtrar por tu label de equipo:
   - `front-html` → Equipo maquetación
   - `front-js` → Equipo JavaScript
   - `back-express` → Equipo Express/Sequelize
   - `back-sql` → Equipo SQL/MySQL
3. Empezar por las issues con label `priority`
4. Consultar siempre el **Contrato técnico** (issue #1) antes de empezar

---

## 3. Flujo de trabajo diario

### Al llegar a clase (SIEMPRE)

```bash
# 1. Ir a develop y traer los últimos cambios
git checkout develop
git pull origin develop

# 2. Crear tu rama (solo la primera vez para esa tarea)
git checkout -b feat/nombre-de-tu-tarea

# 2b. Si la rama ya existe, ir a ella y actualizarla
git checkout feat/nombre-de-tu-tarea
git rebase develop
```

### Mientras trabajas

```bash
# Cuando tengas algo que funcione, guardar:
git add src/models/Alumno.js src/models/index.js
git commit -m "feat: modelo Alumno con validaciones"
```

Puedes hacer varios commits al día. Es mejor hacer commits pequeños y frecuentes.

### Formato de commits

```
feat:  nueva funcionalidad    → feat: modelo Alumno con validaciones
fix:   corregir un bug        → fix: email no se validaba correctamente
style: cambios de CSS/formato → style: centrar formulario en la página
ref:   reorganizar código     → ref: separar validaciones en función aparte
chore: mantenimiento          → chore: actualizar dependencias
```

### Antes de irse de clase (SIEMPRE)

```bash
# Subir tu trabajo aunque no esté terminado
git add .
git commit -m "chore: WIP modelo Alumno"
git push -u origin feat/nombre-de-tu-tarea
```

**Trabajo no pusheado = trabajo que puedes perder.**

---

## 4. Cuando termines una tarea

### Subir tu rama

```bash
git push -u origin feat/nombre-de-tu-tarea
```

### Crear Pull Request en GitHub

1. Ir al repo en GitHub
2. Aparece un banner amarillo "Compare & pull request" → click
3. Verificar que dice: `base: develop` ← `compare: feat/tu-rama`
4. Título: describir qué has hecho (ej: "feat: modelo Alumno con validaciones")
5. Body: explicar qué has hecho. **Referenciar la issue:**
   ```
   closes #9
   ```
6. Click "Create pull request"

### Referenciar issues en el PR (IMPORTANTE)

En el cuerpo del PR, escribe `closes #N` donde N es el número de la issue.
Esto hace que el tablero Kanban se actualice automáticamente:

- Al abrir el PR → la issue pasa a **In Review**
- Al mergear el PR → la issue pasa a **Done** y se cierra

Palabras válidas: `closes`, `fixes`, `resolves`

Un PR puede cerrar varias issues:
```
closes #9, closes #10
```

### Pedir review

Avisar al equipo que te toca revisar:

```
Front HTML  ←→  Front JS       (se revisan entre ellos)
Back Express ←→ Back SQL       (se revisan entre ellos)
```

### Esperar review y mergear

Cuando alguien apruebe tu PR, puedes mergear con el botón "Merge pull request".
La rama se borra automáticamente después del merge.

---

## 5. Revisar una PR de otro equipo

Cuando te pidan que revises:

1. Ir a la PR en GitHub
2. Click en la pestaña "Files changed"
3. Leer el código
4. Si está bien:
   - Click "Review changes" → "Approve" → comentario "LGTM" (Looks Good To Me)
5. Si hay algo que cambiar:
   - Click "Review changes" → "Request changes" → explicar qué falta o qué está mal

---

## 6. Resolver conflictos de merge/rebase

Si al hacer `git rebase develop` salen conflictos:

```bash
# Git te dice qué archivos tienen conflicto
# Abrir esos archivos en el editor

# Verás algo así:
<<<<<<< HEAD
tu código
=======
código de develop
>>>>>>> develop

# Elegir qué te quedas (o combinar ambos)
# Borrar las líneas con <<<, === y >>>

# Si estabas haciendo rebase:
git add archivo-con-conflicto.js
git rebase --continue
```

> **merge vs rebase — ¿cuál es la diferencia?**
>
> `git merge develop` trae los cambios de develop y crea un commit extra de merge.
> El historial queda con bifurcaciones y "Merge branch 'develop' into..." por todos lados.
>
> `git rebase develop` recoloca tus commits encima de develop, como si hubieras
> empezado a trabajar desde el último commit de develop. El historial queda lineal y limpio.
>
> ```
> merge:    A---B---C---M  (M = merge commit extra)
>          /           /
>    D---E---F---G----
>
> rebase:   D---E---F---G---A'---B'---C'  (tus commits recolocados encima, sin merge commit)
> ```
>
> **Usamos rebase** porque el historial queda más fácil de leer y de revisar.

Si no sabes resolverlo, pedir ayuda al formador.

---

## 7. Estructura del proyecto

```
CIFO_CRM_project/
├── src/
│   ├── server.js                       # Servidor Express + EJS + sesiones
│   ├── config/
│   │   └── database.js                 # Conexión Sequelize + MySQL
│   ├── models/
│   │   ├── index.js                    # Registro de modelos + relaciones
│   │   ├── Usuario.js
│   │   ├── Alumno.js
│   │   ├── Curso.js
│   │   ├── Uf.js
│   │   └── Profesor.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── alumnoController.js
│   │   ├── cursoController.js
│   │   ├── ufController.js
│   │   ├── profesorController.js
│   │   └── usuarioController.js
│   ├── routes/
│   │   ├── index.js                    # Registro central de rutas
│   │   ├── authRoutes.js
│   │   ├── alumnoRoutes.js
│   │   ├── cursoRoutes.js
│   │   ├── ufRoutes.js
│   │   ├── profesorRoutes.js
│   │   └── usuarioRoutes.js
│   ├── middlewares/
│   │   └── auth.js                     # Middleware de sesiones
│   ├── views/                          # Vistas EJS
│   │   ├── layout.ejs
│   │   ├── login.ejs
│   │   ├── dashboard.ejs
│   │   ├── alumnos.ejs
│   │   ├── alumno-detalle.ejs
│   │   ├── alumno-form.ejs
│   │   ├── cursos.ejs
│   │   ├── curso-detalle.ejs
│   │   ├── curso-form.ejs
│   │   ├── ufs.ejs
│   │   ├── uf-form.ejs
│   │   ├── profesores.ejs
│   │   ├── profesor-form.ejs
│   │   └── usuarios.ejs
│   └── public/                         # Archivos estáticos
│       ├── css/
│       │   ├── main.css
│       │   ├── forms.css
│       │   ├── login.css
│       │   ├── dashboard.css
│       │   ├── alumnos.css
│       │   ├── cursos.css
│       │   ├── ufs.css
│       │   ├── profesores.css
│       │   └── usuarios.css
│       └── js/
│           ├── main.js
│           ├── auth.js
│           ├── alumnos.js
│           ├── cursos.js
│           ├── ufs.js
│           ├── profesores.js
│           └── usuarios.js
├── docs/
│   ├── Briefing.md
│   └── Esquema v1.excalidraw
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

### Qué archivos toca cada equipo

| Equipo | Archivos |
|--------|----------|
| Front HTML/CSS | `src/views/*.ejs`, `src/public/css/*.css` |
| Front JavaScript | `src/public/js/*.js` |
| Back Express | `src/server.js`, `src/controllers/*`, `src/routes/*`, `src/middlewares/*` |
| Back SQL/Sequelize | `src/config/database.js`, `src/models/*` |

---

## 8. Reglas importantes

```
╔══════════════════════════════════════════════════════╗
║  1. Rama SIEMPRE desde develop                       ║
║  2. Nombre: feat/descripcion (NO tu nombre)          ║
║  3. PR siempre a develop (NUNCA a main)              ║
║  4. PR con "closes #N" para vincular la issue        ║
║  5. 1 review mínimo antes de mergear                 ║
║  6. Si hay conflicto, lo resuelves TÚ                ║
║  7. Commit con formato: feat: descripcion            ║
║  8. Push SIEMPRE antes de irte                       ║
╚══════════════════════════════════════════════════════╝
```

---

## 9. Comandos Git — Resumen rápido

| Qué quiero hacer | Comando |
|------------------|---------|
| Ver en qué rama estoy | `git branch` |
| Cambiar de rama | `git checkout nombre-rama` |
| Crear rama nueva | `git checkout -b feat/mi-tarea` |
| Traer cambios del remoto | `git pull origin develop` |
| Ver qué he cambiado | `git status` |
| Ver los cambios en detalle | `git diff` |
| Añadir archivos al commit | `git add archivo.js` |
| Añadir todos los archivos | `git add .` |
| Hacer commit | `git commit -m "feat: descripcion"` |
| Subir mi rama | `git push -u origin feat/mi-tarea` |
| Traer cambios de develop a mi rama | `git rebase develop` |

---

## 10. Problemas frecuentes

### "No puedo hacer push"

```bash
# Probablemente tu rama no está subida aún
git push -u origin feat/mi-rama
```

### "Tengo cambios sin commitear y quiero cambiar de rama"

```bash
# Opción 1: commitear lo que tengas
git add .
git commit -m "chore: WIP trabajo en progreso"
git checkout otra-rama

# Opción 2: guardar temporalmente
git stash
git checkout otra-rama
# Cuando vuelvas:
git checkout feat/mi-rama
git stash pop
```

### "He commiteado en la rama equivocada"

Avisar al formador. No intentar arreglarlo solo con `git reset`.

### "Mi código no funciona y quiero volver atrás"

```bash
# Ver los últimos commits
git log --oneline -10

# Volver a un commit anterior (sin perder los cambios)
git checkout hash-del-commit -- archivo.js
```

### "El servidor no arranca"

1. ¿Está XAMPP arrancado con MySQL?
2. ¿Existe el archivo `.env`? (copiarlo de `.env.example`)
3. ¿Se han instalado las dependencias? (`npm install`)
4. ¿El puerto 3000 está libre?
