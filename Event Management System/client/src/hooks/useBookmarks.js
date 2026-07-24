import { useEffect, useState } from 'react';

const storageKey = 'ems_bookmarks';

const readBookmarks = () => {
  try {
    return JSON.parse(localStorage.getItem(storageKey) || '[]');
  } catch {
    return [];
  }
};

const useBookmarks = () => {
  const [bookmarks, setBookmarks] = useState(readBookmarks);

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(bookmarks));
  }, [bookmarks]);

  const isBookmarked = (id) => bookmarks.includes(id);

  const toggleBookmark = (id) => {
    setBookmarks((current) =>
      current.includes(id) ? current.filter((bookmarkId) => bookmarkId !== id) : [...current, id]
    );
  };

  return { bookmarks, isBookmarked, toggleBookmark };
};

export default useBookmarks;