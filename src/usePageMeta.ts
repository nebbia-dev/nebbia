import { useEffect } from 'react';

function setMeta(property: string, content: string, attribute: 'name' | 'property' = 'property') {
  let tag = document.head.querySelector<HTMLMetaElement>(`meta[${attribute}="${property}"]`);
  if (!tag) {
    tag = document.createElement('meta');
    tag.setAttribute(attribute, property);
    document.head.appendChild(tag);
  }
  tag.content = content;
}

export function usePageMeta(title: string, description: string, image = '/og.png') {
  useEffect(() => {
    const absoluteImage = new URL(image, window.location.origin).href;
    document.title = title;
    setMeta('description', description, 'name');
    setMeta('og:title', title);
    setMeta('og:description', description);
    setMeta('og:image', absoluteImage);
    setMeta('twitter:card', 'summary_large_image', 'name');
    setMeta('twitter:title', title, 'name');
    setMeta('twitter:description', description, 'name');
    setMeta('twitter:image', absoluteImage, 'name');
  }, [title, description, image]);
}
