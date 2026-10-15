import React, { useState, useRef, useEffect } from 'react';
import {
  ExternalLink,
  Maximize2,
  Minimize2,
  RefreshCw,
  Volume2,
  VolumeX,
  Play,
  Pause,
  AlertTriangle,
  Info,
  ChevronDown,
  ChevronUp,
  Radio,
  CheckCircle,
} from 'lucide-react';
import { CameraFeed } from '../types/camera';

interface CameraCardProps {
  camera: CameraFeed;
  dashboardSyncTime: string;
  globalRefreshTrigger: number;
}

export const CameraCard: React.FC<CameraCardProps> = ({
  camera,
  dashboardSyncTime,
  globalRefreshTrigger,
}) => {
  const cardContainerRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // States
  const [localRefreshKey, setLocalRefreshKey] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [status, setStatus] = useState<'Loading' | 'Available' | 'Unavailable'>('Loading');
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [showDetails, setShowDetails] = useState<boolean>(false);
  const [hasError, setHasError] = useState<boolean>(false);
  const [lastRefreshedAt, setLastRefreshedAt] = useState<string>(dashboardSyncTime);

  // When global refresh triggers, reset player
  useEffect(() => {
    if (globalRefreshTrigger > 0) {
      handleRefresh();
    }
  }, [globalRefreshTrigger]);

  // Sync dashboard refresh timestamp
  useEffect(() => {
    if (dashboardSyncTime) {
      setLastRefreshedAt(dashboardSyncTime);
    }
  }, [dashboardSyncTime]);

  // Track fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  const handleRefresh = () => {
    setIsLoading(true);
    setStatus('Loading');
    setHasError(false);
    setLocalRefreshKey((prev) => prev + 1);

    const now = new Date();
    const timeFormatter = new Intl.DateTimeFormat('en-GB', {
      timeZone: 'Asia/Singapore',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    });
    setLastRefreshedAt(`${timeFormatter.format(now)} SGT`);
  };

  const handleIframeLoad = () => {
    setIsLoading(false);
    setStatus('Available');
  };

  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        if (cardContainerRef.current) {
          await cardContainerRef.current.requestFullscreen();
        }
      } else {
        await document.exitFullscreen();
      }
    } catch (err) {
      console.warn('Fullscreen request failed:', err);
    }
  };

  const sendIframeCommand = (command: string, args: unknown = '') => {
    if (iframeRef.current && iframeRef.current.contentWindow) {
      iframeRef.current.contentWindow.postMessage(
        JSON.stringify({
          event: 'command',
          func: command,
          args: args,
        }),
        '*'
      );
    }
  };

  const toggleMute = () => {
    if (isMuted) {
      sendIframeCommand('unMute');
      setIsMuted(false);
    } else {
      sendIframeCommand('mute');
      setIsMuted(true);
    }
  };

  const togglePlayPause = () => {
    if (isPlaying) {
      sendIframeCommand('pauseVideo');
      setIsPlaying(false);
    } else {
      sendIframeCommand('playVideo');
      setIsPlaying(true);
    }
  };

  // YouTube embed URL with standard parameters
  // autoplay=1 (starts muted as per browser policy), enablejsapi=1 for iframe commands
  const embedUrl = `https://www.youtube-nocookie.com/embed/${camera.videoId}?autoplay=1&mute=1&playsinline=1&enablejsapi=1&rel=0&modestbranding=1&origin=${encodeURIComponent(window.location.origin)}`;

  return (
    <article
      ref={cardContainerRef}
      className={`flex flex-col bg-[#101A2D] border border-[#243149] rounded-2xl overflow-hidden shadow-xl transition-all duration-300 hover:border-[#00C6A2]/40 ${
        isFullscreen ? 'fixed inset-0 z-50 rounded-none w-screen h-screen' : ''
      }`}
      aria-label={`${camera.name} feed card`}
    >
      {/* A. Card Toolbar */}
      <div className="flex items-center justify-between px-4 py-3 bg-[#1D2A3E] border-b border-[#243149] select-none">
        <div className="flex items-center gap-2.5">
          <span className="font-bold text-sm tracking-wide text-[#00D9F5]">
            {camera.label}
          </span>
          <span className="text-xs font-mono-numbers px-2 py-0.5 rounded bg-[#101A2D] border border-[#243149] text-[#91A9C8]">
            {camera.code}
          </span>

          {/* Status Label */}
          {status === 'Available' && !hasError && (
            <span
              className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-medium bg-[#10D99A]/10 text-[#10D99A] border border-[#10D99A]/30"
              title="Camera stream available"
            >
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10D99A] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#10D99A]"></span>
              </span>
              Available
            </span>
          )}

          {status === 'Loading' && !hasError && (
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-medium bg-[#00D9F5]/10 text-[#00D9F5] border border-[#00D9F5]/30 animate-pulse">
              <RefreshCw className="w-2.5 h-2.5 animate-spin" />
              Loading
            </span>
          )}

          {hasError && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-[#F87171]/10 text-[#F87171] border border-[#F87171]/30">
              <AlertTriangle className="w-3 h-3" />
              Unavailable
            </span>
          )}
        </div>

        {/* Toolbar Action Buttons */}
        <div className="flex items-center gap-1">
          {/* Quick Mute Toggle */}
          <button
            onClick={toggleMute}
            className="p-1.5 rounded-lg text-[#91A9C8] hover:text-[#00D9F5] hover:bg-[#243149] transition-colors cursor-pointer"
            title={isMuted ? 'Unmute stream audio' : 'Mute stream audio'}
            aria-label={isMuted ? `Unmute ${camera.label}` : `Mute ${camera.label}`}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-amber-400" /> : <Volume2 className="w-4 h-4 text-[#00C6A2]" />}
          </button>

          {/* Play/Pause Toggle */}
          <button
            onClick={togglePlayPause}
            className="p-1.5 rounded-lg text-[#91A9C8] hover:text-[#00D9F5] hover:bg-[#243149] transition-colors cursor-pointer"
            title={isPlaying ? 'Pause stream' : 'Resume stream'}
            aria-label={isPlaying ? `Pause ${camera.label}` : `Resume ${camera.label}`}
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 text-[#00C6A2]" />}
          </button>

          {/* Fullscreen Button */}
          <button
            onClick={toggleFullscreen}
            className="p-1.5 rounded-lg text-[#91A9C8] hover:text-[#00D9F5] hover:bg-[#243149] transition-colors cursor-pointer"
            title={isFullscreen ? 'Exit fullscreen' : 'View fullscreen'}
            aria-label={`Toggle fullscreen for ${camera.label}`}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>

          {/* Open Original YouTube Stream Button */}
          <a
            href={camera.originalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-1.5 rounded-lg text-[#91A9C8] hover:text-[#00D9F5] hover:bg-[#243149] transition-colors"
            title="Open original stream on YouTube"
            aria-label={`Open original YouTube stream for ${camera.label} in new tab`}
          >
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>

      {/* B. Live Video Player (16:9 Aspect Ratio) */}
      <div className={`relative w-full bg-[#030817] overflow-hidden ${isFullscreen ? 'flex-1' : 'aspect-video'}`}>
        {/* Loading Spinner Overlay */}
        {isLoading && !hasError && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-[#030817]/90 backdrop-blur-xs text-[#91A9C8]">
            <div className="relative flex items-center justify-center mb-3">
              <div className="w-12 h-12 rounded-full border-2 border-[#243149] border-t-[#00C6A2] animate-spin"></div>
              <Radio className="w-5 h-5 text-[#00D9F5] absolute" />
            </div>
            <p className="text-xs font-medium text-[#c4d6ee] animate-pulse">
              Connecting to {camera.label} live broadcast...
            </p>
            <span className="text-[10px] text-[#91A9C8] mt-1">Official YouTube Stream Embed</span>
          </div>
        )}

        {/* Unavailable Fallback Screen */}
        {hasError ? (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center p-6 text-center bg-[#101A2D] text-[#91A9C8]">
            <AlertTriangle className="w-10 h-10 text-[#F87171] mb-2" />
            <h4 className="text-sm font-semibold text-[#F5F7FC] mb-1">
              Stream Unavailable or Embedding Restricted
            </h4>
            <p className="text-xs text-[#91A9C8] max-w-sm mb-4 leading-relaxed">
              This broadcast might be offline, experiencing momentary network drops, or requires viewing directly on YouTube.
            </p>
            <div className="flex items-center gap-3">
              <button
                onClick={handleRefresh}
                className="px-3.5 py-1.5 rounded-lg bg-[#1D2A3E] border border-[#243149] text-xs font-medium text-[#F5F7FC] hover:bg-[#243149] transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Retry Stream
              </button>
              <a
                href={camera.originalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-1.5 rounded-lg bg-[#00C6A2] text-[#030817] text-xs font-semibold hover:bg-[#00D9F5] transition-colors flex items-center gap-1.5"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                Open on YouTube
              </a>
            </div>
          </div>
        ) : (
          <iframe
            key={`${camera.id}-${localRefreshKey}`}
            ref={iframeRef}
            src={embedUrl}
            title={`${camera.name} live video stream`}
            className="w-full h-full border-0 absolute inset-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
            allowFullScreen
            loading="lazy"
            onLoad={handleIframeLoad}
            onError={() => {
              setIsLoading(false);
              setHasError(true);
              setStatus('Unavailable');
            }}
          />
        )}
      </div>

      {/* C. Camera Information */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="text-base font-semibold text-[#F5F7FC] tracking-tight">
                {camera.name}
              </h3>
              <p className="text-xs text-[#91A9C8] mt-0.5">
                {camera.description}
              </p>
            </div>
            <span className="shrink-0 text-[10px] font-semibold uppercase tracking-wider text-[#00C6A2] px-2 py-0.5 rounded bg-[#00C6A2]/10 border border-[#00C6A2]/25">
              {camera.source}
            </span>
          </div>

          {/* Sync status metadata (strictly not invented) */}
          <div className="mt-3 pt-3 border-t border-[#243149]/60 flex items-center justify-between text-xs text-[#91A9C8]">
            <span className="text-[11px]">
              Dashboard Synced: <span className="font-mono-numbers text-[#c4d6ee] font-medium">{lastRefreshedAt}</span>
            </span>
            <span className="text-[11px] text-[#91A9C8]">
              Aspect: <span className="font-mono-numbers text-[#c4d6ee]">{camera.aspectRatio}</span>
            </span>
          </div>
        </div>

        {/* Optional Expandable Information Panel for stream details */}
        {showDetails && (
          <div className="mt-3 p-3 rounded-xl bg-[#1D2A3E]/80 border border-[#243149] text-xs space-y-1.5 transition-all animate-fadeIn">
            <div className="flex justify-between items-center text-[#91A9C8]">
              <span>Stream Provider:</span>
              <span className="text-[#F5F7FC] font-medium">YouTube Live Broadcast</span>
            </div>
            <div className="flex justify-between items-center text-[#91A9C8]">
              <span>YouTube Video ID:</span>
              <span className="font-mono-numbers text-[#00D9F5] font-semibold">{camera.videoId}</span>
            </div>
            <div className="flex justify-between items-center text-[#91A9C8]">
              <span>Iframe API:</span>
              <span className="text-[#10D99A] font-medium">Enabled (Active)</span>
            </div>
            <div className="flex justify-between items-center text-[#91A9C8]">
              <span>Player Status:</span>
              <span className="text-[#F5F7FC] capitalize">{status}</span>
            </div>
            <div className="pt-1.5 text-[10px] text-[#91A9C8]/80 leading-normal border-t border-[#243149]">
              * Note: Actual video freshness, frame rate, and broadcast uptime are managed by the original YouTube channel.
            </div>
          </div>
        )}

        {/* D. Card Footer Controls */}
        <div className="mt-4 pt-3 border-t border-[#243149] flex items-center justify-between gap-2">
          {/* Details toggle button */}
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="flex items-center gap-1 text-xs text-[#91A9C8] hover:text-[#00D9F5] transition-colors cursor-pointer py-1"
            aria-expanded={showDetails}
            aria-label={`${showDetails ? 'Hide' : 'Show'} stream technical details for ${camera.label}`}
          >
            <Info className="w-3.5 h-3.5 text-[#00D9F5]" />
            <span>{showDetails ? 'Hide Details' : 'Stream Details'}</span>
            {showDetails ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>

          <div className="flex items-center gap-2">
            {/* Refresh Individual Player Button */}
            <button
              onClick={handleRefresh}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1D2A3E] hover:bg-[#243149] border border-[#243149] text-xs font-medium text-[#F5F7FC] transition-colors cursor-pointer"
              title="Refresh this camera feed"
              aria-label={`Refresh ${camera.label} feed`}
            >
              <RefreshCw className={`w-3.5 h-3.5 text-[#00C6A2] ${isLoading ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Refresh Feed</span>
            </button>

            {/* Open on YouTube Button */}
            <a
              href={camera.originalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#00C6A2]/15 hover:bg-[#00C6A2]/25 border border-[#00C6A2]/40 text-xs font-semibold text-[#00D9F5] transition-colors"
              title="Open stream in YouTube"
              aria-label={`Watch ${camera.label} on YouTube`}
            >
              <span>Watch on YouTube</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </article>
  );
};
