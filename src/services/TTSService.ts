import OpenAI from 'openai';

/**
 * Service for handling text-to-speech functionality
 */
export class TTSService {
  private static instance: TTSService;
  private audio: HTMLAudioElement | null = null;
  private openai: OpenAI | null = null;
  private isSpeaking = false;
  private currentAudioUrl: string | null = null;

  private constructor() {
    // Private constructor for singleton pattern
  }

  /**
   * Get the singleton instance of TTSService
   */
  public static getInstance(): TTSService {
    if (!TTSService.instance) {
      TTSService.instance = new TTSService();
    }
    return TTSService.instance;
  }

  /**
   * Initialize the OpenAI client
   * @param apiKey The OpenAI API key
   */
  public initializeOpenAI(apiKey: string): void {
    this.openai = new OpenAI({
      apiKey,
      dangerouslyAllowBrowser: true, // Required for browser usage
    });
  }

  /**
   * Check if the service is ready to use OpenAI TTS
   */
  public isOpenAIInitialized(): boolean {
    return !!this.openai;
  }

  /**
   * Check if speech is currently being played
   */
  public isSpeakingNow(): boolean {
    return this.isSpeaking;
  }

  /**
   * Speak text using the Web Speech API (fallback)
   * @param text The text to speak
   * @returns Promise that resolves when speech ends or is canceled
   */
  public speakWithWebSpeech(text: string): Promise<void> {
    // Cancel any ongoing speech
    this.stop();
    
    return new Promise((resolve) => {
      // Use browser's native speech synthesis if available
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(text);
        
        utterance.onend = () => {
          this.isSpeaking = false;
          resolve();
        };
        
        utterance.onerror = () => {
          this.isSpeaking = false;
          resolve();
        };
        
        this.isSpeaking = true;
        window.speechSynthesis.speak(utterance);
      } else {
        // No speech synthesis available
        console.warn('Speech synthesis not supported in this browser');
        resolve();
      }
    });
  }

  /**
   * Speak text using OpenAI TTS
   * @param text The text to speak
   * @param voiceId Voice to use (default: 'alloy')
   * @returns Promise that resolves when speech ends or is canceled
   */
  public async speakWithOpenAI(
    text: string, 
    voiceId: 'alloy' | 'echo' | 'fable' | 'onyx' | 'nova' | 'shimmer' | 'coral' = 'alloy'
  ): Promise<void> {
    // Validate we have OpenAI initialized
    if (!this.openai) {
      console.warn('OpenAI client not initialized. Using Web Speech API instead.');
      return this.speakWithWebSpeech(text);
    }

    // Cancel any ongoing speech
    this.stop();

    try {
      this.isSpeaking = true;

      // Generate speech using OpenAI API
      const mp3Response = await this.openai.audio.speech.create({
        model: "tts-1",
        voice: voiceId,
        input: text,
      });

      // Convert response to blob
      const blob = new Blob([await mp3Response.arrayBuffer()], { type: 'audio/mpeg' });
      const url = URL.createObjectURL(blob);
      
      // Store the URL to revoke it later
      this.currentAudioUrl = url;
      
      // Create and play audio
      return new Promise((resolve) => {
        this.audio = new Audio(url);
        
        this.audio.onended = () => {
          this.cleanupAudio();
          resolve();
        };
        
        this.audio.onerror = () => {
          console.error('Error playing TTS audio');
          this.cleanupAudio();
          resolve();
        };
        
        this.audio.play().catch(error => {
          console.error('Error playing TTS audio:', error);
          this.cleanupAudio();
          resolve();
        });
      });
    } catch (error) {
      console.error('Error generating TTS with OpenAI:', error);
      this.isSpeaking = false;
      // Fallback to Web Speech API
      return this.speakWithWebSpeech(text);
    }
  }

  /**
   * Stop any ongoing speech
   */
  public stop(): void {
    // Stop Web Speech API speech
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    
    // Stop audio element if playing
    if (this.audio) {
      this.audio.pause();
      this.cleanupAudio();
    }
  }

  /**
   * Clean up audio resources
   */
  private cleanupAudio(): void {
    if (this.currentAudioUrl) {
      URL.revokeObjectURL(this.currentAudioUrl);
      this.currentAudioUrl = null;
    }
    
    this.audio = null;
    this.isSpeaking = false;
  }
}

export default TTSService.getInstance();
