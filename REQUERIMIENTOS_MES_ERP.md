# Requerimientos para Software MES/ERP

## Empresa Objetivo

Este documento define los requerimientos base para crear un software tipo MES/ERP orientado a una empresa pequena dedicada a:

- Creacion digital.
- Diseno CAD/3D.
- Impresion 3D.
- Fabricacion de piezas y prototipos.
- Desarrollo de proyectos mecatronicos.
- Ensamble, pruebas y entrega de soluciones personalizadas.

El sistema debe estar pensado para una operacion pequena o mediana, donde los proyectos suelen ser personalizados, iterativos y con alta dependencia de archivos tecnicos, materiales, horas de ingenieria y disponibilidad de maquinas.

## Objetivo del Sistema

El objetivo principal de la aplicacion es controlar el flujo completo de trabajo desde la solicitud inicial del cliente hasta la entrega final, permitiendo conocer el estado de cada proyecto, los costos reales, el uso de materiales, la carga de trabajo, el avance de produccion y la rentabilidad.

La cadena principal del sistema debe ser:

```text
Solicitud -> Cotizacion -> Proyecto -> Diseno -> Fabricacion -> Calidad -> Entrega -> Costos reales -> Aprendizaje
```

El software no debe comportarse como un ERP generico pesado. Debe estar enfocado en empresas que combinan servicios creativos, fabricacion digital y desarrollo tecnico.

## Alcance General

La aplicacion debe permitir gestionar:

- Clientes.
- Solicitudes.
- Cotizaciones.
- Proyectos.
- Archivos tecnicos.
- Ordenes de trabajo.
- Maquinas.
- Inventario.
- Compras.
- Proveedores.
- Tareas.
- Produccion.
- Control de calidad.
- Entregas.
- Facturacion simple.
- Costos estimados y reales.
- Indicadores de negocio.
- Usuarios y permisos.

Queda fuera del alcance inicial el portal de cliente externo.

## Principios del Producto

El sistema debe cumplir con estos principios:

- Ser simple de operar para equipos pequenos.
- Evitar procesos excesivamente burocraticos.
- Mantener trazabilidad clara de archivos, costos y estados.
- Priorizar visibilidad operativa sobre complejidad contable.
- Permitir comenzar con datos manuales y crecer hacia integraciones futuras.
- Facilitar la toma de decisiones: que fabricar, que comprar, que entregar, que esta retrasado y que proyecto esta perdiendo dinero.
- Separar claramente lo estimado de lo real.
- Permitir trabajar por proyectos personalizados y no solo por productos repetitivos.

## Roles de Usuario

### Administrador

Puede configurar el sistema, gestionar usuarios, modificar costos base, crear categorias, ver reportes completos y cerrar proyectos.

### Ventas / Comercial

Puede registrar clientes, solicitudes, cotizaciones, seguimientos y estados comerciales.

### Disenador / Ingeniero

Puede gestionar archivos tecnicos, tareas de diseno, listas de materiales, validaciones y documentacion tecnica.

### Produccion / Operador

Puede ver ordenes de trabajo, actualizar estados de fabricacion, registrar tiempos, consumos, fallas y evidencias.

### Compras

Puede crear solicitudes de compra, registrar proveedores, actualizar recepciones y asociar compras a proyectos.

### Finanzas / Administracion

Puede ver facturacion, pagos, costos, margenes y reportes economicos.

## Modulo 1: Clientes y Solicitudes

### Objetivo

Registrar clientes, contactos y necesidades iniciales para convertir oportunidades en cotizaciones o proyectos.

### Funciones Requeridas

- Crear, editar y consultar clientes.
- Registrar contactos asociados a una empresa.
- Registrar solicitudes nuevas.
- Adjuntar archivos enviados por el cliente.
- Registrar notas internas.
- Clasificar el tipo de solicitud.
- Asignar responsable.
- Definir prioridad.
- Registrar fecha esperada de entrega.
- Cambiar estado de la solicitud.
- Convertir solicitud en cotizacion.

### Datos del Cliente

- Codigo interno.
- Tipo de cliente: persona, empresa, institucion.
- Nombre o razon social.
- Documento fiscal.
- Telefono.
- Correo.
- Direccion.
- Ciudad / pais.
- Contactos asociados.
- Notas.
- Estado: activo, inactivo, potencial.

### Datos de la Solicitud

- Codigo de solicitud.
- Cliente.
- Contacto.
- Fecha de ingreso.
- Descripcion.
- Tipo de trabajo.
- Archivos adjuntos.
- Prioridad.
- Fecha objetivo.
- Responsable.
- Estado.
- Observaciones.

### Estados Sugeridos

