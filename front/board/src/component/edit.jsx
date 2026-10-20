import React, { useState, useRef} from "react";
import api from "../api/axios";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import Layout from "./Layout";
import BundledEditor from "./BundleEditor";
import tinymce from "tinymce";


function Edit() {
    const { state } = useLocation();
    const navigate = useNavigate();
    const token = localStorage.getItem("token");
    const postId = state?.postId;
    const post = state?.post;
    const editorRef = useRef(null);



    const [title, setTitle] = useState(post?.title ?? "");
    const [content, setContent] = useState(post?.content ?? "");

    if (!token) return <Navigate to="/" replace />;
    if (!postId || !post) return <Navigate to="/board" replace />;

    const submit = async (e) => {
        e.preventDefault();

         const editor = editorRef.current;
        const html = editor ? editor.getContent() : "";
        // 태그/공백만 있는 경우를 빈 내용으로 판단 (이미지는 텍스트가 없어도 내용으로 인정)
        const plain = editor ? editor.getContent({ format: "text" }).trim() : "";
        const hasImage = /<img\s/i.test(html);


        if (title.trim() === "") { alert("제목을 입력해주세요."); return; }
        if (content.trim() === "") { alert("내용이 비어있으면 안됩니다"); return; }
        try {
            await api.put(`/boards/posts/${postId}`, { title, content:html });
            alert("수정되었습니다.");
            navigate("/contentpage", { state: { postId }, replace: true });
        } catch (error) {
            console.error("글 수정 실패", error);
            alert(error.response?.data?.message ?? "글 수정에 실패했습니다.");
        }
    };

    return (
        <Layout>
            <form onSubmit={submit}>
                <div className="wrap_write">
                    <dl className="write_tit">
                        <dt>제목</dt>
                        <dd><input type="text" className="comm_inp_text" style={{ width: "100%" }} value={title} onChange={(e) => setTitle(e.target.value)} /></dd>
                    </dl>
                    <div className="write_info">
                        <dl className="info">
                            <dt>작성자</dt>
                            <dd>{post.author}</dd>
                        </dl>
                    </div>
                    <div className="write_cont">
                                <BundledEditor
                                        onInit={(evt, editor) => editorRef.current = editor}
                                        initialValue={content}
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
                                        
                                    />                    </div>
                </div>

                <div className="comm_paging_btn">
                    <div className="flo_side left">
                        <button type="button" className="comm_btn_round fill" onClick={() => navigate("/board")}>목록</button>
                    </div>
                    <div className="flo_side right">
                        <button type="button" className="comm_btn_round" onClick={() => navigate(-1)}>취소</button>
                        <button type="submit" className="comm_btn_round fill">수정</button>
                    </div>
                </div>
            </form>
        </Layout>
    );
}

export default Edit;
