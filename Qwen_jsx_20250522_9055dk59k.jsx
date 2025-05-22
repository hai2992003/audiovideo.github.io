import React, { useState } from 'react';

export default function App() {
  const [videoId, setVideoId] = useState('');
  const [audioFile, setAudioFile] = useState(null);
  const [backgroundMusic, setBackgroundMusic] = useState(null);
  const [orientation, setOrientation] = useState('Landscape');
  const [subtitles, setSubtitles] = useState('Without Subtitles');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [videoUrl, setVideoUrl] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Hàm tạo video_id theo định dạng text_hour-minute-second_date
  const getFormattedVideoId = () => {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0'); // Tháng bắt đầu từ 0
    const year = now.getFullYear();

    return `${videoId}_${hours}-${minutes}-${seconds}_${year}-${month}-${day}`;
  };

  const handleAudioUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.size <= 5 * 1024 * 1024) {
      setAudioFile(file);
      setErrorMessage('');
    } else {
      setErrorMessage('Audio file must be under 5MB.');
    }
  };

  const handleBackgroundMusicUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.size <= 5 * 1024 * 1024) {
      setBackgroundMusic(file);
      setErrorMessage('');
    } else {
      setErrorMessage('Background music must be under 5MB.');
    }
  };

  const handleSubmit = async () => {
    if (!audioFile || isLoading) return;

    setIsLoading(true);
    setErrorMessage('');

    const formData = new FormData();
    const formattedVideoId = getFormattedVideoId();
    formData.append('video_id', formattedVideoId);
    formData.append('audio_file', audioFile);
    if (backgroundMusic) formData.append('background_music', backgroundMusic);
    formData.append('orientation', orientation === 'Landscape' ? 'horizontal' : 'vertical');
    formData.append('subtitles', subtitles === 'With Subtitles' ? 'yes' : 'no');

    try {
      const response = await fetch('http://localhost:5678/webhook-test/1a9744b5-0299-4dce-8632-4d832632eb97', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        let videoUrl;
        if (Array.isArray(data)) {
          videoUrl = data[0]?.video;
        } else if (data?.video) {
          videoUrl = data.video;
        }

        if (videoUrl) {
          setVideoUrl(videoUrl);
          setIsSuccess(true);
          // Show popup with the video URL
          alert(`Your video is ready! Download it here: ${videoUrl}`);
        } else {
          throw new Error('Invalid response format from webhook');
        }
      } else {
        throw new Error('Failed to create video');
      }
    } catch (error) {
      setErrorMessage('Error creating video. Please try again later.');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-lg p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Create Your Video</h1>
        
        {/* Video ID */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Video ID</label>
          <input
            type="text"
            value={videoId}
            onChange={(e) => setVideoId(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter video ID"
          />
        </div>

        {/* Audio File Upload */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Audio File (Max 5MB)</label>
          <input
            type="file"
            accept="audio/*"
            onChange={handleAudioUpload}
            className="w-full"
          />
          {audioFile && (
            <p className="mt-1 text-sm text-green-600">Uploaded: {audioFile.name}</p>
          )}
        </div>

        {/* Background Music Upload */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Background Music (Max 5MB)</label>
          <input
            type="file"
            accept="audio/*"
            onChange={handleBackgroundMusicUpload}
            className="w-full"
          />
          {backgroundMusic && (
            <p className="mt-1 text-sm text-green-600">Uploaded: {backgroundMusic.name}</p>
          )}
        </div>

        {/* Orientation Selection */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Video Orientation</label>
          <div className="flex space-x-2">
            <button
              onClick={() => setOrientation('Landscape')}
              className={`px-4 py-2 rounded-md transition-colors ${
                orientation === 'Landscape'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Landscape
            </button>
            <button
              onClick={() => setOrientation('Portrait')}
              className={`px-4 py-2 rounded-md transition-colors ${
                orientation === 'Portrait'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Portrait
            </button>
          </div>
        </div>

        {/* Subtitle Options */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">Subtitle Options</label>
          <div className="flex space-x-2">
            <button
              onClick={() => setSubtitles('With Subtitles')}
              className={`px-4 py-2 rounded-md transition-colors ${
                subtitles === 'With Subtitles'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              With Subtitles
            </button>
            <button
              onClick={() => setSubtitles('Without Subtitles')}
              className={`px-4 py-2 rounded-md transition-colors ${
                subtitles === 'Without Subtitles'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Without Subtitles
            </button>
          </div>
        </div>

        {/* Send Button */}
        <button
          onClick={handleSubmit}
          disabled={!audioFile || isLoading}
          className={`w-full py-3 px-4 rounded-md font-medium text-white transition-colors ${
            !audioFile || isLoading
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {isLoading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </span>
          ) : 'Create Video'}
        </button>

        {/* Error Message */}
        {errorMessage && (
          <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-md">
            {errorMessage}
          </div>
        )}

        {/* Success State */}
        {isSuccess && (
          <div className="mt-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-2">Your Video is Ready!</h2>
            <a
              href={videoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            >
              Download Video
            </a>
          </div>
        )}
      </div>
    </div>
  );
}