- Nuevo.
- En revision.
- Falta informacion.
- Listo para cotizar.
- Cotizado.
- Rechazado.
- Convertido en proyecto.

## Modulo 2: Cotizaciones

### Objetivo

Crear presupuestos claros, versionados y basados en costos estimados de materiales, maquinas, horas de trabajo, compras externas y margen.

### Funciones Requeridas

- Crear cotizaciones desde una solicitud o manualmente.
- Versionar cotizaciones.
- Registrar items de cotizacion.
- Calcular costos estimados.
- Aplicar margen de ganancia.
- Aplicar descuentos.
- Registrar impuestos.
- Adjuntar documentos y archivos de referencia.
- Generar PDF de cotizacion.
- Marcar cotizacion como enviada.
- Registrar aprobacion o rechazo.
- Convertir cotizacion aprobada en proyecto.

### Estructura de Cotizacion

- Codigo de cotizacion.
- Cliente.
- Solicitud asociada.
- Fecha de emision.
- Fecha de vencimiento.
- Responsable.
- Moneda.
- Estado.
- Items.
- Subtotal.
- Descuento.
- Impuestos.
- Total.
- Condiciones comerciales.
- Tiempo estimado de entrega.
- Validez de la oferta.
- Observaciones.

### Costos para Impresion 3D

- Material.
- Cantidad estimada en gramos o mililitros.
- Costo unitario del material.
- Tiempo estimado de impresion.
- Costo por hora de maquina.
- Tiempo de preparacion.
- Tiempo de postprocesado.
- Riesgo de falla.
- Cantidad de unidades.
- Margen.

### Costos para Proyectos Mecatronicos

- Horas de diseno mecanico.
- Horas de diseno electronico.
- Horas de programacion.
- Horas de ensamble.
- Horas de pruebas.
- Componentes electronicos.
- Componentes mecanicos.
- Fabricacion externa.
- Herramientas o consumibles.
- Instalacion.
- Soporte.
- Margen.

### Estados Sugeridos

- Borrador.
- En revision interna.
- Enviada.
- En negociacion.
- Aprobada.
- Rechazada.
- Vencida.
- Convertida en proyecto.

## Modulo 3: Proyectos

### Objetivo

Centralizar toda la informacion operativa, tecnica y economica de un trabajo aprobado.

### Funciones Requeridas

- Crear proyecto desde cotizacion aprobada.
- Crear proyecto manualmente.
- Asignar cliente, responsable y equipo.
- Definir fechas.
- Registrar presupuesto aprobado.
- Crear tareas.
- Asociar ordenes de trabajo.
- Asociar materiales, compras y archivos.
- Registrar avances.
- Controlar estado general.
- Comparar costos estimados contra reales.
- Cerrar proyecto.

### Datos del Proyecto

- Codigo de proyecto.
- Nombre.
- Cliente.
- Cotizacion asociada.
- Responsable.
- Equipo asignado.
- Fecha de inicio.
- Fecha objetivo.
- Fecha real de cierre.
- Presupuesto aprobado.
- Estado.
- Prioridad.
- Descripcion tecnica.
- Entregables.
- Riesgos.
- Observaciones.

### Estados Sugeridos

- Pendiente.
- En diseno.
- En validacion.
- En compra de materiales.
- En fabricacion.
- En ensamble.
- En pruebas.
- En correccion.
- Listo para entrega.
- Entregado.
- Cerrado.
- Pausado.
- Cancelado.

## Modulo 4: Archivos Tecnicos

### Objetivo

Controlar archivos de diseno, fabricacion y documentacion para evitar errores por versiones incorrectas.

### Tipos de Archivo

- STL.
- STEP.
- OBJ.
- GCODE.
- 3MF.
- DXF.
- DWG.
- PDF.
- Imagenes de referencia.
- Planos.
- Archivos CAD.
- Firmware.
- Codigo fuente.
- Esquemas electronicos.
- BOM.
- Manuales.
- Fotografias de avance.
- Videos de prueba.

### Funciones Requeridas

- Subir archivos por proyecto.
- Asociar archivos a solicitud, cotizacion, proyecto u orden de trabajo.
- Definir tipo de archivo.
- Registrar version.
- Marcar archivo aprobado para fabricacion.
- Marcar archivo obsoleto.
- Agregar comentarios tecnicos.
- Registrar usuario que subio el archivo.
- Registrar fecha y hora.
- Descargar archivos.
- Mantener historial de versiones.

### Datos del Archivo

- Nombre.
- Tipo.
- Extension.
- Proyecto asociado.
- Version.
- Estado.
- Usuario responsable.
- Fecha de carga.
- Descripcion.
- Relacion con tarea u orden de trabajo.

### Estados Sugeridos

- En revision.
- Aprobado para cotizar.
- Aprobado para fabricar.
- Obsoleto.
- Rechazado.

