# JOINs con Sequelize

Guía rápida con ejemplos basados en este proyecto. En Sequelize, las JOINs se hacen con la opción `include` en `findAll`/`findByPk`/`findOne`.

---

## 1. JOIN básico (traer datos relacionados)

Si `Alumno.belongsToMany(Curso, ...)`, para traer un alumno con sus cursos:

```js
const alumno = await Alumno.findByPk(id, {
  include: [Curso]   // ← JOIN con la tabla cursos
});

// Acceso al resultado:
alumno.Cursos      // array de cursos
```

**Ejemplo del proyecto** (`alumnoController.getById`):

```js
const alumno = await Alumno.findByPk(req.params.id, {
  include: [Curso],
});
```

---

## 2. Filtrar columnas del JOIN

Para no traer todas las columnas (mejor rendimiento):

```js
const profesor = await Profesor.findByPk(id, {
  include: [{
    model: Curso,
    attributes: ["id", "codigo", "nombre"]   // solo estas columnas
  }]
});
```

---

## 3. Múltiples JOINs

Si curso tiene UFs, profesores y alumnos:

```js
const curso = await Curso.findByPk(id, {
  include: [Uf, Profesor, Alumno]
});

curso.Ufs        // UFs del curso
curso.Profesors  // profesores
curso.Alumnos    // alumnos
```

Ya está usado en `cursoController.getById` del proyecto.

---

## 4. Filtrar resultados del JOIN

Solo cursos con alumnos de tipo "actual":

```js
const cursos = await Curso.findAll({
  include: [{
    model: Alumno,
    where: { tipo: "actual" }
  }]
});
```

---

## 5. LEFT JOIN vs INNER JOIN

Por defecto los `include` son **LEFT JOIN** (traen todo aunque no haya match). Para forzar INNER JOIN (solo registros con match):

```js
include: [{
  model: Alumno,
  required: true   // INNER JOIN
}]
```

---

## 6. JOIN anidado (múltiples niveles)

Curso → Alumno → Cursos de cada alumno:

```js
const curso = await Curso.findByPk(id, {
  include: [{
    model: Alumno,
    include: [Curso]   // los cursos de cada alumno
  }]
});
```

---

## 7. Acceder a la tabla intermedia (M:N con campos extra)

La relación `alumno_uf` tiene un campo `estat` (aprobado/pendiente):

```js
const alumno = await Alumno.findByPk(id, {
  include: [{
    model: Uf,
    through: { attributes: ['estat'] }   // campos de la tabla pivote
  }]
});

// Acceso:
alumno.Ufs[0].alumno_uf.estat   // valor del campo `estat`
```

---

## 8. Naming de las propiedades del resultado

Sequelize pluraliza automáticamente el nombre del modelo:

- `Alumno.belongsToMany(Curso)` → `alumno.Cursos`
- `Curso.belongsToMany(Alumno)` → `curso.Alumnos`

Puedes cambiarlo con `as`:

```js
Alumno.belongsToMany(Curso, {
  as: "matriculaciones",
  through: "curso_alumno"
});
// Acceso: alumno.matriculaciones
```

---

## 9. Ordenar por columnas del JOIN

```js
const cursos = await Curso.findAll({
  include: [Alumno],
  order: [
    ["codigo", "ASC"],
    [Alumno, "apellidos", "ASC"]   // ordenar por apellidos del alumno
  ]
});
```

---

## 10. JOIN solo para filtrar (sin traer datos)

Cuando quieres usar el JOIN para condicionar la consulta pero no necesitas los datos:

```js
const cursos = await Curso.findAll({
  include: [{
    model: Profesor,
    attributes: [],          // no traer ningún campo
    where: { id: profesorId },
    required: true            // INNER JOIN para filtrar
  }]
});
```

---

## Trampas comunes

- **`findOne` + `include` sin `where`** te trae el primer registro con sus relaciones. Si solo quieres el alumno y no necesitas los cursos, no pongas `include`.
- **Performance:** los `include` generan una SQL gorda con LEFT JOINs. Si tu listado tiene muchos registros y muchos `include`, la query puede ser lenta. Usa `attributes` para limitar columnas.
- **`attributes: []` en el include** = solo se usa el JOIN para filtrar, no se devuelven los datos.
- **Ojo con la pluralización:** Sequelize a veces pluraliza raro (ej. `Profesor` → `Profesors` en lugar de `Profesores`). Si te molesta, usa `as`.

---

## Referencia oficial

https://sequelize.org/docs/v6/advanced-association-concepts/eager-loading/
