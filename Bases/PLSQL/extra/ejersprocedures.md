# 📝 **Procedimientos en PL/SQL** - Sección Extendida con Ejercicios Resueltos

## 📌 **Ejercicios Resueltos**

### **Ejercicio 1: Procedimiento para aumentar precios en 10%**
*(Página 52 del material)*

```sql
CREATE OR REPLACE PROCEDURE pa_libros_aumentar10 
AS
BEGIN
    UPDATE libros SET precio = precio * 1.10; -- Aumento del 10%
    DBMS_OUTPUT.PUT_LINE('Precios actualizados correctamente');
    COMMIT;
EXCEPTION
    WHEN OTHERS THEN
        DBMS_OUTPUT.PUT_LINE('Error: ' || SQLERRM);
        ROLLBACK;
END pa_libros_aumentar10;
/

-- Ejecución:
EXEC pa_libros_aumentar10;
```

### **Ejercicio 2: Procedimiento con parámetros (editorial y porcentaje)**
*(Página 55 del material)*

```sql
CREATE OR REPLACE PROCEDURE pa_libros_aumentar (
    p_editorial IN VARCHAR2,
    p_porcentaje IN NUMBER DEFAULT 10
)
AS
    v_registros_afectados NUMBER;
BEGIN
    UPDATE libros 
    SET precio = precio * (1 + p_porcentaje/100)
    WHERE editorial = p_editorial;
    
    v_registros_afectados := SQL%ROWCOUNT;
    
    DBMS_OUTPUT.PUT_LINE('Libros actualizados: ' || v_registros_afectados);
    COMMIT;
EXCEPTION
    WHEN OTHERS THEN
        DBMS_OUTPUT.PUT_LINE('Error al actualizar: ' || SQLERRM);
        ROLLBACK;
END pa_libros_aumentar;
/

-- Ejecuciones posibles:
EXEC pa_libros_aumentar('Planeta', 15); -- Aumento del 15%
EXEC pa_libros_aumentar('Anaya'); -- Usa el 10% por defecto
```

### **Ejercicio 3: Procedimiento con variables locales (crear tabla para libros de un autor)**
*(Páginas 57-58 del material)*

```sql
CREATE OR REPLACE PROCEDURE crear_tabla_autor (
    p_autor IN VARCHAR2
)
AS
    v_sentencia LONG;
    v_existe_tabla NUMBER;
BEGIN
    -- Verificar si la tabla ya existe
    SELECT COUNT(*) INTO v_existe_tabla
    FROM user_tables
    WHERE table_name = 'LIBROS_AUTOR';
    
    -- Crear tabla si no existe
    IF v_existe_tabla = 0 THEN
        v_sentencia := 'CREATE TABLE libros_autor (
            id_libro NUMBER,
            titulo VARCHAR2(100),
            precio NUMBER(8,2)
        )';
        EXECUTE IMMEDIATE v_sentencia;
    ELSE
        -- Limpiar tabla si ya existe
        EXECUTE IMMEDIATE 'TRUNCATE TABLE libros_autor';
    END IF;
    
    -- Insertar libros del autor especificado
    INSERT INTO libros_autor
    SELECT id, titulo, precio
    FROM libros
    WHERE autor = p_autor;
    
    COMMIT;
    DBMS_OUTPUT.PUT_LINE('Tabla creada/actualizada con libros de ' || p_autor);
EXCEPTION
    WHEN OTHERS THEN
        DBMS_OUTPUT.PUT_LINE('Error: ' || SQLERRM);
        ROLLBACK;
END crear_tabla_autor;
/

-- Ejecución:
EXEC crear_tabla_autor('Gabriel García Márquez');
```

---

## 🔎 **Consultar Procedimientos en el Diccionario de Datos**
*(Páginas 60-61 del material)*

```sql
-- 1. Ver todos los procedimientos del usuario actual
SELECT object_name, created, status
FROM user_objects
WHERE object_type = 'PROCEDURE';

-- 2. Ver código fuente de un procedimiento específico
SELECT text
FROM user_source
WHERE name = 'PA_LIBROS_AUMENTAR'
ORDER BY line;

-- 3. Ver procedimientos que comienzan con 'PA_'
SELECT object_name
FROM user_procedures
WHERE object_name LIKE 'PA\_%' ESCAPE '\';
```

---

### ❎ **Ejercicio 4: Procedimiento que imprima por consola las 5 primeras tablas de multiplicar**

```sql
-- Activa la salida por consola para poder usar DBMS_OUTPUT.PUT_LINE() equivalente a println()
SET SERVEROUTPUT ON;

-- Creo el procedimiento usando el or replace para poder recompilar
CREATE OR REPLACE PROCEDURE PROCEDIMIENTO_TABLAS
AS
 MULTI1 NUMBER(2); -- Primer factor
 MULTI2 NUMBER(2); -- Segundo factor
BEGIN
    MULTI1:= 1; -- Inicializo el primer factor fuera

    -- Itera hasta que el primer factor sea 5
    WHILE (MULTI1 <= 5) LOOP
        MULTI2:= 0; -- Inicializo el segundo factor dentro del primer bucle

        -- Itera hasta que el segundo factor sea 10
        WHILE (MULTI2 <= 10) LOOP
            -- Imprime el producto de multiplicar ambos factores
            DBMS_OUTPUT.PUT_LINE(MULTI1 '*' MULTI2 '=' MULTI1*MULTI2);
            MULTI2:= MULTI2 + 1; -- Incrementa el segundo factor
        END LOOP;
        MULTI1:= MULTI1 + 1; -- Incrementa el primer factor
    END LOOP;
END;


EXEC PROCEDIMIENTO_TABLAS;
```

