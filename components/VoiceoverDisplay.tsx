import React, { useState, useEffect } from 'react';
import { generateKannadaVoiceoverAudio } from '../services/geminiService';
import { createWavBlob } from '../utils/audioUtils';
import { Spinner } from './Spinner';

interface VoiceoverDisplayProps {
  voiceoverContent: string | null;
  isLoading: boolean;
  error: string | null;
}

const LoadingSkeleton: React.FC = () => (
  <div className="animate-pulse space-y-3">
    <div className="h-4 bg-gray-200 rounded w-full"></div>
    <div className="h-4 bg-gray-200 rounded w-5/6"></div>
    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
  </div>
);

const AudioIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
        <path d="M10 3.5a.5.5 0 01.5.5v12a.5.5 0 01-1 0v-12a.5.5 0 01.5-.5zM5.5 6a.5.5 0 000 1h1a.5.5 0 000-1h-1zM13.5 9a.5.5 0 000 1h1a.5.5 0 000-1h-1zM5.5 12a.5.5 0 000 1h1a.5.5 0 000-1h-1zM10 6.5a.5.5 0 01.5-.5h1a.5.5 0 010 1h-1a.5.5 0 01-.5-.5z" />
        <path d="M3 5a2 2 0 012-2h10a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V5zm2-1a1 1 0 00-1 1v10a1 1 0 001 1h10a1 1 0 001-1V5a1 1 0 00-1-1H5z" />
    </svg>
);


export const VoiceoverDisplay: React.FC<VoiceoverDisplayProps> = ({ voiceoverContent, isLoading, error }) => {
  const [isAudioLoading, setIsAudioLoading] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [audioError, setAudioError] = useState<string | null>(null);
  
  useEffect(() => {
    // Clean up Blob URL when component unmounts or content changes
    return () => {
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
    };
  }, [audioUrl]);

  useEffect(() => {
    // Reset audio when new content is generated
    setAudioUrl(null);
    setAudioError(null);
  }, [voiceoverContent]);


  const handleGenerateAudio = async () => {
    if (!voiceoverContent) return;
    setIsAudioLoading(true);
    setAudioError(null);
    if (audioUrl) URL.revokeObjectURL(audioUrl);

    try {
      const base64Audio = await generateKannadaVoiceoverAudio(voiceoverContent);
      const wavBlob = createWavBlob(base64Audio);
      const url = URL.createObjectURL(wavBlob);
      setAudioUrl(url);
    } catch (err) {
      console.error(err);
      setAudioError("Failed to generate audio. Please try again.");
    } finally {
      setIsAudioLoading(false);
    }
  };


  return (
    <div className="w-full min-h-[224px] p-4 border border-gray-300 rounded-xl shadow-sm bg-blue-50/50 flex flex-col">
      <div className="flex-grow overflow-y-auto">
          {isLoading && <LoadingSkeleton />}
          {!isLoading && !error && !voiceoverContent && (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-500 text-center">Voiceover script will appear here.</p>
            </div>
          )}
           {!isLoading && error && (
            <div className="flex items-center justify-center h-full">
              <p className="text-red-500 text-center">{error}</p>
            </div>
          )}
          {!isLoading && voiceoverContent && (
            <div className="text-base leading-relaxed whitespace-pre-wrap">
              {voiceoverContent}
            </div>
          )}
      </div>

       {voiceoverContent && !error && (
        <div className="mt-4 pt-4 border-t border-blue-200">
           {audioUrl && !isAudioLoading && (
            <div className="space-y-3">
                <audio controls src={audioUrl} className="w-full">
                    Your browser does not support the audio element.
                </audio>
                <a 
                href={audioUrl} 
                download="voiceover.wav"
                className="block text-center w-full px-4 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors"
                >
                Download Audio
                </a>
            </div>
          )}

          {isAudioLoading && (
             <button disabled className="w-full flex items-center justify-center px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg opacity-70 cursor-not-allowed">
                <Spinner />
                <span className="ml-2">Generating Audio...</span>
            </button>
          )}

           {!isAudioLoading && !audioUrl && (
             <button 
                onClick={handleGenerateAudio}
                className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
              >
               <AudioIcon />
               Generate Audio
            </button>
           )}

           {audioError && <p className="text-red-500 text-sm mt-2 text-center">{audioError}</p>}
        </div>
      )}
    </div>
  );
};
