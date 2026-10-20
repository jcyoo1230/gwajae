import React from "react";

// html 템플릿의 공통 틀 (#WrapTitle 로고 영역 + #WrapContainer > .container > .wrap_tit)
// right: 제목 줄 오른쪽에 들어갈 내용 (총 갯수, 로그인 정보 등)
function Layout({ title = "자유게시판", right = null, children }) {
    return (
        <>
            <div id="WrapTitle">
                <div className="container">
                    <h1 className="logo">STN INFOTECH</h1>
                </div>
            </div>
            <div id="WrapContainer">
                <div className="container">
                    <div className="wrap_tit">
                        <h2 className="tit_cont">{title}</h2>
                        {right && <div className="ta_r">{right}</div>}
                    </div>
                    {children}
                </div>
            </div>
        </>
    );
}

export default Layout;
