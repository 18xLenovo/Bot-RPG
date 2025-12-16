# 🎨 Ejemplos Visuales de las Nuevas Características

## 🛡️ Sistema de Clanes

### Crear un Clan
```
/clan crear nombre:LosDragones
```

**Respuesta del Bot:**
```
╔════════════════════════════════════╗
║  🛡️ ¡CLAN CREADO CON ÉXITO!       ║
╚════════════════════════════════════╝

Clan: LosDragones
Líder: @TuNombre

📊 Nivel 1 (0/1000 EXP)
👥 Miembros: 1/5
💰 Tesorería: 0 oro

✨ Beneficios Actuales:
• Máximo de miembros: 5
• Bonus de oro: 0%
• Bonus de EXP: 0%

💡 Invita amigos con /clan invitar @usuario
💰 Dona oro con /clan donar [cantidad]
```

### Invitar a un Jugador
```
/clan invitar @Amigo
```

**Respuesta del Bot:**
```
╔════════════════════════════════════╗
║  📩 INVITACIÓN ENVIADA             ║
╚════════════════════════════════════╝

Has invitado a @Amigo a unirse a LosDragones

[ 🎮 Aceptar Invitación ] [ ❌ Rechazar ]

⏱️ La invitación expira en 5 minutos
```

**Lo que ve el Amigo:**
```
╔════════════════════════════════════╗
║  🎉 ¡INVITACIÓN DE CLAN!          ║
╚════════════════════════════════════╝

@TuNombre te ha invitado a unirte a:
🛡️ LosDragones

Líder: @TuNombre
Nivel: 1
Miembros: 1/5

[ 🎮 Aceptar Invitación ] [ ❌ Rechazar ]
```

### Info del Clan
```
/clan info
```

**Respuesta del Bot:**
```
╔════════════════════════════════════╗
║  🛡️ LosDragones                   ║
╚════════════════════════════════════╝

👑 Líder: @TuNombre
📊 Nivel: 2 (750/2500 EXP)
💰 Tesorería: 2,500 oro

👥 Miembros (3/10):
• @TuNombre (Líder) - Nivel 5
• @Amigo1 - Nivel 4
• @Amigo2 - Nivel 3

✨ Beneficios Actuales:
• Bonus de oro: +5%
• Bonus de EXP: +5%

📢 Últimos Anuncios:
• "¡Raid de mazmorra esta noche a las 8pm!"
• "Felicidades a @Amigo1 por llegar a nivel 5!"

⬆️ Siguiente nivel: Dona 1,750 oro más o 
   completa mazmorras para alcanzar nivel 3
```

### Ranking de Clanes
```
/clan ranking
```

**Respuesta del Bot:**
```
╔════════════════════════════════════╗
║  🏆 RANKING DE CLANES              ║
╚════════════════════════════════════╝

1. 👑 LosTitanes - Nivel 5 (30 miembros)
2. ⚔️ GuerrerosOscuros - Nivel 4 (19 miembros)
3. 🛡️ LosDragones - Nivel 3 (15 miembros)
4. ✨ MagosSupremos - Nivel 3 (12 miembros)
5. 🏹 ArquerosElite - Nivel 2 (10 miembros)
6. ⚡ FuerzaEpica - Nivel 2 (8 miembros)
7. 🌟 EstrellasDelSur - Nivel 2 (7 miembros)
8. 🔥 LlamasSagradas - Nivel 1 (5 miembros)
9. 🌊 OlasDeHielo - Nivel 1 (4 miembros)
10. 🌲 GuardianesDelBosque - Nivel 1 (3 miembros)

Tu clan está en la posición #3
```

---

## 🏰 Mazmorras Cooperativas

### Iniciar Mazmorra Cooperativa
```
/mazmorra nombre:bosque_encantado cooperativo:true
```

**Respuesta del Bot:**
```
╔════════════════════════════════════╗
║  🗺️ Bosque Encantado              ║
║     Mazmorra Cooperativa           ║
╚════════════════════════════════════╝

Un bosque antiguo corrompido por magia 
oscura. Los árboles susurran secretos 
prohibidos...

👥 Jugadores: 1/4
🎯 Dificultad: Nivel 1+
🏆 Recompensas: 100-200 oro, 50-100 EXP
              Items raros, EXP de clan

⏱️ Esperando...
60 segundos para que se unan más jugadores

[ 🎮 Unirse a la Mazmorra ] [ ▶️ Comenzar Ahora ]

Los jugadores pueden unirse presionando el botón
```

