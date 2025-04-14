from PIL import Image, ImageDraw, ImageFont

# Configuración
texto = "Jesus Aparicio"
ancho, alto = 1920, 1080
tamaño_fuente = 30
color_texto = (255, 255, 255)  # Negro
color_fondo = (0, 0, 0)  # Blanco

# Crear imagen
imagen = Image.new("RGB", (ancho, alto), color_fondo)
dibujo = ImageDraw.Draw(imagen)
fuente = ImageFont.load_default(tamaño_fuente)  # O usa una fuente personalizada

# Repetir texto en toda la imagen
for y in range(0, alto, tamaño_fuente + 10):
    for x in range(0, ancho, tamaño_fuente * len(texto)):
        dibujo.text((x, y), texto, fill=color_texto, font=fuente)

# Guardar imagen
imagen.save("texto_repetido_1080p.png")
print("¡Imagen generada!")