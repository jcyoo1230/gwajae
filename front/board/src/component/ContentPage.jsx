import React, { useEffect, useState } from "react";
import { Navigate, useNavigate, useLocation } from "react-router-dom";
import api from "../api/axios";
import Layout from "./Layout";
import { formatDate } from "./dateFormat";

// 03view.html 이식
function ContentPage() {
    const { state } = useLocation();
    const postId = state?.postId;
    const navigate = useNavigate();
    const token = localStorage.getItem("token");
    const loginId = localStorage.getItem("loginId");
    const [post, setPost] = useState(null);

    useEffect(() => {
        if (!postId) return;
        const contentlist = async () => {
            try {
                const res = await api.get(`/boards/posts/${postId}`);
                setPost(res.data);
            } catch (e) {
                console.error("게시글 조회 실패", e);
            }
        };
        contentlist();
    }, [postId]);

    if (!token) return <Navigate to="/" replace />;
    if (!postId) return <Navigate to="/board" replace />;

    const isMine = post && post.author === loginId; // 수정은 서버에서도 본인 글만 허용

    return (
        <Layout>
            {post && (
                <div className="wrap_view">
                    <dl className="view_tit">
                        <dt>제목</dt>
                        <dd><h3 className="tit">{post.title}</h3></dd>
                    </dl>
                    <dl className="view_info">
                        <dt>작성자</dt>
                        <dd>{post.author}</dd>
                        <dt>작성일</dt>
                        <dd>{formatDate(post.create_date)}</dd>
                        <dt>조회수</dt>
                        <dd>{post.view_count}</dd>
                    </dl>
                    <div className="view_cont" style={{ whiteSpace: "pre-wrap" }}>
                        {post.content}
                    </div>
                </div>
            )}

            <div className="comm_paging_btn">
                <div className="flo_side left">
                    <button className="comm_btn_round fill" onClick={() => navigate("/board")}>목록</button>
                </div>
                <div className="flo_side right">
                    {isMine && (
                        <button className="comm_btn_round fill" onClick={() => navigate("/edit", { state: { postId, post } })}>수정</button>
                    )}
                </div>
            </div>
        </Layout>
    );
}

export default ContentPage;
