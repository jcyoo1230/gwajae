import React, { useEffect, useState } from "react";
import { Navigate, useNavigate, useLocation } from "react-router-dom";
import api from "../api/axios";
import Board from "./Board";




function ContentPage(id){
    const { state } = useLocation();
    const postId = state?.postId;
    const navigate = useNavigate();
    const backbtn = () => navigate(-1);
    const [tableData, setTableData] = useState([]);


    useEffect(() => {
        const contentlist =async () => {
            try {
                const res = await api.get(`/boards/posts/${postId}`);
                setTableData(res.data); 
            }catch(e){
                console.error("테이블 조회 실패",e);
            }
        }
        contentlist();
    }, [])
    
    return(
    <>
        <h2>임시 페이지</h2>
        {console.log(tableData)}
        <ul>
            <li>{tableData.title}</li>
            <li>{tableData.content}</li>
        </ul>
        <button onClick={backbtn}>뒤로가기</button>
    
    </>

    )

}

export default ContentPage;