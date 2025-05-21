
# Apuntes Examen Kotlin + SQL + JavaFX

## **Dependencias**

### Gradle (build.gradle.kts):

```kotlin
dependencies {
    implementation("mysql:mysql-connector-java:8.0.33") // Verificar versión más reciente
}
```

### Maven (pom.xml):

- Para MySQL

```xml
<dependency>
    <groupId>mysql</groupId>
    <artifactId>mysql-connector-java</artifactId>
    <version>8.0.33</version> <!-- Verificar versión más reciente -->
</dependency>
```

- Para Oracle XE

```xml
<dependency>
    <groupId>com.oracle.database.jdbc</groupId>
    <artifactId>ojdbc8</artifactId>
    <version>12.2.0.1</version>
</dependency>

```

---

## **Conexión Básica**

- Para MySQL

```kotlin
import java.sql.DriverManager
import java.sql.Connection

fun getConnection(): Connection {
    val dbName = "nombreDB"
    val url = "jdbc:mysql://localhost:3306/${dbName}"
    val user = "root" // Para MySQL
    val password = "" // Vacío por defecto para MySQL

    return DriverManager.getConnection(url, user, password)
}
```

- Para Oracle XE

```kotlin
val connection = DriverManager.getConnection(
  "jdbc: oracle: thin: @localhost:1521: XE" ,
  "CAMBIAR(NOMBRE USUARIO)",
  "CAMBIAR(CONTRASEÑA USUARIO)"
)
```

---

## **Funciones Utiles (CRUD)**

### 1. Ejecutar Consulta SELECT (Leer)

#### Para get por un parametro
```kotlin
fun getContactoById(id: Int): Contacto? {
    var connection: Connection? = null
    var preparedStatement: PreparedStatement? = null
    var resultSet: ResultSet? = null

    return try {
      connection = getConnection()
      val query = "SELECT id, nombre, apellidos, telefono, direccion, fecha_nacimiento FROM agenda WHERE id = ?"
      preparedStatement = connection.prepareStatement(query)
      preparedStatement.setInt(1, id)
      resultSet = preparedStatement.executeQuery()

      if (resultSet.next()) {
        Contacto(
          id = resultSet.getInt("id"),
          nombre = resultSet.getString("name"),
          apellidos = resultSet.getString("description"),
          telefono = resultSet.getInt("telefono"),
          direccion = resultSet.getString("direccion"),
          fechaNacimiento = resultSet.getString("fecha_nacimiento").toString()
        )
      } else {
        null
      }
    } catch (e: Exception) {
      e.printStackTrace()
      null
    } finally {
      resultSet?.close()
      preparedStatement?.close()
      connection?.close()
    }
  }
```

#### Sin parámetro (traer todos)

```kotlin
fun getContactos(): ArrayList<Contacto> {
    val contactos = ArrayList<Contacto>()
    var connection: Connection? = null
    var statement: Statement? = null
    var resultSet: ResultSet? = null

    try {
      connection = getConnection()
      val query = "SELECT id, nombre, apellidos, telefono, direccion, fecha_nacimiento FROM contacto"
      statement = connection.createStatement()
      resultSet = statement.executeQuery(query)

      while (resultSet.next()) {
        contactos.add(
          Contacto(
            id = resultSet.getInt("id"),
            nombre = resultSet.getString("nombre"),
            apellidos = resultSet.getString("apellidos"),
            telefono = resultSet.getInt("telefono"),
            direccion = resultSet.getString("direccion"),
            fechaNacimiento = resultSet.getString("fecha_nacimiento").toString()
          )
        )
      }
    } catch (e: Exception) {
      e.printStackTrace()
    } finally {
      resultSet?.close()
      statement?.close()
      connection?.close()
    }

    return contactos
  }
```

### 2. Ejecutar INSERT/UPDATE/DELETE

