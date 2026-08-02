import { getProperties } from "../lib/data";
import PcdDashboard from "../components/PcdDashboard";

export const metadata = {
  title: "Almahyra Photo Watermarker | Proyek PCD",
  description: "Sistem Manajemen Watermark Citra Real-Time terintegrasi Cloudinary dan Supabase untuk Tugas Pengolahan Citra Digital.",
};

export default async function PcdPage() {
  // Ambil data semua properti dari database Supabase
  const rawProperties = await getProperties();
  
  // Sanitasi data agar menjadi plain object untuk menghindari error serialisasi Next.js
  const properties = JSON.parse(JSON.stringify(rawProperties));

  return <PcdDashboard properties={properties} />;
}
