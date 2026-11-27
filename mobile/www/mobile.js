import { Capacitor } from '@capacitor/core';
import { Preferences } from '@capacitor/preferences';
import { Browser } from '@capacitor/browser';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { LocalNotifications } from '@capacitor/local-notifications';

const native = Capacitor.isNativePlatform();
const KEY = 'jw-study-data';
const fileKey = path => `jw-file:${path}`;
const b64FromDataUrl = value => value.substring(value.indexOf(',') + 1);
const mimeFor = ext => ({pdf:'application/pdf',txt:'text/plain',md:'text/markdown',docx:'application/vnd.openxmlformats-officedocument.wordprocessingml.document'}[ext] || 'application/octet-stream');

async function load(){
  try {
    const result = native ? await Preferences.get({key:KEY}) : {value:localStorage.getItem(KEY)};
    return result.value ? JSON.parse(result.value) : {studies:[],notes:[],highlights:[],settings:{dailyMinutes:30,studyTime:'18:00',reminder:true}};
  } catch { return {studies:[],notes:[],highlights:[],settings:{dailyMinutes:30,studyTime:'18:00',reminder:true}}; }
}
async function save(data){
  const value=JSON.stringify(data);
  if(native) await Preferences.set({key:KEY,value});
  else localStorage.setItem(KEY,value);
  return true;
}
function chooseFile(){
 return new Promise(resolve=>{
  const input=document.createElement('input');input.type='file';input.accept='.pdf,.txt,.md,.docx';
  input.onchange=async()=>{
   const file=input.files?.[0];if(!file){resolve(null);return;}
   if(file.size>(native?20:3)*1024*1024){alert('Please choose a document smaller than 20 MB.');resolve(null);return;}
   const reader=new FileReader();
   reader.onload=async()=>{
    const dataUrl=String(reader.result||'');const ext=(file.name.split('.').pop()||'').toLowerCase();
    const path=`${Date.now()}-${file.name.replace(/[^a-z0-9._-]/gi,'_')}`;
    try{
      if(native) await Filesystem.writeFile({path:`publications/${path}`,data:b64FromDataUrl(dataUrl),directory:Directory.Data,recursive:true});
      else localStorage.setItem(fileKey(path),dataUrl);
      resolve({name:file.name,path,type:ext});
    }catch(e){alert('Could not save this document on the device. Please try a smaller file.');resolve(null);}
   };
   reader.onerror=()=>resolve(null);reader.readAsDataURL(file);
  };
  input.click();
 });
}
async function openFile(path){
 try{
  let dataUrl;
  if(native){
   const result=await Filesystem.readFile({path:`publications/${path}`,directory:Directory.Data});
   dataUrl=`data:${mimeFor((path.split('.').pop()||'').toLowerCase())};base64,${result.data}`;
  }else dataUrl=localStorage.getItem(fileKey(path));
  if(!dataUrl)return false;
  const blob=await (await fetch(dataUrl)).blob();const url=URL.createObjectURL(blob);
  const a=document.createElement('a');a.href=url;a.target='_blank';a.rel='noopener';a.download=path.split('-').slice(1).join('-')||'study-document';a.click();
  setTimeout(()=>URL.revokeObjectURL(url),60000);return true;
 }catch{return false;}
}
async function openJw(url){
 try{const u=new URL(url);if(u.protocol!=='https:'||(u.hostname!=='jw.org'&&!u.hostname.endsWith('.jw.org')))return false;
   if(native)await Browser.open({url:u.href});else window.open(u.href,'_blank','noopener');return true;
 }catch{return false;}
}
async function scheduleReminder(settings){
 if(!native)return;
 try{
  await LocalNotifications.cancel({notifications:[{id:4101}]});
  if(!settings?.reminder||!settings.studyTime)return;
  const perm=await LocalNotifications.checkPermissions();
  if(perm.display!=='granted'){const req=await LocalNotifications.requestPermissions();if(req.display!=='granted')return;}
  const [hour,minute]=settings.studyTime.split(':').map(Number);
  const reminderMinutes=(hour*60+minute-60+1440)%1440;
  const reminderHour=Math.floor(reminderMinutes/60),reminderMinute=reminderMinutes%60;
  await LocalNotifications.schedule({notifications:[{id:4101,title:'Study reminder',body:'Your personal study time is in one hour.',schedule:{on:{hour:reminderHour,minute:reminderMinute},repeats:true}}]});
 }catch(e){console.warn('Reminder scheduling unavailable',e);}
}
window.studyApp={
 load,save,importFile:chooseFile,openFile,openJw,
 notify:async(title,body)=>{if(native){const p=await LocalNotifications.checkPermissions();if(p.display!=='granted')await LocalNotifications.requestPermissions();await LocalNotifications.schedule({notifications:[{id:4102,title,body,schedule:{at:new Date(Date.now()+1000)} }]});}},
 scheduleReminder,
 exportData:async data=>{
  const blob=new Blob([JSON.stringify(data,null,2)],{type:'application/json'});const url=URL.createObjectURL(blob);
  const a=document.createElement('a');a.href=url;a.download='jw-study-backup.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),3000);
 }
};
if(!native && 'serviceWorker' in navigator){navigator.serviceWorker.register('./service-worker.js').catch(()=>{});}
await import('./app.js');
