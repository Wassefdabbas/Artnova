import GalleryItem from "../GalleryItem/GalleryItem";
import "./Gallery.css";
import { useInfiniteQuery } from "@tanstack/react-query";
import InfiniteScroll from "react-infinite-scroll-component";
import axios from "axios";

// function Gallery({search, userId, boardId}) {
//   const fetchPins = async ({ pageParam = 0, search, userId, boardId }) => {
//     const res = await axios.get(
//       `${import.meta.env.VITE_API_ENDPOINT}/pins?cursor=${pageParam}&search=${search || ""}&userId=${userId || ""}&boardId=${boardId || ""}`
//     );
//     return res.data;
//   };

//   const { data, fetchNextPage, hasNextPage, status } = useInfiniteQuery({
//     queryKey: ["pins", search, userId],
//     queryFn:({pageParam=0})=>fetchPins({pageParam, search, userId, boardId}),
//     initialPageParam: 0,
//     getNextPageParam: (lastPage) => lastPage.nextCursor,
//   });

//   if (status === "error") return <h3>Something went wrong...</h3>;
//   if (status === "pending") return <h3>Loading...</h3>;

//   const allPins = data?.pages.flatMap((page) => page.pins) || [];

//   return (
//     <InfiniteScroll
//       dataLength={allPins.length}
//       next={fetchNextPage}
//       hasMore={!!hasNextPage}
//       loader={<h4>Loading more pins...</h4>}
//       endMessage={<h3>All Posts Loaded!</h3>}
//     >
//       <div className="gallery">
//         {allPins.map((item) => (
//           <GalleryItem key={item._id} item={item} />
//         ))}
//       </div>
//     </InfiniteScroll>
//   );
// }
function Gallery({ search, userId, boardId, saved }) {
  const fetchPins = async ({ pageParam = 0 }) => {
    let url;

    if (saved) {
      url = `${import.meta.env.VITE_API_ENDPOINT}/pins/saved/${userId}?cursor=${pageParam}`;
    } else {
      url = `${import.meta.env.VITE_API_ENDPOINT}/pins?cursor=${pageParam}&search=${search || ""}&userId=${userId || ""}&boardId=${boardId || ""}`;
    }

    const res = await axios.get(url);
    return res.data;
  };

  const { data, fetchNextPage, hasNextPage, status } = useInfiniteQuery({
    queryKey: [saved ? "savedPins" : "pins", search, userId, boardId],
    queryFn: ({ pageParam = 0 }) => fetchPins({ pageParam }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });

  if (status === "error") return <h3>Something went wrong...</h3>;
  if (status === "pending") return <h3>Loading...</h3>;

  const allPins = data?.pages.flatMap((page) => page.pins) || [];

  return (
    <InfiniteScroll
      dataLength={allPins.length}
      next={fetchNextPage}
      hasMore={!!hasNextPage}
      loader={<h4>Loading more pins...</h4>}
      endMessage={<h3>All Posts Loaded!</h3>}
    >
      <div className="gallery">
        {allPins.map((item) => (
          <GalleryItem key={item._id} item={item} />
        ))}
      </div>
    </InfiniteScroll>
  );
}

export default Gallery;