## Modulo 5: Produccion / MES

### Objetivo

Gestionar lo que ocurre en taller: ordenes de trabajo, maquinas, operadores, tiempos, materiales, fallas y resultados.

### Funciones Requeridas

- Crear ordenes de trabajo desde un proyecto.
- Asignar maquina.
- Asignar operador.
- Asociar archivo de fabricacion.
- Definir material.
- Definir cantidad.
- Registrar tiempo estimado.
- Registrar tiempo real.
- Registrar consumo real.
- Registrar estado.
- Registrar pausas.
- Registrar fallas.
- Registrar retrabajos.
- Adjuntar evidencias.
- Enviar orden a control de calidad.

### Tipos de Orden de Trabajo

- Impresion 3D FDM.
- Impresion 3D resina.
- Corte laser.
- CNC.
- Diseno.
- Ensamble mecanico.
- Ensamble electronico.
- Soldadura.
- Cableado.
- Programacion.
- Pruebas.
- Postprocesado.
- Pintura o acabado.
- Empaque.

### Datos de Orden de Trabajo

- Codigo de orden.
- Proyecto.
- Tipo de trabajo.
- Responsable.
- Operador.
- Maquina.
- Archivo aprobado.
- Material.
- Cantidad.
- Fecha programada.
- Fecha de inicio.
- Fecha de fin.
- Tiempo estimado.
- Tiempo real.
- Consumo estimado.
- Consumo real.
- Estado.
- Resultado.
- Observaciones.

### Estados Sugeridos

- Por programar.
- En cola.
- Preparando.
- En produccion.
- Pausado.
- Fallido.
- Terminado.
- En postproceso.
- En calidad.
- Aprobado.
- Rechazado.
- Cancelado.

## Modulo 6: Maquinas y Equipos

### Objetivo

Controlar disponibilidad, capacidad, costos, mantenimiento e historial de uso de maquinas y equipos.

### Funciones Requeridas

- Registrar maquinas.
- Clasificar por tipo.
- Definir estado operativo.
- Definir materiales compatibles.
- Definir area o volumen de trabajo.
- Registrar costo por hora.
- Registrar horas de uso.
- Asociar ordenes de trabajo.
- Registrar fallas.
- Programar mantenimiento.
- Consultar disponibilidad.

### Datos de Maquina

- Codigo.
- Nombre.
- Tipo.
- Marca.
- Modelo.
- Numero de serie.
- Ubicacion.
- Volumen o area de trabajo.
- Materiales compatibles.
- Costo por hora.
- Estado.
- Horas acumuladas.
- Fecha de ultimo mantenimiento.
- Fecha de proximo mantenimiento.
- Observaciones.

### Estados Sugeridos

- Disponible.
- Ocupada.
- En mantenimiento.
- Fuera de servicio.
- Reservada.

## Modulo 7: Inventario

### Objetivo

Controlar materiales, componentes, consumibles y herramientas criticas para produccion.

### Categorias Sugeridas

- Filamentos.
- Resinas.
- Polvos o materiales especiales.
- Tornilleria.
- Rodamientos.
- Ejes.
- Perfiles.
- Motores.
- Sensores.
- Microcontroladores.
- Drivers.
- Fuentes.
- Placas electronicas.
- Cables.
- Conectores.
- Herramientas consumibles.
- Empaques.
- Adhesivos.
- Pinturas.
- Repuestos.

### Funciones Requeridas

- Crear items de inventario.
- Registrar entradas.
- Registrar salidas.
- Reservar materiales para proyectos.
- Descontar materiales por orden de trabajo.
- Definir stock minimo.
- Alertar stock bajo.
- Registrar ubicacion fisica.
- Registrar proveedor principal.
- Registrar costo unitario.
- Consultar movimientos.
- Ajustar inventario con motivo.

### Datos de Item

- Codigo interno.
- Nombre.
- Categoria.
- Unidad de medida.
- Stock actual.
- Stock reservado.
- Stock disponible.
- Stock minimo.
- Costo unitario.
- Proveedor.
- Ubicacion.
- Lote.
- Fecha de vencimiento, si aplica.
- Estado.
- Observaciones tecnicas.

### Tipos de Movimiento

- Entrada por compra.
- Salida por produccion.
- Reserva para proyecto.
- Liberacion de reserva.
- Ajuste positivo.
- Ajuste negativo.
- Merma.
- Devolucion.

## Modulo 8: Compras y Proveedores

### Objetivo

Gestionar compras necesarias para proyectos y reposicion de inventario, manteniendo trazabilidad de costos y tiempos.

### Funciones Requeridas

