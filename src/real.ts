import {collection,doc,getDoc,getDocs,setDoc,updateDoc,query,where} from 'firebase/firestore';
import {createUserWithEmailAndPassword,signInWithEmailAndPassword,signOut,sendPasswordResetEmail,sendEmailVerification,updateProfile} from 'firebase/auth';
import {auth,db} from './firebase';
import type {AppData,Category,Company,Person,Ticket} from './types';
const root='main';
export async function loadReal():Promise<AppData>{
 if(!auth.currentUser)throw new Error('Autenticação necessária.');
 const meSnap=await getDoc(doc(db,'companies',root,'people',auth.currentUser.uid));
 if(!meSnap.exists())throw new Error('Sua conta ainda não foi ativada. Verifique seu e-mail e conclua o convite.');
 const me=meSnap.data() as Person;
 const [co,ca,pe]=await Promise.all([getDoc(doc(db,'companies',root)),getDocs(collection(db,'companies',root,'categories')),getDocs(collection(db,'companies',root,'people'))]);
 if(!co.exists())throw new Error('Empresa ainda não configurada. Execute o script de configuração inicial descrito no README.');
 const ticketRef=collection(db,'companies',root,'tickets');
 let tickets:Ticket[]=[];
 if(me.role==='admin'){
   const snap=await getDocs(ticketRef);tickets=snap.docs.map(d=>d.data() as Ticket);
 }else{
   const queries=[query(ticketRef,where('requesterId','==',me.id))];
   if(me.role==='agent'){
     for(let i=0;i<me.categoryIds.length;i+=10)queries.push(query(ticketRef,where('categoryId','in',me.categoryIds.slice(i,i+10))));
     queries.push(query(ticketRef,where('assigneeId','==',me.id)));
   }
   const snaps=await Promise.all(queries.map(q=>getDocs(q)));
   tickets=[...new Map(snaps.flatMap(s=>s.docs.map(d=>[d.id,d.data() as Ticket] as const))).values()];
 }
 return {company:co.data() as Company,categories:ca.docs.map(d=>({...(d.data() as Category),id:d.id})),people:pe.docs.map(d=>({...(d.data() as Person),id:d.id})),tickets};
}
export async function login(email:string,password:string){await signInWithEmailAndPassword(auth,email,password)}
export async function logout(){await signOut(auth)}
export async function recover(email:string){await sendPasswordResetEmail(auth,email)}
export async function acceptInvite(name:string,email:string,password:string){
 const cred=await createUserWithEmailAndPassword(auth,email,password);
 await updateProfile(cred.user,{displayName:name});
 await sendEmailVerification(cred.user);
}
export async function finalizeInvite(){
 if(!auth.currentUser)throw new Error('Faça login para ativar o convite.');
 await auth.currentUser.reload();
 await auth.currentUser.getIdToken(true);
 const current=auth.currentUser;
 if(!current.emailVerified)throw new Error('Confirme o e-mail enviado pelo Firebase antes de ativar sua conta.');
 const email=current.email?.toLowerCase();if(!email)throw new Error('E-mail indisponível.');
 const invitation=await getDoc(doc(db,'companies',root,'invitations',email));
 if(!invitation.exists())throw new Error('Convite inexistente. Solicite um convite ao administrador.');
 const data=invitation.data();
 await setDoc(doc(db,'companies',root,'people',current.uid),{id:current.uid,name:current.displayName||data.name||email,email,role:data.role,categoryIds:data.categoryIds||[],active:true});
}
export async function saveCompany(company:Company){await updateDoc(doc(db,'companies',root),{name:company.name,accent:company.accent,initials:company.initials})}
export async function saveCategory(category:Category){await setDoc(doc(db,'companies',root,'categories',category.id),category)}
export async function removeCategory(id:string){await deleteDoc(doc(db,'companies',root,'categories',id))}
export async function savePerson(person:Person){await updateDoc(doc(db,'companies',root,'people',person.id),{name:person.name,role:person.role,categoryIds:person.categoryIds,active:person.active})}
export async function createInvitation(person:Omit<Person,'id'|'active'>){await setDoc(doc(db,'companies',root,'invitations',person.email.toLowerCase()),{email:person.email.toLowerCase(),name:person.name,role:person.role,categoryIds:person.categoryIds,createdAt:new Date().toISOString()})}
export async function saveTicket(ticket:Ticket){await setDoc(doc(db,'companies',root,'tickets',ticket.id),ticket)}
