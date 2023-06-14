import { useState, useEffect } from 'react';
import { NextPage } from 'next';
import { PrismaClient } from '@prisma/client';
import ButtonPanel from '../../components/ButtonPanel';
import { FaThumbsUp, FaThumbsDown } from 'react-icons/fa';

const prisma = new PrismaClient();
const COMMENTS_PER_PAGE = 5;

interface Comment {
  id: number;
  name: string;
  content: string;
  likes: number;
  dislikes: number;
}

interface Post {
  id: number;
  title: string;
  content: string;
  imageLink?: string;
}

interface PostPageProps {
  post: Post;
  postComments: Comment[];
}

const PostPage: NextPage<PostPageProps> = ({ post, postComments }) => {
  const [fontSize, setFontSize] = useState<number>(18);
  const [newComment, setNewComment] = useState<{ name: string; content: string }>({
    name: '',
    content: '',
  });
  const [comments, setComments] = useState<Comment[]>(postComments || []);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const increaseFontSize = () => {
    setFontSize((prevSize) => prevSize + 2);
  };

  const decreaseFontSize = () => {
    setFontSize((prevSize) => prevSize - 2);
  };

  const toggleDarkMode = () => {
    setIsDarkMode((prevMode) => !prevMode);
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

  const handleCommentChange: React.ChangeEventHandler<HTMLTextAreaElement> = (event) => {
    setCommentContent(event.target.value);
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewComment((prevComment) => ({ ...prevComment, name: e.target.value }));
  };

  const setCommentContent = (value: string) => {
    setNewComment((prevComment) => ({ ...prevComment, content: value }));
  };

  const [error, setError] = useState<string>('');

  const handleAddComment = async () => {
    try {
      if (newComment.name.trim() === '' || newComment.content.trim() === '') {
        setError('Будь ласка, заповніть усі поля коментаря');
        return;
      }

      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          postId: post.id,
          ...newComment,
        }),
      });

      if (response.ok) {
        const comment = await response.json();
        setComments((prevComments: Comment[]) => [...prevComments, comment]);
        setNewComment({ name: '', content: '' });
        setError(''); // Очищуємо помилку, якщо вона була відображена раніше
      } else {
        console.error('Failed to add comment');
      }
    } catch (error) {
      console.error('Failed to add comment', error);
    }
  };

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await fetch(`/api/comments?postId=${post.id}`);
        if (response.ok) {
          const data = await response.json();
          setComments(data.comments);
        } else {
          console.error('Failed to fetch comments');
        }
      } catch (error) {
        console.error('Failed to fetch comments', error);
      }
    };
    fetchComments();
  }, [post.id]);

  const totalPages = Math.ceil(comments.length / COMMENTS_PER_PAGE);
  const startIndex = (currentPage - 1) * COMMENTS_PER_PAGE;
  const endIndex = startIndex + COMMENTS_PER_PAGE;
  const displayedComments = comments.slice(startIndex, endIndex);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const handleLike = async (commentId: number) => {
    const comment = comments.find((comment) => comment.id === commentId);
    if (comment && !comment.likes) {
      try {
        const response = await fetch(`/api/comments/${commentId}/like`, {
          method: 'POST',
        });
  
        if (response.ok) {
          const updatedComment = await response.json();
          setComments((prevComments: Comment[]) =>
            prevComments.map((comment) =>
              comment.id === commentId
                ? { ...updatedComment, content: comment.content, name: comment.name }
                : comment
            )
          );
        } else {
          console.error('Failed to like comment');
        }
      } catch (error) {
        console.error('Failed to like comment', error);
      }
    }
  };
  
  const handleDislike = async (commentId: number) => {
    const comment = comments.find((comment) => comment.id === commentId);
    if (comment && !comment.dislikes) {
      try {
        const response = await fetch(`/api/comments/${commentId}/dislike`, {
          method: 'POST',
        });
  
        if (response.ok) {
          const updatedComment = await response.json();
          setComments((prevComments: Comment[]) =>
            prevComments.map((comment) =>
              comment.id === commentId
                ? { ...updatedComment, content: comment.content, name: comment.name }
                : comment
            )
          );
        } else {
          console.error('Failed to dislike comment');
        }
      } catch (error) {
        console.error('Failed to dislike comment', error);
      }
    }
  };
  

  return (
    <div className={'container mx-auto px-4 py-8'}>
      <ButtonPanel
        increaseFontSize={increaseFontSize}
        decreaseFontSize={decreaseFontSize}
        toggleDarkMode={toggleDarkMode}
        isDarkMode={isDarkMode}
      />
      <div className="max-w-2xl mx-auto">
        <h1 className={`text-4xl justify-center items-center flex font-bold mb-4 ${
          isDarkMode ? 'text-white' : 'text-black'
        }`}>
          {post.title}
        </h1>
        <div className="relative w-full h-64 mb-4 rounded-lg overflow-hidden">
          <img
            src={post.imageLink}
            alt={post.title}
            className={`w-full h-full object-cover ${isDarkMode ? 'grayscale' : ''}`}
          />
        </div>
        <p className={`text-lg text-justify mb-9 ${isDarkMode ? 'text-white' : 'text-black'}`} style={{ fontSize: `${fontSize}px` }}>
          {post.content}
        </p>
        <div className="mb-8 border-2 rounded-lg border-gray-300 p-4">
          <h2 className={`text-2xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-black'}`}>Додайте ваш коментар</h2>
          <input
            type="text"
            placeholder="Імя"
            value={newComment.name}
            onChange={handleNameChange}
            className={`w-full mb-2 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500${
              isDarkMode ? 'text-white' : 'text-black'
            } border-2 border-gray-300`}
          />
          <textarea
            placeholder="Коментар"
            value={newComment.content}
            onChange={handleCommentChange}
            className={`w-full mb-4 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              isDarkMode ? 'text-white' : 'text-black'
            } border-2 border-gray-300`}
          />
          <button
            onClick={handleAddComment}
            className={`bg-blue-500 text-white px-4 py-2 rounded-lg ${
              isDarkMode ? 'bg-blue-700' : ''
            }`}
           
          >
            Додати коментар
          </button>
        </div>
        <div className="mb-8">
          <h2 className={`text-2xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-black'}`}>Коментарі</h2>
          {displayedComments.map((comment) => (
            <div
              key={comment.id}
              className={`bg-gray-200 rounded-lg px-4 py-2 mb-4 ${isDarkMode ? 'bg-gray-700' : ''}`}
            >
              <h3 className={`text-lg font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-black'}`}>
                {comment.name}
              </h3>
              <p className={`text-base ${isDarkMode ? 'text-white' : 'text-black'}`}>{comment.content}</p>
              <div className="mt-2 flex justify-start">
                <button
                  onClick={() => handleLike(comment.id)}
                  className={`px-2 py-1 rounded-md ${
                    comment.likes ? 'bg-red-500 text-white' : 'bg-gray-300 text-black'
                  }`}
                  style={{ background: 'transparent' }}
                >
                  <FaThumbsUp />
                </button>
                <span className={`mx-1 ${isDarkMode ? 'text-white' : 'text-black'}`}>{comment.likes}</span>
                <button
                  onClick={() => handleDislike(comment.id)}
                  className={`px-2 py-1 rounded-md ${
                    comment.dislikes ? 'bg-blue-500 text-white' : 'bg-gray-300 text-black'
                  }`}
                  style={{ background: 'transparent' }}
                >
                  <FaThumbsDown />
                </button>
                <span className={`mx-1 ${isDarkMode ? 'text-white' : 'text-black'}`}>{comment.dislikes}</span>

              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-end mt-4">
          {Array.from({ length: totalPages }, (_, index) => index + 1).map((pageNumber) => (
            <button
              key={pageNumber}
              onClick={() => handlePageChange(pageNumber)}
              className={`px-4 py-2 mx-1 rounded-lg ${
                pageNumber === currentPage ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'
              }`}
              style={{ background: 'transparent' }}
            >
              {pageNumber}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
  
      
};

export async function getServerSideProps({ params }: { params: { postId: string } }) {
  const postId = parseInt(params.postId);
  try {
    const post = await prisma.post.findUnique({
      where: { id: postId },
      select: {
        id: true,
        title: true,
        content: true,
        imageLink: true,
      },
    });

    if (!post) {
      return {
        notFound: true,
      };
    }

    const postComments = await prisma.comment.findMany({
      where: { postId },
      select: {
        id: true,
        name: true,
        content: true,
        likes: true,
        dislikes: true,
      },
    });

    return {
      props: {
        post,
        postComments,
      },
    };
  } catch (error) {
    console.error('Failed to fetch post and comments', error);
    return {
      notFound: true,
    };
  }
}

export default PostPage;