### Otro Jugador se Une
```
✅ @Amigo1 se ha unido a la mazmorra!

╔════════════════════════════════════╗
║  🗺️ Bosque Encantado              ║
║     Mazmorra Cooperativa           ║
╚════════════════════════════════════╝

👥 Jugadores: 2/4
🎯 Dificultad: Nivel 1+
🏆 Recompensas: 100-200 oro, 50-100 EXP

⏱️ Esperando...
45 segundos restantes

[ 🎮 Unirse a la Mazmorra ] [ ▶️ Comenzar Ahora ]
```

### Comenzando la Mazmorra
```
╔════════════════════════════════════╗
║  ⚔️ Bosque Encantado              ║
║     ¡COMENZANDO!                   ║
╚════════════════════════════════════╝

2 jugador(es) entran a la mazmorra...

👥 Grupo:
• @TuNombre (Guerrero Nv.5) - 150/150 HP
• @Amigo1 (Mago Nv.4) - 120/120 HP

🛡️ Bonus de Clan: ¡Todos son de LosDragones!
   +50% oro y EXP

---

🚪 Sala 1/5
```

### Evento de Tesoro
```
╔════════════════════════════════════╗
║  🎁 ¡TESORO ENCONTRADO!           ║
╚════════════════════════════════════╝

El grupo encuentra un cofre antiguo...

💰 150 oro (repartido: 75 oro c/u)
✨ 1x Poción de Vida

Los items han sido añadidos a sus inventarios
```

### Combate Cooperativo
```
╔════════════════════════════════════╗
║  ⚔️ ¡COMBATE COOPERATIVO!         ║
╚════════════════════════════════════╝

🐺 Lobo Corrupto (Nivel 2)
❤️ 80/80 HP | ⚔️ 20 ATK | 🛡️ 5 DEF

---

👥 Tu Grupo:
• @TuNombre (Guerrero) - 150/150 HP
• @Amigo1 (Mago) - 120/120 HP

---

⚔️ Turno del Grupo:

@TuNombre ataca por 25 de daño!
@Amigo1 lanza Bola de Fuego por 35 de daño!

💥 Daño total: 60 de daño
🐺 Lobo Corrupto: 25/80 HP

---

🐺 Turno del Enemigo:

Lobo Corrupto usa Mordida Salvaje!
💥 30 de daño dividido entre 2 jugadores

• @TuNombre recibe 15 de daño (135/150 HP)
• @Amigo1 recibe 15 de daño (105/120 HP)
```

### Jefe Final
```
╔════════════════════════════════════╗
║  👑 ¡JEFE FINAL!                  ║
╚════════════════════════════════════╝

🌳 Ent Corrupto
❤️ 300/300 HP | ⚔️ 35 ATK | 🛡️ 15 DEF

"El guardián del bosque ha sido corrompido
por la magia oscura. Sus raíces retorcidas
amenazan a todo el que se acerca..."

💀 Habilidades Especiales:
• Raíces Estranguladores (daño a todos)
• Regeneración Natural (+50 HP)
• Furia de la Naturaleza (ATK +50%)

---

👥 Tu Grupo:
• @TuNombre (Guerrero) - 135/150 HP
• @Amigo1 (Mago) - 105/120 HP

¡Prepárense para el combate más difícil!
```

### Victoria y Recompensas
```
╔════════════════════════════════════╗
║  🎉 ¡MAZMORRA COMPLETADA!         ║
╚════════════════════════════════════╝

¡El Bosque Encantado ha sido purificado!

👥 Recompensas del Grupo:

💰 Oro ganado:
• Base: 200 oro
• Bonus de clan: +100 oro
• Total: 300 oro (150 oro c/u)

⭐ EXP ganada:
• Base: 100 EXP
• Bonus de clan: +50 EXP
• Total: 150 EXP (75 EXP c/u)

🎁 Items especiales:
• 2x Poción de Vida Grande
• 1x Espada del Bosque (+15 ATK)

🛡️ Bonus de Clan:
• LosDragones gana +50 EXP de clan

---

📊 Estadísticas:

Salas exploradas: 5/5
Combates: 4
Tesoros: 2
MVP: @TuNombre (200 daño total)

¡Gracias por jugar! 🎮
```

