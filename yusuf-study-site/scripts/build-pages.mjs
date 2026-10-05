import {build} from 'vite';
import {readFile,writeFile,mkdir,stat} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const out=resolve(root,'pages-dist/yusufs-quizzes');
await build({configFile:resolve(root,'vite.pages.config.ts')});
const {pageRoutes,pagesBase}=await import('../pages/routes.ts');
const shell=await readFile(resolve(out,'index.html'),'utf8');
for(const route of pageRoutes){
  if(route==='/')continue;
  const folder=resolve(out,'.'+route);await mkdir(folder,{recursive:true});
  await writeFile(resolve(folder,'index.html'),shell);
}
// Preserve the original static activities; adjust only their root-mounted navigation.
const ecology=resolve(out,'quizzes/ecology/index.html');
await writeFile(ecology,(await readFile(ecology,'utf8')).replace(/(href|src)="\/(?!\/)/g,`$1="${pagesBase}`));
for(const route of [...pageRoutes,'/quizzes/ecology/','/quizzes/southwest-asia/'])
  await stat(resolve(out,'.'+route,'index.html'));
await writeFile(resolve(out,'release.json'),JSON.stringify({site:'Yusuf’s Study Club',base:pagesBase,routes:13},null,2)+'\n');
console.log(`GitHub Pages output: ${out} (13 direct-loadable routes)`);
