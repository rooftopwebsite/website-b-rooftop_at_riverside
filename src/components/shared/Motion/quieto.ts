import estilos from './Motion.module.css';

export const quieto = (className?: string) => [className, estilos.quieto].filter(Boolean).join(' ');
