import { useState, useEffect } from 'react';

const MAX_RECORDING_SIZE_MB = 25; // Maximum size in MB
const MAX_RECORDING_LENGTH_MS = 180000; // 3 minutes in milliseconds

interface AudioRecorderState {
  mediaRecorder: MediaRecorder | null;
  audioChunks: Blob[];
  audioUrl: string | null;
}

export const useAudioRecorder = () => {
  const [recorderState, setRecorderState] = useState<AudioRecorderState>({
    mediaRecorder: null,
    audioChunks: [],
    audioUrl: null,
  });
  const [error, setError] = useState<string | null>(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus',
        bitsPerSecond: 16000 // Lower bitrate for smaller file size
      });
      
      const audioChunks: Blob[] = [];
      let recordingSize = 0;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunks.push(event.data);
          recordingSize += event.data.size;
          
          // Check if size exceeds limit
          if (recordingSize > MAX_RECORDING_SIZE_MB * 1024 * 1024) {
            mediaRecorder.stop();
            setError(`Recording exceeded ${MAX_RECORDING_SIZE_MB}MB limit`);
            return;
          }

          setRecorderState(prev => ({
            ...prev,
            audioChunks: [...prev.audioChunks, event.data]
          }));
        }
      };

      // Auto-stop after MAX_RECORDING_LENGTH_MS
      setTimeout(() => {
        if (mediaRecorder.state === 'recording') {
          mediaRecorder.stop();
          setError('Maximum recording length reached (3 minutes)');
        }
      }, MAX_RECORDING_LENGTH_MS);

      mediaRecorder.start(1000);
      setRecorderState({ mediaRecorder, audioChunks, audioUrl: null });
      setError(null);
    } catch (error) {
      console.error('Error accessing microphone:', error);
      setError('Failed to access microphone');
    }
  };

  const stopRecording = () => {
    if (recorderState.mediaRecorder && recorderState.mediaRecorder.state !== 'inactive') {
      recorderState.mediaRecorder.requestData();
      recorderState.mediaRecorder.stop();
      recorderState.mediaRecorder.stream.getTracks().forEach(track => track.stop());

      const audioBlob = new Blob(recorderState.audioChunks, { type: 'audio/webm; codecs=opus' });
      const audioUrl = URL.createObjectURL(audioBlob);
      
      setRecorderState(prev => ({
        ...prev,
        mediaRecorder: null,
        audioUrl,
      }));

      return audioBlob;
    }
    return null;
  };

  // Cleanup function
  useEffect(() => {
    return () => {
      if (recorderState.mediaRecorder) {
        recorderState.mediaRecorder.stream.getTracks().forEach(track => track.stop());
      }
      if (recorderState.audioUrl) {
        URL.revokeObjectURL(recorderState.audioUrl);
      }
    };
  }, []);

  return {
    isRecording: !!recorderState.mediaRecorder,
    startRecording,
    stopRecording,
    audioUrl: recorderState.audioUrl,
    error,
  };
}; 