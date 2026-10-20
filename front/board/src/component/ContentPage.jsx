import React, { useEffect, useState } from "react";
import { Navigate, useNavigate, useLocation } from "react-router-dom";
import api from "../api/axios";
import DOMPurify from "dompurify";
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
                // 같은 탭에서 처음 열 때만 조회수 +1
                // (새로고침, 수정 후 복귀, 개발모드 StrictMode 중복 실행으로 여러 번 오르는 것 방지)
                const key = `viewed_${postId}`;
                const count = !sessionStorage.getItem(key);
                if (count) sessionStorage.setItem(key, "1");
                const res = await api.get(`/boards/posts/${postId}`, { params: { count } });
                setPost(res.data);
            } catch (e) {
                console.error("게시글 조회 실패", e);
            }
        };
        contentlist();
    }, [postId]);

    if (!token) return <Navigate to="/" replace />;
    if (!postId) return <Navigate to="/board" replace />;

    // 삭제는 서버에서도 본인 글만 허용
    const deletePost = async () => {
        if (!window.confirm("이 글을 삭제하시겠습니까?")) return;
        try {
            await api.delete(`/boards/posts/${postId}`);
            alert("삭제되었습니다.");
            navigate("/board", { replace: true });
        } catch (e) {
            console.error("게시글 삭제 실패", e);
            alert(e.response?.data?.message ?? "삭제에 실패했습니다.");
        }
    };

    // 에디터가 저장한 HTML을 그대로 보여주되, 스크립트 등 위험한 태그/속성은 제거(XSS 방지)
    // 태그가 없는 예전 글(순수 텍스트)은 줄바꿈만 살려서 보여준다.
    const raw = post?.content ?? "";
    const isHtml = /<\/?[a-z][\s\S]*>/i.test(raw);
    const safeHtml = isHtml
        ? DOMPurify.sanitize(raw, { ADD_ATTR: ["target"] })
        : "";

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
                    {isHtml ? (
                        <div className="view_cont" dangerouslySetInnerHTML={{ __html: safeHtml }} />
                    ) : (
                        <div className="view_cont" style={{ whiteSpace: "pre-wrap" }}>{raw}</div>
                    )}
                </div>
            )}

            <div className="comm_paging_btn">
                <div className="flo_side left">
                    <button className="comm_btn_round fill" onClick={() => navigate("/board")}>목록</button>
                    {isMine && (
                        <button className="comm_btn_round" onClick={deletePost}>삭제</button>
                    )}
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
