import { useEffect, useRef } from 'react';

export function useDraggableScroll() {
  const ref = useRef(null);
  
  useEffect(() => {
    const slider = ref.current;
    if (!slider) return;
    
    let isDown = false;
    let startX;
    let scrollLeft;
    let velX = 0;
    let momentumID;

    const beginMomentumTracking = () => {
      cancelAnimationFrame(momentumID);
      momentumID = requestAnimationFrame(momentumLoop);
    };

    const momentumLoop = () => {
      slider.scrollLeft += velX;
      velX *= 0.95; 
      if (Math.abs(velX) > 0.5) {
        momentumID = requestAnimationFrame(momentumLoop);
      } else {
        slider.style.scrollSnapType = 'x mandatory';
      }
    };

    const mouseDown = (e) => {
      isDown = true;
      slider.style.cursor = 'grabbing';
      slider.style.scrollSnapType = 'none';
      cancelAnimationFrame(momentumID);
      startX = e.pageX - slider.offsetLeft;
      scrollLeft = slider.scrollLeft;
    };
    
    const mouseLeave = () => {
      if(!isDown) return;
      isDown = false;
      slider.style.cursor = 'grab';
      beginMomentumTracking();
    };
    
    const mouseUp = () => {
      if(!isDown) return;
      isDown = false;
      slider.style.cursor = 'grab';
      beginMomentumTracking();
    };
    
    const mouseMove = (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - slider.offsetLeft;
      const walk = (startX - x) * 1.5;
      const prevScrollLeft = slider.scrollLeft;
      slider.scrollLeft = scrollLeft + walk;
      velX = slider.scrollLeft - prevScrollLeft;
    };

    slider.style.cursor = 'grab';
    slider.addEventListener('mousedown', mouseDown);
    slider.addEventListener('mouseleave', mouseLeave);
    slider.addEventListener('mouseup', mouseUp);
    slider.addEventListener('mousemove', mouseMove);

    return () => {
      slider.removeEventListener('mousedown', mouseDown);
      slider.removeEventListener('mouseleave', mouseLeave);
      slider.removeEventListener('mouseup', mouseUp);
      slider.removeEventListener('mousemove', mouseMove);
      cancelAnimationFrame(momentumID);
    };
  }, []);
  
  return ref;
}
