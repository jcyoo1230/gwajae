import React, { useEffect, useMemo, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import api from "../api/axios";
import Layout from "./Layout";
import { formatDate } from "./dateFormat";

const PAGE_SIZE = 10;   // 한 페이지에 보여줄 글 수
const PAGE_GROUP = 10;  // 페이지 번호를 한 번에 몇 개 보여줄지

// 02list.html 이식. 토큰이 없으면 로그인 화면으로 돌려보낸다.
function Board() {
    const navigate = useNavigate();
    const token = localStorage.getItem("token");
    const loginId = localStorage.getItem("loginId");

    const [posts, setPosts] = useState([]);
    const [page, setPage] = useState(1);
    const [searchType, setSearchType] = useState("title");
    const [keyword, setKeyword] = useState("");
    const [applied, setApplied] = useState({ type: "title", keyword: "" }); // 검색 버튼을 눌렀을 때만 반영

    useEffect(() => {
        const boardlist = async () => {
            try {
                const res = await api.get("/boards/posts/list");
                setPosts(res.data);
            } catch (e) {
                console.error("테이블 조회 실패", e);
            }
        };
        boardlist();
    }, []);

    // 최신 글이 위로 오도록 id 내림차순 + 검색 필터
    const filtered = useMemo(() => {
        const k = applied.keyword.trim().toLowerCase();
        return [...posts]
            .sort((a, b) => b.id - a.id)
            .filter((p) => {
                if (!k) return true;
                const title = (p.title ?? "").toLowerCase();
                const content = (p.content ?? "").toLowerCase();
                const author = (p.author ?? "").toLowerCase();
                if (applied.type === "author") return author.includes(k);
                if (applied.type === "titleContent") return title.includes(k) || content.includes(k);
                return title.includes(k);
            });
    }, [posts, applied]);

    if (!token) {
        return <Navigate to="/" replace />;
    }

    const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
    const current = Math.min(page, totalPages);
    const rows = filtered.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);

    const groupStart = Math.floor((current - 1) / PAGE_GROUP) * PAGE_GROUP + 1;
    const groupEnd = Math.min(groupStart + PAGE_GROUP - 1, totalPages);
    const pageNumbers = [];
    for (let i = groupStart; i <= groupEnd; i++) pageNumbers.push(i);

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("loginId");
        navigate("/");
    };

    const doSearch = (e) => {
        e.preventDefault();
        setApplied({ type: searchType, keyword });
        setPage(1);
    };

    const showAll = () => {
        setKeyword("");
        setSearchType("title");
        setApplied({ type: "title", keyword: "" });
        setPage(1);
    };

    const mvcon = (id) => navigate("/contentpage", { state: { postId: id } });

    return (
        <Layout
            right={
                <>
                    {loginId}님 <button className="comm_btn_small" onClick={logout}>로그아웃</button>
                    <div>총 갯수 <strong className="fc_p">{filtered.length}</strong>건</div>
                </>
            }
        >
            <table className="tbl_board">
                <colgroup>
                    <col style={{ width: "7%" }} />
                    <col />
                    <col style={{ width: "12%" }} />
                    <col style={{ width: "12%" }} />
                    <col style={{ width: "8%" }} />
                </colgroup>
                <thead>
                    <tr>
                        <th scope="col">No</th>
                        <th scope="col">제목</th>
                        <th scope="col">작성자</th>
                        <th scope="col">작성일</th>
                        <th scope="col">조회수</th>
                    </tr>
                </thead>
                <tbody>
                    {rows.length === 0 ? (
                        <tr>
                            <td colSpan={5} className="no_data">
                                {applied.keyword ? "검색 결과가 없습니다." : "등록된 글이 없습니다."}
                            </td>
                        </tr>
                    ) : (
                        rows.map((post) => (
                            <tr key={post.id}>
                                <td>{post.id}</td>
                                <td className="ta_l">
                                    <a className="link_title" href="#" onClick={(e) => { e.preventDefault(); mvcon(post.id); }}>
                                        {post.title}
                                    </a>
                                </td>
                                <td><span className="link_writer">{post.author}</span></td>
                                <td>{formatDate(post.create_date)}</td>
                                <td>{post.view_count}</td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>

            <div className="comm_paging_btn">
                <div className="flo_side left">
                    페이지 <strong className="fc_p">{current}</strong>/{totalPages}
                </div>

                <div className="wr_paging">
                    <button className="btn_page first" disabled={current === 1} onClick={() => setPage(1)}>첫 페이지</button>
                    <button className="btn_page prev" disabled={groupStart === 1} onClick={() => setPage(groupStart - 1)}>이전</button>
                    <span className="wr_page">
                        {pageNumbers.map((n) =>
                            n === current ? (
                                <strong key={n} className="page on">{n}</strong>
                            ) : (
                                <span key={n} className="page" onClick={() => setPage(n)}>{n}</span>
                            )
                        )}
                    </span>
                    <button className="btn_page next" disabled={groupEnd === totalPages} onClick={() => setPage(groupEnd + 1)}>다음</button>
                    <button className="btn_page last" disabled={current === totalPages} onClick={() => setPage(totalPages)}>마지막 페이지</button>
                </div>

                <div className="flo_side right">
                    <button className="comm_btn_round fill" onClick={() => navigate("/write")}>글쓰기</button>
                </div>
            </div>

            <form className="box_search" onSubmit={doSearch}>
                <select className="comm_sel ml_10" value={searchType} onChange={(e) => setSearchType(e.target.value)}>
                    <option value="title">제목</option>
                    <option value="titleContent">제목+내용</option>
                    <option value="author">작성자</option>
                </select>
                <input type="text" className="comm_inp_text" style={{ width: 300 }} value={keyword} onChange={(e) => setKeyword(e.target.value)} />
                <button type="submit" className="comm_btn fill">검색</button>
                {applied.keyword && <button type="button" className="comm_btn fill" onClick={showAll}>전체글</button>}
            </form>
        </Layout>
    );
}

export default Board;
