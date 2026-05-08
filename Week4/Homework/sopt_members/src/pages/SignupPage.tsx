import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { isAxiosError } from 'axios';
import client from '../apis/axios';

const checkPassword = (pw: string) => {
    if (pw.length < 8 || pw.length > 20) return false;
    if (/\s/.test(pw)) return false;
    if (!/[A-Za-z]/.test(pw)) return false;
    if (!/\d/.test(pw)) return false;
    if (!/[^A-Za-z0-9\s]/.test(pw)) return false;
    return true;
};

function SignupPage() {
    const [step, setStep] = useState(1);

    const [loginId, setLoginId] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirm, setPasswordConfirm] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [age, setAge] = useState('');
    const [part, setPart] = useState('');

    const [pwVisible, setPwVisible] = useState(false);
    const [pwConfirmVisible, setPwConfirmVisible] = useState(false);

    const navigate = useNavigate();

    const loginIdTooLong = loginId.length > 20;
    const step1Disabled = loginId === '' || loginIdTooLong;

    const passwordPolicyOk = checkPassword(password);
    const passwordMismatch = passwordConfirm !== '' && password !== passwordConfirm;
    const step2Disabled = password === '' || passwordConfirm === '' || !passwordPolicyOk || passwordMismatch;

    const nameTooLong = name.length > 10;
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    const ageIsNumber = age !== '' && !Number.isNaN(Number(age));
    const step3Disabled =
        name === '' || email === '' || age === '' || part === '' ||
        nameTooLong || !emailOk || !ageIsNumber;

    const handleSubmit = async () => {
        try {
            await client.post('/api/v1/auth/signup', {
                loginId,
                password,
                name,
                email,
                age: Number(age),
                part,
            });
            alert(`${name}님, 회원가입이 완료되었습니다!`);
            navigate('/login');
        } catch (err) {
            if (isAxiosError(err)) {
                alert(err.response?.data?.message ?? '회원가입에 실패했습니다.');
            } else {
                alert('회원가입에 실패했습니다.');
            }
        }
    };

    return (
        <div className="flex w-full h-screen bg-background justify-center items-center">
            <div className="flex flex-col w-1/3 justify-center items-center text-black">
                <h1 className="text-4xl font-bold mb-10 text-primary">회원가입</h1>

                {step === 1 && (
                    <>
                        <div className="input-box">
                            <label>아이디
                                <input
                                    type="text"
                                    placeholder="아이디를 입력해주세요."
                                    value={loginId}
                                    onChange={(e) => setLoginId(e.target.value)}
                                />
                            </label>
                            {loginIdTooLong && (
                                <p className="text-red-500 font-semibold text-sm">아이디는 20자를 넘을 수 없습니다.</p>
                            )}
                        </div>

                        <button onClick={() => setStep(2)} disabled={step1Disabled} className="button">
                            다음
                        </button>
                    </>
                )}

                {step === 2 && (
                    <>
                        <div className="input-box">
                            <label>비밀번호
                                <div className="relative w-full">
                                    <input
                                        type={pwVisible ? 'text' : 'password'}
                                        placeholder="비밀번호를 입력해주세요"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="pr-10!"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setPwVisible(!pwVisible)}
                                        className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-500 cursor-pointer"
                                    >
                                        {pwVisible ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                            </label>
                            {password !== '' && !passwordPolicyOk && (
                                <p className="text-red-500 font-semibold text-sm">8~20자 / 영문, 숫자, 특수문자 포함 / 공백 불가</p>
                            )}
                        </div>

                        <div className="input-box">
                            <label>비밀번호 확인
                                <div className="relative w-full">
                                    <input
                                        type={pwConfirmVisible ? 'text' : 'password'}
                                        placeholder="비밀번호를 다시 입력해주세요"
                                        value={passwordConfirm}
                                        onChange={(e) => setPasswordConfirm(e.target.value)}
                                        className="pr-10!"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setPwConfirmVisible(!pwConfirmVisible)}
                                        className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-500 cursor-pointer"
                                    >
                                        {pwConfirmVisible ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                            </label>
                            {passwordMismatch && (
                                <p className="text-red-500 font-semibold text-sm">비밀번호가 일치하지 않습니다.</p>
                            )}
                        </div>

                        <button onClick={() => setStep(3)} disabled={step2Disabled} className="button">
                            다음
                        </button>
                    </>
                )}

                {step === 3 && (
                    <>
                        <div className="input-box">
                            <label>이름
                                <input
                                    type="text"
                                    placeholder="이름을 입력해주세요"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </label>
                            {nameTooLong && (
                                <p className="text-red-500 font-semibold text-sm">이름은 10자 이하로 입력해주세요.</p>
                            )}
                        </div>

                        <div className="input-box">
                            <label>이메일
                                <input
                                    type="text"
                                    placeholder="이메일을 입력해주세요"
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
                                    placeholder="나이를 입력해주세요."
                                    value={age}
                                    onChange={(e) => setAge(e.target.value)}
                                />
                            </label>
                            {age !== '' && !ageIsNumber && (
                                <p className="text-red-500 font-semibold text-sm">나이는 숫자만 입력해주세요.</p>
                            )}
                        </div>

                        <div className="input-box">
                            <label>파트
                                <select
                                    value={part}
                                    onChange={(e) => setPart(e.target.value)}
                                >
                                    <option value="iOS">iOS</option>
                                    <option value="안드로이드">안드로이드</option>
                                    <option value="웹">웹</option>
                                </select>
                            </label>
                        </div>

                        <button onClick={handleSubmit} disabled={step3Disabled} className="button">
                            회원가입
                        </button>
                    </>
                )}

                <div className="text-gray-600 text-sm">
                    이미 계정이 있나요?
                    <button onClick={() => navigate('/login')} className='mx-1 text-blue-500 font-bold cursor-pointer'>
                        로그인
                    </button>
                </div>
            </div>
        </div>
    );
}

export default SignupPage;
