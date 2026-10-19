import React, { useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

const MIN_PASSWORD_LENGTH = 8;

function AddUser() {
    const [loginId, setLoginId] = useState(""); //null 값이여서 console창에서 input 오류가 나왔음.
    const [password, setPassword] = useState("");//위와 같은 내용
    const [idChecked, setIdChecked] = useState(false); // 중복 확인을 통과한 아이디인지
    const [msg, setMsg] = useState("");

    const navigate = useNavigate();

    const backbtn = () => navigate(-1);

    // 아이디를 고치면 이전 중복 확인 결과는 무효 -> 가입 버튼 다시 비활성화
    const onChangeId = (e) => {
        setLoginId(e.target.value);
        setIdChecked(false);
        setMsg("");
    };

    const stripWhitespace = () => {
        const stripped = loginId.replace(/\s/g, "");//작성된 loginId에 정규식으로 공백이 포함되있는 부분을 찾아서 공백 제거
        if (stripped !== loginId) {
            alert("아이디에 공백이 포함되어 있어 공백을 제거했습니다.");
            setLoginId(stripped);
            return stripped;
        }
        return loginId;
    };

    const dupCheck = async () => {
        const id = stripWhitespace();
        if (id === "") {
            alert("아이디를 입력해주세요.");
            return;
        }
        try {
            const res = await api.post("/users/dupcheck", { loginId: id });
            if (res.data) {
                setMsg("중복된 아이디");
                setIdChecked(false);
            } else {
                setMsg("사용가능한 아이디");
                setIdChecked(true);
            }
        } catch (error) {
            console.error("중복 확인 실패", error);
            alert("중복 확인 중 오류가 발생했습니다.");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (loginId.trim() === "" || password === "") {
            alert("아이디와 비밀번호를 입력해주세요.");
            return;
        }
        if (password.trim() === "") {
            alert("비밀번호는 공백만으로 만들 수 없습니다.");
            return;
        }
        if (password.length < MIN_PASSWORD_LENGTH) {
            alert(`비밀번호는 ${MIN_PASSWORD_LENGTH}자 이상이어야 합니다.`);
            return;
        }

        // 요청이 실제로 성공했을 때만 환영 메시지를 띄움
        // (기존엔 .catch 뒤에 .then 이 있어서 실패해도 "회원가입 되었습니다"가 떴다)
        try {
            await api.post("/users/signup", { loginId, password });
            alert(`회원가입 되었습니다. ${loginId}님 환영합니다`);
            navigate("/");
        } catch (error) {
            console.error("회원가입 실패", error);
            alert(error.response?.data?.message ?? "회원가입에 실패했습니다.");
        }
    };

    return (
        <>
            <h2>회원 가입 페이지</h2>
            <form onSubmit={handleSubmit}>
                <input placeholder="사용할 아이디" name="loginId" value={loginId} onChange={onChangeId} /> <br />
                <button type="button" onClick={dupCheck}>중복 확인</button>&emsp;
                {msg}
                <br />
                <input type="password" placeholder={`비밀번호 (${MIN_PASSWORD_LENGTH}자 이상)`} name="password"
                       value={password} onChange={(e) => setPassword(e.target.value)} />
                <br />
                <button type="submit" disabled={!idChecked}>회원가입</button>
            </form>
            <button onClick={backbtn}>돌아가기</button>
        </>
    );
}

export default AddUser;
