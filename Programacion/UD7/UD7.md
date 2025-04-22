# 📝 Apuntes sobre Manejo de Ficheros en Kotlin

## 📂 Tipos de Ficheros

- **Texto plano** (.txt, .xml, .json, etc.) → Legibles con editores de texto.
- **Binarios** (.jpg, .pdf, .docx, etc.) → Contienen datos no solo de texto.

### 🔍 Acceso

- **Secuencial**: Lectura/escritura desde el inicio.
- **Aleatorio**: Acceso directo a cualquier posición.

---

# 📝 Apuntes **Kotlin** sobre Manejo de Ficheros

## 📂 Crear/Verificar Archivos

### Crear archivo vacío

```kotlin
import java.io.File

fun crearArchivo(ruta: String) {
    val file = File(ruta)

    if (!file.exists()) {

      // Si no existe lo crea
      file.createNewFile()
      println("✅ Archivo creado: ${file.absolutePath}")
    } else {
      // Si existe lo avisa
      println("⚠️ Ya existe: ${file.name}")
    }

}

// Uso:
crearArchivo("datos.txt")
```

### Crear archivo con contenido (con FileWriter)

```Kotlin
fun createFileOf(pathName: String, content: String): File {
  // Convertimos a Path
  val path = Path(pathName)
  // Obtenemos el directorio padre si no es un directorio
  val parentPath = if (!path.isDirectory()) path.parent else path

  // Instanciamos el archivo
  val file = File(parentPath.toString(), "fichero.txt")

  try {
    // Crea el archivo si no existe
    if (!file.exists()) {
      file.createNewFile()
      println("✅ El archivo ${file.name} ha sido creado")
    } else {
      println("⚠️ El archivo ${file.name} ya existía, se sobrescribirá su contenido")
    }

    // Escribimos el contenido
    val fileWriter = FileWriter(file)
    fileWriter.use {
      it.write(content)
    }
    println("✅ Se ha escrito en el archivo ${file.name}")

  } catch (e: Exception) {
    println("❌ Error al crear/escribir el archivo: ${e.message}")
    throw e
  }

  return file
}
```

---

## ✍️ Escribir (3 métodos Kotlin)

### 1. `writeText` (sobrescribe)

```kotlin
File("datos.txt").writeText("Contenido nuevo")
```

### 2. `appendText` (añade al final)

```kotlin
File("datos.txt").appendText("\nLínea añadida")
```

### 3. `bufferedWriter` (eficiente para grandes datos)

```kotlin
File("datos.txt").bufferedWriter().use { writer ->
  writer.write("Línea 1\n")
  writer.write("Línea 2\n")
}
```

---

## 📖 Leer (3 métodos Kotlin)

### 1. `readText` (todo el contenido)

```kotlin
val texto = File("datos.txt").readText()
println(texto)
```
### 2. Imprimir un archivo

```kotlin
fun printFile(pathName: String) {
  // Instanciamos el archivo
  val file = File(pathName)

  // Realizamos las comprobaciones previas
  if (file.isDirectory){
    println("❌ La ruta proporcionada no corresponde a un archivo")
    return
  } else if (!file.exists()) {
    println("❌ El archivo no existe")
    return
  }
  
  // Leemos el archivo manejando las excepciones
  try {
    FileReader(file).use {
      println(it.readText())
      // println((it.readLines())[0]) // Imprime solo la primera línea
    }
  } catch (e:IOException){
    println("❌ Se ha producido un error al leer el archivo")
  }
}
```

### 3. `readLines` (lista de líneas)

```kotlin
File("datos.txt").readLines().forEach { println("> $it") }
```

### 4. `forEachLine` (línea por línea)

```kotlin
File("datos.txt").forEachLine { println("Línea: $it") }
```

---

## 🗑️ Borrar/Copiar

```kotlin
// Borrar
File("datos.txt").takeIf { it.exists() }?.delete()

// Copiar (Kotlin style)
File("origen.txt").copyTo(File("destino.txt"), overwrite = true)
```

---

## 🔄 Acceso Aleatorio (Kotlin + `RandomAccessFile`)

**1. Métodos**

- `file.seek(pos)`: Coloca en la posicion pasada por parametro el cursor.
- `file.read(buffer)`: Lee

```kotlin
import java.io.RandomAccessFile

RandomAccessFile("datos.bin", "rw").use {
  file ->
    file.seek(10)  // Posiciona el puntero
    file.writeUTF("Kotlin")  // Escribe String
    file.seek(0)
    println("Leído: ${file.readUTF()}")
}
```

## 🗂️Archivos binarios

**1. Leer archivos binarios:**

```kotlin
// Función que lee un archivo binario y devuelve su contenido como un array de bytes
fun leeFicheroBinario(nombreArchivo: String): ByteArray? {
  var fis: FileInputStream? = null // Declaramos la variable para el flujo de entrada
  var listaDeBytes: ByteArray? = null // Aquí guardaremos los datos del archivo

  try {
    val file = File(nombreArchivo) // Creamos un objeto File con el nombre recibido

    if (file.exists()) { // Verificamos si el archivo realmente existe
      fis = FileInputStream(file) // Abrimos el archivo con un flujo de entrada binario
      listaDeBytes = fis.readBytes() // Leemos todos los bytes del archivo y los guardamos en el array

      // Mostramos por consola el tamaño del archivo en bytes
      println("Tamaño del archivo: ${listaDeBytes.size} bytes")

      // Mostramos el contenido del array de bytes (puede ser largo, ojo con archivos grandes)
      println(listaDeBytes.joinToString(separator = " "))
    } else {
      // Si el archivo no existe, mostramos un mensaje de error
      println("El fichero $nombreArchivo no existe")
    }
  } catch (e: IOException) {
    // Si ocurre un error al leer el archivo, lo mostramos
    println("Error al leer el archivo: ${e.message}")
  } finally {
    try {
      // Intentamos cerrar el flujo de entrada si se abrió correctamente
      fis?.close()
    } catch (e: IOException) {
      // Si hay un error al cerrar, también lo mostramos
      println("Error al cerrar el archivo: ${e.message}")
    }
  }
  // Devolvemos el contenido leído (o null si no se leyó nada)
  return listaDeBytes
}
```

**2. Escribir archivos binarios:**
![](img/p1.png)

![](img/p3.png)

---

## 📁 Directorios

### Listar contenido

```kotlin
fun ls(file: File){
  if (file.isDirectory) {
    // Guarda el nombre de los archivos y carpetas contenidos
    val content: Array<String!>! = file.list()

    // Crea dos arrays donde guardaremos los nombres 
    // de los archivos y de los directorios
    val files = ArrayList<String>()
    val directories = ArrayList<String>()

    // Recorre el array
    content?.forEach { childName ->
      // Imprime el nombre del hijo
      println(childName)
      // Instancia el fichero
      val child = File(childName)
      // Según sea archivo o directorio lo añade a la lista correspondiente
      if (child.isFile) files.add(childName)
      if (child.isDirectory) files.add(childName)
    }
    // Imprime la cuenta de cada uno
    println("El directorio ${file.name} contiene:\n" +
     "${files.size} archivos\n" +
     "${directories.size} directorios"
    )
  }
}
```

### 🔗 Recursos

- **Clase File** [(Java Docs)](https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/io/File.html)  
  -- **Referencia oficial**: [Kotlin File Handling](https://kotlinlang.org/docs/io.html)
