import {useCallback,useEffect,useState} from 'react';
export function useSpanishSpeech(){
 const [voices,setVoices]=useState<SpeechSynthesisVoice[]>([]);const [notice,setNotice]=useState('');
 useEffect(()=>{if(!('speechSynthesis' in window))return;const load=()=>{try{setVoices(window.speechSynthesis.getVoices().filter(v=>/^es([_-]|$)/i.test(v.lang)))}catch{setVoices([])}};load();window.speechSynthesis.addEventListener('voiceschanged',load);return()=>{window.speechSynthesis.removeEventListener('voiceschanged',load);window.speechSynthesis.cancel()}},[]);
 const listen=useCallback((text:string)=>{if(!voices.length||!('speechSynthesis' in window)){setNotice('No Spanish voice is available. The same words stay on screen.');return}try{window.speechSynthesis.cancel();const line=new SpeechSynthesisUtterance(text);line.voice=voices[0];line.lang=voices[0].lang;line.rate=.82;line.onerror=()=>setNotice('Audio could not play. The same words stay on screen.');window.speechSynthesis.speak(line)}catch{setNotice('Audio is unavailable. You can read the words on screen.')}},[voices]);
 return {canListen:voices.length>0,listen,notice};
}