- Registrar proveedores.
- Crear solicitudes de compra.
- Asociar compras a proyectos.
- Asociar compras a items de inventario.
- Registrar cotizaciones de proveedores.
- Registrar ordenes de compra.
- Registrar fecha esperada de llegada.
- Registrar recepcion parcial o total.
- Actualizar costos reales.
- Marcar compras pendientes que bloquean proyectos.

### Datos de Proveedor

- Nombre.
- Tipo.
- Contacto.
- Telefono.
- Correo.
- Web.
- Direccion.
- Tiempo promedio de entrega.
- Condiciones de pago.
- Calidad historica.
- Observaciones.

### Estados de Compra

- Solicitada.
- Cotizando.
- Aprobada.
- Comprada.
- En transito.
- Recibida parcial.
- Recibida completa.
- Cancelada.

## Modulo 9: Costos Reales y Rentabilidad

### Objetivo

Comparar lo cotizado contra lo realmente consumido para mejorar margenes, detectar perdidas y aprender para futuras cotizaciones.

### Funciones Requeridas

- Registrar costos estimados por proyecto.
- Registrar costos reales.
- Comparar desviaciones.
- Calcular margen esperado.
- Calcular margen real.
- Registrar horas reales por usuario.
- Registrar consumo real de materiales.
- Registrar compras asociadas.
- Registrar retrabajos.
- Registrar fallas.
- Generar reporte de rentabilidad.

### Costos a Considerar

- Materiales.
- Componentes.
- Tiempo de maquina.
- Horas de diseno.
- Horas de ingenieria.
- Horas de produccion.
- Horas de ensamble.
- Horas de pruebas.
- Compras externas.
- Servicios tercerizados.
- Consumibles.
- Desperdicio.
- Retrabajos.
- Garantias.
- Costos indirectos asignados.

### Indicadores

- Rentabilidad por proyecto.
- Margen estimado.
- Margen real.
- Desviacion de materiales.
- Desviacion de horas.
- Costo de fallas.
- Costo de retrabajo.
- Proyectos con perdida.
- Proyectos mas rentables.
- Tiempo promedio por tipo de proyecto.

## Modulo 10: Tareas y Flujo de Trabajo

### Objetivo

Organizar el trabajo diario del equipo y conectar tareas con proyectos, archivos, ordenes y responsables.

### Funciones Requeridas

- Crear tareas por proyecto.
- Asignar responsable.
- Definir prioridad.
- Definir fecha limite.
- Registrar estado.
- Registrar tiempo trabajado.
- Asociar archivos.
- Asociar ordenes de trabajo.
- Agregar comentarios.
- Crear checklist.
- Filtrar tareas por usuario, proyecto, estado o fecha.

### Ejemplos de Tareas

- Revisar requerimientos.
- Modelar pieza.
- Validar medidas.
- Preparar archivo para impresion.
- Laminar modelo.
- Imprimir prototipo.
- Comprar componente.
- Soldar placa.
- Programar firmware.
- Ensamblar mecanismo.
- Realizar prueba funcional.
- Corregir diseno.
- Documentar entrega.

### Estados Sugeridos

- Pendiente.
- En progreso.
- Bloqueada.
- En revision.
- Completada.
- Cancelada.

## Modulo 11: Control de Calidad

### Objetivo

Validar que piezas, ensambles y proyectos cumplan criterios tecnicos antes de su entrega.

### Funciones Requeridas

- Crear inspecciones de calidad.
- Asociar inspeccion a orden de trabajo o proyecto.
- Usar checklists por tipo de trabajo.
- Registrar resultado.
- Registrar defectos.
- Adjuntar fotos o videos.
- Registrar accion correctiva.
- Aprobar o rechazar.
- Enviar a retrabajo.

### Criterios para Impresion 3D

- Material correcto.
- Color correcto.
- Dimensiones criticas.
- Acabado superficial.
- Adhesion de capas.
- Deformaciones.
- Warping.
- Relleno correcto.
- Resistencia esperada.
- Cantidad producida.

### Criterios para Mecatronica

- Conexion electrica correcta.
- Polaridad validada.
- Firmware cargado.
- Movimiento mecanico correcto.
- Sensores funcionando.
- Actuadores funcionando.
- Prueba de seguridad.
- Prueba de uso continuo.
- Documentacion minima.
- Limpieza y presentacion.

### Estados Sugeridos

- Pendiente.
- En inspeccion.
- Aprobado.
- Rechazado.
- Aprobado con observaciones.
- En retrabajo.

## Modulo 12: Entregas y Facturacion Simple

### Objetivo

Controlar el cierre comercial y operativo de los proyectos.

### Funciones Requeridas

