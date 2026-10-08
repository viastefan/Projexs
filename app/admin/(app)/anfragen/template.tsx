import styles from '@/components/admin/shell.module.css';

/* Beim Wechsel zwischen Anfragen blendet nur die rechte Seite neu ein — die Liste bleibt ruhig stehen. */
export default function InquiryTemplate({ children }: { children: React.ReactNode }) {
  return <div className={styles.page}>{children}</div>;
}
