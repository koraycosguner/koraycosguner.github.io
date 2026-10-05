import {defineConfig, type Plugin} from 'vite';
import react from '@vitejs/plugin-react';
import ts from 'typescript';
import {resolve} from 'node:path';
import {pagesBase} from './static-pages/routes';

const sourceRoot=import.meta.dirname;
/** Only this static build rewrites URL literals. Sites source remains root-mounted. */
function subpathUrls():Plugin {
  return {name:'study-pages-subpath',enforce:'pre',transform(code,id){
    if(!/\.[jt]sx?$/.test(id)||!['app','spanish','rikki'].some(dir=>id.startsWith(resolve(sourceRoot,dir)+'/')))return;
    const file=ts.createSourceFile(id,code,ts.ScriptTarget.Latest,true,ts.ScriptKind.TSX);
    const changes:{start:number;end:number;value:string}[]=[];
    function visit(node:ts.Node){
      if(ts.isStringLiteral(node)||ts.isNoSubstitutionTemplateLiteral(node)){
        const value=node.text;
        if(value==='/'||/^\/(quizzes\/|subjects\/|favicon\.svg$|sw-asia-map\.webp$)/.test(value))
          changes.push({start:node.getStart(file),end:node.getEnd(),value:JSON.stringify(pagesBase+value.slice(1))});
      }
      ts.forEachChild(node,visit);
    }
    visit(file);
    if(!changes.length)return;
    for(const change of changes.sort((a,b)=>b.start-a.start))code=code.slice(0,change.start)+change.value+code.slice(change.end);
    return {code,map:null};
  }};
}
export default defineConfig({
  root:resolve(sourceRoot,'static-pages'),
  base:pagesBase,
  publicDir:resolve(sourceRoot,'public'),
  plugins:[subpathUrls(),react()],
  build:{outDir:resolve(sourceRoot,'pages-dist/yusufs-quizzes'),emptyOutDir:true,assetsDir:'assets',sourcemap:false},
});
