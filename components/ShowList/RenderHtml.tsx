

"use client";

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';

interface RichTextDisplayProps {
  htmlContent: string;
  className?: string;
  maxHeight?: number;
  detailHref?: string;
}

interface VideoEmbed {
  url: string;
  platform: string;
  embedUrl: string | null;
}

const RichTextDisplay: React.FC<RichTextDisplayProps> = ({ 
  htmlContent, 
  className = '',
  maxHeight = 200,
  detailHref
}) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [lockScrollTop, setLockScrollTop] = useState<number | null>(null);

  useEffect(() => {
    const element = contentRef.current;
    if (!element) return;
    const hasOverflow = element.scrollHeight > element.clientHeight + 1;
    setIsOverflowing(hasOverflow);

    if (!detailHref || !hasOverflow) {
      setIsLocked(false);
      setLockScrollTop(null);
      return;
    }

    const clientHeight = element.clientHeight;
    const maxScrollTop = Math.max(0, element.scrollHeight - clientHeight);
    const baseAllowed = Math.max(60, Math.floor(clientHeight * 2));
    const allowed = Math.min(baseAllowed, maxScrollTop);
    setLockScrollTop(allowed);

    // Clamp if already past allowed
    if (element.scrollTop > allowed) {
      element.scrollTop = allowed;
      setIsLocked(true);
    } else {
      setIsLocked(false);
    }
  }, [htmlContent, maxHeight, detailHref]);
  const handleScroll = (event: React.UIEvent<HTMLDivElement>) => {
    const target = event.currentTarget;
    if (lockScrollTop == null) return;
    const tolerance = 4;
    if (target.scrollTop >= lockScrollTop - tolerance) {
      target.scrollTop = lockScrollTop;
      if (!isLocked) setIsLocked(true);
      return;
    }
    if (isLocked && target.scrollTop > lockScrollTop) {
      target.scrollTop = lockScrollTop;
    }
  };
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
    maxHeight: detailHref && maxHeight ? `${maxHeight}px` : 'none',
    overflowY: detailHref && maxHeight ? 'auto' : undefined,
  };
  return (
    <div className="relative">
      <div 
        ref={contentRef}
        className={`rich-text-container text-gray-600 ${className}`}
        style={containerStyle}
        onScroll={handleScroll}
      >
        <div dangerouslySetInnerHTML={{ __html: processHTML(htmlContent) }} />

        {detailHref && isOverflowing && (
          <div className={`sticky bottom-2 w-full flex justify-end transition-opacity ${isLocked ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
            <Link 
              href={detailHref}
              className="inline-flex items-center rounded-md bg-orange-600 px-3 py-1.5 text-xs font-medium !text-white shadow hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 !no-underline"
            >
              Read more
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default RichTextDisplay;