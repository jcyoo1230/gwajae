import React from 'react';
import { Editor } from '@tinymce/tinymce-react';

/* 1. 핵심 TinyMCE 라이브러리 및 모델 필수 로드 */
import 'tinymce/tinymce';
import 'tinymce/models/dom/model';

/* 2. 에디터 테마 및 아이콘 로드 */
import 'tinymce/themes/silver';
import 'tinymce/icons/default';

/* 3. 에디터 UI 스타일 스킨 로드 */
import 'tinymce/skins/ui/oxide/skin';

/* 4. 에디터 내부 본문 영역(Content) 스타일 CSS 로드 */
import 'tinymce/skins/content/default/content';
import 'tinymce/skins/ui/oxide/content';

/* 5. 사용할 플러그인 각각 로드 (원하는 기능만 선택 가능) */
import 'tinymce/plugins/anchor';
import 'tinymce/plugins/link';
import 'tinymce/plugins/lists';
import 'tinymce/plugins/image';
import 'tinymce/plugins/table';
import 'tinymce/plugins/wordcount';

export default function BundledEditor(props) {
  return (
    <Editor
      licenseKey="gpl" // 또는 발급받은 상용 라이선스 키
      init={{
        // 셀프 호스팅 번들 방식에서는 외부 CSS 경로를 참조하지 않도록 
        // skin과 content_css를 false로 지정하거나 명시적 매핑이 필요할 수 있습니다.
        skin: false,
        content_css: false,
        ...props.init
      }}
      {...props}
    />
  );
}