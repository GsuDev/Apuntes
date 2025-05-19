### **Dependencias**
#### Gradle (build.gradle.kts):
```kotlin
dependencies {
    implementation("mysql:mysql-connector-java:8.0.33") // Verificar versión más reciente
}
```

#### Maven (pom.xml):
```xml
<dependency>
    <groupId>mysql</groupId>
    <artifactId>mysql-connector-java</artifactId>
    <version>8.0.33</version> <!-- Verificar versión más reciente -->
</dependency>
```

---

### **Conexión Básica**
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

---

### **Funciones Utiles (CRUD)**

#### 1. Ejecutar Consulta SELECT (Leer)
```kotlin
fun selectWithParams(
    sql: String,
    params: List<Any> = emptyList()
): Result<List<Map<String, Any?>>> {
    return try {
        getConnection().use { conn ->
            conn.prepareStatement(sql).use { stmt ->
                // Asignar parámetros
                params.forEachIndexed { index, value ->
                    when (value) {
                        is String -> stmt.setString(index + 1, value)
                        is Int -> stmt.setInt(index + 1, value)
                        is Double -> stmt.setDouble(index + 1, value)
                        is Boolean -> stmt.setBoolean(index + 1, value)
                        is Date -> stmt.setDate(index + 1, java.sql.Date(value.time))
                        else -> stmt.setObject(index + 1, value)
                    }
                }

                // Ejecutar consulta
                val rs = stmt.executeQuery()
                val metaData = rs.metaData
                val results = mutableListOf<Map<String, Any?>>()

                // Procesar resultados
                while (rs.next()) {
                    val row = mutableMapOf<String, Any?>()
                    for (i in 1..metaData.columnCount) {
                        try {
                            row[metaData.getColumnName(i)] = rs.getObject(i)
                        } catch (e: SQLException) {
                            row[metaData.getColumnName(i)] = null
                            // Opcional: registrar el error
                            println("Error al leer columna ${metaData.getColumnName(i)}: ${e.message}")
                        }
                    }
                    results.add(row)
                }

                Result.success(results)
            }
        }
    } catch (e: SQLException) {
        println("Error SQL: ${e.message}\nConsulta: $sql")
        Result.failure(e)
    } catch (e: Exception) {
        println("Error inesperado: ${e.javaClass.simpleName}: ${e.message}")
        Result.failure(e)
    }
}
```

#### 2. Ejecutar INSERT/UPDATE/DELETE
```kotlin
fun executeUpdate(
    sql: String,
    params: Map<String, Any> = emptyMap()
): Int {
    getConnection().use { conn ->
        conn.prepareStatement(sql).use { stmt ->
            params.forEach { (key, value) ->
                stmt.setObject(key.replaceFirstChar { "" }, value)
            }
            
            return stmt.executeUpdate()
        }
    }
}
```

---

### **Ejemplos de Uso**

#### Consulta SELECT:
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

#### INSERT:
```kotlin
val filasAfectadas = executeUpdate(
    "INSERT INTO usuarios (nombre, email) VALUES (:nombre, :email)",
    mapOf(
        "nombre" to "Ana",
        "email" to "ana@example.com"
    )
)
```

#### UPDATE:
```kotlin
executeUpdate(
    "UPDATE usuarios SET nombre = :nombre WHERE id = :id",
    mapOf("nombre" to "Ana Pérez", "id" to 1)
)
```

#### DELETE:
```kotlin
executeUpdate("DELETE FROM usuarios WHERE id = :id", mapOf("id" to 5))
```

---

### **Tips Importantes**
1. **Parámetros con Nombres:** Usar `:nombreParametro` en la consulta SQL
2. **Cierre Automático:** Se usa `.use{}` para cerrar recursos automáticamente
3. **Excepciones:** Manejar `SQLException` con try-catch
4. **Seguridad:** Siempre usar `PreparedStatement` para prevenir SQL Injection
5. **Conexiones Pool:** Para producción considerar HikariCP u otro pool

---

### **Plantilla de Conexión Avanzada (SSL/Timezone)**
```kotlin
val url = "jdbc:mysql://host:puerto/bd?" +
          "useSSL=true&" +
          "requireSSL=true&" +
          "serverTimezone=UTC"
```

---

### **Notas Finales**
- Para transacciones manuales: `conn.autoCommit = false` + `commit()`/`rollback()`
- Usar `?` en lugar de `:nombre` para parámetros posicionales
- Considerar ORM como Exposed o Hibernate para proyectos complejos

¡Listo para copiar/pegar y adaptar! 😊