# 🎮 Bot RPG para Discord

Un bot de Discord completo centrado en juegos de rol (RPG) con sistema de combate, personajes, inventario, tienda, misiones y mazmorras.

## 🌟 Características

### 👤 Sistema de Personajes
- **4 Clases jugables**: Guerrero, Mago, Arquero y Clérigo
- **Habilidades únicas por clase** - 3 habilidades especiales para cada rol
- Sistema de niveles y experiencia
- Estadísticas: HP, ATK, DEF, SPD, **Maná**
- **Sistema de reputación** - Tus decisiones afectan tu reputación
- Progresión de personaje con aumento de stats por nivel

### ⚔️ Sistema de Combate Interactivo
- **Combate por turnos donde TÚ decides cada acción**
- Elige entre: Ataque básico, Habilidades especiales, Defender, Usar items
- **Gestión de maná** para habilidades poderosas
- Múltiples tipos de enemigos con habilidades propias
- Sistema de críticos, buffs y debuffs
- Defensa activa para reducir daño
- Recompensas de oro y experiencia
- Sistema de victoria/derrota con penalizaciones

### ✨ Habilidades de Clase
- **Guerrero**: Golpe Poderoso, Escudo de Hierro, Furia Guerrera
- **Mago**: Bola de Fuego, Rayo de Hielo, Tormenta Arcana
- **Arquero**: Disparo Preciso, Lluvia de Flechas, Flecha Perforante
- **Clérigo**: Destello Sagrado, Curación Divina, Juicio Divino

### 🎒 Inventario y Equipo
- Sistema completo de inventario
- Equipamiento: Armas, armaduras y accesorios
- Items consumibles (pociones)
- Sistema de equipar/desequipar con aplicación de stats

### 🏪 Tienda
- Compra de items con oro
- **Múltiples categorías**: Consumibles (pociones de vida y maná), Armas especiales, Armaduras, Accesorios
- **Armas con stats únicos** - Diferentes armas para diferentes estilos
- Items de diferentes niveles y precios

### 🎭 Sistema de Eventos
- **Eventos aleatorios con múltiples decisiones**
- Tus elecciones afectan tu historia personal
- Consecuencias inmediatas: oro, experiencia, items, reputación
- Eventos con probabilidad de éxito/fallo
- Sistema de cooldown para evitar repetición
- **5 eventos únicos** con decisiones morales

### 📜 Misiones
- Sistema de misiones con requisitos
- Diferentes niveles de dificultad
- Recompensas de oro y experiencia
- Seguimiento de progreso

### 🏰 Mazmorras Cooperativas
- **4 Mazmorras épicas** con diferentes dificultades
- **Modo Solitario** - Juega solo o
- **Modo Cooperativo** - ¡Invita amigos y juega en equipo! (hasta 8 jugadores)
- **Salas únicas** con eventos aleatorios (tesoros, trampas, puzzles)
- **Jefes finales** con habilidades especiales
- Recompensas compartidas entre el grupo
- **Bonos de clan** si todos los jugadores son del mismo clan
- Daño distribuido entre miembros del equipo
- Sistema de exploración sala por sala
- Eventos de cooperación y decisiones en grupo

### 🛡️ Sistema de Clanes
- **Crea tu propio clan** por 500 oro
- **Sistema de invitaciones** con botones interactivos
- **Tesorería compartida** - Dona oro para mejorar el clan
- **5 Niveles de clan** con beneficios crecientes:
  - Nivel 1: 5 miembros, sin bonos
  - Nivel 2: 10 miembros, +5% oro y EXP
  - Nivel 3: 15 miembros, +10% oro y EXP
  - Nivel 4: 20 miembros, +15% oro y EXP
  - Nivel 5: 30 miembros, +25% oro y EXP
- **Anuncios de clan** para comunicarte con tus miembros
- **Ranking de clanes** - Compite por ser el mejor
- Sistema de líder de clan con permisos especiales
- Experiencia compartida en mazmorras cooperativas

### 📊 Rankings
- Clasificación por nivel
- Clasificación por oro
- Clasificación por victorias
- **Clasificación de clanes** por nivel y miembros

## 📦 Instalación

### Requisitos previos
- Node.js v16.9.0 o superior
- npm o yarn
- Una aplicación de Discord Bot

### Pasos de instalación

1. **Clona el repositorio**
```bash
git clone https://github.com/18xLenovo/Bot-RPG.git
cd Bot-RPG
```

2. **Instala las dependencias**
```bash
npm install
```

3. **Configura las variables de entorno**
```bash
cp .env.example .env
```

Edita el archivo `.env` y añade tu información:
```env
DISCORD_TOKEN=tu_token_del_bot
CLIENT_ID=tu_client_id
```

### 🔑 Obtener credenciales de Discord

