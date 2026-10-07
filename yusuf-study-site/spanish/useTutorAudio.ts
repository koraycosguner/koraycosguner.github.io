import {useCallback,useEffect,useRef,useState} from 'react';
import {ignoredSpeechError,selectSpanishVoice,tutorSpeechRate,tutorSpokenText} from './tutor-audio';

/** Speech is opt-in. Browser voices vary; never silently use an English voice. */
export function useTutorAudio(){
  const [voice,setVoice]=useState<SpeechSynthesisVoice|null>(null);
  const [playing,setPlaying]=useState<string|null>(null);
  const [notice,setNotice]=useState('');
  const generation=useRef(0);
  const active=useRef<SpeechSynthesisUtterance|null>(null);
  const watchdog=useRef<ReturnType<typeof setTimeout>|null>(null);
  const invalidate=useCallback(()=>{generation.current++},[]);
  const clearWatchdog=useCallback(()=>{if(watchdog.current!==null){clearTimeout(watchdog.current);watchdog.current=null}},[]);
  const stop=useCallback(()=>{
    invalidate();clearWatchdog();
    if(active.current){active.current.onstart=null;active.current.onend=null;active.current.onerror=null;active.current=null}
    try{window.speechSynthesis?.cancel()}catch{/* Text activities remain available. */}
    setPlaying(null);
  },[clearWatchdog,invalidate]);
  useEffect(()=>{
    let disposed=false;
    const synth=window.speechSynthesis;
    const load=()=>{
      if(disposed)return;
      let selected:SpeechSynthesisVoice|null=null;
      try{selected=synth&&typeof window.SpeechSynthesisUtterance==='function'?selectSpanishVoice(synth.getVoices()):null}catch{/* Some privacy modes block voice enumeration. */}
      setVoice(selected);
      setNotice(selected?'':'Audio isn’t available right now. You can still continue with reading and picture activities.');
    };
    // Voice lists often arrive asynchronously, especially on mobile browsers.
    const initial=setTimeout(load,0),retry=setTimeout(load,1200);
    synth?.addEventListener?.('voiceschanged',load);
    return()=>{
      disposed=true;clearTimeout(initial);clearTimeout(retry);clearWatchdog();invalidate();
      synth?.removeEventListener?.('voiceschanged',load);
      if(active.current){active.current.onstart=null;active.current.onend=null;active.current.onerror=null;active.current=null}
      try{synth?.cancel()}catch{/* Teardown must never break navigation. */}
    };
  },[clearWatchdog,invalidate]);
  const listen=useCallback((text:string,slow=false)=>{
    stop();
    if(!text.trim())return;
    if(!voice||!window.speechSynthesis||typeof window.SpeechSynthesisUtterance!=='function'){
      setNotice('Audio isn’t available right now. You can still continue with reading and picture activities.');return;
    }
    const token=generation.current;
    try{
      const synth=window.speechSynthesis;
      const utterance=new window.SpeechSynthesisUtterance(tutorSpokenText(text));
      active.current=utterance;utterance.voice=voice;utterance.lang=voice.lang.replace('_','-');
      utterance.rate=tutorSpeechRate(slow);utterance.pitch=1;utterance.volume=1;
      const finish=()=>{if(token!==generation.current)return;clearWatchdog();active.current=null;setPlaying(null)};
      utterance.onstart=()=>{if(token!==generation.current)return;clearWatchdog();setPlaying(text)};
      utterance.onend=finish;
      utterance.onerror=event=>{
        if(token!==generation.current)return;
        finish();if(!ignoredSpeechError(event.error))setNotice('Audio could not play. Try Listen again, or continue with reading and picture activities.');
      };
      setNotice('');
      watchdog.current=setTimeout(()=>{
        if(token!==generation.current)return;
        stop();setNotice('Audio did not start. Try Listen again, or continue with reading and picture activities.');
      },10000);
      if(synth.paused)synth.resume();
      synth.speak(utterance);
    }catch{
      stop();setNotice('Audio could not play. You can still continue with reading and picture activities.');
    }
  },[voice,stop,clearWatchdog]);
  return {canListen:voice!==null,listen,stop,playing,notice,source:voice?`${voice.name} · ${voice.lang.replace('_','-')} · browser voice`:'No Spanish voice available'};
}
