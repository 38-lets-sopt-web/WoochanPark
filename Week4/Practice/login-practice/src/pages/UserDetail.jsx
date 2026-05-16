import { useEffect, useState } from "react";
import { useParams, Link } from "react-router";
import axios from "axios";

const UserDetail = () => {
    const { id } = useParams();
    const [user, setUser] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.get(
                    `${import.meta.env.VITE_API_URL}/users/${id}`,
                );
                setUser(res.data.data);
            } catch (error) {
                console.error("유저 상세 정보를 불러오는 데 실패했습니다.", error);
            }
        };

        fetchData();
    }, [id]);

    if (!user) return <p>로딩 중...</p>;

    return (
        <div style={{ padding: "2rem", display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column", gap: "1rem" }}>
            <Link to="/" style={{ textDecoration: "none", color: "#007bff", textAlign: "end" }}>
                ← 목록으로 돌아가기
            </Link>

            <div
                style={{
                    marginTop: "2rem",
                    padding: "1.5rem",
                    border: "1px solid #eee",
                    borderRadius: "12px",
                    backgroundColor: "#f9f9f9",
                    width: "600px",
                }}
            >
                <h1 style={{ margin: "0 0 1.5rem 0", fontSize: "1.8rem" }}>
                    {user.name} 님
                </h1>

                <div
                    style={{ display: "flex", flexDirection: "column", gap: "0.8rem" }}
                >
                    <p>
                        <strong>아이디:</strong> {user.loginId}
                    </p>
                    <p>
                        <strong>파트:</strong> {user.part}
                    </p>
                    <p>
                        <strong>이메일:</strong> {user.email}
                    </p>
                    <p>
                        <strong>나이:</strong> {user.age}세
                    </p>
                </div>
            </div>
        </div>
    );
};

export default UserDetail;
