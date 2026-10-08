import { localizedAlternates } from '@/lib/metadata';
export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  return { alternates: localizedAlternates((await params).lang, 'sustainability') };
}
export default function Layout({ children }: { children: React.ReactNode }) { return children; }
