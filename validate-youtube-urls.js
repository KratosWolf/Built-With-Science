// Script para validar URLs de YouTube dos exercícios
const https = require('https');
const fs = require('fs');

// URLs extraídas do workout-data.ts
const exerciseUrls = [
  { exercise: "Barbell Back Squat", variation: "See Tutorial Video", url: "https://youtu.be/Dy28eq2PjcM" },
  { exercise: "Barbell Back Squat", variation: "Box Squats", url: "https://youtu.be/6qV1WZ_z0u0" },
  { exercise: "Barbell Back Squat", variation: "Goblet Squats", url: "https://youtu.be/LdahU9kB-u0" },
  { exercise: "Barbell Bench Press", variation: "See Tutorial Video", url: "https://youtu.be/rT7DgCr-3pg" },
  { exercise: "Barbell Deadlift", variation: "See Tutorial Video", url: "https://youtu.be/op9kVnSso6Q" },
  { exercise: "Barbell Hip Thrust", variation: "See Tutorial Video", url: "https://youtu.be/srYETmyq3_c" },
  { exercise: "Barbell Row", variation: "See Tutorial Video", url: "https://youtu.be/kBWAon7ItDw" },
  { exercise: "Cable Lateral Raise", variation: "See Tutorial Video", url: "https://youtu.be/3VcKaXpzqRo" },
  { exercise: "Cable Pushdowns", variation: "See Tutorial Video", url: "https://youtu.be/2-LAMcpzODU" },
  { exercise: "Dumbbell Fly", variation: "See Tutorial Video", url: "https://youtu.be/eozdVDA78K0" },
  { exercise: "Dumbbell Romanian Deadlift", variation: "See Tutorial Video", url: "https://youtu.be/2SHsk9AzdjA" },
  { exercise: "Flat Dumbbell Press", variation: "See Tutorial Video", url: "https://youtu.be/QCAGs6YEmxY" },
  { exercise: "Hammer Curls", variation: "See Tutorial Video", url: "https://youtu.be/zC3nLlEvin4" },
  { exercise: "Incline DB Overhead Extensions", variation: "See Tutorial Video", url: "https://youtu.be/YbX7Wd8jQ-Q" },
  { exercise: "Incline Dumbbell Curls", variation: "See Tutorial Video", url: "https://youtu.be/soxrZlIl35U" },
  { exercise: "Kneeling Lat Pulldown", variation: "See Tutorial Video", url: "https://youtu.be/CAwf7n6Luuc" },
  { exercise: "Lat Focused Cable Row", variation: "See Tutorial Video", url: "https://youtu.be/GZbfZ033f74" },
  { exercise: "Lat Pulldown", variation: "See Tutorial Video", url: "https://youtu.be/CAwf7n6Luuc" },
  { exercise: "Low Incline Dumbbell Press", variation: "See Tutorial Video", url: "https://youtu.be/sO8lFa9CidE" },
  { exercise: "Lying Leg Curls", variation: "See Tutorial Video", url: "https://youtu.be/aYy3alWRDmk" },
  { exercise: "Quad-Focused Leg Press", variation: "See Tutorial Video", url: "https://youtu.be/0nrW-q7-WRQ" },
  { exercise: "Rear Delt Cable Row", variation: "See Tutorial Video", url: "https://youtu.be/k9G7BykDD4o" },
  { exercise: "Seated Cable Row", variation: "See Tutorial Video", url: "https://youtu.be/Q-5V5T55giY" },
  { exercise: "Seated Dumbbell Curls", variation: "See Tutorial Video", url: "https://youtu.be/qUAzPq4B2aw" },
  { exercise: "Seated Dumbbell Shoulder Press", variation: "See Tutorial Video", url: "https://youtu.be/DPXG3BJvl8A" },
  { exercise: "Seated Leg Curls", variation: "See Tutorial Video", url: "https://youtu.be/81umRgyxIAU" },
  { exercise: "Seated Leg Extensions", variation: "See Tutorial Video", url: "https://youtu.be/nIalczfM8es" },
  { exercise: "Side Plank", variation: "See Tutorial Video", url: "https://youtu.be/o4LGPtKjbhU" },
  { exercise: "Single Leg Weighted Calf Raise", variation: "See Tutorial Video", url: "https://youtu.be/cRKA_Qdut7I" },
  { exercise: "Single-Leg Leg Press", variation: "See Tutorial Video", url: "https://youtu.be/hdioTTf8qdw" },
  { exercise: "Smith Machine Hip Thrust", variation: "See Tutorial Video", url: "https://youtu.be/srYETmyq3_c" },
  { exercise: "Smith Machine Squat", variation: "See Tutorial Video", url: "https://youtu.be/zSVi51Jp3eI" },
  { exercise: "Standing Face Pulls", variation: "See Tutorial Video", url: "https://youtu.be/02g7XtSRXug" },
  { exercise: "Standing High To Low Cable Fly", variation: "See Tutorial Video", url: "https://youtu.be/JfZjng7jAKs" },
  { exercise: "Standing Weighted Calf Raise", variation: "See Tutorial Video", url: "https://youtu.be/q2Eigaa9dKU" },
  { exercise: "Walking Lunges", variation: "See Tutorial Video", url: "https://youtu.be/JB20RuTOaFc" },
  { exercise: "Weighted Step-Ups", variation: "See Tutorial Video", url: "https://youtu.be/Cjc3AgmdtlA" },
];