1. Ve al [Portal de Desarrolladores de Discord](https://discord.com/developers/applications)
2. Crea una nueva aplicación o selecciona una existente
3. Ve a la sección "Bot" y copia el **Token** (este es tu `DISCORD_TOKEN`)
4. En "General Information", copia el **Application ID** (este es tu `CLIENT_ID`)
5. En la sección "Bot", habilita estos privilegios:
   - Message Content Intent
   - Server Members Intent (opcional)

6. Para invitar el bot a tu servidor:
   - Ve a "OAuth2" > "URL Generator"
   - Selecciona los scopes: `bot` y `applications.commands`
   - Selecciona los permisos: `Send Messages`, `Read Messages`, `Embed Links`, `Use Slash Commands`
   - Copia la URL generada y ábrela en tu navegador

## 🚀 Uso

### Registrar comandos slash
Antes de iniciar el bot por primera vez, registra los comandos:
```bash
node deploy-commands.js
```

### Iniciar el bot
```bash
npm start
```

## 📖 Comandos disponibles

### Personaje
- `/crear` - Crea tu personaje eligiendo una clase
- `/perfil` - Muestra tu perfil completo con reputación
- `/inventario` - Muestra tu inventario y permite equipar items
- `/habilidades` - Ver tus habilidades especiales de clase

### Combate
- `/combate` - **Combate interactivo** donde eliges cada acción
- `/mazmorra [nombre] [cooperativo]` - Explora mazmorras solo o con amigos

### Clanes
- `/clan crear [nombre]` - Crea tu clan (cuesta 500 oro)
- `/clan info` - Ver información de tu clan
- `/clan invitar [@usuario]` - Invita a alguien a tu clan
- `/clan salir` - Salir de tu clan actual
- `/clan donar [cantidad]` - Donar oro a la tesorería del clan
- `/clan anuncio [mensaje]` - Enviar anuncio a tu clan (solo líder)
- `/clan ranking` - Ver ranking de clanes

### Economía
- `/tienda [categoría]` - Abre la tienda (consumibles, armas, armaduras, accesorios)
- `/usar [item]` - Usa un item consumible (pociones de vida/maná)

### Progreso & Historia
- `/misiones` - Muestra las misiones disponibles y tu progreso
- `/ranking [tipo]` - Muestra la clasificación (nivel, oro, victorias, clanes)
- `/evento` - **Experimenta eventos con decisiones** que afectan tu historia

### Utilidades
- `/ayuda` - Muestra todos los comandos disponibles
- `/borrar` - Elimina tu personaje (permanente, requiere confirmación)

## 🎯 Ejemplo de juego

1. **Crear personaje**
```
/crear clase:guerrero
```

2. **Ver tus habilidades especiales**
```
/habilidades
```

3. **Combate interactivo**
```
/combate
```
- Durante el combate podrás elegir:
  - ⚔️ Ataque básico
  - ✨ Habilidades especiales (usa maná)
  - 🛡️ Defender (reduce daño siguiente turno)
  - 🎒 Usar items (pociones)

4. **Experimentar un evento**
```
/evento
```
- Toma decisiones que afectan tu historia
- Gana reputación, oro, items especiales

5. **Crear o unirte a un clan**
```
/clan crear nombre:LosDragones
/clan invitar @amigo
```

6. **Comprar equipo**
```
/tienda categoria:armas
```

7. **Explorar mazmorra con amigos**
```
/mazmorra nombre:bosque_encantado cooperativo:true
```
- Espera a que tus amigos se unan con el botón
- Explora salas juntos
- ¡Derroten al jefe final en equipo!

8. **Avanzar y subir de nivel**
```
/perfil - Ver tu progreso
/ranking tipo:nivel - Ver tu posición
```

## 🎮 Guía de juego

### Mazmorras Cooperativas - Cómo jugar
1. **Modo Solitario**: Usa `/mazmorra nombre:bosque_encantado` sin activar cooperativo
2. **Modo Cooperativo**: Usa `/mazmorra nombre:bosque_encantado cooperativo:true`
   - Aparecerá un botón "🎮 Unirse a la Mazmorra"
   - Otros jugadores tienen 60 segundos para unirse
   - El creador puede iniciar antes presionando "▶️ Comenzar Ahora"
3. **Durante la mazmorra**:
   - Exploras salas una por una
   - Encuentras tesoros, trampas y puzzles
   - Combates en grupo contra enemigos
   - El daño se distribuye entre todos los jugadores
   - ¡Enfrentan un jefe final épico!
4. **Recompensas**:
   - Todos reciben oro y EXP
   - Si son del mismo clan, el clan también gana EXP
   - Bonos especiales por completar en grupo

### Sistema de Clanes - Cómo funciona
1. **Crear un clan**: Cuesta 500 oro
2. **Invitar miembros**: Usa `/clan invitar @usuario` - recibirán un botón para aceptar
3. **Subir de nivel tu clan**:
   - Los miembros donan oro a la tesorería
   - Completan mazmorras juntos para ganar EXP de clan
   - Al subir de nivel, aumentan: miembros máximos, bonos de oro/EXP
4. **Beneficios por nivel**:
   - Nivel 1: 5 miembros, sin bonos
   - Nivel 2: 10 miembros, +5% oro y EXP
   - Nivel 3: 15 miembros, +10% oro y EXP
   - Nivel 4: 20 miembros, +15% oro y EXP
   - Nivel 5: 30 miembros, +25% oro y EXP (¡máximo!)

## 🗂️ Estructura del proyecto

```
Bot-RPG/
├── commands/                    # Comandos slash del bot
│   ├── ayuda.js
│   ├── borrar.js
│   ├── clan.js                 # Sistema de clanes
│   ├── combate.js
│   ├── crear.js
│   ├── evento.js               # Eventos con decisiones
│   ├── habilidades.js          # Ver habilidades
│   ├── inventario.js
│   ├── mazmorra.js             # Mazmorras cooperativas
│   ├── misiones.js
│   ├── perfil.js
│   ├── ranking.js
│   ├── tienda.js
│   └── usar.js
├── utils/                       # Utilidades y sistemas del juego
│   ├── clanManager.js          # Gestión de clanes
│   ├── coopDungeon.js          # Mazmorras cooperativas
│   ├── combatSystem.js         # Sistema de combate (legacy)
│   ├── interactiveCombat.js    # Sistema de combate interactivo
│   ├── playerManager.js        # Gestión de jugadores
│   ├── gameData.js             # Datos del juego (items, misiones, etc)
│   └── embedBuilder.js         # Constructor de embeds
├── data/                        # Datos guardados (JSON)
│   ├── players.json            # Datos de los jugadores
│   └── clans.json              # Datos de los clanes
├── index.js                     # Archivo principal del bot
├── deploy-commands.js           # Script para registrar comandos
├── package.json
├── .env.example
├── .gitignore
└── README.md
```

## 💾 Almacenamiento de datos

Los datos de los jugadores se guardan en `data/players.json` en formato JSON. El sistema guarda automáticamente después de cada acción importante.

**Nota**: Para un entorno de producción, considera migrar a una base de datos como MongoDB o PostgreSQL.

## 🛠️ Personalización

### Añadir nuevos enemigos
Edita `utils/combatSystem.js` y añade nuevos enemigos al objeto `ENEMIES`:

```javascript
nuevo_enemigo: {
    name: 'Nombre',
    emoji: '😈',
    level: 5,
    hp: 150,
    atk: 20,
    def: 10,
    spd: 8,
    expReward: 100,
    goldReward: 75
}
```

### Añadir items a la tienda
Edita `utils/gameData.js` y añade items a `SHOP_ITEMS`:

```javascript
{
    id: 'item_id',
    name: 'Nombre del Item',
    type: 'weapon', // weapon, armor, accessory, consumible
    stats: { atk: 10, def: 5 },
    price: 200,
    description: 'Descripción'
}
```

### Añadir nuevas clases
Edita `utils/playerManager.js` y añade clases a `CLASSES`:

```javascript
nueva_clase: {
    name: 'Nueva Clase',
    emoji: '🎯',
    stats: { hp: 100, atk: 15, def: 10, spd: 10 },
    description: 'Descripción de la clase'
}
```

## 🐛 Solución de problemas

### El bot no responde
- Verifica que el bot tenga los permisos correctos
- Asegúrate de haber ejecutado `deploy-commands.js`
- Revisa que el `DISCORD_TOKEN` sea correcto
- Comprueba que Message Content Intent esté habilitado

### Comandos no aparecen
- Ejecuta `node deploy-commands.js` nuevamente
- Espera unos minutos (los comandos pueden tardar en actualizarse)
- Verifica que el `CLIENT_ID` sea correcto

### Error al guardar datos
- Asegúrate de que la carpeta `data/` existe
- Verifica los permisos de escritura del directorio

## 📄 Licencia

MIT License - Ver archivo LICENSE para más detalles

## 🤝 Contribuir

Las contribuciones son bienvenidas. Por favor:

1. Haz fork del proyecto
2. Crea una rama para tu feature (`git checkout -b feature/NuevaCaracteristica`)
3. Commit tus cambios (`git commit -m 'Añadir nueva característica'`)
4. Push a la rama (`git push origin feature/NuevaCaracteristica`)
5. Abre un Pull Request

## 📧 Contacto

Si tienes preguntas o sugerencias, abre un issue en GitHub.

## 🎮 ¡Disfruta jugando!

¡Esperamos que disfrutes de tu aventura RPG en Discord! Si te gusta el proyecto, considera darle una ⭐ en GitHub.
