# 🎮 Guía de Características Multijugador

## 🛡️ Sistema de Clanes

### Crear un Clan
```
/clan crear nombre:LosDragones
```
- **Costo**: 500 oro
- Solo puedes ser líder de un clan a la vez

### Invitar Miembros
```
/clan invitar @usuario
```
- El usuario recibirá un botón para aceptar
- La invitación expira en 5 minutos
- Solo el líder y miembros pueden invitar

### Gestionar tu Clan
```
/clan info               # Ver información completa
/clan donar 100          # Donar oro a la tesorería
/clan anuncio ¡Evento!   # Enviar anuncio (solo líder)
/clan salir              # Salir del clan
/clan ranking            # Ver top 10 clanes
```

### Niveles de Clan
| Nivel | Miembros | Bonus Oro | Bonus EXP | EXP Requerida |
|-------|----------|-----------|-----------|---------------|
| 1     | 5        | 0%        | 0%        | -             |
| 2     | 10       | +5%       | +5%       | 1000          |
| 3     | 15       | +10%      | +10%      | 2500          |
| 4     | 20       | +15%      | +15%      | 5000          |
| 5     | 30       | +25%      | +25%      | 10000         |

### Cómo subir de nivel tu clan
1. **Donar oro**: `/clan donar [cantidad]`
   - Cada 100 oro donado = +10 EXP de clan
2. **Completar mazmorras juntos**: 
   - Si todos son del mismo clan, el clan gana EXP
   - Más EXP en mazmorras difíciles

---

## 🏰 Mazmorras Cooperativas

### Mazmorras Disponibles

#### 🌲 Bosque Encantado (Fácil)
- **Nivel mínimo**: 1
- **Jugadores**: 1-4
- **Salas**: 5
- **Jefe**: Ent Corrupto
- **Recompensas**: 100-200 oro, 50-100 EXP

#### ⛏️ Minas Profundas (Media)
- **Nivel mínimo**: 3
- **Jugadores**: 1-5
- **Salas**: 7
- **Jefe**: Señor de las Profundidades
- **Recompensas**: 200-400 oro, 100-200 EXP

#### 🏛️ Templo Maldito (Difícil)
- **Nivel mínimo**: 5
- **Jugadores**: 1-6
- **Salas**: 10
- **Jefe**: Sumo Sacerdote Oscuro
- **Recompensas**: 400-800 oro, 200-400 EXP

#### 🏰 Ciudadela del Demonio (Legendaria)
- **Nivel mínimo**: 8
- **Jugadores**: 1-8
- **Salas**: 15
- **Jefe**: Señor Demonio
- **Recompensas**: 1000-2000 oro, 500-1000 EXP

### Cómo jugar

#### Modo Solitario
```
/mazmorra nombre:bosque_encantado
```
- Exploras solo
- Recompensas normales
- Dificultad ajustada para 1 jugador

#### Modo Cooperativo
```
/mazmorra nombre:bosque_encantado cooperativo:true
```
1. **Espera**: 60 segundos para que se unan jugadores
2. **Botón**: Otros jugadores presionan "🎮 Unirse a la Mazmorra"
3. **Inicio**: El creador puede iniciar antes con "▶️ Comenzar Ahora"

### Durante la Mazmorra

#### Tipos de Salas
- **🎁 Tesoro**: Oro o items para el grupo
- **⚠️ Trampa**: Daño distribuido entre todos
- **🧩 Puzzle**: Decisiones de grupo, recompensas o penalizaciones
- **⚔️ Enemigos**: Combate en grupo
- **👑 Jefe Final**: Combate épico con habilidades especiales

#### Sistema de Combate Cooperativo
- El daño enemigo se **distribuye** entre todos los jugadores
- Todos atacan en cada turno
- Las habilidades de curación afectan a todos
- El combate termina si todos mueren o el enemigo es derrotado

#### Bonos de Clan
Si todos los jugadores son del mismo clan:
- **+50% oro extra** para todos
- **+50% EXP extra** para todos
- **EXP de clan**: El clan gana experiencia

### Estrategias

#### Composición de Grupo Balanceada
- **1 Guerrero**: Tanque y daño físico
- **1 Clérigo**: Curación y soporte
- **1 Mago**: Daño mágico en área
- **1 Arquero**: Daño consistente

#### Tips para el Éxito
1. **Comunicación**: Usa el chat de Discord
2. **Nivel similar**: Es más fácil con jugadores del mismo nivel
3. **Preparación**: Compra pociones antes de entrar
4. **Clan**: Juega con tu clan para bonos extras
5. **Combos**: Las clases se complementan bien

---

## 🎯 Progresión Multijugador

### Ejemplo de Sesión de Juego

1. **Crear/Unirse a un Clan**
```
/clan crear nombre:GuerrerosDelNorte
```

2. **Invitar Amigos**
```
/clan invitar @amigo1
/clan invitar @amigo2
```

3. **Prepararse**
```
/tienda categoria:consumibles
# Comprar Pociones de Vida x5
```

4. **Iniciar Mazmorra**
```
/mazmorra nombre:minas_profundas cooperativo:true
```

5. **Completar y Celebrar**
```
/clan info  # Ver el progreso del clan
/perfil     # Ver tus recompensas
```

6. **Mejorar el Clan**
```
/clan donar 200  # Donar para subir nivel
```

---

## 📊 Estadísticas y Rankings

### Rankings Individuales
```
/ranking tipo:nivel      # Top jugadores por nivel
/ranking tipo:oro        # Top jugadores por oro
/ranking tipo:victorias  # Top jugadores por combates
```

### Rankings de Clanes
```
/clan ranking  # Top 10 clanes por nivel y miembros
```

---

## 💡 Consejos Pro

### Para Líderes de Clan
1. Envía anuncios regulares para mantener activos a los miembros
2. Organiza horarios para mazmorras en grupo
3. Anima a donar para subir de nivel
4. Invita jugadores activos y de nivel variado

### Para Jugadores
1. Únete a un clan activo para bonos
2. Participa en mazmorras cooperativas regularmente
3. Dona cuando tengas oro extra
4. Ayuda a nuevos miembros con consejos

### Para Grupos
1. Balancea las clases del grupo
2. El Clérigo es crucial en mazmorras difíciles
3. Guarden maná para el jefe final
4. Distribuyan las pociones antes de entrar

---

## ❓ Preguntas Frecuentes

**P: ¿Puedo estar en varios clanes?**
R: No, solo puedes ser miembro de un clan a la vez.

**P: ¿Qué pasa si el líder del clan se va?**
R: El liderazgo se transfiere automáticamente al miembro más antiguo.

**P: ¿Puedo hacer mazmorras cooperativas sin clan?**
R: Sí, pero no recibirás los bonos de clan.

**P: ¿El oro se divide entre los jugadores?**
R: No, cada jugador recibe la recompensa completa.

**P: ¿Puedo salir de una mazmorra en progreso?**
R: No, debes completarla o ser derrotado.

**P: ¿Cuánto oro necesita mi clan para subir de nivel?**
R: Cada 100 oro donado = 10 EXP de clan. Consulta la tabla de niveles arriba.

**P: ¿Puedo recuperar el oro donado al clan?**
R: Los líderes pueden retirar oro con `/clan retirar`, pero se desaconseja.

**P: ¿Las mazmorras cooperativas dan más recompensas?**
R: Sí, especialmente con el bono de clan (+50% oro y EXP).
