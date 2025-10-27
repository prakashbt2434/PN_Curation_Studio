// Function to decode base64 string to Uint8Array
function decodeBase64(base64: string): Uint8Array {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

// Function to create a WAV file header
function createWavHeader(dataLength: number): ArrayBuffer {
  const sampleRate = 24000; // As specified by the Gemini TTS API
  const numChannels = 1; // Mono
  const bitsPerSample = 16; // 16-bit PCM
  const byteRate = sampleRate * numChannels * (bitsPerSample / 8);
  const blockAlign = numChannels * (bitsPerSample / 8);

  const buffer = new ArrayBuffer(44);
  const view = new DataView(buffer);

  // RIFF identifier
  writeString(view, 0, 'RIFF');
  // RIFF chunk size
  view.setUint32(4, 36 + dataLength, true);
  // RIFF type
  writeString(view, 8, 'WAVE');
  // FMT sub-chunk
  writeString(view, 12, 'fmt ');
  // Size of FMT chunk
  view.setUint32(16, 16, true);
  // Audio format (1 for PCM)
  view.setUint16(20, 1, true);
  // Number of channels
  view.setUint16(22, numChannels, true);
  // Sample rate
  view.setUint32(24, sampleRate, true);
  // Byte rate
  view.setUint32(28, byteRate, true);
  // Block align
  view.setUint16(32, blockAlign, true);
  // Bits per sample
  view.setUint16(34, bitsPerSample, true);
  // Data sub-chunk
  writeString(view, 36, 'data');
  // Size of data chunk
  view.setUint32(40, dataLength, true);

  return buffer;
}

function writeString(view: DataView, offset: number, str: string) {
  for (let i = 0; i < str.length; i++) {
    view.setUint8(offset + i, str.charCodeAt(i));
  }
}

export const createWavBlob = (base64PcmData: string): Blob => {
  const pcmData = decodeBase64(base64PcmData);
  const header = createWavHeader(pcmData.length);
  const wavBlob = new Blob([header, pcmData], { type: 'audio/wav' });
  return wavBlob;
};