- Registrar entregas parciales o completas.
- Generar nota de entrega.
- Asociar evidencia de entrega.
- Registrar conformidad del cliente.
- Registrar factura o comprobante.
- Registrar pagos.
- Registrar anticipos.
- Controlar saldo pendiente.
- Marcar proyecto como entregado o cerrado.

### Datos de Entrega

- Codigo de entrega.
- Proyecto.
- Cliente.
- Fecha programada.
- Fecha real.
- Responsable.
- Items entregados.
- Observaciones.
- Evidencia.
- Estado.

### Estados Financieros Sugeridos

- Sin facturar.
- Anticipo solicitado.
- Anticipo recibido.
- Facturado parcial.
- Facturado completo.
- Pago parcial.
- Pagado.
- Vencido.

## Modulo 13: Dashboard e Indicadores

### Objetivo

Mostrar informacion clave para operar la empresa sin tener que entrar a cada modulo.

### Indicadores Operativos

- Proyectos activos.
- Proyectos atrasados.
- Tareas vencidas.
- Ordenes en produccion.
- Ordenes fallidas.
- Maquinas disponibles.
- Maquinas ocupadas.
- Maquinas en mantenimiento.
- Compras pendientes.
- Materiales con stock bajo.
- Entregas proximas.

### Indicadores Comerciales

- Cotizaciones pendientes.
- Cotizaciones aprobadas.
- Cotizaciones rechazadas.
- Ventas del mes.
- Proyectos aprobados.
- Clientes activos.

### Indicadores Financieros

- Ingresos estimados.
- Ingresos facturados.
- Costos reales.
- Margen estimado.
- Margen real.
- Proyectos con desviacion alta.
- Cuentas pendientes de cobro.

### Vistas Recomendadas

- Vista general.
- Vista de produccion.
- Vista financiera.
- Vista de proyectos.
- Vista de inventario.

## Modulo 14: Usuarios, Permisos y Auditoria

### Objetivo

Controlar el acceso a informacion sensible y mantener historial de acciones importantes.

### Funciones Requeridas

- Crear usuarios.
- Asignar roles.
- Activar o desactivar usuarios.
- Definir permisos por modulo.
- Registrar acciones criticas.
- Registrar cambios de estado.
- Registrar modificaciones de costos.
- Registrar eliminacion o reemplazo de archivos.

### Permisos Criticos

- Ver costos.
- Editar costos.
- Aprobar cotizaciones.
- Cerrar proyectos.
- Eliminar archivos.
- Cambiar archivo aprobado para fabricacion.
- Ajustar inventario.
- Registrar pagos.
- Ver reportes financieros.
- Administrar usuarios.

### Eventos de Auditoria

- Creacion de cotizacion.
- Aprobacion de cotizacion.
- Cambio de estado de proyecto.
- Cambio de archivo aprobado.
- Inicio y cierre de orden de trabajo.
- Rechazo de calidad.
- Ajuste de inventario.
- Registro de pago.
- Cierre de proyecto.

## Requerimientos Tecnicos

### Arquitectura General

La aplicacion debe construirse como una plataforma modular, con separacion clara entre interfaz de usuario, logica de negocio, almacenamiento de datos y almacenamiento de archivos.

Debe permitir crecer progresivamente sin obligar a rehacer la estructura principal.

### Requerimientos de Plataforma

- Aplicacion web responsive.
- Acceso desde escritorio, tablet y movil.
- Autenticacion de usuarios.
- Control de sesiones.
- Base de datos relacional.
- Almacenamiento de archivos.
- Generacion de PDF.
- Exportacion a Excel o CSV.
- Importacion basica de datos.
- Copias de seguridad.
- Registro de auditoria.
- API interna para futuras integraciones.

### Tecnologias Recomendadas

#### Frontend

- React, Vue o Angular.
- Preferencia para una interfaz basada en componentes.
- Soporte para tablas, formularios, modales, paneles y dashboards.
- Diseno responsive desde el inicio.

#### Backend

- Node.js, Django, FastAPI, Laravel o .NET.
- API REST o GraphQL.
- Separacion por modulos de negocio.
- Validaciones centralizadas.
- Manejo robusto de permisos.

#### Base de Datos

- PostgreSQL como opcion recomendada.
- Uso de relaciones claras entre clientes, proyectos, ordenes, materiales y costos.
- Indices para busqueda por codigo, estado, fecha y cliente.

#### Almacenamiento de Archivos

- Almacenamiento local para una primera version.
- Posibilidad de migrar a almacenamiento compatible con S3.
- Control de versiones y metadatos en base de datos.

#### Reportes y Documentos

- Generacion de cotizaciones en PDF.
- Generacion de notas de entrega.
- Exportacion de reportes a Excel o CSV.
- Plantillas configurables para documentos comerciales.

#### Integraciones Futuras

