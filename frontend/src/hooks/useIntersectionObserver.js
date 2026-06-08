import { useState, useEffect, useRef } from 'react';

export const useIntersectionObserver = (options = { threshold: 0.1, triggerOnce: true }) => {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const elementRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      setIsIntersecting(entry.isIntersecting);
      
      if (entry.isIntersecting && options.triggerOnce) {
        observer.unobserve(entry.target);
      }
    }, options);

    const currentElement = elementRef.current;
    if (currentElement) {
      observer.observe(currentElement);
    }

    return () => {
      if (currentElement && !options.triggerOnce) {
        observer.unobserve(currentElement);
      }
    };
  }, [options]);

  return [elementRef, isIntersecting];
};
