import { useState } from 'react';
import { prisma } from "../../lib/prisma";
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';

interface Post {
  id: number;
  title: string;
  content: string;
  imageLink: string;
  comments: Comment[];
}

interface Comment {
  id: number;
  content: string;
  name: string;
}

interface FormData {
  title: string;
  content: string;
  imageLink: string;
  id: string;
}

interface DashboardProps {
  posts: Post[];
}

const Dashboard = ({ posts }: DashboardProps) => {
  const [form, setForm] = useState<FormData>({ title: '', content: '', imageLink: '', id: '' });
  const router = useRouter();
  
  const refreshData = () => {
    router.replace(router.asPath);
  };

  const create = async (data: FormData) => {
    try {
      const response = await fetch('/api/create', {
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'POST',
      });

      if (response.ok) {
        if (data.id) {
          deletePost(data.id);
          setForm({ title: '', imageLink: '', content: '', id: '' });
          refreshData();
        } else {
          setForm({ title: '', imageLink: '', content: '', id: '' });
          refreshData();
        }
      } else {
        console.log('Error creating post');
      }
    } catch (error) {
      console.log(error);
    }
  };

  const deletePost = async (id: string) => {
    try {
      const response = await fetch(`/api/post/${id}`, {
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'DELETE',
      });

      if (response.ok) {
        // Delete comments related to the deleted post
        await fetch(`/api/comment/post/${id}`, {
          headers: {
            'Content-Type': 'application/json',
          },
          method: 'DELETE',
        });

        refreshData();
      } else {
        console.log('Error deleting post');
      }
    } catch (error) {
      console.log(error);
    }
  };

  const deleteComment = async (postId: number, commentId: number) => {
    try {
      const response = await fetch(`/api/comment/${commentId}`, {
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'DELETE',
      });

      if (response.ok) {
        refreshData();
      } else {
        console.log('Error deleting comment');
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = async (data: FormData) => {
    try {
      await create(data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <h1 className="text-center font-bold text-2xl mt-4">Пости</h1>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit(form);
        }}
        className="w-auto min-w-[25%] max-w-min mx-auto space-y-6 flex flex-col items-stretch"
      >
        <input
          type="text"
          placeholder="Заголовок"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          className="border-2 rounded border-gray-600 p-1"
        />
        <input
          type="text"
          placeholder="Посилання на фото"
          value={form.imageLink}
          onChange={(e) => setForm({ ...form, imageLink: e.target.value })}
          className="border-2 rounded border-gray-600 p-1"
        />
        <textarea
          placeholder="Текст"
          value={form.content}
          onChange={(e) => setForm({ ...form, content: e.target.value })}
          className="border-2 rounded border-gray-600 p-1"
        />
        <button type="submit" className="bg-blue-500 text-white rounded p-1">
          Додати +
        </button>
      </form>
      <div className="w-auto min-w-[25%] max-w-min mt-20 mx-auto space-y-6 flex flex-col item-stretch">
        <ul>
          {posts.map((post) => (
            <li key={post.id} className="border-b border-gray-600 p-2">
              <div className="flex justify-between">
                <div className="flex-1">
                  <h3 className="font-bold">{post.title}</h3>
                 
                </div>
                <button
                  onClick={() =>
                    setForm({ title: post.title, content: post.content, imageLink: post.imageLink, id: post.id.toString() })
                  }
                  className="bg-blue-500 px-3 text-white rounded"
                >
                  Оновити
                </button>
                <button onClick={() => deletePost(post.id.toString())} className="bg-red-500 px-3 text-white rounded">
                  X
                </button>
              </div>
              <div>
                <h4 className="font-bold">Коментарі:</h4>
                <ul>
                  {post.comments.map((comment) => (
                    <li key={comment.id} className="border-b border-gray-600 p-2">
                      <div className="flex justify-between">
                        <div><p><b>{comment.name}</b></p>
                        <p>{comment.content}</p></div>
                      
                        <button
                          onClick={() => deleteComment(post.id, comment.id)}
                          className="bg-red-500 px-3 text-white rounded"
                        >
                          X
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;

export const getServerSideProps: GetServerSideProps = async () => {
  const posts = await prisma.post.findMany({
    select: {
      id: true,
      title: true,
      content: true,
      imageLink: true,
      comments: {
        select: {
          id: true,
          name:true,
          content: true,
        },
      },
    },
  });

  return {
    props: {
      posts,
    },
  };
}