- OctoPrint.
- Klipper.
- PrusaLink.
- Bambu Studio / Bambu Connect, si existe disponibilidad tecnica.
- Servicios de facturacion electronica.
- Pasarelas de pago.
- Sistemas contables.
- Servicios de correo.
- Notificaciones por WhatsApp o mensajeria externa.

### Seguridad

- Contrasenas cifradas.
- Roles y permisos por modulo.
- Validacion de entradas.
- Proteccion contra eliminacion accidental.
- Registro de auditoria.
- Copias de seguridad periodicas.
- Restriccion de acceso a archivos privados.
- Politicas de recuperacion ante perdida de datos.

### Rendimiento

- Carga rapida de dashboards.
- Paginacion en tablas grandes.
- Filtros eficientes.
- Busqueda por cliente, proyecto, codigo y estado.
- Procesamiento asincrono para generacion de reportes pesados.

### Escalabilidad

- Soporte inicial para una empresa.
- Preparar estructura para multiempresa si se requiere en el futuro.
- Separar configuraciones por empresa.
- Mantener catalogos configurables.
- Permitir agregar nuevos tipos de orden, materiales y maquinas sin cambios profundos.

## Modelo de Datos Inicial

### Entidades Principales

- Usuario.
- Rol.
- Permiso.
- Cliente.
- Contacto.
- Solicitud.
- Cotizacion.
- Item de cotizacion.
- Proyecto.
- Tarea.
- Archivo tecnico.
- Orden de trabajo.
- Maquina.
- Material / item de inventario.
- Movimiento de inventario.
- Proveedor.
- Solicitud de compra.
- Orden de compra.
- Inspeccion de calidad.
- Entrega.
- Factura o comprobante.
- Pago.
- Registro de tiempo.
- Registro de costo.
- Evento de auditoria.

### Relaciones Clave

- Un cliente puede tener muchas solicitudes.
- Una solicitud puede generar una o varias cotizaciones.
- Una cotizacion aprobada puede generar un proyecto.
- Un proyecto puede tener muchas tareas.
- Un proyecto puede tener muchos archivos tecnicos.
- Un proyecto puede tener muchas ordenes de trabajo.
- Una orden de trabajo puede consumir materiales.
- Una orden de trabajo puede usar una maquina.
- Una orden de trabajo puede tener inspecciones de calidad.
- Un proyecto puede tener compras asociadas.
- Un proyecto puede tener entregas parciales.
- Un proyecto puede tener costos estimados y reales.

## Flujos Principales

### Flujo Comercial

```text
Cliente solicita trabajo
-> Se registra solicitud
-> Se revisan archivos y requerimientos
-> Se prepara cotizacion
-> Se envia al cliente
-> Cliente aprueba
-> Se crea proyecto
```

### Flujo de Proyecto

```text
Proyecto creado
-> Se asignan responsables
-> Se crean tareas
-> Se cargan archivos tecnicos
-> Se validan materiales
-> Se crean ordenes de trabajo
-> Se ejecuta produccion
-> Se controla calidad
-> Se entrega
-> Se cierra y analiza rentabilidad
```

### Flujo de Produccion

```text
Orden de trabajo creada
-> Se asigna maquina y operador
-> Se reserva material
-> Se inicia produccion
-> Se registra consumo y tiempo real
-> Se termina o se reporta falla
-> Se envia a calidad
-> Se aprueba o se retrabaja
```

### Flujo de Compra

```text
Proyecto requiere material
-> Se crea solicitud de compra
-> Se aprueba compra
-> Se registra proveedor
-> Se marca como comprada
-> Se recibe material
-> Se actualiza inventario
-> Se libera bloqueo del proyecto
```

## Diseno de Interfaz

### Estilo General

La interfaz debe ser profesional, moderna y limpia. Debe transmitir orden, control y precision tecnica sin sentirse pesada.

El diseno debe priorizar:

- Claridad.
- Lectura rapida.
- Baja carga visual.
- Tablas bien organizadas.
- Estados visibles.
- Acciones principales faciles de encontrar.
- Buen uso del espacio.
- Navegacion consistente.

### Personalidad Visual

El producto debe sentirse como una herramienta de operacion profesional para taller, ingenieria y gestion. No debe parecer una pagina de marketing ni una aplicacion decorativa.

Debe usar:

- Fondos claros.
- Superficies neutras.
- Alto contraste en texto.
- Colores de estado bien diferenciados.
- Iconografia simple.
- Bordes suaves.
- Espaciado consistente.
- Componentes compactos pero respirables.

### Paleta de Color Sugerida

La paleta debe ser sobria y funcional:

