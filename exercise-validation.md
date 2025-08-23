# VALIDAÇÃO DE EXERCÍCIOS - Built With Science

## 📋 LISTA COMPLETA DE EXERCÍCIOS E VARIAÇÕES

### **EXERCÍCIO 1: Barbell Back Squat**
1. ✅ **See Tutorial Video** - https://youtu.be/Dy28eq2PjcM (PRINCIPAL)
2. ✅ **Box Squats** - https://youtu.be/6qV1WZ_z0u0
3. ✅ **Goblet Squats** - https://youtu.be/LdahU9kB-u0
4. ✅ **High Bar vs Low Bar** - https://youtu.be/fyFVaCP9J-8

### **EXERCÍCIO 2: Barbell Bench Press**
1. ✅ **See Tutorial Video** - https://youtu.be/rT7DgCr-3pg (PRINCIPAL)
2. ✅ **Incline Barbell Press** - https://youtu.be/SrqOu55lrYU
3. ✅ **Close Grip Bench** - https://youtu.be/nEF0bv2FW94
4. ✅ **Dumbbell Bench Press** - https://youtu.be/QCAGs6YEmxY
5. ✅ **Incline Dumbbell Press** - https://youtu.be/hChxWk6rIqI

### **EXERCÍCIO 3: Barbell Deadlift**
1. ✅ **See Tutorial Video** - https://youtu.be/op9kVnSso6Q (PRINCIPAL)
2. ✅ **Sumo Deadlift** - https://youtu.be/6qV1WZ_z0u0
3. ✅ **Romanian Deadlift** - https://youtu.be/LdahU9kB-u0
4. ✅ **Trap Bar Deadlift** - https://youtu.be/fyFVaCP9J-8

### **EXERCÍCIO 4: Barbell Hip Thrust**
1. ✅ **See Tutorial Video** - https://youtu.be/srYETmyq3_c (PRINCIPAL)
2. ✅ **Single Leg Hip Thrust** - https://youtu.be/kpzUeELReEA
3. ✅ **Pause Rep Hip Thrust** - https://youtu.be/abc1fisYB3w
4. ✅ **Banded Hip Thrust** - https://youtu.be/R53nThQcdZo

### **EXERCÍCIO 5: Barbell Row (lat focus)**
1. ✅ **See Tutorial Video** - https://youtu.be/kBWAon7ItDw (PRINCIPAL)
2. ✅ **Underhand Barbell Row** - https://youtu.be/6qV1WZ_z0u0
3. ✅ **Chest Supported Row** - https://youtu.be/LdahU9kB-u0
4. ✅ **Single Arm Row** - https://youtu.be/fyFVaCP9J-8

### **EXERCÍCIO 6: Cable Lateral Raise**
1. ✅ **See Tutorial Video** - https://youtu.be/3VcKaXpzqRo (PRINCIPAL)
2. ✅ **Dumbbell Lateral Raise** - https://youtu.be/6qV1WZ_z0u0
3. ✅ **Single Arm Cable Raise** - https://youtu.be/LdahU9kB-u0
4. ✅ **Machine Lateral Raise** - https://youtu.be/fyFVaCP9J-8

### **EXERCÍCIO 7: Cable Pushdowns***
1. ✅ **See Tutorial Video** - https://youtu.be/2-LAMcpzODU (PRINCIPAL)
2. ✅ **Rope Pushdowns** - https://youtu.be/6qV1WZ_z0u0
3. ✅ **V-Bar Pushdowns** - https://youtu.be/LdahU9kB-u0
4. ✅ **Single Arm Pushdowns** - https://youtu.be/fyFVaCP9J-8

### **EXERCÍCIO 8: Dumbbell Fly**
1. ✅ **See Tutorial Video** - https://youtu.be/eozdVDA78K0 (PRINCIPAL)
2. ✅ **Incline Dumbbell Fly** - https://youtu.be/6qV1WZ_z0u0
3. ✅ **Cable Fly** - https://youtu.be/LdahU9kB-u0
4. ✅ **Decline Fly** - https://youtu.be/fyFVaCP9J-8

### **EXERCÍCIO 9: Dumbbell Lateral Raise**
1. ✅ **See Tutorial Video** - https://youtu.be/3VcKaXpzqRo (PRINCIPAL)
2. ✅ **Single Arm Lateral Raise** - https://youtu.be/6qV1WZ_z0u0
3. ✅ **Cable Lateral Raise** - https://youtu.be/LdahU9kB-u0
4. ✅ **Machine Lateral Raise** - https://youtu.be/fyFVaCP9J-8

### **EXERCÍCIO 10: Dumbbell Romanian Deadlift**
1. ✅ **See Tutorial Video** - https://youtu.be/2SHsk9AzdjA (PRINCIPAL)
2. ✅ **Single Leg RDL** - https://youtu.be/6qV1WZ_z0u0
3. ✅ **Barbell Romanian Deadlift** - https://youtu.be/LdahU9kB-u0
4. ✅ **Cable Romanian Deadlift** - https://youtu.be/fyFVaCP9J-8

---

## 🔍 PROBLEMAS IDENTIFICADOS:

### ⚠️ **URLs REPETIDAS/GENÉRICAS:**
- Muitos exercícios usam os mesmos URLs placeholder (6qV1WZ_z0u0, LdahU9kB-u0, fyFVaCP9J-8)
- Precisam de URLs específicos e únicos para cada variação

### 📋 **EXERCÍCIOS COM POUCAS VARIAÇÕES:**
- Alguns exercícios têm apenas 1 variação
- Idealmente todos deveriam ter 3-4 variações

### 🎯 **EXERCÍCIOS QUE PRECISAM DE MAIS VARIAÇÕES:**
1. **RKC Plank** - apenas 1 variação
2. **Banded Hip Abductions** - apenas 1 variação  
3. **Close-Grip Dumbbell Press** - apenas 1 variação
4. **Standing Mid-Chest Cable Fly** - apenas 1 variação

---

## 💡 **PROPOSTA DE UX:**

```
┌─────────────────────────────────────┐
│ 💪 Barbell Back Squat               │
│ ┌─────────────────────────────────┐ │
│ │ [v] See Tutorial Video         │ │ <- Dropdown sempre mostra a primeira opção
│ └─────────────────────────────────┘ │
│                                     │
│ 🎥 https://youtu.be/Dy28eq2PjcM    │ <- URL do exercício selecionado
│                                     │
│ Sets: 3  |  Reps: 8-10             │
│ ┌─────┐ ┌─────┐ ┌─────────┐        │
│ │ 80kg│ │ 8   │ │ Easy ▼  │        │ <- Carrega último peso/reps usados
│ └─────┘ └─────┘ └─────────┘        │
└─────────────────────────────────────┘
```

**Quer que eu:**
1. ✅ **Valide e corrija todos os URLs de YouTube**
2. ✅ **Adicione mais variações aos exercícios**
3. ✅ **Implemente essa UX de dropdown + cache**