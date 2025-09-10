import Layout from "../components/Layout";
import SearchBox from "../components/SearchBox";

export default function SearchPage() {
  return (
    <Layout>
      <h1 className="text-2xl font-bold mb-4">Cari Lagu</h1>
      <SearchBox />
    </Layout>
  );
}