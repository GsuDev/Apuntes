# 📚 Apuntes de PL/SQL - Tema 6

## 🎯 Objetivos
- Ampliar el lenguaje SQL con utilidades adicionales.
- Incorporar elementos de programación estructurada (bucles, condiciones, funciones) en SQL.

## 📖 Contenidos
1. [Introducción](#-1-introducción)
2. [Arquitectura](#️-2-arquitectura)
3. [Conceptos básicos](#-3-conceptos-básicos)
4. [Procedimientos]()
5. [Funciones](#-5-funciones)
6. [Control de flujo](#-6-instrucciones-de-control-de-flujo)
7. [Excepciones](#️-7-plsql-excepción)

---

## 🔹 1. Introducción
PL/SQL es el lenguaje procedimental de Oracle que permite:
- Usar condiciones y bucles como en lenguajes de 3ª generación (Java, C++).
- Realizar tareas administrativas, validación avanzada y consultas complejas.

**Ejemplo en otros SGBD:**
```sql
-- SQL Server usa TRANSACT SQL
-- Informix usa INFORMIX 4GL
```

---

## 🏗️ 2. Arquitectura
- **Código PL/SQL** = PL/SQL + Sentencias SQL
- **Motor PL/SQL**: Ejecuta el código PL/SQL.
- **SQL Statement Executor**: Ejecuta las sentencias SQL.

**Beneficios**:
- Modularidad 🧩
- Integración con Oracle 🔄
- Portabilidad 🧳
- Manejo de excepciones ⚠️

---

## 📝 3. Conceptos básicos

### 🔠 Estructura de un bloque PL/SQL
```sql
[DECLARE
    -- Declaraciones de variables
    v_numero NUMBER := 10;
]
BEGIN
    -- Instrucciones ejecutables
    DBMS_OUTPUT.PUT_LINE('El valor es: ' || v_numero);
[EXCEPTION
    -- Manejo de errores
    WHEN OTHERS THEN
        DBMS_OUTPUT.PUT_LINE('Error!');
]
END;
```

### 📌 Tipos de datos comunes
| Tipo | Descripción | Ejemplo |
|------|-------------|---------|
| `VARCHAR2` | Texto variable | `nombre VARCHAR2(50)` |
| `NUMBER` | Número | `precio NUMBER(8,2)` |
| `DATE` | Fecha | `fecha DATE` |
| `BOOLEAN` | Lógico | `es_valido BOOLEAN` |

### ➗ Operadores
```sql
v_total := v_precio * v_cantidad;  -- Asignación con :=
v_nombre := 'Juan' || ' Pérez';    -- Concatenación con ||
```

---

## 🛠️ 4. Procedimientos

### 🔍 **Definición y Estructura Básica**
Un procedimiento almacenado es un bloque de código PL/SQL con nombre que se guarda en la base de datos y puede ser invocado mediante una llamada.

**Estructura básica**:
```sql
CREATE [OR REPLACE] PROCEDURE nombre_procedimiento
    [(parámetro1 [IN|OUT|IN OUT] tipo_dato, ...)]
IS | AS
    -- Declaración de variables locales
BEGIN
    -- Código ejecutable
[EXCEPTION
    -- Manejo de excepciones]
END [nombre_procedimiento];
```

### 🛠️ **Tipos de Parámetros**
| Tipo | Descripción | Ejemplo |
|------|-------------|---------|
| **IN** (Por defecto) | Solo entrada | `p_id IN NUMBER` |
| **OUT** | Solo salida | `p_resultado OUT VARCHAR2` |
| **IN OUT** | Entrada y salida | `p_contador IN OUT NUMBER` |

---

**Ejecutar**:
```sql
EXEC aumentar_precio(15);  -- Aumenta un 15%
```

---

## 📊 5. Funciones
**Crear una función**:
```sql
CREATE OR REPLACE FUNCTION calcular_iva (
    p_monto IN NUMBER
) RETURN NUMBER IS
    v_iva NUMBER;
BEGIN
    v_iva := p_monto * 0.21;  -- IVA del 21%
    RETURN v_iva;
END;
/
```

**Usar en SQL**:
```sql
SELECT producto, precio, calcular_iva(precio) AS iva 
FROM productos;
```

---

## 🔄 6. Instrucciones de control de flujo

### 🔂 Bucles
**WHILE**:
```sql
DECLARE
    i NUMBER := 1;
BEGIN
    WHILE i <= 5 LOOP
        DBMS_OUTPUT.PUT_LINE('Número: ' || i);
        i := i + 1;
    END LOOP;
END;
/
```

**FOR**:
```sql
BEGIN
    FOR i IN 1..5 LOOP
        DBMS_OUTPUT.PUT_LINE('Tabla del ' || i);
        FOR j IN 1..10 LOOP
            DBMS_OUTPUT.PUT_LINE(i || ' x ' || j || ' = ' || (i*j));
        END LOOP;
    END LOOP;
END;
/
```

### ❓ Condicionales
**IF-THEN-ELSE**:
```sql
DECLARE
    v_nota NUMBER := 7;
BEGIN
    IF v_nota >= 5 THEN
        DBMS_OUTPUT.PUT_LINE('Aprobado 🎉');
    ELSE
        DBMS_OUTPUT.PUT_LINE('Suspendido 😢');
    END IF;
END;
/
```

---

## ⚠️ 7. PL/SQL Excepción

### 🚨 Excepciones predefinidas
| Excepción | Error Oracle | Descripción |
|-----------|--------------|-------------|
| `NO_DATA_FOUND` | ORA-01403 | Consulta sin resultados |
| `TOO_MANY_ROWS` | ORA-01422 | Consulta devuelve múltiples filas |
| `ZERO_DIVIDE` | ORA-01476 | División por cero |

**Ejemplo**:
```sql
DECLARE
    v_resultado NUMBER;
BEGIN
    v_resultado := 10 / 0;  -- Provoca ZERO_DIVIDE
EXCEPTION
    WHEN ZERO_DIVIDE THEN
        DBMS_OUTPUT.PUT_LINE('Error: División por cero ❌');
    WHEN OTHERS THEN
        DBMS_OUTPUT.PUT_LINE('Error inesperado: ' || SQLERRM);
END;
/
```

### 🛑 Excepciones personalizadas
```sql
DECLARE
    e_saldo_insuficiente EXCEPTION;
    v_saldo NUMBER := 100;
    v_retiro NUMBER := 200;
BEGIN
    IF v_retiro > v_saldo THEN
        RAISE e_saldo_insuficiente;
    END IF;
EXCEPTION
    WHEN e_saldo_insuficiente THEN
        DBMS_OUTPUT.PUT_LINE('Saldo insuficiente 💸');
END;
/
```

---

## 📌 Resumen final
PL/SQL es un lenguaje poderoso para:
- Extender SQL con lógica procedural.
- Crear procedimientos y funciones reutilizables.
- Manejar errores de forma estructurada.
- Optimizar operaciones complejas en Oracle.

**¡Dominar PL/SQL te convertirá en un experto en bases de datos Oracle!** 🚀