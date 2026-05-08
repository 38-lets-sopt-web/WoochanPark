import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { isAxiosError } from 'axios';
import client from '../apis/axios';

type MemberDetail = {
    id: number;
    loginId: string;
    name: string;
    email: string;
    age: number;
    part: string;
};

function MemberDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [detail, setDetail] = useState<MemberDetail | null>(null);

    useEffect(() => {
        const fetchDetail = async () => {
            try {
                const res = await client.get(`/api/v1/users/${id}`);
                setDetail(res.data.data);
            } catch (err) {
                if (isAxiosError(err)) {
                    alert(err.response?.data?.message ?? '회원 정보를 불러오지 못했습니다.');
                } else {
                    alert('회원 정보를 불러오지 못했습니다.');
                }
                navigate('/mypage/members');
            }
        };
        fetchDetail();
    }, [id, navigate]);

    return (
        <div className="flex flex-col items-center w-full p-8">
            <div className="flex flex-col w-1/3 gap-4 justify-center items-center">
                <h2 className="text-2xl font-bold text-primary">상세 정보</h2>
                <button
                    onClick={() => navigate('/mypage/members')}
                    className="self-start text-gray-500 hover:text-primary cursor-pointer"
                >
                    ← 뒤로가기
                </button>


                {detail !== null && (
                    <div className="flex flex-col w-full bg-white p-6 rounded-xl shadow-sm gap-2">
                        <div className="flex w-full justify-between">
                            <span className="text-primary font-bold">이름</span>
                            <span>{detail.name}</span>
                        </div>
                        <div className="flex w-full justify-between">
                            <span className="text-primary font-bold">아이디</span>
                            <span>{detail.loginId}</span>
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
                    </div>
                )}
            </div>
        </div>
    );
}

export default MemberDetailPage;
