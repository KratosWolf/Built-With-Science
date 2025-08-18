// Exemplo de estrutura de mock data para Built With Science
export const mockUsers = [
  { 
    id: 1, 
    name: 'Dr. João Silva', 
    email: 'joao.silva@university.edu',
    role: 'researcher',
    institution: 'Universidade de São Paulo',
    field: 'Biologia Molecular'
  },
  { 
    id: 2, 
    name: 'Dra. Maria Santos', 
    email: 'maria.santos@research.org',
    role: 'researcher',
    institution: 'Instituto de Pesquisa',
    field: 'Física Quântica'
  },
];

export const mockArticles = [
  {
    id: 1,
    title: 'Advances in CRISPR Gene Editing Technology',
    abstract: 'Recent developments in CRISPR-Cas9 technology have opened new possibilities for genetic engineering...',
    authors: ['Dr. João Silva', 'Dr. Ana Costa'],
    field: 'Biologia Molecular',
    publishedDate: '2024-01-15',
    citations: 127,
    tags: ['CRISPR', 'Gene Editing', 'Biotechnology']
  },
  {
    id: 2,
    title: 'Quantum Computing Applications in Drug Discovery',
    abstract: 'Exploring how quantum computing algorithms can accelerate pharmaceutical research...',
    authors: ['Dra. Maria Santos', 'Dr. Carlos Lima'],
    field: 'Física Quântica',
    publishedDate: '2024-02-20',
    citations: 89,
    tags: ['Quantum Computing', 'Drug Discovery', 'AI']
  }
];

export const mockResearchProjects = [
  {
    id: 1,
    title: 'Climate Change Impact on Marine Ecosystems',
    description: 'Comprehensive study on how rising temperatures affect ocean biodiversity',
    status: 'active',
    participants: 12,
    startDate: '2024-01-01',
    expectedCompletion: '2024-12-31'
  }
];

// Simular delay de rede
export const simulateDelay = (ms: number = 1000) => 
  new Promise(resolve => setTimeout(resolve, ms));

// Funções para buscar dados mockados
export async function getMockUser(id: number) {
  await simulateDelay(500);
  return mockUsers.find(user => user.id === id);
}

export async function getMockArticles(field?: string) {
  await simulateDelay(800);
  if (field) {
    return mockArticles.filter(article => article.field === field);
  }
  return mockArticles;
}

export async function getMockResearchProjects() {
  await simulateDelay(600);
  return mockResearchProjects;
}