### ❎ **Ejercicio 4.5: Procedimiento que imprima por consola la tabla de multiplicar por parametro**

```sql
-- Realiza un procedimiento que dado un parámetro de entrada del 1…10 pinte la tabla correspondiente.
CREATE OR REPLACE PROCEDURE PROCEDIMIENTO_TABLA_ELEGIDA(I NUMBER)
AS
 J NUMBER(2);
BEGIN 
    J:= 0;
    WHILE (J <= 10) LOOP
        DBMS_OUTPUT.PUT_LINE(I ||'*'|| J ||'='|| I*J);
        J:= J + 1;
    END LOOP;
END;

EXEC PROCEDIMIENTO_TABLA_ELEGIDA(5);

-- Con LOOP
CREATE OR REPLACE PROCEDURE PROCEDIMIENTO_TABLA_ELEGIDA2(I NUMBER)
AS
 J NUMBER(2);
BEGIN 
    J:= 0;
     LOOP
        DBMS_OUTPUT.PUT_LINE(I ||'*'|| J ||'='|| I*J);
        J:= J + 1;
        EXIT WHEN (J > 10);
    END LOOP;
END;

EXEC PROCEDIMIENTO_TABLA_ELEGIDA2(5);
```

## 🧩 **Ejercicio Adicional Propuesto: Procedimiento para Transferencia entre Cuentas**

```sql
CREATE OR REPLACE PROCEDURE transferencia_bancaria (
    p_cuenta_origen  IN NUMBER,
    p_cuenta_destino IN NUMBER,
    p_monto          IN NUMBER,
    p_resultado      OUT VARCHAR2
)
AS
    v_saldo_origen NUMBER;
BEGIN
    -- Verificar saldo en cuenta origen
    SELECT saldo INTO v_saldo_origen
    FROM cuentas
    WHERE numero_cuenta = p_cuenta_origen
    FOR UPDATE; -- Bloquea el registro
    
    IF v_saldo_origen >= p_monto THEN
        -- Realizar débito en cuenta origen
        UPDATE cuentas
        SET saldo = saldo - p_monto
        WHERE numero_cuenta = p_cuenta_origen;
        
        -- Realizar crédito en cuenta destino
        UPDATE cuentas
        SET saldo = saldo + p_monto
        WHERE numero_cuenta = p_cuenta_destino;
        
        COMMIT;
        p_resultado := 'Transferencia exitosa';
    ELSE
        p_resultado := 'Saldo insuficiente';
        ROLLBACK;
    END IF;
EXCEPTION
    WHEN NO_DATA_FOUND THEN
        p_resultado := 'Cuenta no encontrada';
        ROLLBACK;
    WHEN OTHERS THEN
        p_resultado := 'Error: ' || SUBSTR(SQLERRM, 1, 100);
        ROLLBACK;
END transferencia_bancaria;
/

-- Ejemplo de llamada:
DECLARE
    v_resultado VARCHAR2(100);
BEGIN
    transferencia_bancaria(1001, 2002, 500, v_resultado);
    DBMS_OUTPUT.PUT_LINE(v_resultado);
END;
/
```

## **Ejercicio cursores**

```sql
DECLARE
  CURSOR c_empleados_comision IS
    SELECT apellido, oficio, comision
    FROM empleados
    WHERE comision > 500;
BEGIN
  OPEN c_empleados_comision;
  
  DBMS_OUTPUT.PUT_LINE('Empleados con comisión superior a 500€');
  DBMS_OUTPUT.PUT_LINE('----------------------------------------');
  
  LOOP
    FETCH c_empleados_comision INTO v_apellido, v_oficio, v_comision;
    EXIT WHEN c_empleados_comision%NOTFOUND;
    
    DBMS_OUTPUT.PUT_LINE('Apellido: ' || v_apellido || 
                         ', Oficio: ' || v_oficio || 
                         ', Comisión: ' || v_comision || '€');
  END LOOP;
  
  CLOSE c_empleados_comision;
END;
/
```

---

## 📌 **Consejos para Depurar Procedimientos**

1. **Usa `DBMS_OUTPUT` para seguimiento**:
```sql
DBMS_OUTPUT.PUT_LINE('Valor de variable: ' || v_variable);
```

2. **Maneja todas las excepciones posibles**:
```sql
EXCEPTION
    WHEN DUP_VAL_ON_INDEX THEN
        -- Manejar duplicados
    WHEN TOO_MANY_ROWS THEN
        -- Manejar múltiples filas
    WHEN OTHERS THEN
        -- Manejo genérico
```

3. **Usa `%TYPE` para compatibilidad de tipos**:
```sql
v_saldo cuentas.saldo%TYPE; -- Hereda el tipo de la columna saldo
```