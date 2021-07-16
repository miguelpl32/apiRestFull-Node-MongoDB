// RELACIONES POR REFERENCIA (Normalizacion) -> Consistencia
// Consultas mas lentas pero si cambiamos algun dato en usuario, automaticamente se cambia en cursos
let usuario = {
    id:'U0001',
    nombre: 'Miguel',
    email: 'mail@mail.com'
}

let curso = {
    id: 'C0001',
    id_alumnos:['U0001', 'U0002', 'U0003'],
    titulo: 'JavaScript Moderno',
    descripcion:'Ultimas funcionalidades de JavaScript'
}

// RELACIONES POR DOCUMENTOS EMBEBIDOS O SUBDOCUMENTOS (Desnormalizacion) -> Performances
// con una sola consulta se obtiene toda la informacion mas rapidas las consultas
// Si se modifica el email del autor no se actualiza en los demas curso que tenga creados

let curso = {
    id: 'C0001',
    autor: {
        nombre:'Carlos Perez',
        email:'carlos@email.com'
    },
    id_alumnos:
    [
        {id: 'A0001', nombre:'Miguel', email: 'miguel@mail.com'},
        {id: 'A0002', nombre:'Ana', email: 'ana@mail.com'},
    ],
    titulo: 'JavaScript Moderno',
    descripcion:'Ultimas funcionalidades de JavaScript'
}




/* let curso_alumno = {
    id:'0001',
    id_curso:'C0001',
    id_alumno:'A0001'
} */