import { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import client from '../apis/axios';

function Header() {
    const [name, setName] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const userId = localStorage.getItem('userId');
        if (userId === null) {
            navigate('/login');
            return;
        }

        const fetchMe = async () => {
            try {
                const res = await client.get(`/api/v1/users/${userId}`);
                setName(res.data.data.name);
            } catch(e) {
                console.error(e);
            }
        };
        fetchMe();
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('userId');
        navigate('/login');
    };

    return (
        <header className="flex justify-between items-center w-full px-8 py-4 bg-blue-950 text-white">
            <div>
                <h1 className="text-2xl font-bold">SOPT MEMBERS</h1>
                <p className='text-sm'>안녕하세요, {name}님!</p>
            </div>
            <nav className="flex gap-6 items-center">
                <NavLink to="/mypage" end >내 정보</NavLink>
                <NavLink to="/mypage/members">회원 조회</NavLink>
                <button onClick={handleLogout} className="cursor-pointer">
                    로그아웃
                </button>
            </nav>
        </header>
    );
}

export default Header;
