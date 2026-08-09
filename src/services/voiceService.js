/**
 * RoamPulse AI — Voice Assistant & Speech Synthesis Engine
 * Uses Web Speech API for hands-free locality audio briefings.
 */

export const voiceService = {
  speak(text, onEnd) {
    if (!('speechSynthesis' in window)) {
      console.warn('[VoiceService] Web Speech API not supported in this browser.');
      if (onEnd) onEnd();
      return;
    }

    this.stop();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;

    const voices = window.speechSynthesis.getVoices();
    const englishVoice = voices.find(v => v.lang.includes('en')) || voices[0];
    if (englishVoice) utterance.voice = englishVoice;

    if (onEnd) {
      utterance.onend = onEnd;
      utterance.onerror = onEnd;
    }

    window.speechSynthesis.speak(utterance);
  },

  stop() {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  },

  isSpeaking() {
    return 'speechSynthesis' in window && window.speechSynthesis.speaking;
  }
};