- Fondo principal: gris muy claro o blanco frio.
- Superficies: blanco.
- Texto principal: gris oscuro.
- Texto secundario: gris medio.
- Color primario: azul tecnico, verde profundo o teal profesional.
- Exito: verde.
- Advertencia: amarillo/ambar.
- Error: rojo.
- Informacion: azul.
- Estados pausados o neutrales: gris.

Debe evitarse una interfaz dominada por un solo color. Los colores deben ayudar a entender estados, no decorar en exceso.

### Tipografia

La tipografia debe ser sans serif, moderna y legible.

Recomendaciones:

- Usar una familia como Inter, Roboto, Source Sans, IBM Plex Sans o similar.
- Titulos claros pero contenidos.
- Tablas con texto compacto y legible.
- Evitar textos gigantes en modulos operativos.
- Mantener jerarquia visual consistente.

### Navegacion

La navegacion recomendada es una barra lateral fija o colapsable con los modulos principales:

- Dashboard.
- Clientes.
- Solicitudes.
- Cotizaciones.
- Proyectos.
- Produccion.
- Maquinas.
- Inventario.
- Compras.
- Calidad.
- Entregas.
- Reportes.
- Configuracion.

La parte superior puede contener:

- Busqueda global.
- Acciones rapidas.
- Notificaciones.
- Usuario actual.

### Componentes UI Necesarios

- Tablas con filtros.
- Busqueda global.
- Filtros por estado.
- Badges de estado.
- Formularios por secciones.
- Modales de confirmacion.
- Paneles laterales de detalle.
- Tabs dentro de proyectos.
- Cards informativas para indicadores.
- Timeline de actividad.
- Checklists.
- Upload de archivos.
- Selector de usuario.
- Selector de maquina.
- Selector de material.
- Calendario o vista de programacion.
- Graficos simples.

### Diseno de Estados

Los estados deben ser visibles y consistentes en todo el sistema.

Ejemplos:

- Pendiente: gris.
- En progreso: azul.
- Bloqueado: rojo o ambar.
- En revision: violeta o azul suave.
- Aprobado: verde.
- Rechazado: rojo.
- Pausado: gris oscuro.
- Cerrado: verde oscuro o neutro.

Cada estado debe tener:

- Color.
- Texto.
- Icono opcional.
- Descripcion interna.

### Pantalla de Dashboard

Debe mostrar informacion accionable:

- Resumen de proyectos activos.
- Ordenes de trabajo del dia.
- Maquinas disponibles y ocupadas.
- Tareas vencidas.
- Compras pendientes.
- Stock bajo.
- Cotizaciones por aprobar.
- Entregas proximas.
- Margen estimado y real.

No debe saturarse con graficos innecesarios. El dashboard debe responder a la pregunta: "Que necesita atencion ahora?".

### Pantalla de Proyecto

La pantalla de proyecto debe ser una de las mas importantes.

Debe incluir:

- Encabezado con nombre, cliente, estado y prioridad.
- Resumen de fechas y presupuesto.
- Tabs de informacion:
  - General.
  - Tareas.
  - Archivos.
  - Produccion.
  - Materiales.
  - Compras.
  - Calidad.
  - Costos.
  - Entregas.
  - Actividad.

Debe permitir entender rapidamente:

- Que falta.
- Quien es responsable.
- Que archivo esta aprobado.
- Que orden esta en produccion.
- Que compra esta pendiente.
- Si el proyecto sigue siendo rentable.

### Pantalla de Produccion

Debe funcionar como tablero operativo.

Vistas recomendadas:

- Lista de ordenes.
- Kanban por estado.
- Calendario de maquinas.
- Vista por maquina.
- Vista por operador.

Cada orden debe mostrar:

- Proyecto.
- Tipo de trabajo.
- Maquina.
- Operador.
- Estado.
- Tiempo estimado.
- Tiempo real.
- Material.
- Prioridad.

### Pantalla de Inventario

Debe estar orientada a busqueda y control.

Debe mostrar:

- Codigo.
- Nombre.
- Categoria.
- Stock actual.
- Stock reservado.
- Stock disponible.
- Stock minimo.
- Ubicacion.
- Costo.
- Estado.

Debe resaltar:

- Stock bajo.
- Material reservado.
- Material sin costo definido.
- Material sin proveedor.

### Pantalla de Cotizacion

Debe permitir crear cotizaciones rapido.

Debe incluir:

- Datos del cliente.
- Items cotizados.
- Costos estimados.
- Margen.
- Descuentos.
- Impuestos.
- Total.
- Condiciones.
- Vista previa PDF.
- Historial de versiones.

### Experiencia Movil

La version movil debe priorizar operaciones rapidas:

- Ver tareas asignadas.
- Actualizar estado de orden.
- Registrar tiempo.
- Subir foto de evidencia.
- Consultar proyecto.
- Ver materiales requeridos.
- Registrar inspeccion simple.

