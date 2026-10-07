/** Selection stays separate from playback so recorded clips can be added later. */
export type SpanishVoice = {name:string;lang:string;localService?:boolean;default?:boolean};
export function selectSpanishVoice<T extends SpanishVoice>(voices:readonly T[]):T|null {
  const spanish=voices.filter(voice=>/^es(?:[-_]|$)/i.test(voice.lang));
  const score=(voice:T)=>{
    const locale=voice.lang.toLowerCase().replace('_','-');
    const region=locale==='es-us'?30:locale==='es-mx'?28:locale==='es-es'?24:20;
    const natural=/natural|neural|premium|enhanced/i.test(voice.name)?8:0;
    const novelty=/grandma|grandpa|eddy|flo|rocko|sandy|shelley|reed/i.test(voice.name)?-10:0;
    return region+natural+novelty+(voice.localService?3:0)+(voice.default?1:0);
  };
  return spanish.map((voice,index)=>({voice,index,score:score(voice)})).sort((a,b)=>b.score-a.score||a.index-b.index)[0]?.voice??null;
}
export function ignoredSpeechError(error:string){return error==='canceled'||error==='interrupted'}
export function tutorSpeechRate(slow=false){return slow?.72:.92}
/** Read vocabulary variants as separate phrases, never say slash punctuation. */
export function tutorSpokenText(text:string){return text.replace(/\s*[/;]\s*/g,'. ').replace(/\s+/g,' ').trim()}
