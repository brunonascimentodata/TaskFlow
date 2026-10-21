// Esse script prepara a primeira empresa. A chave de serviço fica só na máquina local.
import {readFileSync} from 'node:fs';
import {initializeApp,cert} from 'firebase-admin/app';
import {getAuth} from 'firebase-admin/auth';
import {getFirestore} from 'firebase-admin/firestore';
const [,,keyPath,email,password,companyName]=process.argv;
if(!keyPath||!email||!password||!companyName){console.error('Uso: node scripts/bootstrap.mjs service-account.json admin@empresa.com SenhaForte "Minha Empresa"');process.exit(1)}
const key=JSON.parse(readFileSync(keyPath,'utf8'));
initializeApp({credential:cert(key)});
const db=getFirestore();const company=db.doc('companies/main');
if((await company.get()).exists()){console.error('Empresa já configurada. Script encerrado para evitar sobrescrita.');process.exit(1)}
let user;try{user=await getAuth().getUserByEmail(email)}catch(e){if(e.code!=='auth/user-not-found')throw e;user=await getAuth().createUser({email,password,emailVerified:true,displayName:'Administrador'})}
await db.runTransaction(async tx=>{const snap=await tx.get(company);if(snap.exists)throw Error('Empresa já configurada');tx.create(company,{name:companyName,initials:companyName.split(/\s+/).slice(0,2).map(x=>x[0].toUpperCase()).join(''),accent:'#6868e8',createdAt:new Date().toISOString()});tx.create(db.doc(`companies/main/people/${user.uid}`),{id:user.uid,name:user.displayName||'Administrador',email:user.email.toLowerCase(),role:'admin',categoryIds:[],active:true})});
const names=['Marketing','Intranet','Hardware','Criação de acesso','Revogação','Liberação de sites','Financeiro','Recursos Humanos','Redes e conectividade','Software','Infraestrutura','Outros'];const batch=db.batch();names.forEach((name,i)=>{const ref=db.collection('companies/main/categories').doc(['marketing','intranet','hardware','access','revoke','sites','finance','rh','network','software','facilities','other'][i]);batch.set(ref,{id:ref.id,name,description:'Atendimento de '+name.toLowerCase(),color:['#b59bf4','#61a8e8','#f3a965','#6dc9ba','#ed9196','#bbbd6e'][i%6],active:true})});await batch.commit();
console.log('✅ Workspace criado. Administrador:',email,'| Empresa:',companyName);
