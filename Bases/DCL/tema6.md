# 📚 **Tema 5: Lenguaje de Control de Datos (DCL)** 🛡️  

El **DCL (Data Control Language)** es un componente esencial en bases de datos que permite **administrar el acceso y los permisos** de los usuarios sobre los objetos (tablas, vistas, procedimientos, etc.).

> 💭 Recuerda: <br>
> Para poder asignar elementos del sistema a usuarios normales debes ejecutar cada vez que inicies sesión `ALTER SESSION SET "_oracle_script"=TRUE;`

---

## 1. 👥 **Usuarios**
### 🔹 **¿Qué son?**
Los **usuarios** son entidades que interactúan con la base de datos. Cada uno tiene permisos específicos para realizar acciones.  

### 🔹 **Operaciones clave:**  
- **Crear un usuario** (`CREATE USER`):  
  - Define nombre, contraseña, tablespace por defecto y cuota de almacenamiento.  
  - Ejemplo:  
    ```sql
    CREATE USER Ana IDENTIFIED BY "1234" 
    DEFAULT TABLESPACE users QUOTA 10M ON users;
    ```  

- **Modificar un usuario** (`ALTER USER`):  
  - Cambia contraseña, tablespace, bloqueo/desbloqueo, etc.  
  - Ejemplo:  
    ```sql
    ALTER USER Ana QUOTA UNLIMITED ON system;
    ```  

- **Eliminar un usuario** (`DROP USER`):  
  - Borra el usuario y, opcionalmente, todos sus objetos con `CASCADE`.  
  - Ejemplo:  
    ```sql
    DROP USER Ana CASCADE;
    ```  

De esta forma para crear un usuario completo sin privilegios:

```sql
CREATE USER usuario IDENTIFIED BY contraseña
DEFAULT TABLESPACE SYSTEM -- Tablespace mas comun
TEMPORARY TABLESPACE TEMP -- Tablespace temporal mas comun
QUOTA 100M ON SYSTEM -- sin esto no puede obtener el permiso create table
```

---

## 2. 🔑 **Permisos (Privilegios)**  
### 🔹 **¿Qué son?**  
Los **permisos** determinan qué acciones puede realizar un usuario sobre la base de datos.  

### 🔹 **Tipos de permisos:**  
1. **De sistema** (ejecutar acciones globales):  
   - `CREATE SESSION` (conectarse a la BD).  
   - `CREATE TABLE` (crear tablas).  
   - `CREATE USER` (crear usuarios).  

2. **De objeto** (sobre tablas/vistas de otros):  
   - `SELECT`, `INSERT`, `UPDATE`, `DELETE` (sobre una tabla).  

### 🔹 **Operaciones clave:**  
- **Conceder permisos** (`GRANT`):  
  ```sql
  GRANT SELECT, INSERT ON empleados TO Juan;
  ```  
  - `WITH GRANT OPTION` permite que Juan dé esos permisos a otros.  

- **Revocar permisos** (`REVOKE`):  
  ```sql
  REVOKE SELECT ON empleados FROM Juan;
  ```  

📌 **Tablas útiles:**  
- `DBA_SYS_PRIVS` → Privilegios de sistema.  
- `USER_TAB_PRIVS` → Permisos sobre tablas.  

---

## 3. 🎭 **Roles**  
### 🔹 **¿Qué son?**  
Los **roles** son grupos de permisos que se asignan a usuarios para simplificar la administración.  

### 🔹 **Operaciones clave:**  
- **Crear un rol**:  
  ```sql
  CREATE ROLE rol_lectura;
  GRANT SELECT ON libros TO rol_lectura;
  ```  

- **Asignar rol a usuario**:  
  ```sql
  GRANT rol_lectura TO María;
  ```  

- **Borrar un rol**:  
  ```sql
  DROP ROLE rol_lectura;
  ```  

📌 **Tablas útiles:**  
- `DBA_ROLES` → Lista de roles.  
- `USER_ROLE_PRIVS` → Roles asignados a un usuario.  
- `ALL_TABLES` → Todas las tablas del server
- `DBA_SYS_PRIVS` → Privilegios de todos los usuarios
---

## 4. 🔄 **Sinónimos**  
### 🔹 **¿Qué son?**  
Alias para referirse a objetos (ej: `Ana.empleados` → `emp_ana`).  

### 🔹 **Tipos:**  
- **Privados** (solo para un usuario).  
- **Públicos** (para todos los usuarios).  

### 🔹 **Operaciones clave:**  
- **Crear sinónimo**:  
  ```sql
  CREATE SYNONYM emp_ana FOR Ana.empleados;
  ```  

- **Borrar sinónimo**:  
  ```sql
  DROP SYNONYM emp_ana;
  ```  

---

## 5. 👀 **Vistas**  
### 🔹 **¿Qué son?**  
Consultas almacenadas como "tablas virtuales".  

### 🔹 **Operaciones clave:**  
- **Crear vista**:  
  ```sql
  CREATE VIEW libros_caros AS
  SELECT * FROM libros WHERE precio > 20;
  ```  

- **Vista de solo lectura**:  
  ```sql
  CREATE VIEW vista_segura AS
  SELECT * FROM empleados WITH READ ONLY;
  ```  

- **Borrar vista**:  
  ```sql
  DROP VIEW libros_caros;
  ```  

---

## 6. 💾 **Tablespaces**  
### 🔹 **¿Qué son?**  
Espacios de almacenamiento lógico en disco donde se guardan los datos.  

### 🔹 **Operaciones clave:**  
- **Crear tablespace**:  
  ```sql
  CREATE TABLESPACE ventas 
  DATAFILE 'ventas.ora' SIZE 100M;
  ```  

- **Autoextensión**:  
  ```sql
  ALTER TABLESPACE ventas
  ADD DATAFILE 'ventas2.ora' SIZE 50M AUTOEXTEND ON;
  ```  

- **Asignar a usuario**:  
  ```sql
  CREATE USER Pedro IDENTIFIED BY "abcd"
  DEFAULT TABLESPACE ventas;
  ```  

---

## 🎯 **Conclusión**  
El **DCL** permite:  
✅ **Controlar acceso** con usuarios y permisos.  
✅ **Simplificar gestión** con roles.  
✅ **Organizar datos** con tablespaces.  
✅ **Optimizar consultas** con vistas y sinónimos.  

¡Dominar el DCL es clave para la **seguridad y eficiencia** en bases de datos! 🚀