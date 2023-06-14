// ResumePage.js
import React, { useState, useEffect } from 'react';
import { Post } from '.prisma/client';
import { useRouter } from 'next/router';
import Navigation from '@/components/Navigation';

const ResumePage = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const router = useRouter();
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    async function fetchCategories() {
      const res = await fetch('/api/categories');
      const data = await res.json();
      setCategories(data);
    }
    fetchCategories();
  }, []);

  const navigateToPost = async (categoryId: number | null) => {
    setSelectedCategory(categoryId);
    const categoryParam = categoryId ? `category=${categoryId}` : '';
    router.push(`/?${categoryParam}`);
  };

  useEffect(() => {
    async function fetchPosts() {
      let url = '/api/posts';
      if (selectedCategory !== null) {
        url += `?category=${selectedCategory}`;
      }
      const res = await fetch(url);
      const data = await res.json();
      setPosts(data);
    }
    fetchPosts();
  }, [selectedCategory]);

  // Function to fetch GitHub projects
  const fetchGitHubProjects = async () => {
    try {
      const response = await fetch('https://api.github.com/users/ben1maru/repos');
      const data = await response.json();
      setProjects(data);
    } catch (error) {
      console.log('Error fetching GitHub projects:', error);
    }
  };

  useEffect(() => {
    fetchGitHubProjects();
  }, []);

  return (
    <>
      <Navigation categories={categories} navigateToPost={navigateToPost} />

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-2 gap-8">
          <div className="bg-green-200 p-8">
            <img
              src="https://i.pinimg.com/564x/d8/14/11/d81411ffe4a467c9f8ca98d01c5f5335.jpg"
              alt="Фото"
              className="mx-auto w-full h-auto rounded"
            />
            <div className="mt-8">
              <h2 className="text-2xl font-bold">Контактні дані</h2>
              <p>Ім'я: Євген"</p>
              <p>Email: evgenbabych13@gmail.com</p>
              <p>Телефон: 067-2131-123</p>
            </div>
          </div>
          <div>
            
            <h2 className="text-2xl font-bold mt-4">Бабич Євген</h2>
            <h3>React.js Developer</h3>

            <div className="mt-8">
              <h2 className="text-2xl font-bold">Навички</h2>
              <ul className="list-disc list-inside mt-4">
                <li>HTML</li>
                <li>CSS</li>
                <li>JavaScript</li>
                <li>TypeScript</li>
                <li>Tailwind</li>
                <li>React</li>
                <li>Next</li>
                <li>Java</li>
                <li>C#</li>
                <li>MySQL</li>
                <li>PostgreSQL</li>
              </ul>
            </div>

            <div className="mt-8">
              <h2 className="text-2xl font-bold">Проекти</h2>
              <ul className="list-disc list-inside mt-4">
                {projects.map((project: any) => (
                  <li key={project.id}>
                    <a href={project.html_url} target="_blank" rel="noopener noreferrer">
                      {project.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-8">
              <h2 className="text-2xl font-bold">Досвід</h2>
              <p>Досвід роботи веб-розробником - відсутній</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ResumePage;
