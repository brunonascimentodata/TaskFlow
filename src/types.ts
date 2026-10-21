export type Role='admin'|'agent'|'requester';
export type Status='open'|'progress'|'waiting'|'resolved';
export type Priority='low'|'medium'|'high'|'urgent';
export interface Category {id:string;name:string;description:string;color:string;active:boolean}
export interface Person {id:string;name:string;email:string;role:Role;categoryIds:string[];active:boolean}
export interface Note {id:string;author:string;message:string;at:string}
export interface Ticket {id:string;code:string;title:string;description:string;categoryId:string;priority:Priority;status:Status;requesterId:string;assigneeId:string|null;createdAt:string;updatedAt:string;notes:Note[]}
export interface Company {name:string;accent:string;initials:string;createdAt?:string}
export interface AppData {company:Company;categories:Category[];people:Person[];tickets:Ticket[]}
export const statusLabels:Record<Status,string>={open:'Aberto',progress:'Em andamento',waiting:'Aguardando',resolved:'Resolvido'};
export const priorityLabels:Record<Priority,string>={low:'Baixa',medium:'Média',high:'Alta',urgent:'Urgente'};
export const roleLabels:Record<Role,string>={admin:'Administrador',agent:'Atendente',requester:'Solicitante'};
