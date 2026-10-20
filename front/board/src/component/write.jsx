import React ,{ useRef, useState }from "react";
import api from "../api/axios";
import { Navigate, useNavigate } from "react-router-dom";
import "../assets/board.css";
import editor from "../assets/_images/editor.png";
import BundledEditor from "./BundleEditor.jsx";
import tinymce from "tinymce";

function write () {
    const token = localStorage.getItem("token");
    const loginId = localStorage.getItem("loginId");

    const editorRef = useRef(null);


      const log = () => {
    if (editorRef.current) {
      console.log(editorRef.current.getContent());
    }
  };
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
    


    const wP = async (e) => { // wP = writePost
        e.preventDefault();

        const editor = editorRef.current;
        const html = editor ? editor.getContent() : "";
        // 태그/공백만 있는 경우를 빈 내용으로 판단 (이미지는 텍스트가 없어도 내용으로 인정)
        const plain = editor ? editor.getContent({ format: "text" }).trim() : "";
        const hasImage = /<img\s/i.test(html);

        if (title.trim() === "") {
            alert("제목을 입력해주세요.");
            return;
        }
        if (plain === "" && !hasImage) {
            alert("내용이 비어있으면 안됩니다");
            return;
        }

        const today = new Date();
        const create_date = `${today.getFullYear()}/${today.getMonth() + 1}/${today.getDate()}/`;

        try {
            // TODO: 백엔드에 파일 업로드 API가 생기면 FormData로 files를 함께 전송
            await api.post("/boards/posts", { title, content: html, create_date });
            alert("게시되었습니다.");
            navigate("/board");
        } catch (error) {
            console.error("글 등록 실패", error);
            alert(error.response?.data?.message ?? "글 등록에 실패했습니다.");
        }
    };

    // 작성 중인 내용이 있으면 확인 후 이동
    const leave = (path) => {
        const dirty =
            title.trim() !== "" ||
            files.length > 0 ||
            (editorRef.current && editorRef.current.getContent({ format: "text" }).trim() !== "");
        if (dirty && !window.confirm("작성 중인 내용이 사라집니다. 나가시겠습니까?")) return;
        path === -1 ? navigate(-1) : navigate(path);
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
                <form onSubmit={wP}>
                <div id="WrapContainer" >
                    <div className="container">
                        <div className="wrap_tit">
                            <h2 className="tit_cont">자유게시판</h2>
                        </div>
                        <div className="wrap_write">
                            <dl className="write_tit">
                                <dt>제목</dt>
                                <dd><input value={title} onChange={(e)=> settitle(e.target.value)} type="text" className="comm_inp_text" styled="width: 100%;"/></dd>
                            </dl>
                            <div className="write_info">
                                <dl className="info">
                                    <dt>작성자</dt>
                                    <dd>{loginId}</dd>
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
                                <BundledEditor
                                        onInit={(evt, editor) => editorRef.current = editor}
                                        initialValue='<p>This is the initial content of the editor.</p>'
                                        init={{
                                        height: 500,
                                        menubar: false,
                                        
                                        plugins: [
                                            'advlist', 'anchor', 'autolink', 'help', 'image', 'link', 'lists',
                                            'searchreplace', 'table', 'wordcount'
                                        ],
                                        toolbar: 'undo redo | blocks | ' +
                                            'bold italic forecolor | alignleft aligncenter ' +
                                            'alignright alignjustify | bullist numlist outdent indent | ' +
                                            'removeformat | help',
                                        content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
                                        }}
                                        
                                    />
                            </div>
                            <div className="write_file">
                                <strong className="tit_file"><span className="ico_img flie">첨부파일</span> 첨부파일</strong>
                                <div className="cont_file">
                                    <input type="file" className="comm_inp_file" styled="width:100%"/>
                                    <ul className="list_file_inline mt_5">
                                       
                                    </ul>
                                    </div>
                                </div>
                            </div>
                    
                            <div className="comm_paging_btn">
                                <div className="flo_side left">
                                    <button className="comm_btn_round fill">목록</button>
                                </div>
                            <div className="flo_side right">
                                <button type="button"className="comm_btn_round" onClick={leave}>취소</button>
                                <button type="submit" className ="comm_btn_round fill" >등록</button>   
                            </div>
                        </div>
                 </div>
            </div>
        </form>
        <button onClick={backbtn}>뒤로 가기</button>
        </>
    )
}

export default write;