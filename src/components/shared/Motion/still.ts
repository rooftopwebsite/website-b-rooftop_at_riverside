import styles from './Motion.module.css';

export const still = (className?: string) => [className, styles.still].filter(Boolean).join(' ');