No es necesario que todas las funciones administrativas sean comodas en movil, pero las operaciones de taller si deben serlo.

## MVP Recomendado

### Version 1

Debe incluir:

- Login y usuarios basicos.
- Clientes.
- Solicitudes.
- Cotizaciones.
- Proyectos.
- Archivos por proyecto.
- Tareas.
- Ordenes de trabajo.
- Maquinas.
- Inventario basico.
- Compras basicas.
- Control de calidad simple.
- Entregas.
- Costos estimados vs reales.
- Dashboard inicial.

### Version 2

Puede incluir:

- Reportes avanzados.
- Programacion visual de maquinas.
- Versionado avanzado de archivos.
- Plantillas de cotizacion.
- Plantillas de inspeccion.
- Reservas automaticas de inventario.
- Analisis de rentabilidad mas detallado.
- Auditoria completa.

### Version 3

Puede incluir:

- Integracion con impresoras 3D.
- Integracion con facturacion electronica.
- Integracion con contabilidad.
- Notificaciones automaticas.
- App movil dedicada.
- Multiempresa.
- Automatizaciones por reglas.

## Reglas de Negocio Iniciales

- Una cotizacion aprobada debe poder convertirse en proyecto.
- Un proyecto debe tener al menos un responsable.
- Una orden de trabajo debe pertenecer a un proyecto.
- Una orden de trabajo de produccion debe tener tipo de trabajo.
- Una orden de trabajo puede tener maquina asignada cuando aplique.
- Solo archivos aprobados deben poder marcarse como listos para fabricacion.
- El inventario disponible debe considerar stock actual menos stock reservado.
- Los ajustes de inventario deben registrar motivo.
- Los cambios de costo deben quedar auditados.
- Un proyecto no deberia cerrarse si tiene ordenes abiertas.
- Un proyecto no deberia cerrarse si tiene entregas pendientes.
- Una inspeccion rechazada debe permitir crear retrabajo.
- Los costos reales deben mantenerse separados de los costos estimados.

## Reportes Necesarios

### Reportes Operativos

- Proyectos activos por estado.
- Ordenes de trabajo por estado.
- Produccion por maquina.
- Produccion por operador.
- Tareas vencidas.
- Fallas por tipo de trabajo.
- Retrabajos por proyecto.

### Reportes de Inventario

- Stock bajo.
- Movimientos por item.
- Consumo por proyecto.
- Materiales mas usados.
- Materiales sin movimiento.
- Valor de inventario.

### Reportes Comerciales

- Cotizaciones por estado.
- Tasa de aprobacion.
- Ventas por cliente.
- Ventas por periodo.
- Proyectos aprobados por mes.

### Reportes Financieros

- Rentabilidad por proyecto.
- Margen estimado vs real.
- Costos por categoria.
- Horas facturadas vs no facturadas.
- Compras por proyecto.
- Proyectos con perdida.

## Criterios de Exito

El sistema sera exitoso si permite:

- Saber rapidamente en que estado esta cada proyecto.
- Evitar fabricar con archivos incorrectos.
- Controlar mejor el consumo de materiales.
- Reducir olvidos y trabajos pendientes.
- Saber que maquinas estan disponibles.
- Mejorar la precision de cotizaciones.
- Detectar proyectos no rentables.
- Reducir retrabajos por falta de informacion.
- Tener historial tecnico y comercial de cada cliente.
- Operar el taller con menos dependencia de mensajes dispersos.

## Riesgos a Considerar

- Crear un sistema demasiado complejo para una empresa pequena.
- No controlar versiones de archivos desde el inicio.
- No separar costos estimados de costos reales.
- Hacer inventario demasiado rigido.
- No contemplar fallas y retrabajos.
- No registrar horas reales de trabajo.
- Descuidar la experiencia movil para el taller.
- Depender demasiado de integraciones externas en la primera version.
- No definir permisos para informacion sensible.

## Prioridad General de Desarrollo

La prioridad recomendada es:

1. Clientes, solicitudes y cotizaciones.
2. Proyectos y tareas.
3. Archivos tecnicos.
4. Ordenes de trabajo y maquinas.
5. Inventario y compras.
6. Costos reales.
7. Calidad y entregas.
8. Dashboard.
9. Reportes.
10. Integraciones futuras.

## Conclusion

El software debe funcionar como el centro operativo de una empresa de fabricacion digital y proyectos mecatronicos. Su valor principal no esta en reemplazar una contabilidad completa, sino en dar control real sobre proyectos, archivos, produccion, costos, materiales y entregas.

La primera version debe ser suficientemente simple para usarse todos los dias, pero con una estructura solida para crecer hacia integraciones, reportes avanzados y automatizaciones.
