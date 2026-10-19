import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

function Login() {
    const [loginId, setLoginId] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate();

    const onAddUser = () => navigate("/addUser");

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (loginId.trim() === "" || password === "") {//아이디와 비밀번호 공백확인
            alert("아이디와 비밀번호를 입력해주세요.");
            return;
        }

        try {
            const res = await api.post("/users/login", { loginId, password });
            // 2차 확인: 서버가 돌려준 loginId가 입력한 값과 같은지
            if (res.data.loginId !== loginId) {
                alert("로그인 정보가 일치하지 않습니다.");
                return;
            }
            localStorage.setItem("token", res.data.token);
            localStorage.setItem("loginId", res.data.loginId);
            navigate("/board");
        } catch (error) {
            alert(error.response?.data?.message ?? "로그인에 실패했습니다.");
        }
    };

    return (
        <>
            <h2>로그인페이지</h2>
            <form onSubmit={handleSubmit}>
                <input placeholder="아이디" name="loginId" value={loginId} onChange={(e) => setLoginId(e.target.value)} />
                <input type="password" placeholder="비밀번호" name="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                <button type="submit">로그인</button>
            </form>
            <button className="addUserbtn" onClick={onAddUser}>회원가입</button>
        </>
    );
}

export default Login;
