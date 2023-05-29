import { useState, useEffect } from 'react';
import type { NextPage } from 'next';
import { Post } from '.prisma/client';
import { useRouter } from 'next/router';
import ButtonPanel from './ButtonPanel';

const HomePage: NextPage = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [fontSize, setFontSize] = useState<number>(18);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    async function fetchPosts() {
      const res = await fetch('/api/posts');
      const data = await res.json();
      setPosts(data);
    }
    fetchPosts();
  }, []);

  const increaseFontSize = () => {
    setFontSize((prevSize) => prevSize + 2);
  };

  const decreaseFontSize = () => {
    setFontSize((prevSize) => prevSize - 2);
  };

  const toggleDarkMode = () => {
    setIsDarkMode((prevMode) => !prevMode);
  };

  const navigateToPost = (postId: number) => {
    router.push(`/posts/${postId}`);
  };

  useEffect(() => {
    const html = document.querySelector('html');
    if (html) {
      if (isDarkMode) {
        html.classList.add('dark');
      } else {
        html.classList.remove('dark');
      }
    }
  }, [isDarkMode]);

  return (
    <div className={'container mx-auto px-4 py-8'}>
      <ButtonPanel
        increaseFontSize={increaseFontSize}
        decreaseFontSize={decreaseFontSize}
        toggleDarkMode={toggleDarkMode}
        isDarkMode={isDarkMode} // Доданий проп isDarkMode
      />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-4 flex flex-col items-center justify-center">
          Блог
        </h1>
        <div className="flex flex-row flex-wrap items-center justify-center gap-4">
          {posts.map((post) => (
            <div
              key={post.id}
              className={`bg-gray-400 rounded p-2 flex flex-col items-center justify-center ${  isDarkMode ? 'text-white' : 'text-black'}`}style={{ width: '300px', height: '400px' }}>
              <h2 className={`text-xl font-semibold mb-4`} style={{ fontSize: `${fontSize}px` }} >
                {post.title}
              </h2>
              {post.imageLink && (
                <div className="relative w-full h-3/5 mb-4">
                  <img src={post.imageLink}alt={post.title} className={`w-full h-full object-cover rounded-lg ${isDarkMode ? 'grayscale' : ''}`} />
                </div>
              )}
              <button
                className={`bg-blue-500 hover:bg-blue-700 ${isDarkMode ? 'text-white' : 'text-black'} font-bold py-2 px-4 rounded`} onClick={() => navigateToPost(post.id)} >
                Перейти до посту
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