---

## 🎯 Ejemplo de Sesión Completa

```
[1] @TuNombre: /clan crear nombre:LosDragones
Bot: ¡Clan creado! Cuesta 500 oro.

[2] @TuNombre: /clan invitar @Amigo1
Bot: Invitación enviada a @Amigo1

[3] @Amigo1: [Presiona "Aceptar Invitación"]
Bot: @Amigo1 se ha unido a LosDragones!

[4] @TuNombre: /clan donar 200
Bot: Has donado 200 oro. Tesorería: 200 oro.
     LosDragones gana +20 EXP (220/1000)

[5] @TuNombre: /tienda categoria:consumibles
Bot: [Muestra tienda]

[6] @TuNombre: [Compra 5x Poción de Vida]
Bot: Compraste 5x Poción de Vida por 250 oro

[7] @TuNombre: /mazmorra nombre:bosque_encantado cooperativo:true
Bot: [Muestra pantalla de espera con botones]

[8] @Amigo1: [Presiona "Unirse a la Mazmorra"]
Bot: @Amigo1 se ha unido! (2/4 jugadores)

[9] @TuNombre: [Presiona "Comenzar Ahora"]
Bot: ¡Comenzando mazmorra!

[10] Bot: Sala 1/5 - ¡Tesoro encontrado!
         +150 oro para cada jugador

[11] Bot: Sala 2/5 - ¡Combate!
         [Combate automático en grupo]
         ¡Victoria!

[12] Bot: Sala 3/5 - ⚠️ ¡Trampa!
         -20 HP a cada jugador

[13] Bot: Sala 4/5 - 🧩 Puzzle
         [Decisión de grupo]
         ¡Resuelto! +50 EXP

[14] Bot: Sala 5/5 - 👑 ¡JEFE FINAL!
         Ent Corrupto (300 HP)
         [Combate épico]

[15] Bot: ¡VICTORIA! Mazmorra completada
         Recompensas: 300 oro, 150 EXP
         LosDragones gana +50 EXP de clan

[16] @TuNombre: /clan info
Bot: LosDragones - Nivel 1 (270/1000 EXP)
     Miembros: 2/5
     Tesorería: 200 oro

[17] @TuNombre: /perfil
Bot: [Muestra nuevo nivel y oro]
```

---

## 💡 Tips de Uso

### Para Jugadores
1. **Crea o únete a un clan** lo antes posible para bonos
2. **Dona oro regularmente** para subir el nivel del clan
3. **Juega mazmorras con miembros del clan** para máximos bonos
4. **Compra pociones antes** de mazmorras difíciles
5. **Comunícate con tu equipo** en Discord durante las mazmorras

### Para Líderes de Clan
1. **Envía anuncios regulares** para mantener activa la comunidad
2. **Organiza horarios** para mazmorras en grupo
3. **Anima a donar** para beneficiar a todos
4. **Invita jugadores activos** de diferentes niveles
5. **Celebra los logros** del clan con anuncios

### Para Grupos en Mazmorras
1. **Balancea las clases**: Guerrero + Clérigo + DPS
2. **El Clérigo es crucial** en mazmorras difíciles
3. **Guarden maná** para el jefe final
4. **Distribuyan pociones** antes de entrar
5. **Todos del mismo clan** = +50% recompensas

---

## 🎊 ¡Disfruta del Juego!

Tu bot RPG ahora es completamente multijugador e inmersivo. 

**Características principales:**
✅ Clanes con 5 niveles
✅ Mazmorras cooperativas (hasta 8 jugadores)
✅ Bonos de clan increíbles
✅ Rankings competitivos
✅ Sistema de invitaciones interactivo
✅ Recompensas compartidas
✅ Eventos aleatorios en mazmorras
✅ Jefes épicos con habilidades especiales

**¡Que comience la aventura! 🎮🔥**