```kotlin
// INSERT - Retorna el Contacto con el ID generado
  fun insertContacto(contacto: Contacto): Contacto? {
    var connection: Connection? = null
    var preparedStatement: PreparedStatement? = null
    var generatedKeys: ResultSet? = null

    return try {
      connection = getConnection()
      val query = """
            INSERT INTO contacto 
            (nombre, apellidos, telefono, direccion, fecha_nacimiento) 
            VALUES (?, ?, ?, ?, ?)
        """.trimIndent()

      // Indicamos que queremos recuperar las claves generadas
      preparedStatement = connection.prepareStatement(query, Statement.RETURN_GENERATED_KEYS)

      preparedStatement.apply {
        setString(1, contacto.nombre)
        setString(2, contacto.apellidos)
        setInt(3, contacto.telefono)
        setString(4, contacto.direccion)
        setString(5, contacto.fechaNacimiento)
      }.executeUpdate()

      // Obtenemos el ID generado
      generatedKeys = preparedStatement.generatedKeys
      if (generatedKeys.next()) {
        val newId = generatedKeys.getInt(1)
        contacto.copy(id = newId)
      } else {
        null
      }
    } catch (e: Exception) {
      e.printStackTrace()
      null
    } finally {
      generatedKeys?.close()
      preparedStatement?.close()
      connection?.close()
    }
  }
```


```kotlin
// UPDATE - Retorna el número de filas afectadas
  fun updateContacto(contacto: Contacto): Int {
    var connection: Connection? = null
    var preparedStatement: PreparedStatement? = null

    return try {
      connection = getConnection()
      val query = """
            UPDATE contacto SET 
            nombre = ?, 
            apellidos = ?, 
            telefono = ?, 
            direccion = ?, 
            fecha_nacimiento = ?
            WHERE id = ?
        """.trimIndent()

      preparedStatement = connection.prepareStatement(query).apply {
        setString(1, contacto.nombre)
        setString(2, contacto.apellidos)
        setInt(3, contacto.telefono)
        setString(4, contacto.direccion)
        setString(5, contacto.fechaNacimiento)
        setInt(6, contacto.id)
      }

      preparedStatement.executeUpdate()
    } catch (e: Exception) {
      e.printStackTrace()
      0
    } finally {
      preparedStatement?.close()
      connection?.close()
    }
  }
```

```kotlin
// DELETE - Retorna el número de filas afectadas
  fun deleteContacto(id: Int): Int {
    var connection: Connection? = null
    var preparedStatement: PreparedStatement? = null

    return try {
      connection = getConnection()
      val query = "DELETE FROM contacto WHERE id = ?"

      preparedStatement = connection.prepareStatement(query).apply {
        setInt(1, id)
      }

      preparedStatement.executeUpdate()
    } catch (e: Exception) {
      e.printStackTrace()
      0
    } finally {
      preparedStatement?.close()
      connection?.close()
    }
  }
```
---

## **Ejemplos de Uso**

### Consulta SELECT:

```kotlin
data class Usuario(val id: Int, val nombre: String)

val usuarios = executeQuery(
    "SELECT id, nombre FROM usuarios WHERE activo = :activo",
    mapOf("activo" to true)
) { rs ->
    Usuario(
        id = rs.getInt("id"),
        nombre = rs.getString("nombre")
    )
}
```

### INSERT:

```kotlin
val filasAfectadas = executeUpdate(
    "INSERT INTO usuarios (nombre, email) VALUES (:nombre, :email)",
    mapOf(
        "nombre" to "Ana",
        "email" to "ana@example.com"
    )
)
```

### UPDATE:

```kotlin
executeUpdate(
    "UPDATE usuarios SET nombre = :nombre WHERE id = :id",
    mapOf("nombre" to "Ana Pérez", "id" to 1)
)
```

### DELETE:

```kotlin
executeUpdate("DELETE FROM usuarios WHERE id = :id", mapOf("id" to 5))
```

---

## **Tips Importantes**

1. **Parámetros con Nombres:** Usar `:nombreParametro` en la consulta SQL
2. **Cierre Automático:** Se usa `.use{}` para cerrar recursos automáticamente
3. **Excepciones:** Manejar `SQLException` con try-catch
4. **Seguridad:** Siempre usar `PreparedStatement` para prevenir SQL Injection
5. **Conexiones Pool:** Para producción considerar HikariCP u otro pool

---

## **Plantilla de Conexión Avanzada (SSL/Timezone)**

```kotlin
val url = "jdbc:mysql://host:puerto/bd?" +
          "useSSL=true&" +
          "requireSSL=true&" +
          "serverTimezone=UTC"
```

---

## **Notas Finales**

- Para transacciones manuales: `conn.autoCommit = false` + `commit()`/`rollback()`
- Usar `?` en lugar de `:nombre` para parámetros posicionales
- Considerar ORM como Exposed o Hibernate para proyectos complejos

¡Listo para copiar/pegar y adaptar! 😊
