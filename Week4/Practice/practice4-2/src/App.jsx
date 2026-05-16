import { useEffect, useState } from 'react'
import './App.css'
import axios from 'axios'


function App() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await axios.get(
          'https://jsonplaceholder.typicode.com/posts'
        );
        setPosts(res.data); // 데이터를 state에 저장
      } catch (err) {
        console.error('데이터 가져오기 실패:', err);
      }
    };

    fetchPosts();
  }, []);


  return (
    <>
      <div>
        <h1>게시글 목록</h1>
        <ul>
          {posts.slice(0, 5).map((post) => (
            <li key={post.id}>
              <strong>{post.title}</strong>
              <p>{post.body}</p>
            </li>
          ))}
        </ul>
      </div>
    </>
  )
}

export default App
