# Configuración del Agente N8N para Valka Chat

## 📋 Resumen
He integrado exitosamente un sistema de chat en la página de cursos de Valka con conexión para N8N. El chat incluye:

- ✅ Chat flotante con ícono de bot
- ✅ Interfaz completa de mensajes (usuario y bot)
- ✅ Estados de carga y manejo de errores
- ✅ Contexto del módulo actual enviado a N8N
- ✅ Diseño consistente con el tema morado de Valka

## 🔧 Configuración N8N

### 1. Crear Webhook en N8N

1. Abre tu instancia de N8N
2. Crea un nuevo workflow
3. Agrega un nodo **Webhook** como primer paso
4. Configura el webhook:
   - **HTTP Method**: POST
   - **Path**: `/webhook/chat-agent`
   - **Response Mode**: Respond to Webhook

### 2. Estructura del Payload

El frontend envía este JSON al webhook:

```json
{
  "message": "Pregunta del usuario",
  "context": {
    "currentModule": "mod-1",
    "moduleTitle": "Módulo 1 · Fundamentos",
    "userId": "user-123",
    "timestamp": "2025-08-21T20:15:30.123Z"
  }
}
```

### 3. Configurar el Agente AI

Después del webhook, agrega:

**Nodo AI Agent (OpenAI/Claude/etc.)**:
```
Role: Eres un asistente especializado en fitness y entrenamiento de fuerza para Valka.

Context: El usuario está viendo: {{$json.context.moduleTitle}}

Instructions:
- Responde preguntas sobre entrenamiento, técnica y nutrición
- Mantén un tono motivacional y profesional
- Si la pregunta no está relacionada con fitness, redirige amablemente al tema
- Usa el contexto del módulo actual para dar respuestas más específicas

User question: {{$json.message}}
```

### 4. Estructura de Respuesta

El agente debe responder con este formato JSON:

```json
{
  "response": "Respuesta del agente aquí",
  "confidence": 0.95,
  "moduleRelevant": true
}
```

### 5. Ejemplo de Workflow N8N

```
[Webhook] → [AI Agent] → [Response]
    ↓           ↓           ↓
  Recibe     Procesa    Responde
  mensaje   con contexto  al chat
```

## ⚙️ Configuración en el Frontend

### Cambiar URL del Webhook

En `CoursePage.tsx`, línea ~90, reemplaza:

```typescript
const N8N_WEBHOOK_URL = "https://your-n8n-instance.com/webhook/chat-agent";
```

Por tu URL real de N8N:

```typescript
const N8N_WEBHOOK_URL = "https://tu-n8n.app.n8n.cloud/webhook/chat-agent";
```

### Variables de Entorno (Recomendado)

Crea un archivo `.env.local`:

```env
VITE_N8N_WEBHOOK_URL=https://tu-n8n.app.n8n.cloud/webhook/chat-agent
```

Y actualiza el código:

```typescript
const N8N_WEBHOOK_URL = import.meta.env.VITE_N8N_WEBHOOK_URL || "http://localhost:5678/webhook/chat-agent";
```

## 🧪 Testing

### 1. Test Local
Para probar sin N8N, puedes usar un servidor mock:

```javascript
// Mock server simple
const mockResponse = {
  response: "¡Hola! Soy tu asistente de Valka. ¿En qué te puedo ayudar con el entrenamiento?"
};
```

### 2. Test con N8N
1. Configura el webhook en N8N
2. Actualiza la URL en el código
3. Abre la página de cursos
4. Haz clic en el bot flotante
5. Envía un mensaje de prueba

## 🎨 Personalización del Chat

### Estilos y Colores
El chat usa la paleta morada de Valka:
- `violet-600`: Fondo de mensajes del usuario
- `violet-300`: Íconos y acentos
- `zinc-800/900`: Fondo del chat

### Mensajes del Sistema
Puedes personalizar mensajes en:
- Mensaje inicial de bienvenida
- Mensajes de error
- Estados de carga

## 🔒 Seguridad

### Recomendaciones:
1. **Rate Limiting**: Implementa límites en N8N
2. **Validación**: Valida inputs en el webhook
3. **CORS**: Configura CORS apropiadamente
4. **API Keys**: Protege las keys de AI en N8N

## 📈 Mejoras Futuras

### Funcionalidades Adicionales:
- [ ] Historial de conversaciones
- [ ] Respuestas con formato (markdown)
- [ ] Sugerencias de preguntas frecuentes
- [ ] Integración con base de conocimiento
- [ ] Analytics de uso del chat

## 🚀 Deployment

1. **Frontend**: Despliega normalmente (Vercel, Netlify, etc.)
2. **N8N**: Asegúrate que tu webhook sea público
3. **Variables**: Configura las URLs de producción

## 🆘 Troubleshooting

### Problemas Comunes:

**Error 404 en webhook**:
- Verifica que la URL del webhook sea correcta
- Asegúrate que N8N esté ejecutándose

**CORS Error**:
- Configura CORS en N8N para tu dominio
- En desarrollo: usa proxy o configura localhost

**Respuestas vacías**:
- Verifica que el agente AI esté configurado
- Revisa los logs en N8N

**Chat no se conecta**:
- Verifica la consola del navegador
- Confirma que la URL del webhook sea accesible

## 📞 Soporte

Para problemas específicos:
1. Revisa la consola del navegador (F12)
2. Verifica los logs en N8N
3. Prueba el webhook directamente con Postman
4. Confirma que las variables de entorno estén configuradas

---

✨ **¡Listo!** Tu asistente AI de Valka está configurado y listo para ayudar a los usuarios con sus entrenamientos.
