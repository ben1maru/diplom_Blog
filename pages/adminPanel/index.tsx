import { useState } from 'react';
import axios from 'axios';


export default function AdminPanel() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async () => {
    try {
        const response = await axios.post('/api/auth/login', { email, password });
  
        if (response.status === 200) {
          // Авторизація успішна - перенаправлення на адмін панель
          window.location.href = '/adminPanel/dashboard';
        } else {
          setError('Помилка авторизації');
        }
      } catch (error) {
        console.error('Помилка авторизації', error);
        setError('Помилка авторизації');
      }
  };

 
  return (
    <div className="bg-gray-100 min-h-screen flex flex-col justify-center items-center">
      <div className="bg-white rounded-md shadow-md p-6">
        <h1 className="text-3xl font-bold mb-6">Вхід до адмін панелі</h1>
        <div className="mb-4">
          <label htmlFor="email" className="block mb-2 text-gray-700">Електронна пошта:</label>
          <input
            type="text"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border border-gray-300 rounded-md p-2 w-full"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="password" className="block mb-2 text-gray-700">Пароль:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border border-gray-300 rounded-md p-2 w-full"
          />
        </div>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <div className="text-center">
          <button
            onClick={handleLogin}
            className="bg-blue-500 text-white rounded-md py-2 px-4 hover:bg-blue-600 mx-auto"
          >
            Увійти
          </button>
        </div>
      </div>
    </div>
  );
}