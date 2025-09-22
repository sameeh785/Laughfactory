

interface RichTextDisplayProps {
  htmlContent: string;
  className?: string;
  maxHeight?: number;
}

interface VideoEmbed {
  url: string;
  platform: string;
  embedUrl: string | null;
}

const RichTextDisplay: React.FC<RichTextDisplayProps> = ({ 
  htmlContent, 
  className = '',
  maxHeight = 400
}) => {
  const extractVideoInfo = (url: string): VideoEmbed => {
    // YouTube
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      const videoId = url.match(/[?&]v=([^&]+)/)?.[1] || url.match(/youtu\.be\/([^?]+)/)?.[1];
      return {
        url,
        platform: 'youtube',
        embedUrl: videoId ? `https://www.youtube.com/embed/${videoId}` : null
      };
    }

    // Vimeo
    if (url.includes('vimeo.com')) {
      const videoId = url.match(/vimeo\.com\/(\d+)/)?.[1];
      return {
        url,
        platform: 'vimeo',
        embedUrl: videoId ? `https://player.vimeo.com/video/${videoId}` : null
      };
    }

    // Dailymotion
    if (url.includes('dailymotion.com') || url.includes('dai.ly')) {
      const videoId = url.match(/dailymotion\.com\/video\/([^_]+)/)?.[1] || 
                     url.match(/dai\.ly\/([^?]+)/)?.[1];
      return {
        url,
        platform: 'dailymotion',
        embedUrl: videoId ? `https://www.dailymotion.com/embed/video/${videoId}` : null
      };
    }

    // Wistia
    if (url.includes('wistia.com') || url.includes('wistia.net')) {
      const videoId = url.match(/wistia\.com\/medias\/([^?]+)/)?.[1] || 
                     url.match(/wistia\.net\/embed\/([^?]+)/)?.[1];
      return {
        url,
        platform: 'wistia',
        embedUrl: videoId ? `https://fast.wistia.net/embed/iframe/${videoId}` : null
      };
    }

    // Loom
    if (url.includes('loom.com')) {
      const videoId = url.match(/loom\.com\/share\/([^?]+)/)?.[1];
      return {
        url,
        platform: 'loom',
        embedUrl: videoId ? `https://www.loom.com/embed/${videoId}` : null
      };
    }

    // Generic fallback - return the original URL for unsupported platforms
    return {
      url,
      platform: 'unknown',
      embedUrl: null
    };
  };

  const createVideoEmbed = (videoInfo: VideoEmbed): string => {
    if (videoInfo.embedUrl) {
      return `
        <div class="video-container" data-platform="${videoInfo.platform}">
          <iframe 
            src="${videoInfo.embedUrl}" 
            frameborder="0" 
            allowfullscreen
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            title="Video player"
          ></iframe>
        </div>
      `;
    }

    // For unsupported platforms, show a clickable link
    return `
      <div class="video-link-container">
        <a href="${videoInfo.url}" target="_blank" rel="noopener noreferrer" class="video-link">
          📹 Watch video: ${videoInfo.url}
        </a>
      </div>
    `;
  };

  const processHTML = (html: string): string => {
    if (!html.trim()) return '';
    
    // Extract any oembed URL and replace with appropriate embed/link
    return html.replace(
      /<figure class="media"><oembed url="([^"]+)"><\/oembed><\/figure>/g,
      (match: string, url: string): string => {
        const videoInfo = extractVideoInfo(url);
        return createVideoEmbed(videoInfo);
      }
    );
  };

  const containerStyle: React.CSSProperties = {
    maxHeight: maxHeight ? `${maxHeight}px` : 'none',
  };

  return (
    <div 
      className={`rich-text-container text-gray-600 ${className}`}
      style={containerStyle}
      dangerouslySetInnerHTML={{ __html: processHTML(htmlContent) }} 
    />
  );
};

export default RichTextDisplay;