// Script para converter CSV de exercícios para formato do app
const fs = require('fs');

// Parse do CSV "3 DAYS.csv"
const csvContent = fs.readFileSync('3 DAYS.csv', 'utf-8');
const lines = csvContent.split('\n');

const exercises = [];
const exerciseVariations = [];
let currentExerciseId = 1;
let currentVariationId = 1;

// Processar cada linha do CSV
for (let i = 2; i < lines.length; i++) { // Começar da linha 3 (índice 2)
  const line = lines[i];
  if (!line.trim()) continue;
  
  const columns = line.split(';');
  const exerciseName = columns[2];
  const sets = columns[3];
  const url = columns[4];
  
  if (exerciseName && exerciseName.trim() && url && url.includes('youtu')) {
    // Verificar se já existe o exercício
    let exercise = exercises.find(ex => ex.name === exerciseName.trim());
    
    if (!exercise) {
      // Criar novo exercício
      exercise = {
        id: currentExerciseId++,
        name: exerciseName.trim()
      };
      exercises.push(exercise);
    }
    
    // Adicionar variação
    exerciseVariations.push({
      id: currentVariationId++,
      exercise_id: exercise.id,
      variation_index: exerciseVariations.filter(ev => ev.exercise_id === exercise.id).length + 1,
      variation_name: exerciseName.trim(),
      youtube_url: url.trim(),
      sets_info: sets || ""
    });
  }
}

// Gerar estrutura final
const output = {
  exercises,
  exerciseVariations,
  summary: {
    total_exercises: exercises.length,
    total_variations: exerciseVariations.length,
    generated_at: new Date().toISOString()
  }
};

// Salvar resultado
fs.writeFileSync('parsed-exercises.json', JSON.stringify(output, null, 2));

console.log('📊 EXERCÍCIOS PROCESSADOS:');
console.log(`✅ ${exercises.length} exercícios únicos`);
console.log(`✅ ${exerciseVariations.length} variações totais`);
console.log('\n📋 EXERCÍCIOS ENCONTRADOS:');
exercises.forEach(ex => {
  const variations = exerciseVariations.filter(ev => ev.exercise_id === ex.id);
  console.log(`- ${ex.name} (${variations.length} variações)`);
});

console.log('\n📄 Resultado salvo em: parsed-exercises.json');