import "./SearchPage.css";
import Gallery from "../../components/Gallery/Gallery";
import { useSearchParams } from "react-router";

function SearchPage() {

  let [searchParams] = useSearchParams();

  const search = searchParams.get("search")
  const boardId = searchParams.get("boardId")

  return (
    <div>
      <Gallery search={search} boardId={boardId}/>
    </div>
  );
}

export default SearchPage;
