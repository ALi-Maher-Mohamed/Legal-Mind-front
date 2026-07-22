'use client';

import { useCallback, useEffect, useState } from 'react';
import { cleanSpeechText } from '../lib/consultHelpers';

export function useSpeechRead(activeKey: string | null) {
  const [speakingMsgId, setSpeakingMsgId] = useState<string | null>(null);
  const [speechRate, setSpeechRate] = useState(0.9);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    window.speechSynthesis.getVoices();
    const onVoices = () => window.speechSynthesis.getVoices();
    window.speechSynthesis.addEventListener('voiceschanged', onVoices);
    return () => {
      window.speechSynthesis.removeEventListener('voiceschanged', onVoices);
      window.speechSynthesis.cancel();
    };
  }, []);

  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
      setSpeakingMsgId(null);
    };
  }, [activeKey]);

  const stopSpeaking = useCallback(() => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setSpeakingMsgId(null);
  }, []);

  const speakMessage = useCallback(
    (msgId: string, text: string) => {
      if (typeof window === 'undefined' || !window.speechSynthesis) return;
      if (speakingMsgId === msgId) {
        stopSpeaking();
        return;
      }

      window.speechSynthesis.cancel();
      const clean = cleanSpeechText(text);
      const utterance = new SpeechSynthesisUtterance(clean);
      utterance.lang = 'ar-EG';
      utterance.rate = speechRate;
      const arVoice = window.speechSynthesis.getVoices().find((v) => v.lang.startsWith('ar'));
      if (arVoice) utterance.voice = arVoice;
      utterance.onend = () => setSpeakingMsgId(null);
      utterance.onerror = () => setSpeakingMsgId(null);
      setSpeakingMsgId(msgId);
      window.speechSynthesis.speak(utterance);
    },
    [speakingMsgId, speechRate, stopSpeaking],
  );

  return { speakingMsgId, speechRate, setSpeechRate, speakMessage, stopSpeaking };
}
