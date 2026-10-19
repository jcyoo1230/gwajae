import React, { useEffect, useState, createContext} from "react";
import { Navigate, useNavigate } from "react-router-dom";
import api from "../api/axios";
import "../assets/board.css"
import ContentPage from "./ContentPage";

// 임시 게시판 화면. 토큰이 없으면 로그인 화면으로 돌려보냄
function Board() {
    const navigate = useNavigate();
    const token = localStorage.getItem("token");
    const loginId = localStorage.getItem("loginId");
    const [tableData, setTableData] = useState([]);
    const [Id, setId] = useState();
    
    useEffect(() => {
        const boardlist =async () => {
            try {
                const res = await api.get("/boards/posts/list");
                setTableData(res.data); 
            }catch(e){
                console.error("테이블 조회 실패",e);
            }
        }
        boardlist();
    }, [])



    if (!token) {
        return <Navigate to="/" replace />;
    }

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("loginId");
        navigate("/");
    };

    const handleFileSelect = (event) => {
        const file = event.target.files[0];
        selectedFile(file);
    }


    const write = () =>{
        navigate("/Write")
    }
const mvcon = (id) => {
    setId(id);
    navigate("/contentpage", { state: { postId: id } });
};




    return (
        <>
            <div id="WrapTitle">
                <div class="container">
                    <h1 class="logo">STN INFOTECH</h1>
                </div>
            </div>
            <div style={{display:'flex',justifyContent:'right',}}>
                <p>{loginId}</p>&emsp;&emsp;
                <button onClick={logout}>로그아웃</button>
            </div>
            <div id="WrapContainer">
                <div class="container">
                    <div class="wrap_tit">
                        <h2 class="tit_cont">자유게시판</h2>
                        <div class="ta_r">총 갯수 <strong class="fc_p">93</strong>건 </div>
                    </div>
                    <table class="tbl_board">
                        <colgroup>
                            <col styled={"width:5%"}/>
                            <col/>
                            <col styled={"width:10%"}/>
                            <col styled={"width:10%"}/>
                            <col styled={"width:8%"}/>
                            <col styled={"width:7%"}/>
                        </colgroup>           
                        <thead>
                            <tr>
                                <th>번호</th>
                                <th>작성자</th>
                                <th>제목</th>
                                <th>작성일</th>
                                <th>조회수</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tableData.map((post) =>{
                            return(
                                <tr key={post.id} onClick={() => {mvcon(post.id)}}  className="text-element">
                                    <td>{post.id}</td>
                                    <td>{post.author}</td>
                                    <td>{post.title}</td>
                                    <td>{post.create_date}</td>
                                    <td>{post.view_count}</td>
                                </tr>)}
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
            <button onClick={write}> 글 쓰기</button>
        </>
    );
}

export default Board;