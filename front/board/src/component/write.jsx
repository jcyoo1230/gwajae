import React ,{ useState }from "react";
import api from "../api/axios";
import { Navigate, useNavigate } from "react-router-dom";
import "../assets/board.css";
import editor from "../assets/_images/editor.png";

function write () {
    const token = localStorage.getItem("token");
    const loginId = localStorage.getItem("loginId");

            // 선택된 파일을 저장하는 상태
    const [selectedFile, setSelectedFile] = useState(null);
    // 업로드 상태 메시지를 저장하는 상태
    const [uploadStatus, setUploadStatus] = useState('');


    const [title, settitle] = useState(""); //null 값이여서 console창에서 input 오류가 나왔음.
    const [content, setcontent] = useState("");//위와 같은 내용

    const navigate = useNavigate();

    const backbtn = () => navigate(-1);

    const handleFileSelect = (event) => {
        const file = event.target.files[0];
        selectedFile(file);
    }
      const handleUpload = async () => {
    // 파일이 선택되지 않은 경우 경고
    if (!selectedFile) {
      setUploadStatus('파일을 선택해주세요.');
      return;
    }}
    


    const  wP = async (e) => {      //wP= writePost의 약자
        const today = new Date();
        const create_date = `${today.getFullYear()}/${today.getMonth() + 1}/${today.getDate()}/`;
        e.preventDefault();

        if (title.trim() === "") {
            alert("비밀번호는 공백만으로 만들 수 없습니다.");
            return;
        }
        if (content.trim() === "") {
            alert("내용이 비어있으면 안됩니다");
            return;
        }

        try {
            await api.post("/boards/posts", { title,content, create_date});
            alert(`게시되었습니다.`);
            navigate(-1);
        } catch (error) {
            console.error("회원가입 실패", error);
            alert(error.response?.data?.message ?? "회원가입에 실패했습니다.");
        };
    };
    return(
        <>
                <title>STN INFOTECH - 글 쓰기</title>
                <link rel="stylesheet" href="_css/common.css"/>
                <div id="WrapTitle">
                <div className="container">
                    <h1 className="logo">STN INFOTECH</h1>
                </div>
                </div>
                <div id="WrapContainer">
                <div className="container">
                    <div className="wrap_tit">
                    <h2 className="tit_cont">자유게시판</h2>
                    </div>
                    <div className="wrap_write">
                    <dl className="write_tit">
                        <dt>제목</dt>
                        <dd><input type="text" className="comm_inp_text" styled="width: 100%;"/></dd>
                    </dl>
                    <div className="write_info">
                        <dl className="info">
                        <dt>작성자</dt>
                        <dd><input type="text" className="comm_inp_text" styled="width: 80px;"/></dd>
                        <dt>비밀번호</dt>
                        <dd><input type="text" className="comm_inp_text" styled="width: 100px;"/></dd>
                        <dt>이메일</dt>
                        <dd><input type="text" className="comm_inp_text" styled="width: 150px;"/></dd>
                        </dl>
                        
                        <dl className="side">
                        <dt>공지사항</dt>
                        <dd><label className="comm_swich"><input type="checkbox"/><span className="ico_txt"/></label> </dd>
                        <dt>비밀글</dt>
                        <dd><label className="comm_swich"><input type="checkbox"/><span className="ico_txt"/></label> </dd>
                        </dl>
                    </div>
                    <div className="write_cont">
                        <img src={editor}/>
                    </div>
                    <div className="write_file">
                        <strong className="tit_file"><span className="ico_img flie">첨부파일</span> 첨부파일</strong>
                        <div className="cont_file">
                        <input type="file" className="comm_inp_file" styled="width:100%"/>
                            <ul className="list_file_inline mt_5">
                            <li>file_20240425.zip <button className="btn_ico_del">삭제</button></li>
                            <li>file_파일명이 길 경우_파일명이 길 경우_파일명이 길 경우_20240425.png <button className="btn_ico_del">삭제</button></li>
                            <li>file_2.pdf <button className="btn_ico_del">삭제</button></li>
                            <li>file_3.jpg <button className="btn_ico_del">삭제</button></li>
                            <li>file_20240425.zip <button className="btn_ico_del">삭제</button></li>
                            <li>file_20240425.png <button className="btn_ico_del">삭제</button></li>
                            <li>file_파일명이 길 경우_파일명이 길 경우_파일명이 길 경우_20240425.png <button className="btn_ico_del">삭제</button></li>
                            <li>file_2.pdf <button className="btn_ico_del">삭제</button></li>
                            <li>file_3.jpg <button className="btn_ico_del">삭제</button></li>
                            <li>file_파일명이 길 경우_파일명이 길 경우_파일명이 길 경우_20240425.png <button className="btn_ico_del">삭제</button></li>
                            <li>file_2.pdf <button className="btn_ico_del">삭제</button></li>
                            </ul>
                        </div>
                    </div>
                    </div>
                    
                    <div className="comm_paging_btn">
                    <div className="flo_side left">
                        <button className="comm_btn_round fill">목록</button>
                    </div>
                    <div className="flo_side right">
                        <button className="comm_btn_round">취소</button>
                        <button className ="comm_btn_round fill">등록</button>   
                    </div>
                    </div>

                </div>
                </div>
                    

        <button onClick={backbtn}>뒤로 가기</button>
        </>
    )
}

export default write;