import styles from '@/components/admin/shell.module.css';

/* Wird bei jedem Seitenwechsel neu eingehängt — dadurch blendet jede Seite sanft ein. */
export default function PageTemplate({ children }: { children: React.ReactNode }) {
  return <div className={styles.page}>{children}</div>;
}
