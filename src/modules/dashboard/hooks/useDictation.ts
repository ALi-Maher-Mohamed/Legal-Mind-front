'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { consultCopy as c } from '../data/consultCopy';

type RecognitionLike = {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  onstart: (() => void) | null;
  onend: (() => void) | null;
  onerror: (() => void) | null;
  onresult: ((event: { results: { [i: number]: { [j: number]: { transcript: string } } } }) => void) | null;
};

export function useDictation(onTranscript: (text: string) => void) {
  const [isDictating, setIsDictating] = useState(false);
  const recognitionRef = useRef<RecognitionLike | null>(null);
  const onTranscriptRef = useRef(onTranscript);
  onTranscriptRef.current = onTranscript;

  useEffect(() => {
    if (typeof window === 'undefined') return;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const Win = window as any;
    const SR = Win.SpeechRecognition || Win.webkitSpeechRecognition;
    if (!SR) return;

    const rec: RecognitionLike = new SR();
    rec.continuous = false;
    rec.interimResults = false;
    rec.lang = 'ar-EG';
    rec.onstart = () => setIsDictating(true);
    rec.onend = () => setIsDictating(false);
    rec.onerror = () => setIsDictating(false);
    rec.onresult = (event) => {
      const transcript = event.results[0]?.[0]?.transcript;
      if (transcript) onTranscriptRef.current(transcript);
    };
    recognitionRef.current = rec;
  }, []);

  const toggleDictation = useCallback(() => {
    if (!recognitionRef.current) {
      alert(c.dictationUnsupported);
      return;
    }
    if (isDictating) recognitionRef.current.stop();
    else {
      try {
        recognitionRef.current.start();
      } catch (err) {
        console.error(err);
      }
    }
  }, [isDictating]);

  return { isDictating, toggleDictation };
}
