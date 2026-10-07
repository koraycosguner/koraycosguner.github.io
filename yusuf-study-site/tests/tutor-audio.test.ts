import test from 'node:test';
import assert from 'node:assert/strict';
import {selectSpanishVoice,ignoredSpeechError,tutorSpeechRate,tutorSpokenText} from '../spanish/tutor-audio.ts';
test('audio never falls back to an unrelated language',()=>{
  assert.equal(selectSpanishVoice([{name:'English',lang:'en-US',default:true}]),null);
  assert.equal(selectSpanishVoice([]),null);
});
test('Spanish selection favors a suitable Latin American voice, preserves the real voice object',()=>{
  const mx={name:'Paulina',lang:'es_MX',localService:true};
  assert.equal(selectSpanishVoice([{name:'English',lang:'en-US'},{name:'Mónica',lang:'es-ES'},mx]),mx);
});
test('natural voices are preferred and other Spanish locales remain usable',()=>{
  const natural={name:'Lucia Natural',lang:'es-US'};
  assert.equal(selectSpanishVoice([{name:'Eddy',lang:'es-US'},natural]),natural);
  assert.equal(selectSpanishVoice([{name:'Spanish Colombia',lang:'es-CO'}])?.lang,'es-CO');
});
test('replay cancellation is normal; actual playback failures are not hidden',()=>{
  assert.ok(ignoredSpeechError('canceled'));assert.ok(ignoredSpeechError('interrupted'));
  assert.equal(ignoredSpeechError('network'),false);assert.equal(ignoredSpeechError('not-allowed'),false);
  assert.ok(tutorSpeechRate(true)<tutorSpeechRate());assert.ok(tutorSpeechRate()<=1);
});
test('vocabulary variants use natural phrase pauses without changing accents or sentence meaning',()=>{
  assert.equal(tutorSpokenText('el profesor / la profesora; el maestro / la maestra'),'el profesor. la profesora. el maestro. la maestra');
  assert.equal(tutorSpokenText('Teresa es de Perú.'),'Teresa es de Perú.');
});
