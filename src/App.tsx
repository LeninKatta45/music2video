import React, { useState } from 'react';
import axios from 'axios';
import './App.css'; // Import CSS

interface VideoData {
    prompt: string;
    audio_path: string;
    tempo: number;
    sr: number;
    significant_points: number[];
}

function App() {
    const [audioFile, setAudioFile] = useState<File | null>(null);
    const [theme, setTheme] = useState('Abstract Shapes');
    const [colorPattern, setColorPattern] = useState('Vibrant');
    const [primaryColor, setPrimaryColor] = useState('#FF5733');
    const [secondaryColor, setSecondaryColor] = useState('#33FF57');
    const [animationType, setAnimationType] = useState('Smooth Transitions');
    const [videoData, setVideoData] = useState<VideoData | null>(null);
    const [videoFile, setVideoFile] = useState<File | null>(null);
    const [finalVideoUrl, setFinalVideoUrl] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isBeatSync, setIsBeatSync] = useState(true);
    const [url, setUrl] = useState(''); // New state for the URL input


    const handleAudioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
          setAudioFile(e.target.files[0]);
          setError(null)
        }
      };

      const handleThemeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setTheme(e.target.value);
      };
    
      const handleColorPatternChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setColorPattern(e.target.value);
      };

      const handlePrimaryColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPrimaryColor(e.target.value);
      };
    
      const handleSecondaryColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSecondaryColor(e.target.value);
      };
    
      const handleAnimationTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
          setAnimationType(e.target.value);
      };
    
    const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUrl(e.target.value);
    };

    const handleGeneratePrompt = async () => {
        setIsLoading(true);
        setError(null)

        if (!audioFile && !url) {
          setError("Please upload an audio file or provide a URL.");
          setIsLoading(false)
          return;
        }
        
        const formData = new FormData();
        if (audioFile){
            formData.append('audio_file', audioFile);
        } else {
            formData.append('url', url);
        }
        formData.append('theme', theme);
        formData.append('color_pattern', colorPattern);
        formData.append('primary_color', primaryColor);
        formData.append('secondary_color', secondaryColor);
        formData.append('animation_type', animationType);

        try {
            const response = await axios.post('https://6857-2409-408c-159d-6a62-5038-c6ec-92a3-ad6b.ngrok-free.app/generate_prompt/', formData, { // Make POST request to /generate_prompt endpoint
                headers: {
                    'Content-Type': 'multipart/form-data', // set content type to multi part form data to send files and data
                },
            });
            // Extract data from the response and store it in videoData state
            setVideoData({
                prompt: response.data.prompt,
                audio_path: response.data.audio_path,
                tempo: response.data.tempo,
                sr: response.data.sr,
                significant_points: response.data.significant_points
              });
            setIsLoading(false);
        } catch (error: any) {
            setError(error.message || "Error generating prompt.");
            setIsLoading(false);
        }
    };

    const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
        setVideoFile(e.target.files[0]);
        setError(null);
      }
    };

  const handleProcessVideo = async () => {
    setIsLoading(true);
    setError(null);

    if (!videoFile) {
      setError("Please upload a video file.");
      setIsLoading(false);
      return;
    }

    if (!videoData) {
        setError("Please generate the video prompt first.");
        setIsLoading(false);
        return;
    }

    try {
      const formData = new FormData();
      formData.append("video_file", videoFile);
      formData.append("audio_path", videoData.audio_path); // send the audio path that was returned from the prompt

       formData.append("tempo", String(videoData.tempo));
       formData.append("sr", String(videoData.sr));
       formData.append("significant_points_str", JSON.stringify(videoData.significant_points));

      const response = await axios.post(
        "https://6857-2409-408c-159d-6a62-5038-c6ec-92a3-ad6b.ngrok-free.app/process_video/",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          responseType: "blob",
        }
      );

        const videoUrl = URL.createObjectURL(new Blob([response.data], { type: "video/mp4" }));
        setFinalVideoUrl(videoUrl);
        setIsLoading(false);
    } catch (error: any) {
        setError(error.message || "Error processing video.");
        setIsLoading(false);
    }
  };
    
    return (
      <div className="app-container">
          <h1>𝄞 Music to Video Generator 🎦</h1>
            <div className='upload-contain'>
              <input type="file" accept=".mp3,.wav,.m4a" onChange={handleAudioChange} />
              <button
                onClick={() => window.open('https://songgpt.com/', '_blank')}
                style={{
                  backgroundColor: 'violet',
                  color: 'white',
                  padding: '5px 10px',
                  fontSize: '14px',
                }}
              >
                Song GPT
              </button>
            </div>
            <div>
              <input type="text" placeholder="Enter audio URL" value={url} onChange={handleUrlChange} />
            </div>
            <div className='options-container'>
              <div className='option'>
                <label>Theme:</label>
                <select value={theme} onChange={handleThemeChange}>
                  {["Abstract Shapes", "Cityscapes", "Nature Scenes", "Galaxy", "Waveforms", "Custom Design", "Underwater World", "Neon Lights", "Vintage Film", "Fantasy Worlds", "Minimalist Art", "Graffiti Art", "Fireworks", "Silhouettes", "3D Geometries", "Liquid Flow", "Particle Effects", "Forest Landscapes", "Space Odyssey", "Dynamic Grids", "Photorealistic Landscapes", "Photorealistic Cityscapes", "Photorealistic Interiors"]
                    .map((themeName) => (
                        <option key={themeName} value={themeName}>{themeName}</option>
                    ))}
                </select>
              </div>

              <div className='option'>
                <label>Color Pattern:</label>
                <select value={colorPattern} onChange={handleColorPatternChange}>
                  <option value="Vibrant">Vibrant</option>
                  <option value="Pastel">Pastel</option>
                  <option value="Monochrome">Monochrome</option>
                  <option value="Custom">Custom</option>
                </select>
              </div>
              {colorPattern === "Custom" && (
              <div className='custom-colors'>
                <div className='color-picker'>
                    <label>Primary Color:</label>
                    <input type="color" value={primaryColor} onChange={handlePrimaryColorChange} />
                </div>
                <div className='color-picker'>
                  <label>Secondary Color:</label>
                  <input type="color" value={secondaryColor} onChange={handleSecondaryColorChange} />
                </div>
              </div>
            )}

            <div className='option'>
              <label>Animation Type:</label>
              <select value={animationType} onChange={handleAnimationTypeChange}>
                  {["Smooth Transitions", "Pulsing Effects", "Zoom Effects", "Rotational Motion"]
                      .map((anim) => (
                          <option key={anim} value={anim}>{anim}</option>
                      ))}
              </select>
            </div>
            </div>
            <button className="generate-prompt-btn" onClick={handleGeneratePrompt} disabled={isLoading}>
              {isLoading ? 'Generating Prompt...' : 'Generate Prompt'}
            </button>
          {error && <div className="error-message">{error}</div>}

          {videoData && (
            <div className="video-process">
                <div className="prompt-section">
                    <h2>Generated Prompt:</h2>
                    <p>{videoData.prompt}</p>
                </div>
                <div className='upload-container'>
                    <input type="file" accept=".mp4,.mov,.avi" onChange={handleVideoChange} />
                </div>
                <button className="process-video-btn" onClick={handleProcessVideo} disabled={isLoading}>
                    {isLoading ? 'Processing Video...' : 'Process Video'}
                </button>
            </div>
          )}

            {finalVideoUrl && (
              <div className='video-container'>
                <h2>Final Video</h2>
                <video controls width="500" src={finalVideoUrl} />
              </div>
            )}

      </div>
  );
}
export default App;