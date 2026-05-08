import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { isAxiosError } from 'axios';
import client from '../apis/axios';

function MyInfoPage() {
    const [loginId, setLoginId] = useState('');
    const [part, setPart] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [age, setAge] = useState('');

    const navigate = useNavigate();

    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    const ageIsNumber = age !== '' && !Number.isNaN(Number(age));
    const disabled = name === '' || email === '' || age === '' || !emailOk || !ageIsNumber;

    useEffect(() => {
        const userId = localStorage.getItem('userId');
        if (userId === null) {
            navigate('/login');
            return;
        }

        const fetchMe = async () => {
            try {
                const res = await client.get(`/api/v1/users/${userId}`);
                const data = res.data.data;
                setLoginId(data.loginId);
                setPart(data.part);
                setName(data.name);
                setEmail(data.email);
                setAge(String(data.age));
            } catch (e) {
                console.error(e);
            }
        };
        fetchMe();
    }, [navigate]);

    const handleUpdate = async () => {
        const userId = localStorage.getItem('userId');
        if (userId === null) return;
        try {
            await client.patch(`/api/v1/users/${userId}`, {
                name,
                email,
                age: Number(age),
            });
            alert('정보가 수정되었습니다.');
        } catch (err) {
            if (isAxiosError(err)) {
                alert(err.response?.data?.message ?? '정보 수정에 실패했습니다.');
            } else {
                alert('정보 수정에 실패했습니다.');
            }
        }
    };

    return (
        <div className="flex flex-col items-center w-full pt-12">
            <div className="flex flex-col w-1/3 items-center text-black">
                <h2 className="text-2xl font-bold mb-6 text-primary">내 정보</h2>

                <div className='flex w-full flex-col bg-blue-200 rounded-xl px-5 py-6 gap-2'>
                    <div className="flex justify-between w-full">
                        <span className="font-bold text-primary">아이디</span>
                        <span className='text-gray-500'>{loginId}</span>
                    </div>
                    <div className="flex justify-between w-full">
                        <span className="font-bold text-primary">파트</span>
                        <span className='text-gray-500'>{part}</span>
                    </div>
                </div>

                <div className="input-box">
                    <label>이름
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </label>
                </div>

                <div className="input-box">
                    <label>이메일
                        <input
                            type="text"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </label>
                    {email !== '' && !emailOk && (
                        <p className="text-red-500 font-semibold text-sm">올바른 이메일 형식이 아닙니다.</p>
                    )}
                </div>

                <div className="input-box">
                    <label>나이
                        <input
                            type="text"
                            value={age}
                            onChange={(e) => setAge(e.target.value)}
                        />
                    </label>
                    {age !== '' && !ageIsNumber && (
                        <p className="text-red-500 font-semibold text-sm">나이는 숫자만 입력해주세요.</p>
                    )}
                </div>

                <button onClick={handleUpdate} disabled={disabled} className="button">
                    정보 수정
                </button>
            </div>
        </div>
    );
}

export default MyInfoPage;