// Função para testar se URL está acessível
function testUrl(url) {
  return new Promise((resolve) => {
    const request = https.get(url, (res) => {
      resolve({
        url: url,
        status: res.statusCode,
        valid: res.statusCode === 200 || res.statusCode === 302
      });
    });
    
    request.on('error', () => {
      resolve({
        url: url,
        status: 'ERROR',
        valid: false
      });
    });
    
    request.setTimeout(5000, () => {
      request.abort();
      resolve({
        url: url,
        status: 'TIMEOUT',
        valid: false
      });
    });
  });
}

// Validar todos os URLs
async function validateAllUrls() {
  console.log('🔍 Iniciando validação de URLs de exercícios...\n');
  
  const results = [];
  let validCount = 0;
  let invalidCount = 0;
  
  for (let i = 0; i < exerciseUrls.length; i++) {
    const item = exerciseUrls[i];
    console.log(`[${i + 1}/${exerciseUrls.length}] Testando: ${item.exercise}`);
    
    const result = await testUrl(item.url);
    results.push({
      ...item,
      ...result
    });
    
    if (result.valid) {
      validCount++;
      console.log(`✅ VÁLIDO - ${item.exercise}`);
    } else {
      invalidCount++;
      console.log(`❌ INVÁLIDO - ${item.exercise} (${result.status})`);
    }
  }
  
  // Gerar relatório
  console.log('\n📊 RELATÓRIO DE VALIDAÇÃO:');
  console.log(`✅ URLs Válidos: ${validCount}`);
  console.log(`❌ URLs Inválidos: ${invalidCount}`);
  console.log(`📋 Total: ${exerciseUrls.length}`);
  
  // Salvar resultados em arquivo
  const reportData = {
    summary: {
      total: exerciseUrls.length,
      valid: validCount,
      invalid: invalidCount,
      timestamp: new Date().toISOString()
    },
    results: results
  };
  
  fs.writeFileSync('youtube-validation-report.json', JSON.stringify(reportData, null, 2));
  console.log('\n📄 Relatório salvo em: youtube-validation-report.json');
  
  // Mostrar URLs inválidos
  const invalidUrls = results.filter(r => !r.valid);
  if (invalidUrls.length > 0) {
    console.log('\n❌ URLs QUE PRECISAM SER CORRIGIDOS:');
    invalidUrls.forEach(item => {
      console.log(`- ${item.exercise}: ${item.url} (${item.status})`);
    });
  }
}

// Executar validação
validateAllUrls().catch(console.error);