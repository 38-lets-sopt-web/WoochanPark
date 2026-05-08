import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { isAxiosError } from 'axios';
import client from '../apis/axios';

type MemberSummary = {
    id: number;
    name: string;
    part: string;
};

type MemberDetail = {
    id: number;
    loginId: string;
    name: string;
    email: string;
    age: number;
    part: string;
};

function MembersPage() {
    const [members, setMembers] = useState<MemberSummary[]>([]);
    const [searchId, setSearchId] = useState('');
    const [detail, setDetail] = useState<MemberDetail | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchMembers = async () => {
            try {
                const res = await client.get('/api/v1/users');
                setMembers(res.data.data.users);
            } catch (e) {
                console.error(e);
            }
        };
        fetchMembers();
    }, []);

    const handleSearch = async () => {
        try {
            const res = await client.get(`/api/v1/users/${searchId}`);
            setDetail(res.data.data);
        } catch (err) {
            setDetail(null);
            if (isAxiosError(err)) {
                alert(err.response?.data?.message ?? '조회에 실패했습니다.');
            } else {
                alert('조회에 실패했습니다.');
            }
        }
    };

    return (
        <div className="flex flex-col items-center w-full p-8">
            <div className="flex flex-col w-2/3 gap-6 items-center">
                <div className="flex w-1/3 flex-col items-center gap-3">
                    <h2 className="text-2xl font-bold my-2 text-primary">회원 조회</h2>
                    <div className="flex gap-2 flex-col w-full">
                        <input
                            type="number"
                            placeholder="회원 ID를 입력해주세요."
                            value={searchId}
                            onChange={(e) => setSearchId(e.target.value)}
                            className="flex-1 px-3 py-2 rounded-lg shadow-sm bg-white outline-none focus:border focus:border-blue-500"
                        />
                        <button
                            onClick={handleSearch}
                            disabled={searchId === ''}
                            className="px-5 bg-blue-400 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200 cursor-pointer disabled:bg-gray-300 disabled:cursor-not-allowed"
                        >
                            조회
                        </button>
                    </div>

                    <div className='w-full'>
                        <p className=" text-primary font-bold mt-3 mb-2">검색 결과</p>
                        <div className="flex flex-col h-40 items-center justify-center  bg-white p-5 rounded-xl gap-1">
                            {detail !== null ? (
                                <>
                                <div className="flex  w-full justify-between">
                                    <span className="text-primary font-bold">아이디</span>
                                    <span>{detail.loginId}</span>
                                </div>
                                <div className="flex  w-full justify-between">
                                    <span className="text-primary font-bold">이름</span>
                                    <span>{detail.name}</span>
                                </div>
                                <div className="flex w-full justify-between">
                                    <span className="text-primary font-bold">이메일</span>
                                    <span>{detail.email}</span>
                                </div>
                                <div className="flex w-full justify-between">
                                    <span className="text-primary font-bold">나이</span>
                                    <span>{detail.age}</span>
                                </div>
                                <div className="flex w-full justify-between">
                                    <span className="text-primary font-bold">파트</span>
                                    <span>{detail.part}</span>
                                </div>
                            </>
                            ) : (
                            <div className="text-gray-500">원하는 ID를 검색해보세요!</div>
                            )}
                        </div>

                    </div>
                </div>


                <div>
                    <h3 className="text-lg font-bold mb-3 text-primary">전체 멤버 리스트</h3>
                    <div className="flex flex-wrap gap-3">
                        {members.map((m) => {
                            return (
                                <div
                                    key={m.id}
                                    onClick={() => navigate(`/mypage/members/${m.id}`)}
                                    className="flex flex-col justify-center items-center gap-2 w-40 p-4 bg-white rounded-xl shadow-sm cursor-pointer hover:shadow-md transition-shadow duration-200"
                                >
                                    <div className="font-bold text-primary">{m.name}</div>
                                    <div className="text-primary text-xs font-bold bg-gray-200 p-1 rounded-xl">{m.part}</div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MembersPage;
