import type { AppData,Category,Person,Ticket,Status,Priority } from './types';
export const demoCategories:Category[]=[
{id:'marketing',name:'Marketing',description:'Campanhas e comunicação',color:'#b59bf4',active:true},
{id:'intranet',name:'Intranet',description:'Portal e aplicações internas',color:'#61a8e8',active:true},
{id:'hardware',name:'Hardware',description:'Equipamentos e periféricos',color:'#f3a965',active:true},
{id:'access',name:'Criação de acesso',description:'Contas e acessos iniciais',color:'#6dc9ba',active:true},
{id:'revoke',name:'Revogação',description:'Desativação de acessos',color:'#ed9196',active:true},
{id:'sites',name:'Liberação de sites',description:'Acesso à internet',color:'#bbbd6e',active:true},
{id:'finance',name:'Financeiro',description:'Sistemas e aprovações',color:'#7ea9dc',active:true},
{id:'rh',name:'Recursos Humanos',description:'Pessoas e benefícios',color:'#d6a0c5',active:true},
{id:'network',name:'Redes e conectividade',description:'Rede, Wi-Fi e VPN',color:'#e0b76d',active:true},
{id:'software',name:'Software',description:'Aplicativos e licenças',color:'#98a8f0',active:true},
{id:'facilities',name:'Infraestrutura',description:'Espaços e instalações',color:'#a7c895',active:true},
{id:'other',name:'Outros',description:'Solicitações gerais',color:'#a0a7b3',active:true}
];
export const demoPeople:Person[]=[
{id:'admin',name:'Alex Morgan',email:'alex@nexora.demo',role:'admin',categoryIds:[],active:true},
{id:'bruno',name:'Bruno Nascimento',email:'bruno@nexora.demo',role:'agent',categoryIds:['marketing','intranet','hardware'],active:true},
{id:'joao',name:'João Oliveira',email:'joao@nexora.demo',role:'agent',categoryIds:['access','revoke','sites'],active:true},
{id:'maria',name:'Maria Costa',email:'maria@nexora.demo',role:'agent',categoryIds:['finance','rh'],active:true},
{id:'bia',name:'Beatriz Lima',email:'bia@nexora.demo',role:'agent',categoryIds:['network','software'],active:true},
{id:'rafa',name:'Rafael Souza',email:'rafa@nexora.demo',role:'agent',categoryIds:['facilities','other'],active:true},
{id:'ana',name:'Ana Martins',email:'ana@nexora.demo',role:'requester',categoryIds:[],active:true},
{id:'pedro',name:'Pedro Silva',email:'pedro@nexora.demo',role:'requester',categoryIds:[],active:true}
];
const titles=[
['Solicitação de nova campanha de e-mail','marketing'],['Ajuste na página inicial da intranet','intranet'],['Notebook com tela intermitente','hardware'],['Criar acesso para colaborador novo','access'],['Revogar acesso de ex-funcionário','revoke'],['Liberar portal de fornecedores','sites'],['Erro na aprovação de reembolso','finance'],['Atualização de cadastro de benefícios','rh'],['VPN desconectando no trabalho remoto','network'],['Licença expirada do aplicativo','software'],['Problema com projetor da sala','facilities'],['Solicitação de orientação geral','other'],['Atualizar banner institucional','marketing'],['Lentidão no portal interno','intranet'],['Mouse sem funcionamento','hardware'],['Acesso ao sistema comercial','access'],['Revisar bloqueio de conta','revoke'],['Acesso a ferramenta externa','sites']];
export function makeDemo():AppData{
 const tickets:Ticket[]=Array.from({length:45},(_,i)=>{
  const [title,categoryId]=titles[i%titles.length]; const statuses:Status[]=['open','progress','resolved','waiting','progress','resolved']; const priorities:Priority[]=['medium','high','low','medium','urgent','low'];
  const status=statuses[(i*7+2)%statuses.length];const created=new Date(Date.now()-(i*11+3)*3600_000).toISOString();
  const assignee=demoPeople.find(p=>p.role==='agent'&&p.categoryIds.includes(categoryId));
  return {id:`demo-${i+1}`,code:`TF-${String(2401+i).padStart(4,'0')}`,title,description:`Solicitação referente a ${title.toLowerCase()}. Favor analisar e informar os próximos passos.`,categoryId,status,priority:priorities[i%priorities.length],requesterId:i%2?'ana':'pedro',assigneeId:status==='open'?null:(assignee?.id??null),createdAt:created,updatedAt:created,notes:i%3===0?[{id:`n${i}`,author:'Equipe de atendimento',message:'Chamado recebido e em análise.',at:created}]:[]};
 });
 return {company:{name:'NEXORA Technologies',initials:'NX',accent:'#6868e8'},categories:structuredClone(demoCategories),people:structuredClone(demoPeople),tickets};
}
export function readDemo():AppData {try{const raw=sessionStorage.getItem('taskflow-demo');if(raw)return JSON.parse(raw) as AppData;}catch{/* reset */}const data=makeDemo();sessionStorage.setItem('taskflow-demo',JSON.stringify(data));return data}
export function saveDemo(data:AppData){sessionStorage.setItem('taskflow-demo',JSON.stringify(data))}
