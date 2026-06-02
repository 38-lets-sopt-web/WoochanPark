import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { isAxiosError } from 'axios';
import client from '../apis/axios';

function LoginPage() {
    const [loginId, setLoginId] = useState('');
    const [password, setPassword] = useState('');
    const [visible, setVisible] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    const disabled = loginId === '' || password === '';

    const handleLogin = async () => {
        try {
            const res = await client.post('/api/v1/auth/signin', { loginId, password });
            const userId = res.data.data.userId;
            localStorage.setItem('userId', String(userId));
            navigate('/mypage');
        } catch (err) {
            if (isAxiosError(err)) {
                setErrorMessage(err.response?.data?.message ?? '로그인에 실패하였습니다.');
            } else {
                setErrorMessage('로그인에 실패하였습니다.');
            }
        }
    };

    return (
        <div className="flex w-full h-screen bg-background justify-center items-center text-white">
            <div id="card" className="flex flex-col w-1/3 justify-center items-center text-black">
                <h1 className="text-4xl font-bold mb-10 text-primary">SOPT MEMBERS</h1>

                <div className="input-box">
                    <label>아이디
                        <input
                            type="text"
                            placeholder="아이디를 입력해주세요."
                            value={loginId}
                            onChange={(e) => setLoginId(e.target.value)}
                        />
                    </label>
                </div>

                <div className="input-box">
                    <label>비밀번호
                        <div className="relative w-full">
                            <input
                                type={visible ? 'text' : 'password'}
                                placeholder="비밀번호를 입력해주세요."
                                className="pr-10!"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <button
                                type="button"
                                onClick={() => setVisible(!visible)}
                                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-500 cursor-pointer"
                            >
                                {visible ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </label>
                </div>


                {errorMessage && (
                    <p className='text-red-500 font-semibold text-sm'>{errorMessage}</p>
                )}
                <button onClick={handleLogin} disabled={disabled} className="button">
                    Login
                </button>
                <button
                    onClick={() => navigate('/signup')}
                    className="w-full h-8 text-blue-600 m-2 cursor-pointer font-bold"
                >
                    회원가입
                </button>
            </div>
        </div>
    );
}

export default LoginPage;